// Deterministic authoring tools; the browser consumes only activities-v3.js.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'../..'),ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'activities.js'),'utf8'),ctx);
const original=ctx.window.ACTIVITIES;
class Layout {
 constructor(w,h){this.map=Array.from({length:h},()=>Array(w).fill(0));this.regions=[];this.entities=[];}
 room(id,label,r,c,h,w,lightState='lit',extra={}){for(let y=r;y<r+h;y++)for(let x=c;x<c+w;x++)this.map[y][x]=1;this.regions.push({id,label,row:r,column:c,height:h,width:w,lightState,...extra});return this;}
 path(...points){for(let i=1;i<points.length;i++){let [r,c]=points[i-1], [er,ec]=points[i];if(r!==er&&c!==ec)throw Error('Diagonal path');while(r!==er||c!==ec){this.map[r][c]=1;r+=Math.sign(er-r);c+=Math.sign(ec-c);}this.map[r][c]=1;}return this;}
 entity(id,type,r,c,extra={}){const e={id,type,row:r,column:c,...extra};this.entities.push(e);return e;}
 start(r,c){this.startPosition={linha:r,coluna:c};this.map[r][c]=2;return this;}
 exit(r,c){this.map[r][c]=3;return this;}
 clue(id,label,r,c,text){return this.entity(id,'inscription',r,c,{label,text});}
 light(id,r,c,rooms){return this.entity(id,'light_switch',r,c,{rooms,initialState:'off',label:'Luz'});}
 gate(id,r,c,requires,extra={}){return this.entity(id,'gate',r,c,{requires,automatic:true,family:'door',...extra});}
 build(){return {mapa:this.map,regions:this.regions,entities:this.entities,startPosition:this.startPosition,initialFacing:'LESTE',barreiras:[]};}
}
const obj={exit:()=>({type:'reach_exit',label:'Alcance o cristal após liberar a passagem'}),clue:(id,label)=>({type:'discovered',id,label}),light:(id,label)=>({type:'illuminated',id,label}),flag:(flag,label)=>({type:'flag',flag,label}),concept:(concept,label)=>({type:'used_concept',concept,label}),context:(command,kind,label)=>({type:'command_context',command,[kind]:true,loopType:kind==='loop'?(['ativar_runa','coletar_rubi'].includes(command)?'for':'while'):undefined,label}),variable:()=>({type:'variable_movement',label:'Use uma variável para conduzir Guto'}),reassign:()=>({type:'reassigned',label:'Reatribua uma variável durante o percurso'}),state:(entityId,state,label)=>({type:'entity_state',entityId,state,label}),budget:()=>({type:'budget',label:'Respeite o orçamento de instruções'})};
const code=s=>s.trim();
function make(id,l,data){const a={...original[id-1],...l.build(),v3:true,variantStates:null,chestKeyVariants:null,outputRules:null,tutorialSteps:null,tutorial:false,instructionBudget:null,requiredConcepts:[],allowedCommands:['andar_frente','virar_direita','virar_esquerda','examinar','ativar_interruptor'],objectives:[],testInputs:[],...data};a.allowedCommands=[...new Set(['andar_frente','virar_direita','virar_esquerda','examinar','ativar_interruptor',...(data.allowedCommands||[])])];a.entities.forEach(e=>{e.skin='v3';e.family=e.type==='gate'||e.type==='guardian'?'door':['pressure_plate','toggle_plate'].includes(e.type)?'plate':['bridge','bridge_segment'].includes(e.type)?'bridge':e.type;});a.mechanics=[...new Set([...(a.mechanics||[]),'M38','M39','M40'])];a.titulo=`ATIVIDADE ${id} — ${a.nome.toUpperCase()}`;a.mapDesign={dimensions:`${a.mapa[0].length} × ${a.mapa.length}`,areas:a.regions.length,structure:a.design};a.solutionExplanation=a.design;a.attempts=a.attempts||['1–2','2–3','2–4','3–5','4–6','2–3','2–4','3–5','4–6','5–7','2–4','3–4','3–5','4–6','5–7','2–4','3–5','4–6','4–7','6–10'][id-1];return a;}
function tutorial(a,codes,conditions,messages){a.tutorial=true;a.codigoInicial=codes[0];a.tutorialSteps=['VER','EXECUTAR','COMPLETAR','ESCREVER'].map((title,i)=>({title:`${title} — ${['observe o mundo','descubra o mecanismo','amplie o programa','conclua a exploração'][i]}`,code:codes[i],condition:conditions[i],message:messages[i]}));return a;}
const helpers={Layout,obj,code,make,tutorial,original};
const updates=[];for(let unit=1;unit<=4;unit++){const p=path.join(__dirname,`unit${unit}.cjs`);if(fs.existsSync(p)) updates.push(...require(p)(helpers));}
fs.writeFileSync(path.join(root,'activities-v3.js'),'// Redesenho V3. Gerado por tools/v3/build.cjs; conceitos e progressão herdados da base.\n(function(){ const updates = '+JSON.stringify(updates,null,2)+'; for(const next of updates){ const i=window.ACTIVITIES.findIndex(a=>a.id===next.id); window.ACTIVITIES[i]=next; } })();\n');
console.log('Atividades V3:',updates.map(a=>a.id).join(', '));
