const test=require('node:test'),assert=require('node:assert/strict');
const {setupV4,localStorageFixture}=require('./v4-helpers.cjs');
const {setupV3}=require('./v3-helpers.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
function collect(h,s,e){s.gutoPosition={linha:e.row,coluna:e.column};s.runState.occupiedTile=null;h.context.DungeonSystem.onEnter(s,e.row,e.column);}

for(let id=1;id<=20;id++)test(`V4 atividade ${id}: solução V3 intacta e todas as variantes concluíveis`,async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[id-1],old=setupV3().context.ACTIVITIES[id-1];
 for(const field of ['mapa','barreiras','startPosition','initialFacing','officialSolution','testScenarios','testInputs','allowedConcepts','allowedCommands','outputRules','regions'])assert.equal(JSON.stringify(a[field]),JSON.stringify(old[field]),`${id}: ${field}`);
 const critical=old.entities.filter(e=>e.type!=='coin'||e.manualCollect);
 for(const e of critical){const current=a.entities.find(x=>x.id===e.id);assert.equal(current.row,e.row);assert.equal(current.column,e.column);for(const field of Object.keys(e).filter(k=>!['type','family'].includes(k)))assert.equal(JSON.stringify(current[field]),JSON.stringify(e[field]));}
 assert.deepEqual(plain(a.objectives.filter(o=>o.type!=='budget')),plain(old.objectives.filter(o=>o.type!=='budget')));
 for(const options of a.testScenarios||Array.from({length:a.chestKeyVariants?.length||a.variantStates?.length||1},(_,variant)=>({variant}))){const {scene:s,result:r}=await h.run(a,options);assert.equal(r.cause,'SUCCESS',r.message);assert.equal(s.livesRemaining,3);assert.equal(s.executionCount,1);assert.equal(s.budgetResult.valid,true);}
});
test('V4 orçamento semântico configurado em todas as atividades, crescente por unidade',()=>{
 const h=setupV4();for(const a of h.context.ACTIVITIES){assert.ok(Number.isInteger(a.instructionBudget));assert.equal(a.objectives.filter(o=>o.type==='budget').length,1);assert.ok(h.context.PythonSubsetParser.parse(a.officialSolution).analysis.instructionCount<=a.instructionBudget);if(a.id%5!==1)assert.ok(a.instructionBudget>=h.context.ACTIVITIES[a.id-2].instructionBudget);}
});
test('V4 programa acima do orçamento executa, descobre e alcança saída; só conclusão é bloqueada',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[6],code=a.officialSolution+'\n'+'extra = 1\n'.repeat(a.instructionBudget);
 const {scene:s,result:r}=await h.run(a,{code});
 assert.equal(s.runState.reachedExit,true);assert.ok(s.discoveryState.inscriptions.memoria);assert.equal(h.context.DungeonSystem.getEntity(s,'door').state,'open');
 assert.equal(r.cause,'CODE_BUDGET_EXCEEDED');assert.match(r.message,/Você alcançou o objetivo/);assert.match(r.message,/Reduza a quantidade de instruções/);assert.match(r.message,new RegExp(`${s.budgetResult.used} / ${a.instructionBudget}`));
 assert.equal(s.executionCount,1);assert.equal(s.playerProgress.totalXp,0);assert.equal(s.playerProgress.unlockedMax,1);assert.equal(s.playerProgress.completedActivities.length,0);assert.equal(h.context.CompletionSystem.model(s),null);
 s.editorTexto.value=a.officialSolution;s.testInputQueue=[...a.testInputs];const second=await h.context.CommandInterpreter.executar(s);assert.equal(second.cause,'SUCCESS');assert.equal(s.executionCount,2);assert.ok(h.context.CompletionSystem.model(s));
});
test('V4 exceder orçamento permite exploração parcial sem mensagem de execução proibida',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[2],{scene:s,result:r}=await h.run(a,{code:'andar_frente()\n'+'n = 1\n'.repeat(a.instructionBudget)});
 assert.equal(r.cause,'INCOMPLETE_EXECUTION');assert.equal(s.gutoPosition.coluna,a.startPosition.coluna+1);assert.equal(s.budgetResult.valid,false);assert.equal(s.executionCount,1);
});
test('V4 tentativas excluem código vazio, comentários, parsing e bloqueios estáticos',async()=>{
 const h=setupV4(),s=h.scene(h.context.ACTIVITIES[0]);
 for(const code of ['', '# comentário', 'x =', 'voar()', 'for i in range(2):\n    andar_frente()']){await h.context.CommandInterpreter.executar(s,{code});assert.equal(s.executionCount||0,0,code);}
 await h.context.CommandInterpreter.executar(s,{code:'andar_frente()'});assert.equal(s.executionCount,1);
 await h.context.CommandInterpreter.executar(s,{code:'andar_frente(40)'});assert.equal(s.executionCount,2);assert.equal(s.livesRemaining,3);
});
test('V4 moedas: cinco por fase, 100 IDs únicos e nenhum objetivo exige moeda',()=>{
 const h=setupV4(),ids=[];for(const a of h.context.ACTIVITIES){const coins=a.entities.filter(e=>e.type==='coin');assert.equal(coins.length,5);for(const [i,e]of coins.entries()){assert.equal(e.id,`A${String(a.id).padStart(2,'0')}_C0${i+1}`);assert.equal(e.manualCollect,undefined);assert.equal(a.mapa[e.row][e.column],1);assert.equal(a.entities.filter(x=>x.row===e.row&&x.column===e.column).length,1);ids.push(e.id);}assert.ok(!a.objectives.some(o=>o.type==='coins'||o.entityId?.startsWith('A')));}
 assert.equal(new Set(ids).size,100);
});
test('V4 coleta grava imediatamente, credita uma vez e rejeita coleta remota',()=>{
 const localStorage=localStorageFixture(),h=setupV4({localStorage}),s=h.scene(h.context.ACTIVITIES[0]),e=s.runState.entities.find(e=>e.type==='coin');
 assert.equal(h.context.CoinSystem.collect(s,e),false);collect(h,s,e);assert.equal(s.playerProgress.walletCoins,1);assert.equal(h.context.PersistenceService.load().coinCollection.ids[0],e.id);
 assert.equal(h.context.CoinSystem.collect(s,e),false);collect(h,s,e);assert.equal(s.playerProgress.walletCoins,1);assert.equal(e.state,'collected');
 const reloaded=setupV4({localStorage}),again=reloaded.scene(reloaded.context.ACTIVITIES[0]);assert.equal(again.playerProgress.walletCoins,1);assert.equal(reloaded.context.DungeonSystem.getEntity(again,e.id).state,'collected');
});
test('V4 executar, reiniciar descobertas e sair/voltar não recriam moedas',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[0],s=h.scene(a),coin=s.runState.entities.find(e=>e.type==='coin');collect(h,s,coin);
 await h.context.CommandInterpreter.executar(s,{code:'andar_frente()'});assert.equal(h.context.DungeonSystem.getEntity(s,coin.id).state,'collected');
 h.context.DiscoverySystem.resetActivity(s);h.context.DungeonSystem.resetRun(s);assert.equal(h.context.DungeonSystem.getEntity(s,coin.id).state,'collected');
 h.scene(h.context.ACTIVITIES[1]);const back=h.scene(a);assert.equal(h.context.DungeonSystem.getEntity(back,coin.id).state,'collected');assert.equal(back.playerProgress.walletCoins,1);
});
test('V4 morrer preserva moedas e desconta exatamente uma vida',async()=>{
 const h=setupV4(),original=h.context.ACTIVITIES[0];
 const a={...original,tutorialSteps:null,regions:[],mapa:[[1,1,1]],startPosition:{linha:0,coluna:0},entities:[{id:'A01_C01',type:'coin',row:0,column:1},{id:'spike',type:'hazard',skin:'v3',row:0,column:2,initialState:'active'}],objectives:[{type:'reach_exit',label:'Saída'},{type:'budget',label:'Orçamento'}]};
 const {scene:s,result:r}=await h.run(a,{code:'andar_frente(2)'});assert.equal(r.cause,'HAZARD_DEATH');assert.equal(s.livesRemaining,2);assert.equal(s.playerProgress.walletCoins,1);assert.equal(h.context.DungeonSystem.getEntity(s,'A01_C01').state,'collected');
});
test('V4 concluir e repetir mantém XP e saldo; rubis não geram moeda extra',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[16],first=await h.run(a),balance=first.scene.playerProgress.walletCoins,xp=first.scene.playerProgress.totalXp;
 assert.equal(first.result.cause,'SUCCESS');assert.equal(first.scene.runState.flags.rubiesCollected,5);assert.equal(first.scene.runState.coinsPending,0);assert.ok(balance<=5);
 const second=await h.run(a);assert.equal(second.result.reward.firstCompletion,false);assert.equal(second.scene.playerProgress.walletCoins,balance);assert.equal(second.scene.playerProgress.totalXp,xp);
 assert.equal(await h.context.DungeonSystem.callApi(second.scene,'rubis_coletados',[]),5);assert.equal(await h.context.DungeonSystem.callApi(second.scene,'moedas_coletadas',[]),balance);
});
test('V4 todas as moedas rendem exatamente 100 uma única vez, inclusive após recarregar',()=>{
 const localStorage=localStorageFixture(),h=setupV4({localStorage});for(const a of h.context.ACTIVITIES){const s=h.scene(a);for(const e of s.runState.entities.filter(e=>e.type==='coin'))collect(h,s,e);}
 assert.equal(h.context.PersistenceService.load().walletCoins,100);assert.equal(h.context.PersistenceService.load().coinCollection.ids.length,100);
 const again=setupV4({localStorage});for(const a of again.context.ACTIVITIES){const s=again.scene(a);for(const e of s.runState.entities.filter(e=>e.type==='coin')){assert.equal(e.state,'collected');collect(again,s,e);}}
 assert.equal(again.context.PersistenceService.load().walletCoins,100);
});
test('V4 migração preserva XP, desbloqueios e saldo V3 sem inventar moedas coletadas',()=>{
 const h=setupV4();h.context.PersistenceService.save({walletCoins:9,totalXp:700,unlockedMax:9,completedActivities:[1,2,3,4,5,6,7,8],rewardedActivities:{1:{xp:100}}});
 const s=h.scene(h.context.ACTIVITIES[0]);assert.equal(s.playerProgress.walletCoins,9);assert.equal(s.playerProgress.coinCollection.legacyCredit,9);assert.equal(s.playerProgress.coinCollection.ids.length,0);assert.equal(s.playerProgress.totalXp,700);assert.equal(s.playerProgress.unlockedMax,9);
 collect(h,s,s.runState.entities.find(e=>e.type==='coin'));assert.equal(s.playerProgress.walletCoins,10);assert.equal(h.context.CoinSystem.stats(s).total,1);
});
test('V4 ledger elimina IDs inválidos/duplicados e mantém saldo separado do histórico de coleta',()=>{
 const h=setupV4(),s=h.context.PersistenceService.save({coinCollection:{version:1,ids:['A01_C01','A01_C01','A20_C05','A21_C01','A01_C06',null],legacyCredit:0,spent:1}});
 assert.deepEqual(plain(s.coinCollection.ids),['A01_C01','A20_C05']);assert.equal(s.walletCoins,1);assert.equal(s.coinCollection.spent,1);
});
test('V4 vinte conclusões, desbloqueios, XP por vidas e replays continuam coerentes',async()=>{
 const h=setupV4();let xp=0;for(const a of h.context.ACTIVITIES){assert.equal(h.context.PersistenceService.load().unlockedMax,a.id);const {scene:s,result:r}=await h.run(a,{lives:a.id===2?2:3});assert.equal(r.cause,'SUCCESS');xp+=Math.round((a.rewards?.xpBase||100)*(a.id===2?.75:1));assert.equal(s.playerProgress.totalXp,xp);assert.equal(s.playerProgress.completedActivities.length,a.id);assert.equal(s.playerProgress.unlockedMax,Math.min(20,a.id+1));assert.ok(s.playerProgress.walletCoins<=100);}
 const before=h.context.PersistenceService.load();await h.run(h.context.ACTIVITIES[19]);const after=h.context.PersistenceService.load();assert.equal(after.totalXp,before.totalXp);assert.equal(after.walletCoins,before.walletCoins);
});
test('V4 soluções podem concluir sem coletar qualquer moeda opcional',async()=>{
 const h=setupV4();for(const a of h.context.ACTIVITIES){const without={...a,entities:a.entities.filter(e=>e.type!=='coin')};const r=await h.run(without);assert.equal(r.result.cause,'SUCCESS',`A${a.id}`);assert.equal(r.scene.playerProgress.walletCoins,0);}
});
test('V4 decoração preserva colisões; objeto sólido futuro bloqueia com aviso e sem dano',async()=>{
 const h=setupV4();for(const a of h.context.ACTIVITIES)for(const d of a.decorations){assert.equal(d.solid,false);assert.equal(a.mapa[d.row][d.column],0);}
 const old=h.context.ACTIVITIES[0],a={...old,tutorialSteps:null,regions:[],mapa:[[1,1,3]],startPosition:{linha:0,coluna:0},entities:[],decorations:[{row:0,column:1,solid:true,label:'A estante'}]};
 const {scene:s,result:r}=await h.run(a,{code:'andar_frente()'});assert.equal(r.cause,'WALL_COLLISION');assert.match(r.message,/A estante impede/);assert.equal(s.livesRemaining,3);assert.equal(s.gutoPosition.coluna,0);
});
