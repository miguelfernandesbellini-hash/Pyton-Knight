// Geometry, isolated missing-requirement checks and mutation audit through the production interpreter.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {setupV3}=require('../../tests/v3-helpers.cjs');
const v4=process.argv.includes('--v4');
const setup=v4?require('../../tests/v4-helpers.cjs').setupV4:setupV3;
const root=path.resolve(__dirname,'../..');
function scenarios(a){return a.testScenarios||Array.from({length:a.chestKeyVariants?.length||a.variantStates?.length||1},(_,variant)=>({variant}));}
function reachable(h,s,{allOpen=false,closedId,portals=false,start=s.atividade.startPosition}={}){
 const queue=[[start.linha,start.coluna]],seen=new Set(),targets=s.runState.entities.filter(e=>e.target&&e.correct!==false);
 while(queue.length){const [r,c]=queue.shift(),key=`${r},${c}`;if(seen.has(key))continue;seen.add(key);
  for(const [nr,nc]of [[r+1,c],[r-1,c],[r,c+1],[r,c-1]]){if(!s.mapa[nr]?.[nc]||s.mapa[nr][nc]===4)continue;const es=s.runState.entities.filter(e=>e.row===nr&&e.column===nc);if(es.some(e=>e.id===closedId||!allOpen&&(['door','gate','guardian','bridge','bridge_segment','chest'].includes(e.type)&&!['open','active','defeated'].includes(e.state)||e.type==='hazard'&&e.state!=='inactive')))continue;if(!seen.has(`${nr},${nc}`))queue.push([nr,nc]);}
  if(portals)for(const e of targets)if(e.row===r&&e.column===c)queue.push([e.target.row,e.target.column]);
 }return seen;
}
(async()=>{
 const report=[];let mutations=0;
 for(const base of setup().context.ACTIVITIES){
 const h=setup(),a=h.context.ACTIVITIES[base.id-1],s=h.scene(a),exit=[];
 for(let r=0;r<a.mapa.length;r++)for(let c=0;c<a.mapa[r].length;c++)if(a.mapa[r][c]===3)exit.push(`${r},${c}`);
 assert.equal(exit.length,1,`${a.id}: cristal único`);assert.ok(a.mapa[a.startPosition.linha][a.startPosition.coluna]>0);
 for(const e of a.entities)assert.ok(a.mapa[e.row]?.[e.column]&&a.mapa[e.row][e.column]!==4,`${a.id} ${e.id}: objeto em piso inválido`);
 const initial=reachable(h,s);assert.equal(initial.has(exit[0]),false,`${a.id}: rota inicial direta`);
 const opened=reachable(h,s,{allOpen:true,portals:true});assert.ok(opened.has(exit[0]),`${a.id}: saída inalcançável`);
 const doors=a.entities.filter(e=>['door','gate','guardian'].includes(e.type));
 const cuts=doors.map(e=>({id:e.id,blocksExit:!reachable(h,s,{allOpen:true,closedId:e.id,portals:true}).has(exit[0])}));
 for(const e of cuts)assert.ok(e.blocksExit,`${a.id}: ${e.id} pode ser contornado até a saída`);
 const runs=[];
 for(const options of scenarios(a)){const visit=new Set();const enter=h.context.DungeonSystem.onEnter;h.context.DungeonSystem.onEnter=function(scene,r,c){visit.add(`${r},${c}`);return enter.call(this,scene,r,c);};const result=await h.run(a,options);h.context.DungeonSystem.onEnter=enter;assert.equal(result.result.cause,'SUCCESS',`${a.id} ${options.variant}: ${result.result.message}`);runs.push({variant:options.variant||0,result:result.result.cause,visitedTiles:visit.size,regions:Object.keys(result.scene.discoveryState.regions),clues:Object.keys(result.scene.discoveryState.inscriptions),lights:Object.keys(result.scene.discoveryState.litRooms),budget:result.scene.budgetResult});}
 // Each required inscription is independently omitted while preserving every movement and other command.
 const omissions=[];
 for(const objective of a.objectives.filter(o=>o.type==='discovered')){
  const altered=setup(),original=altered.context.DiscoverySystem.examine;altered.context.DiscoverySystem.examine=function(scene,e){if(e.id===objective.id)return '';return original.call(this,scene,e);};
  const run=await altered.run(altered.context.ACTIVITIES[a.id-1]);assert.notEqual(run.result.cause,'SUCCESS',`${a.id}: ignora ${objective.id}`);omissions.push({clue:objective.id,result:run.result.cause});mutations++;
 }
 // Remove each physical requirement independently from a successful world, then try the mechanism again locally.
 const locks=[];const {scene:solved}=await h.run(a);
 for(const config of doors){const e=h.context.DungeonSystem.getEntity(solved,config.id);const saved=JSON.stringify({flags:solved.runState.flags,key:solved.runState.hasKey,discovery:solved.discoveryState,inputs:solved.runState.inputsByPedestal});
 const reset=()=>{const d=JSON.parse(saved);solved.runState.flags=d.flags;solved.runState.hasKey=d.key;solved.discoveryState=d.discovery;solved.runState.inputsByPedestal=d.inputs;e.state='closed';};
 const missing=[];for(const f of e.requires||[])missing.push([`flag:${f}`,()=>delete solved.runState.flags[f]]);
 if(e.requiresAny?.length)missing.push(['OR:todos',()=>e.requiresAny.forEach(f=>delete solved.runState.flags[f])]);
 for(const id of e.requiresClues||[])missing.push([`pista:${id}`,()=>delete solved.discoveryState.inscriptions[id]]);
 if(e.requiresKey)missing.push(['chave',()=>solved.runState.hasKey=false]);
 for(const [field,flag]of [['minRubies','rubiesCollected'],['minRunes','runesActivated'],['minTraps','trapsDisabled']])if(e[field])missing.push([field,()=>solved.runState.flags[flag]=e[field]-1]);
 if(e.condition)missing.push(['entrada',()=>delete solved.runState.inputsByPedestal[e.condition.input]]);
 for(const [label,change]of missing){reset();change();assert.equal(h.context.MechanismSystem.requirements(solved,e),false,`${a.id} ${e.id} sem ${label}`);solved.gutoPosition={linha:e.row,coluna:e.column};assert.equal(await h.context.DungeonSystem.callApi(solved,'abrir_porta',[e.id]),false);assert.equal(e.state,'closed');locks.push(`${e.id}/${label}`);mutations++;}
 reset();
 }
 report.push({activity:a.id,name:a.nome,initialExitReachable:false,doorCuts:cuts,scenarios:runs,omissions,missingRequirements:locks,regions:a.regions.map(r=>({id:r.id,label:r.label,area:r.width*r.height,objects:a.entities.filter(e=>h.context.DiscoverySystem.contains(r,e.row,e.column)).map(e=>e.id),visitedInOfficial:runs.some(x=>x.regions.includes(r.id))}))});
 }
 const output={version:v4?'V4':'V3',generatedAt:new Date().toISOString(),activities:report.length,scenarios:report.reduce((n,a)=>n+a.scenarios.length,0),isolatedMutations:mutations,limits:'Auditoria de geometria e casos adversariais; não é prova formal de todos os programas possíveis e não substitui homologação no navegador.',report};
 const dir=path.join(root,v4?'docs/v4/evidencias':'docs/v3/evidencias');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'auditoria.json'),JSON.stringify(output,null,2));console.log(`PASS: ${output.activities} mapas, ${output.scenarios} cenários, ${mutations} omissões/requisitos isolados.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
