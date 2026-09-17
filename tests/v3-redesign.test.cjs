const test=require('node:test'),assert=require('node:assert/strict');
const {setupV3}=require('./v3-helpers.cjs');
function cases(a){return a.testScenarios || Array.from({length:a.chestKeyVariants?.length||a.variantStates?.length||1},(_,variant)=>({variant}));}
const inventory=setupV3().context.ACTIVITIES;
for(const a0 of inventory)for(const options of cases(a0))test(`V3 atividade ${a0.id}, variante ${options.variant||0}: solução, replay e recompensa`,async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[a0.id-1];const {scene:s,result:r}=await h.run(a,options);
 assert.equal(r.cause,'SUCCESS',r.message);assert.equal(s.livesRemaining,3);assert.equal(s.runState.reachedExit,true);
 const rewards=p=>JSON.stringify({...p,updatedAt:undefined});
 const progress=rewards(s.playerProgress);s.testInputQueue=[...(options.inputs||a.testInputs||[])];const code=s.editorTexto.value;
 const replay=await h.context.CommandInterpreter.executar(s);assert.equal(replay.cause,'SUCCESS',replay.message);assert.equal(s.editorTexto.value,code);assert.equal(rewards(s.playerProgress),progress);
 assert.equal(h.context.MissionObjectiveSystem.avaliar(s,s.runState.analysis,s.runState.environment).allRequiredCompleted,true);
});
for(const id of [1,6,11,16])test(`V3 tutorial ${id}: quatro microetapas e descobertas preservadas`,async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[id-1],s=h.scene(a);s.tutorialStepIndex=0;h.context.TutorialSystem.inicializar(s);
 for(let i=0;i<4;i++){if(id===6&&i===3){assert.ok(s.discoveryState.inscriptions.juramento);s.editorTexto.value=a.officialSolution;}
 const r=await h.context.CommandInterpreter.executar(s);assert.equal(r.cause,i===3?'SUCCESS':'TUTORIAL_STEP_COMPLETE',r.message);}
});
test('V3 leitura e luz persistem; reinício limpa descoberta e execução mantém estado transitório separado',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[6],s=h.scene(a);s.editorTexto.value=a.officialSolution.split('resposta =')[0];await h.context.CommandInterpreter.executar(s);
 assert.ok(s.discoveryState.inscriptions.memoria);assert.ok(s.discoveryState.litRooms.biblioteca);
 h.context.DungeonSystem.getEntity(s,'guardian').state='defeated';h.context.DungeonSystem.resetRun(s);
 assert.ok(s.discoveryState.inscriptions.memoria);assert.equal(h.context.DungeonSystem.getEntity(s,'guardian').state,'blocking');assert.equal(s.gutoPosition.coluna,a.startPosition.coluna);
 h.context.DiscoverySystem.resetActivity(s);h.context.DungeonSystem.resetRun(s);assert.equal(Object.keys(s.discoveryState.inscriptions).length,0);assert.equal(Object.keys(s.discoveryState.litRooms).length,0);
});
test('V3 pistas não podem ser examinadas à distância e pedestal exige descoberta',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[6]);await assert.rejects(h.context.DungeonSystem.callApi(s,'examinar',[]),/inscrição próxima/);
 s.gutoPosition={linha:9,coluna:8};await assert.rejects(h.context.DungeonSystem.callApi(s,'input',['Virtude?']),/registros do mundo/);assert.equal(s.runState.inputs.length,0);
});
test('V3 saber a palavra sem visitar o arquivo não abre a saída',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[5]);s.gutoPosition={linha:7,coluna:10};await h.context.DungeonSystem.callApi(s,'print',['AURORA']);assert.equal(s.runState.flags.wordPrinted,undefined);assert.equal(h.context.DungeonSystem.getEntity(s,'grade').state,'closed');
});
for(const id of [7,8,9,10])test(`V3 atividade ${id}: ignorar as entradas e imprimir literal não ativa a solução`,async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[id-1];const literal={7:'"CORAGEM"',8:'6',9:'5',10:'2'}[id];const altered=a.officialSolution.replace(/print\([^\n]+\)/,`print(${literal})`);const {result:r}=await h.run(a,{code:altered});assert.notEqual(r.cause,'SUCCESS');
});
test('V3 requisitos do validador impedem abrir por if True com energia insuficiente',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[12];const code=a.officialSolution.replace('if energia >= limiar:','if True:').replace('if energia != 0:','if True:');const {scene:s,result:r}=await h.run(a,{code,inputs:['0']});assert.notEqual(r.cause,'SUCCESS');assert.equal(h.context.DungeonSystem.getEntity(s,'guardian_high').state,'blocking');
});
for(const variant of [0,1,2])for(const portal of [1,2,3].filter(p=>p!==3-variant))test(`V3 PK-023 poder ${[25,15,5][variant]} recusa portão ${portal}`,async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[14],{variant});s.runState.hasKey=true;Object.assign(s.runState.flags,{leverDone:true,read_sol:true,read_lua:true,read_sombra:true});s.runState.inputs=[String([25,15,5][variant])];const e=h.context.DungeonSystem.getEntity(s,`portal${portal}`);s.gutoPosition={linha:e.row,coluna:e.column};const before={...s.gutoPosition};await assert.rejects(h.context.DungeonSystem.callApi(s,'entrar_portao',[portal]),/Portão incorreto/);assert.deepEqual({...s.gutoPosition},before);assert.notEqual(s.runState.flags.correctPortal,true);assert.equal(s.playerProgress.rewardedActivities['15'],undefined);assert.equal(s.playerProgress.completedActivities.includes(15),false);
});
test('V3 poder deve corresponder ao registro da variante',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[14],{result:r}=await h.run(a,{variant:2,inputs:['25']});assert.notEqual(r.cause,'SUCCESS');assert.match(r.message,/registro encontrado/);
});
test('V3 espelhos incorretos não teleportam nem recompensam',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[8]);for(const id of ['mirror3','mirror7']){const e=h.context.DungeonSystem.getEntity(s,id);s.gutoPosition={linha:e.row,coluna:e.column};await assert.rejects(h.context.DungeonSystem.callApi(s,'entrar_espelho',[e.value]),/não corresponde/);assert.notEqual(s.runState.flags.correctMirror,true);assert.equal(e.state,'inactive');}
});
test('V3 andar sem iluminar a névoa avisa primeiro e perde exatamente uma vida depois',async()=>{
 const h=setupV3(),a={...h.context.ACTIVITIES[0],tutorialSteps:null,allowedCommands:['andar_frente'],mapa:[[1,1,1,1,1]],startPosition:{linha:0,coluna:0},regions:[{id:'escura',row:0,column:1,height:1,width:4,lightState:'deepDark',fearDamage:true,warningSteps:2}],entities:[],objectives:[{type:'reach_exit',label:'Saída'}]},s=h.scene(a);
 await h.context.PlayerController.andarFrente(s,1);assert.equal(s.runState.darkDanger,false);assert.match(s.playerAnimation,/fear/);assert.equal(s.livesRemaining,3);
 s.editorTexto.value='andar_frente(3)';const r=await h.context.CommandInterpreter.executar(s);assert.equal(r.cause,'HAZARD_DEATH');assert.equal(s.livesRemaining,2);
});
test('V3 espinhos são contextuais, retraídos têm estado legível e ciclos são determinísticos',async()=>{
 const h=setupV3(),a={...h.context.ACTIVITIES[0],tutorialSteps:null,mapa:[[1,1,1,1]],startPosition:{linha:0,coluna:0},regions:[],entities:[{id:'spike',type:'hazard',skin:'v3',row:0,column:1,initialState:'retracted',mode:'cycle',period:4,safeTicks:2}]},s=h.scene(a);
 assert.equal(h.context.DungeonSystem.lethalAt(s,0,1),null);await h.context.MechanismSystem.afterMove(s);assert.equal(h.context.DungeonSystem.getEntity(s,'spike').state,'retracted');await h.context.MechanismSystem.afterMove(s);assert.equal(h.context.DungeonSystem.getEntity(s,'spike').state,'active');
 await h.context.DungeonSystem.callApi(s,'desativar_armadilha',[]);assert.equal(h.context.DungeonSystem.lethalAt(s,0,1),null);s.gutoPosition={linha:0,coluna:3};await assert.rejects(h.context.DungeonSystem.callApi(s,'desativar_armadilha',[]),/posição correta/);
});
test('V3 lava é cenário bloqueado, sem morte por piso',()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[3]);const r=s.mapa.findIndex(row=>row.includes(4)),col=s.mapa[r].indexOf(4);assert.equal(h.context.DungeonSystem.isBlocked(s,r,col).cause,'WALL_COLLISION');assert.equal(h.context.DungeonSystem.lethalAt(s,r,col),null);
});
test('V3 rubis não são confundidos com moedas opcionais',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[16]);s.runState.coinsPending=5;assert.equal(await h.context.DungeonSystem.callApi(s,'rubis_coletados',[]),0);s.gutoPosition={linha:8,coluna:24};assert.equal(await h.context.DungeonSystem.callApi(s,'abrir_porta',['door']),false);
});
test('V3 porta mantém colisão durante abertura e a libera ao completar a animação',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[0]),e=h.context.DungeonSystem.getEntity(s,'selo');s.testMode=false;let config;s.tweens={add(c){config=c;}};const image={y:0,setY(y){this.y=y;}};s.entitySprites=new Map([[e.id,{image}]]);
 const task=h.context.AnimationSystem.transition(s,e,'closed','open');assert.equal(e.state,'opening');assert.equal(h.context.DungeonSystem.isBlocked(s,e.row,e.column).cause,'CLOSED_DOOR_BLOCK');config.onComplete();await task;assert.equal(e.state,'open');assert.equal(h.context.DungeonSystem.isBlocked(s,e.row,e.column),null);
});
test('V3 orientações e movimentos correspondem às quatro famílias de animação',async()=>{
 const h=setupV3(),s=h.scene(h.context.ACTIVITIES[0]);for(const [direction,name]of Object.entries({NORTE:'up',SUL:'down',LESTE:'right',OESTE:'left'})){s.playerFacing=direction;h.context.AnimationSystem.pose(s);assert.equal(s.playerAnimation,`idle_${name}`);h.context.AnimationSystem.pose(s,'walk');assert.equal(s.playerAnimation,`walk_${name}`);}
});
for(const id of [19,20])test(`V3 busca ${id}: abre apenas o prefixo necessário em cada posição de chave`,async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[id-1];for(let variant=0;variant<3;variant++){const {scene:s,result:r}=await h.run(a,{variant});assert.equal(r.cause,'SUCCESS');assert.equal(s.runState.searchLog.length,variant+1);assert.equal(s.runState.searchLog.at(-1).found,true);assert.equal(s.runState.searchLog.filter(x=>x.found).length,1);}
});
test('V3 não aceita inserir um laço decorativo e fazer a mecânica fora dele',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[15];const unrolled=a.officialSolution.replace('for i in range(5):\n    ativar_runa()\n    andar_frente()', 'for i in range(1):\n    dummy = 1\n'+Array(5).fill('ativar_runa()\nandar_frente()').join('\n'));const {result:r}=await h.run(a,{code:unrolled});assert.equal(r.cause,'INCOMPLETE_EXECUTION');
});
test('V3 alternativa legítima: acumulador com outro nome, soma explícita e range com início e passo',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[16];const code=a.officialSolution.replaceAll('total','contagem').replace('contagem += 1','contagem = contagem + 1').replace('range(5)','range(1, 6, 1)');assert.equal((await h.run(a,{code})).result.cause,'SUCCESS');
});
test('V3 alternativa legítima: passarela longa evita os espinhos da Forja',async()=>{
 const h=setupV3(),a=h.context.ACTIVITIES[3];const code=`base = 2
andar_frente(base * 2)
virar_esquerda()
andar_frente(base * 2)
ativar_interruptor()
virar_direita()
virar_direita()
andar_frente(base * 2)
virar_esquerda()
andar_frente(base)
virar_direita()
andar_frente(3)
virar_esquerda()
andar_frente(6)
virar_esquerda()
andar_frente(3)
virar_direita()
andar_frente(5)`;const r=await h.run(a,{code});assert.equal(r.result.cause,'SUCCESS',r.result.message);assert.equal(h.context.DungeonSystem.getEntity(r.scene,'espinhos').state,'retracted');assert.equal(r.scene.livesRemaining,3);
});
test('V3 nova sintaxe não libera conceitos futuros nas unidades iniciais',async()=>{
 const h=setupV3();for(const [id,code]of [[1,'if True:\n    andar_frente()'],[6,'x = input("?")'],[11,'for i in range(2):\n    andar_frente()']])assert.equal((await h.run(h.context.ACTIVITIES[id-1],{code})).result.cause,'LOCKED_CONCEPT');
});
test('V3 UI inicial, instruções e tutoriais não publicam os segredos de input',()=>{
 const h=setupV3();for(const id of [6,7,8,9,10,13,15]){const a=h.context.ACTIVITIES[id-1];const ui=JSON.stringify({description:a.descricao,objectives:a.objectives.map(o=>o.label),guide:h.context.ActivityGuide.data(id),initial:a.codigoInicial,tutorial:a.tutorialSteps});for(const word of ['AURORA','CORAGEM'])assert.ok(!ui.includes(word),`${id}: ${word}`);assert.ok(!/(?:Energia da runa: 12|Poder da runa: 25|Grupos: 2|Runa A: 1)/.test(ui));}
});
