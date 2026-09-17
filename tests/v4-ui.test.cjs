const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fixture}=require('./ui-fixture.cjs');
const {setupV4}=require('./v4-helpers.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
async function solve(h,s){s.tutorialStepIndex=(s.atividade.tutorialSteps?.length||1)-1;s.editorTexto.value=s.atividade.officialSolution;s.testInputQueue=[...(s.atividade.testInputs||[])];s.codeEditor.refresh();return h.context.CommandInterpreter.executar(s);}
test('V4 orçamento: indicador semântico real destaca excesso e EXECUTAR permanece disponível',async()=>{
 const h=fixture({v4:true}),s=h.game(0),q=sel=>h.host.querySelector(sel);
 s.editorTexto.value=s.atividade.officialSolution+'\n'+'n = 1\n'.repeat(s.atividade.instructionBudget);s.codeEditor.refresh();
 const count=h.context.PythonSubsetParser.parse(s.editorTexto.value).analysis.instructionCount;
 assert.equal(q('.budget').textContent,`${count} / ${s.atividade.instructionBudget} instruções`);assert.equal(q('.budget').dataset.over,'true');assert.ok(!q('.run').disabled);
 s.tutorialStepIndex=3;await q('.run').emit('click');assert.equal(s.runState.reachedExit,true);assert.equal(q('.feedback').dataset.cause,'CODE_BUDGET_EXCEEDED');assert.match(q('.feedback').textContent,/otimi|Reduza/);assert.ok(!q('.completion-overlay')||q('.completion-overlay').hidden);
 await solve(h,s);assert.equal(q('.budget').dataset.over,'false');assert.equal(q('.completion-overlay').hidden,false);
});
test('V4 modal exige mundo, pedagogia e orçamento; não abre em execução incompleta',async()=>{
 const h=fixture({v4:true}),s=h.game(2);s.editorTexto.value='andar_frente()';await h.context.CommandInterpreter.executar(s);assert.equal(s.completionModel,null);assert.ok(!h.host.querySelector('.completion-overlay'));
 await solve(h,s);assert.ok(s.completionModel);const original=s.objectiveStatuses[0].completed;s.objectiveStatuses[0].completed=false;assert.equal(h.context.CompletionSystem.model(s),null);s.objectiveStatuses[0].completed=original;
 s.budgetResult.valid=false;assert.equal(h.context.CompletionSystem.model(s),null);
});
test('V4 modal apresenta só objetivos/regras locais e estatísticas reais da busca',async()=>{
 const h=fixture({v4:true}),s=h.game(18),q=sel=>h.host.querySelector(sel);s.sessionVariantIndex=1;s.livesRemaining=2;
 s.editorTexto.value='x =';await h.context.CommandInterpreter.executar(s);assert.equal(s.executionCount,0);
 s.editorTexto.value='andar_frente()';await h.context.CommandInterpreter.executar(s);assert.equal(s.executionCount,1);
 const result=await solve(h,s);assert.equal(result.cause,'SUCCESS');const model=s.completionModel;
 assert.equal(q('.completion-overlay').hidden,false);assert.equal(q('.completion-card').attributes.role,'dialog');assert.equal(q('.completion-card').attributes['aria-modal'],'true');assert.equal(q('.play-screen').inert,true);
 assert.equal(q('#completion-title').textContent,`Atividade 19 — ${s.atividade.nome}`);assert.equal(model.lives,2);assert.equal(model.attempts,2);assert.deepEqual(plain(model.chests),{opened:2,total:3});assert.equal(model.budget.used,20);assert.equal(model.budget.limit,30);
 assert.equal(model.coins.collected,s.playerProgress.coinCollection.ids.filter(id=>id.startsWith('A19_')).length);assert.equal(model.coins.available,5);
 for(const label of model.objectives)assert.ok(q('.completion-objectives').textContent.includes(label));for(const label of model.rules)assert.ok(q('.completion-rules').textContent.includes(label));
 assert.ok(!model.rules.some(x=>/input|print|for e/.test(x)));assert.match(q('.completion-stats').textContent,/Vidas restantes2 \/ 3/);assert.match(q('.completion-stats').textContent,/Tentativas2/);assert.match(q('.completion-stats').textContent,/Baús abertos2 \/ 3/);assert.match(q('.completion-stats').textContent,/Instruções semânticas20 \/ 30/);
});
test('V4 modal sem baús omite estatística e tentar novamente reinicia sem duplicar recompensas',async()=>{
 const h=fixture({v4:true}),s=h.game(6);await solve(h,s);assert.equal(s.completionModel.chests,null);assert.ok(!h.host.querySelector('.completion-stats').textContent.includes('Baús'));
 const xp=s.playerProgress.totalXp,coins=s.playerProgress.walletCoins,code=s.editorTexto.value,ids=[...s.playerProgress.coinCollection.ids];
 await h.host.querySelector('.completion-retry').emit('click');assert.equal(h.host.querySelector('.completion-overlay').hidden,true);assert.equal(h.host.querySelector('.play-screen').inert,false);assert.equal(s.executionCount,0);assert.equal(s.livesRemaining,3);assert.equal(s.editorTexto.value,code);assert.equal(Object.keys(s.discoveryState.inscriptions).length,0);
 for(const id of ids)assert.equal(h.context.DungeonSystem.getEntity(s,id).state,'collected');assert.equal(s.playerProgress.walletCoins,coins);
 await solve(h,s);assert.equal(s.playerProgress.totalXp,xp);assert.equal(s.playerProgress.walletCoins,coins);assert.equal(s.completionModel.attempts,1);
});
test('V4 próxima atividade usa progresso salvo e conclui jornada retorna ao menu',async()=>{
 const h=fixture({v4:true}),s=h.game(0);await solve(h,s);await h.host.querySelector('.completion-next').emit('click');assert.equal(s.transition.name,'Game');assert.equal(s.transition.data.atividadeIndex,1);assert.equal(h.context.PersistenceService.load().unlockedMax,2);
 const last=h.game(19);await solve(h,last);assert.equal(h.host.querySelector('.completion-next').textContent,'CONCLUIR JORNADA');await h.host.querySelector('.completion-next').emit('click');assert.equal(last.transition.name,'MainMenu');assert.ok(h.context.PersistenceService.load().completedActivities.includes(20));
});
test('V4 HUD e renderização de moeda persistem após REINICIAR e retorno à fase',async()=>{
 const h=fixture({v4:true}),s=h.game(0),coin=s.runState.entities.find(e=>e.type==='coin');s.gutoPosition={linha:coin.row,coluna:coin.column};h.context.DungeonSystem.onEnter(s,coin.row,coin.column);
 assert.equal(s.entitySprites.get(coin.id).image.visible,false);assert.match(h.host.querySelector('.phase-coins').textContent,/Moedas da fase: 1 \/ 5 · Total: 1 \/ 100/);
 await h.host.querySelector('.restore').emit('click');assert.equal(s.entitySprites.get(coin.id).image.visible,false);
 const again=h.game(0);assert.equal(again.entitySprites.get(coin.id).image.visible,false);assert.match(h.host.querySelector('.phase-coins').textContent,/1 \/ 5/);
});
test('V4 ! aparece apenas próximo e visível; examinar registra, afasta/esconde e persiste entre EXECUTARs',async()=>{
 const h=fixture({v4:true}),s=h.game(6),c=h.context,e=s.runState.entities.find(e=>e.type==='inscription'),visual=s.entitySprites.get(e.id);
 assert.equal(e.visualVariant,'bookshelf');assert.equal(visual.image.key,'official_bookshelf_left');assert.ok(!visual.marker);assert.equal(Object.keys(s.discoveryState.inscriptions).length,0);
 c.DiscoverySystem.reveal(s,s.atividade.regions.map(r=>r.id));c.DecorationSystem.updateMarkers(s);assert.ok(!visual.marker);assert.equal(Object.keys(s.discoveryState.inscriptions).length,0);
 s.gutoPosition={linha:e.row+1,coluna:e.column};s.playerFacing='NORTE';c.DecorationSystem.updateMarkers(s);assert.equal(visual.marker.visible,true);assert.equal(visual.marker.key,'!');
 s.gutoPosition={linha:e.row+3,coluna:e.column};c.DecorationSystem.updateMarkers(s);assert.equal(visual.marker.visible,false);
 s.gutoPosition={linha:e.row+1,coluna:e.column};s.playerFacing='NORTE';const text=await c.DungeonSystem.callApi(s,'examinar',[]);assert.equal(text,e.text);assert.ok(s.discoveryState.inscriptions[e.id]);assert.equal(visual.marker.visible,false);assert.equal(visual.image.key,'official_bookshelf_right');assert.match(h.host.querySelector('.clue-text').textContent,/CORAGEM/);assert.ok(h.host.querySelector('.journal-entries').textContent.includes(e.text));
 c.DungeonSystem.resetRun(s);s.gutoPosition={linha:e.row+1,coluna:e.column};c.DecorationSystem.updateMarkers(s);assert.equal(visual.marker.visible,false);assert.ok(s.discoveryState.inscriptions[e.id]);
});
test('V4 indicador não revela objetos ocultos nem transforma decoração em investigação',()=>{
 const h=fixture({v4:true}),s=h.game(6),c=h.context,e=s.runState.entities.find(e=>e.type==='inscription');
 s.gutoPosition={linha:e.row+1,coluna:e.column};const canSee=c.DiscoverySystem.canSee;c.DiscoverySystem.canSee=()=>false;c.DecorationSystem.updateMarkers(s);assert.ok(!s.entitySprites.get(e.id).marker);c.DiscoverySystem.canSee=canSee;
 const shelf=s.atividade.decorations.find(d=>d.role==='bookshelf_left');assert.ok(shelf);assert.equal(c.DecorationSystem.isInvestigableNearby(s,shelf),false);assert.equal(s.runState.entities.some(x=>x.id===shelf.id),false);
});
test('V4 totens usam os novos quadros OFF/ON, sincronizados com ativação e ponte',async()=>{
 const h=fixture({v4:true}),s=h.game(15),e=s.runState.entities.find(e=>e.type==='totem'),visual=s.entitySprites.get(e.id);assert.equal(visual.image.key,'official_v4_totem_off');
 s.gutoPosition={linha:e.row,coluna:e.column};await h.context.DungeonSystem.callApi(s,'ativar_runa',[]);assert.equal(visual.image.key,'official_v4_totem_on');assert.equal(h.context.DungeonSystem.getEntity(s,'bridge1').state,'active');
 for(const state of ['off','on']){const asset=h.context.AssetCatalog[`v4_totem_${state}`],bytes=fs.readFileSync(path.join(__dirname,'..',asset.path));assert.equal(bytes.readUInt32BE(16),64);assert.equal(bytes.readUInt32BE(20),64);assert.equal(bytes[25],6);}
});
test('V4 UI inicial, livros não lidos e prompts continuam sem respostas expostas',async()=>{
 for(const id of [7,8,9,10,13,15]){const h=fixture({v4:true}),s=h.game(id-1);for(const secret of ['CORAGEM','AURORA'])assert.ok(!h.host.textContent.includes(secret));assert.equal(h.host.querySelector('.journal-entries').textContent.includes('CORAGEM'),false);const p=h.context.GameUI.solicitarEntrada(s,'Apresente o valor descoberto:');assert.equal(h.host.querySelector('.runtime-input').value,'');assert.equal(h.host.querySelector('.input-data').textContent,'Consulte as pistas encontradas no Diário.');h.host.querySelector('.runtime-input').value='resposta';await h.host.querySelector('.input-area').emit('submit');assert.equal(await p,'resposta');}
});
