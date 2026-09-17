const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { setup, root } = require('./helpers.cjs');
const serial = (value) => JSON.parse(JSON.stringify(value));

const programs = [
    ['if/elif/else e duas camadas', 'x = 0\nif False:\n    x = 1\nelif True:\n    if True:\n        x = 2\n    else:\n        x = 3\nelse:\n    x = 4', {x:2}],
    ['dois espaços válidos em Python', 'if True:\n  x = 2\nelse:\n  x = 9', {x:2}],
    ['comentários e linhas vazias não definem nível', 'if True:\n # comentário\n\n    x = 2\n\t# comentário com tab', {x:2}],
    ['for aninhado e acumulador', 'x = 0\nfor i in range(3):\n    for j in range(2):\n        x += 1', {x:6,i:2,j:1}],
    ['while, if e break', 'x = 0\nwhile True:\n    x += 1\n    if x == 3:\n        break', {x:3}],
    ['comparação encadeada', 'x = 3 > 2 > 1\ny = 1 < 2 > 3', {x:true,y:false}],
    ['and/or retornam operandos e curto-circuitam', 'x = 0 and inexistente\ny = "texto" or inexistente\nz = 2 and 3', {x:0,y:'texto',z:3}],
    ['precedência de not', 'x = not 2 == 1\ny = not 1 < 2 and True', {x:true,y:false}],
    ['int trunca números e aceita inteiros textuais', 'x = int(3.8)\ny = int(-3.8)\nz = int(" +12 ")\nw = int()', {x:3,y:-3,z:12,w:0}],
    ['range negativo', 'x = 0\nfor i in range(3, 0, -1):\n    x += i', {x:6,i:1}],
    ['comparação booleana numérica Python', 'x = True == 1\ny = False == 0', {x:true,y:true}]
];
for (const [name, code, expected] of programs) test(`Python: ${name}`, async () => { const h = setup(); const { scene, result } = await h.run(h.languageActivity, {code}); assert.equal(result.cause,'SUCCESS',result.message); assert.deepEqual(serial(scene.runState.environment),expected); });
for (const [name, code, line] of [
    ['fora de bloco','    x = 1',1], ['dedent inexistente','if True:\n    x = 1\n  y = 2',3],
    ['bloco sem corpo','if True:\nx = 1',2], ['else solto','else:\n    x = 1',1],
    ['mistura de tab e espaços','if True:\n\t x = 1',2], ['if sem dois-pontos','if True\n    x = 1',1],
    ['elif após else','if True:\n    x = 1\nelse:\n    x = 2\nelif False:\n    x = 3',5]
]) test(`Indentação inválida: ${name}`, () => { const h=setup(); assert.throws(() => h.context.PythonSubsetParser.parse(code), (error) => error.lineNumber === line); });
for (const code of ['x = int("")','x = int(" ")','x = int("3.0")','x = int("0x10")','x = int("erro")','x = "10" >= 2','x = range("2")','x = range(1, 2, 0)','x = int(1,2)','virar_direita(1)']) test(`Entrada/tipo inválido: ${code}`, async () => { const h=setup(); const {scene,result}=await h.run(h.languageActivity,{code}); assert.equal(result.cause,'SEMANTIC_ERROR'); assert.equal(scene.livesRemaining,3); });
test('Erro em elif informa a própria linha', async () => { const h=setup(); const r=await h.run(h.languageActivity,{code:'x = 0\nif False:\n    x = 1\nelif desconhecida:\n    x = 2'}); assert.equal(r.result.lineNumber,4); });
test('input e print preservam o texto e booleanos Python', async () => { const h=setup(); const r=await h.run(h.languageActivity,{code:'x = input("Pergunta")\ny = x == "CORAGEM"\nprint(x)\nprint(True, False)',inputs:[' CORAGEM ']}); assert.equal(r.scene.runState.environment.x,' CORAGEM '); assert.equal(r.scene.runState.environment.y,false); assert.deepEqual(serial(r.scene.runState.outputs),[' CORAGEM ','True False']); });
for (const id of [6,7]) for (const variant of ['exata','espaços','incorreta','minúscula']) test(`Palavra da atividade ${id}: ${variant}`, async () => {
    const h=setup(), a=h.context.ACTIVITIES[id-1], word=id===6?'AURORA':'CORAGEM';
    const value=variant==='espaços'?` ${word} `:variant==='incorreta'?'ERRADA':variant==='minúscula'?word.toLowerCase():word;
    const r=await h.run(a,{code:id===6?a.officialSolution.replace('"AURORA"',JSON.stringify(value)):a.officialSolution, inputs:id===7?[value]:[]});
    assert.equal(r.result.cause==='SUCCESS',['exata','espaços'].includes(variant)); assert.equal(r.scene.livesRemaining,3);
});
for (const id of [8,9,10,13,15]) test(`Input numérico vazio é erro recuperável na atividade ${id}`, async () => { const h=setup(); const a=h.context.ACTIVITIES[id-1]; const r=await h.run(a,{inputs:['',...(a.testInputs||[]).slice(1)]}); assert.equal(r.result.cause,'SEMANTIC_ERROR'); assert.equal(r.scene.livesRemaining,3); r.scene.testInputQueue=[...a.testInputs]; const retry=await h.context.CommandInterpreter.executar(r.scene); assert.equal(retry.cause,'SUCCESS',retry.message); });
for (const id of Array.from({length:20},(_,i)=>i+1)) test(`Atividade ${id}: solução com blocos de 2 espaços e comentários`, async () => { const h=setup(); const a=h.context.ACTIVITIES[id-1]; const code=a.officialSolution.split('\n').map(line=>line.replace(/^ +/,spaces=>' '.repeat(spaces.length/2))).join('\n\n # comentário livre\n'); const r=await h.run(a,{code}); assert.equal(r.result.cause,'SUCCESS',r.result.message); });
test('As vinte atividades desbloqueiam em ordem, com replay idempotente', async () => {
    const h=setup(); let xp=0,coins=0;
    for(const a of h.context.ACTIVITIES){ const progress=h.context.PersistenceService.load(); assert.equal(progress.unlockedMax,a.id); if(a.id<20)assert.equal(h.context.ProgressionSystem.atividadeDesbloqueada({playerProgress:progress},a.id+1),false); const r=await h.run(a); assert.equal(r.result.cause,'SUCCESS'); const after=h.context.PersistenceService.load(); assert.ok(after.totalXp>xp); assert.ok(after.walletCoins>=coins); r.scene.testInputQueue=[...(a.testInputs||[])]; await h.context.CommandInterpreter.executar(r.scene); assert.equal(h.context.PersistenceService.load().totalXp,after.totalXp); assert.equal(h.context.PersistenceService.load().walletCoins,after.walletCoins); xp=after.totalXp;coins=after.walletCoins; }
    assert.equal(h.context.PersistenceService.load().completedActivities.length,20); assert.equal(coins,8);
});
test('Persistência continua em memória quando localStorage falha', async () => { const storage={getItem:()=>null,setItem:()=>{throw new Error('quota');},removeItem:()=>{}}; const h=setup({localStorage:storage}); const first=await h.run(h.context.ACTIVITIES[1]); const p=h.context.PersistenceService.load(); assert.equal(p.totalXp,first.result.reward.xp); await h.run(h.context.ACTIVITIES[1]); assert.equal(h.context.PersistenceService.load().totalXp,p.totalXp); });
test('M01 libera a pressão ao sair e M02 não alterna duas vezes na mesma entrada', () => { const h=setup(); const a={...h.context.ACTIVITIES[0],entities:[{id:'p',type:'pressure_plate',row:1,column:2,connections:[{targetId:'d'}]},{id:'d',type:'door',row:1,column:3},{id:'t',type:'toggle_plate',row:3,column:3}]}; const s=h.scene(a); h.context.DungeonSystem.onEnter(s,1,2); assert.equal(h.context.DungeonSystem.getEntity(s,'d').state,'open'); h.context.DungeonSystem.onEnter(s,2,2); assert.equal(h.context.DungeonSystem.getEntity(s,'d').state,'closed'); h.context.DungeonSystem.onEnter(s,3,3);h.context.DungeonSystem.onEnter(s,3,3);assert.equal(h.context.DungeonSystem.getEntity(s,'t').state,'on');h.context.DungeonSystem.onEnter(s,3,2);h.context.DungeonSystem.onEnter(s,3,3);assert.equal(h.context.DungeonSystem.getEntity(s,'t').state,'off'); });
test('M03 alterna alavanca e restaura a conexão', async () => {const h=setup(),a=h.context.ACTIVITIES[7],s=h.scene(a);s.gutoPosition={linha:4,coluna:4};await h.context.DungeonSystem.callApi(s,'ativar_alavanca',[],{});assert.equal(h.context.DungeonSystem.getEntity(s,'lever').state,'on');await h.context.DungeonSystem.callApi(s,'ativar_alavanca',[],{});assert.equal(h.context.DungeonSystem.getEntity(s,'lever').state,'off');});
test('Objetivos físicos atualizam durante o movimento', async () => { const h=setup(),s=h.scene(h.context.ACTIVITIES[0]);s.runState.analysis=h.context.PythonSubsetParser.parse('x=1').analysis; const exit=s.mapa.flatMap((row,r)=>row.map((t,c)=>({t,r,c}))).find(p=>p.t===3); h.context.DungeonSystem.onEnter(s,exit.r,exit.c);assert.equal(s.objectiveStatuses[0].completed,true);});
test('Dados do jogador são publicados sem ler testInputs ou officialSolution',()=>{const h=setup();const source=fs.readFileSync(path.join(root,'ui/ActivityGuide.js'),'utf8');const body=source.replace(/\/\/[^\n]*/g,'');assert.doesNotMatch(body,/testInputs|officialSolution/);for(const id of [6,7,8,9,10,13,15])assert.ok(h.context.ActivityGuide.data(id).length>0);assert.match(h.context.ActivityGuide.data(7).join(' '),/CORAGEM/);assert.match(h.context.ActivityGuide.data(8).join(' '),/2.*3/);for(const a of h.context.ACTIVITIES){const r=h.context.ActivityGuide.resources(a);assert.deepEqual([...r.commands,...r.sensors].map(i=>i.name).sort(),[...a.allowedCommands].sort());}});
test('Todos os assets oficiais e scripts referenciados existem',()=>{const h=setup();for(const asset of Object.values(h.context.AssetCatalog))assert.ok(fs.statSync(path.join(root,asset.path)).size>0,asset.path);const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);});
test('Atividade 12: pisar novamente na placa mantém o sensor coerente com as duas rotas',()=>{
 const {context:c,scene}=setup();for(const variant of [0,1]){const s=scene(c.ACTIVITIES[11],{variant});const plate=c.DungeonSystem.getEntity(s,'plate');s.gutoPosition={linha:plate.row,coluna:plate.column};c.DungeonSystem.onEnter(s,plate.row,plate.column);const on=plate.state==='on';assert.equal(c.DungeonSystem.getEntity(s,'spikes_upper').state,on?'inactive':'active');assert.equal(c.DungeonSystem.getEntity(s,'spikes_lower').state,on?'active':'inactive');}
});
