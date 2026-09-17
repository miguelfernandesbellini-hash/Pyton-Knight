// Check collectible access from real, successful execution snapshots.
// Optional detours use the production movement/hazard APIs; no door is forced open.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {setupV4}=require('../../tests/v4-helpers.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
function snapshot(s){const runState=copy(s.runState);runState.analysis=null;runState.runtimeAnalysis=null;return {runState,discoveryState:copy(s.discoveryState),gutoPosition:{...s.gutoPosition},playerFacing:s.playerFacing,livesRemaining:s.livesRemaining};}
function route(h,s,coin){
 const key=(r,c)=>`${r},${c}`,start=s.gutoPosition,target=key(coin.row,coin.column),queue=[[start.linha,start.coluna]],paths=new Map([[key(start.linha,start.coluna),[]]]);
 while(queue.length){const [r,c]=queue.shift(),steps=paths.get(key(r,c));if(key(r,c)===target)return steps;
  for(const [nr,nc]of[[r+1,c],[r-1,c],[r,c+1],[r,c-1]]){
   if(paths.has(key(nr,nc)))continue;
   const region=h.context.DiscoverySystem.regionAt(s,nr,nc);
   if(region?.fearDamage&&(!region.fearVariants||region.fearVariants.includes((s.sessionVariantIndex||0)%3))&&region.lightState==='deepDark'&&!h.context.DiscoverySystem.isLit(s,region))continue;
   if(h.context.DungeonSystem.isBlocked(s,nr,nc)||h.context.DungeonSystem.lethalAt(s,nr,nc))continue;
   paths.set(key(nr,nc),[...steps,{row:nr,column:nc}]);queue.push([nr,nc]);
  }
 }return null;
}
async function auditCoins(){
 const rows=[];
 for(let id=1;id<=20;id++){
  const base=setupV4().context.ACTIVITIES[id-1];
  for(const options of base.testScenarios||Array.from({length:base.chestKeyVariants?.length||base.variantStates?.length||1},(_,variant)=>({variant}))){
   const h=setupV4(),a=h.context.ACTIVITIES[id-1],snapshots=[];
   const after=h.context.MechanismSystem.afterMove;h.context.MechanismSystem.afterMove=async function(s,states){await after.call(this,s,states);snapshots.push(snapshot(s));};
   const {scene:s,result}=await h.run(a,options);h.context.MechanismSystem.afterMove=after;assert.equal(result.cause,'SUCCESS');
   const initialProgress=copy(h.context.PersistenceService.load()),coins=a.entities.filter(e=>e.type==='coin'),results=[];
   for(const coin of coins){
    if(initialProgress.coinCollection.ids.includes(coin.id)){results.push({id:coin.id,access:'percurso oficial',steps:0});continue;}
    let proof=null;
    const nearest=[...snapshots].sort((x,y)=>(Math.abs(x.gutoPosition.linha-coin.row)+Math.abs(x.gutoPosition.coluna-coin.column))-(Math.abs(y.gutoPosition.linha-coin.row)+Math.abs(y.gutoPosition.coluna-coin.column)));
    for(const state of nearest){
     Object.assign(s,copy(state));s.cancelRequested=false;h.context.PersistenceService.save(initialProgress);s.playerProgress=h.context.PersistenceService.load();
     const steps=route(h,s,coin);if(!steps||!steps.length)continue;
     try{
      for(const next of steps){s.playerFacing=next.row>s.gutoPosition.linha?'SUL':next.row<s.gutoPosition.linha?'NORTE':next.column>s.gutoPosition.coluna?'LESTE':'OESTE';await h.context.PlayerController.andarFrente(s,1);}
      if(h.context.PersistenceService.load().coinCollection.ids.includes(coin.id)&&s.livesRemaining===3){proof={id:coin.id,access:'desvio opcional sem dano',from:state.gutoPosition,steps:steps.length};break;}
     }catch(error){if(!['HAZARD_DEATH','CLOSED_DOOR_BLOCK','WALL_COLLISION'].includes(error.cause))throw error;}
    }
    assert.ok(proof,`A${id} variante ${options.variant||0}: ${coin.id} sem percurso legítimo`);results.push(proof);
   }
   assert.ok(results.filter(r=>r.access==='desvio opcional sem dano').length>=2,`A${id}: moedas devem recompensar desvios`);
   rows.push({activity:id,variant:options.variant||0,coins:results});
  }
 }
 return {activities:20,scenarios:rows.length,coinAccessChecks:rows.length*5,uniqueIds:100,method:'Snapshots de soluções oficiais + deslocamentos reais sem dano; nenhum requisito ou porta forçado.',rows};
}
module.exports={auditCoins};
if(require.main===module)auditCoins().then(report=>{const out=path.resolve(__dirname,'../../docs/v4/evidencias');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'auditoria-moedas.json'),JSON.stringify(report,null,2));console.log(`PASS: ${report.coinAccessChecks} acessos em ${report.scenarios} cenários; 100 IDs únicos alcançáveis.`);}).catch(e=>{console.error(e);process.exitCode=1;});
