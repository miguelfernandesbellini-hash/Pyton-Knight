const test=require('node:test'),assert=require('node:assert/strict');
const {auditCoins}=require('../tools/v4/audit-coins.cjs');
const {setupV4}=require('./v4-helpers.cjs');
test('V4 100 moedas acessíveis: 145 percursos nos 29 cenários, sem dano nem requisitos forçados',async()=>{
 const report=await auditCoins();assert.equal(report.coinAccessChecks,145);assert.equal(report.scenarios,29);assert.equal(new Set(report.rows.flatMap(r=>r.coins.map(c=>c.id))).size,100);
});
test('V4 replay nunca duplica recompensa, mesmo com opção legada de replay ativada',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[0];a.rewards={...a.rewards,replayRewards:true};await h.run(a);const first=h.context.PersistenceService.load();const second=await h.run(a);assert.equal(second.result.reward.xp,0);assert.equal(second.result.reward.coins,0);assert.equal(h.context.PersistenceService.load().walletCoins,first.walletCoins);assert.equal(h.context.PersistenceService.load().totalXp,first.totalXp);
});
test('V4 alternativas legítimas preservam acumulador, range e iluminação',async()=>{
 const h=setupV4(),a=h.context.ACTIVITIES[16],code=a.officialSolution.replaceAll('total','contagem').replace('contagem += 1','contagem = contagem + 1').replace('range(5)','range(1, 6, 1)');assert.equal((await h.run(a,{code})).result.cause,'SUCCESS');
});
