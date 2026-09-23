const test=require('node:test'),assert=require('node:assert/strict');
const {setupV6,fixtureV6,localStorageFixture}=require('./v6-helpers.cjs');
const {setupV4}=require('./v4-helpers.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
for(let id=1;id<=20;id++)test(`V6 A${id}: solução e variantes oficiais, mapas e moedas preservados`,async()=>{
    const h=setupV6(),a=h.context.ACTIVITIES[id-1],old=setupV4().context.ACTIVITIES[id-1];
    assert.deepEqual(plain(a.mapa),plain(old.mapa));assert.deepEqual(plain(a.barreiras),plain(old.barreiras));
    assert.deepEqual(plain(a.entities.filter(e=>e.type==='coin').map(({id,row,column})=>({id,row,column}))),plain(old.entities.filter(e=>e.type==='coin').map(({id,row,column})=>({id,row,column}))));
    if(![6,12,13,14].includes(id))assert.equal(a.officialSolution,old.officialSolution);
    for(const options of a.testScenarios||Array.from({length:a.chestKeyVariants?.length||a.variantStates?.length||1},(_,variant)=>({variant}))){const{s:unused,...result}=await h.run(a,options);assert.equal(result.result.cause,'SUCCESS',result.result.message);assert.equal(result.scene.livesRemaining,3);assert.ok(result.scene.budgetResult.valid);}
});
test('V6 A6: juramento exige input correto; literal antigo, resposta errada ou ausência não passam',async()=>{
    const h=setupV6(),a=h.context.ACTIVITIES[5];
    for(const options of [{code:setupV4().context.ACTIVITIES[5].officialSolution},{inputs:['NOITE']},{inputs:['']}]){const r=await h.run(a,options);assert.notEqual(r.result.cause,'SUCCESS');assert.equal(r.scene.playerProgress.totalXp,0);}
    const r=await h.run(a,{inputs:[' AURORA ']});assert.equal(r.result.cause,'SUCCESS');assert.equal(r.scene.runState.answers.juramento,'AURORA');
});
test('V6 A12: interruptor desligado, pisada inócua, sem variante previamente ativa',async()=>{
    for(let variant=0;variant<3;variant++){
        const h=setupV6(),s=h.scene(h.context.ACTIVITIES[11],{variant});const sw=h.context.DungeonSystem.getEntity(s,'route_switch');
        assert.equal(sw.state,'off');assert.ok(sw.discreet);assert.ok(!s.runState.entities.some(e=>e.type.includes('plate')));
        s.gutoPosition={linha:sw.row,coluna:sw.column};h.context.DungeonSystem.onEnter(s,sw.row,sw.column);assert.equal(sw.state,'off');
        assert.equal(await h.context.DungeonSystem.callApi(s,'interruptor_ativo',[]),false);
        await h.context.DungeonSystem.callApi(s,'ativar_interruptor',[]);assert.equal(sw.state,'on');assert.equal(await h.context.DungeonSystem.callApi(s,'interruptor_ativo',[]),true);
        assert.equal(h.context.DungeonSystem.getEntity(s,'spikes_upper').state,'inactive');
        await h.context.DungeonSystem.callApi(s,'ativar_interruptor',[]);assert.equal(sw.state,'off');assert.equal(h.context.DungeonSystem.getEntity(s,'spikes_lower').state,'inactive');
    }
});
test('V6 A13: duas respostas associadas aos registros, ambas obrigatórias e exatas',async()=>{
    for(const inputs of [['12',''],['12','9'],['11','10'],['12','10']]){
        const h=setupV6(),r=await h.run(h.context.ACTIVITIES[12],{inputs});assert.equal(r.result.cause==='SUCCESS',inputs.join(',')==='12,10',r.result.message);
        if(r.result.cause==='SUCCESS')assert.deepEqual(plain(r.scene.runState.answers),{fonte:'12',validadores:'10'});
    }
    const h=setupV6(),a=h.context.ACTIVITIES[12];const r=await h.run(a,{code:setupV4().context.ACTIVITIES[12].officialSolution});assert.notEqual(r.result.cause,'SUCCESS');
});
test('V6 A14: antigo atalho morre nos espinhos; detour indicado no diário passa',async()=>{
    const h=setupV6(),a=h.context.ACTIVITIES[13],old=setupV4().context.ACTIVITIES[13].officialSolution;
    const r=await h.run(a,{code:old});assert.equal(r.result.cause,'HAZARD_DEATH');assert.equal(r.scene.livesRemaining,2);
    const good=await h.run(a);assert.equal(good.result.cause,'SUCCESS');assert.ok(good.scene.discoveryState.inscriptions.manutencao);
});
test('V6 placas falsas: 2–6 apenas nas atividades com placas, piso válido, estado inerte',()=>{
    const h=setupV6();for(const a of h.context.ACTIVITIES){const s=h.scene(a),plates=a.entities.filter(e=>['pressure_plate','toggle_plate'].includes(e.type));if(a.unidade>=2&&plates.length){const falsePlates=s.runState.entities.filter(e=>e.inactivePlate);assert.ok(falsePlates.length>=2&&falsePlates.length<=6);for(const e of falsePlates){assert.equal(a.mapa[e.row][e.column],1);s.gutoPosition={linha:e.row,coluna:e.column};h.context.DungeonSystem.onEnter(s,e.row,e.column);assert.equal(e.state,'off');assert.ok(!s.runState.flags[e.id]);assert.ok(!e.connections);}}}
});
for(const id of [1,6,11,16])test(`V6 tutorial A${id}: não escreve código e solução completa conclui desde etapa zero`,async()=>{
    const h=setupV6(),a=h.context.ACTIVITIES[id-1],s=h.scene(a);s.tutorialStepIndex=0;s.editorTexto.value='meu_rascunho = 1';h.context.TutorialSystem.inicializar(s);assert.equal(s.editorTexto.value,'meu_rascunho = 1');
    const code=a.officialSolution;const r=await h.context.CommandInterpreter.executar(s,{code});assert.equal(r.cause,'SUCCESS');assert.ok(s.playerProgress.completedActivities.includes(id));assert.equal(s.editorTexto.value,'meu_rascunho = 1');
});
test('V6 três mortes: contagem, bloqueio, retorno obrigatório e limite A1',async()=>{
    for(const id of [1,14]){
        const h=setupV6(),a=h.context.ACTIVITIES[id-1],s=h.scene(a);let navigated;
        s.scene={start:(name,data)=>navigated={name,data}};
        h.context.PlayerController.andarFrente=async()=>{throw Object.assign(new Error('perigo'),{cause:'HAZARD_DEATH'});};
        for(let lives=2;lives>=0;lives--){await h.context.CommandInterpreter.executar(s,{code:'andar_frente()'});assert.equal(s.livesRemaining,lives);}
        const j=h.context.PersistenceService.load().journey;assert.equal(j.stats.deaths,3);assert.equal(j.stats.gameOvers,1);assert.equal(j.pendingReturn,Math.max(1,id-1));
        assert.equal((await h.context.CommandInterpreter.executar(s,{code:'andar_frente()'})).cause,'EXECUTION_BLOCKED');
        await h.context.JourneySystem.returnAfterDeath(s);h.context.JourneySystem.checkpoint(s);
        assert.equal(navigated.data.atividadeIndex,Math.max(0,id-2));assert.equal(h.context.PersistenceService.load().journey.currentActivity,Math.max(1,id-1));assert.equal(h.context.PersistenceService.load().journey.pendingReturn,null);
    }
});
test('V6 save: migra V5 sem inventar métricas; conserva XP, moedas e recompensas',()=>{
    const storage=localStorageFixture(),old=setupV4({localStorage:storage}),p=old.context.PersistenceService.load();p.totalXp=123;p.unlockedMax=7;p.completedActivities=[1,2,3,4,5,6];p.walletCoins=9;old.context.PersistenceService.save(p);
    const h=setupV6({localStorage:storage}),s=h.scene(h.context.ACTIVITIES[6]),saved=h.context.PersistenceService.load();
    assert.equal(saved.schemaVersion,3);assert.equal(saved.totalXp,123);assert.equal(saved.walletCoins,9);assert.equal(saved.journey.currentActivity,7);assert.equal(saved.journey.stats.deaths,0);assert.equal(saved.journey.migrated,true);
    s.editorTexto.value='resposta = input("teste")';s.livesRemaining=2;h.context.JourneySystem.checkpoint(s);
    const next=setupV6({localStorage:storage}),resumed=next.scene(next.context.ACTIVITIES[6]);resumed.requestedVariant=null;next.context.JourneySystem.enter(resumed);assert.equal(resumed.livesRemaining,2);assert.equal(resumed.resumeCode,s.editorTexto.value);
});
test('V6 recuperação: não permite voltar imediatamente à missão da morte pelo botão próxima',async()=>{
    const h=setupV6(),s=h.scene(h.context.ACTIVITIES[13]);s.scene={start(){}};
    const p=h.context.PersistenceService.load();p.unlockedMax=14;h.context.PersistenceService.save(p);
    for(let i=0;i<3;i++)h.context.JourneySystem.die(s);await h.context.JourneySystem.returnAfterDeath(s);
    assert.equal(h.context.ProgressionSystem.atividadeDesbloqueada(s,14),false);
    const r=await h.run(h.context.ACTIVITIES[12]);assert.equal(r.result.cause,'SUCCESS');assert.equal(h.context.PersistenceService.load().journey.recoveryActivity,null);
    assert.equal(h.context.ProgressionSystem.atividadeDesbloqueada(r.scene,14),true);
});
test('V6 estatísticas: instruções de laço efetivamente executadas, erros e respostas',async()=>{
    const h=setupV6(),a=h.context.ACTIVITIES[15],s=h.scene(a);
    await h.context.CommandInterpreter.executar(s,{code:'for i in range(3):\n    x = i'});
    let j=h.context.PersistenceService.load().journey;assert.equal(j.stats.instructions,4);assert.equal(j.stats.executions,1);
    await h.context.CommandInterpreter.executar(s,{code:'x ='});j=h.context.PersistenceService.load().journey;assert.equal(j.stats.errors,1);assert.equal(j.stats.instructions,4);
    await h.run(h.context.ACTIVITIES[12],{inputs:['12','9']});j=h.context.PersistenceService.load().journey;assert.equal(j.stats.answers,2);assert.equal(j.stats.wrongAnswers,1);
});
test('V6 dev: voo não atravessa limites nem dispara coleta; save normal intacto',async()=>{
    const storage=localStorageFixture(),normal=setupV6({localStorage:storage});await normal.run(normal.context.ACTIVITIES[0]);const before=storage.getItem(normal.context.GAME_CONSTANTS.STORAGE_KEY);
    const dev=setupV6({localStorage:storage,location:{search:'?dev=1'}}),s=dev.scene(dev.context.ACTIVITIES[0]);s.devMode=true;s.devFlying=true;
    const coins=dev.context.CoinSystem.stats(s).total;assert.ok(dev.context.DevToolsSystem.move(s,'ArrowRight'));assert.equal(dev.context.CoinSystem.stats(s).total,coins);
    s.gutoPosition={linha:0,coluna:0};assert.equal(dev.context.DevToolsSystem.move(s,'ArrowUp'),false);
    assert.equal((await dev.context.CommandInterpreter.executar(s)).cause,'EXECUTION_BLOCKED');s.devFlying=false;await dev.run(dev.context.ACTIVITIES[19]);assert.equal(storage.getItem(normal.context.GAME_CONSTANTS.STORAGE_KEY),before);
});
test('V6 interface: game over não oferece continuar; conclusão A20, estatísticas e reset persistente',async()=>{
    const h=fixtureV6('?dev=1'),s=h.game(19);s.editorTexto.value=s.atividade.officialSolution;s.testInputQueue=[...s.atividade.testInputs];
    assert.equal((await h.context.CommandInterpreter.executar(s)).cause,'SUCCESS');assert.equal(h.host.querySelector('#journey-title').textContent,'JORNADA CONCLUÍDA');
    const buttons=h.host.querySelector('.journey-actions').querySelectorAll('button');await buttons[1].emit('click');assert.match(h.host.querySelector('.journey-stats').textContent,/Instruções executadas/);
    assert.equal(h.context.PersistenceService.load().journey.completed,true);await buttons[0].emit('click');h.context.JourneySystem.checkpoint(s);
    const p=h.context.PersistenceService.load();assert.equal(p.journey.completed,false);assert.equal(p.totalXp,0);assert.equal(p.walletCoins,0);assert.equal(p.journey.stats.instructions,0);assert.deepEqual(plain(p.completedActivities),[]);assert.equal(p.journey.currentActivity,1);
});
