const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),context=vm.createContext({});context.window=context;
for(const file of ['activities.js','activities-v3.js','activities-v4.js','activities-v6.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const lines=['GABARITO OFICIAL — PYTON KNIGHT V6','Derivado do catálogo de produção. V4/V5 preservados em seus arquivos históricos.','Tutoriais: escreva o programa; uma solução integral pode concluir desde a primeira orientação.','A6/A13: digite respostas no campo de entrada durante a execução, não como valores literais no editor.',''];
let scenarios=0;
for(const a of context.ACTIVITIES){lines.push(`ATIVIDADE ${a.id} — ${a.nome}`,a.descricao,'',a.officialSolution,'',`Entradas padrão: ${JSON.stringify(a.testInputs || [])}`);if(a.testScenarios)lines.push(`Variantes: ${JSON.stringify(a.testScenarios)}`);lines.push('');scenarios+=(a.testScenarios||Array.from({length:a.chestKeyVariants?.length||a.variantStates?.length||1})).length;}
fs.writeFileSync(path.join(root,'Gabarito_Oficial_Pyton_Knight_V6.txt'),lines.join('\n'));
const dir=path.join(root,'docs/v6');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'CATALOGO_ATUAL.json'),JSON.stringify({version:6,activities:context.ACTIVITIES.length,scenarios,changes:[6,12,13,14],catalog:context.ACTIVITIES.map(a=>({id:a.id,name:a.nome,description:a.descricao,budget:a.instructionBudget,objectives:a.objectives,notes:a.entities.filter(e=>e.type==='inscription').map(e=>({id:e.id,title:e.label,text:e.text,variants:e.variantTexts})),falsePlates:a.entities.filter(e=>e.inactivePlate).map(e=>({id:e.id,row:e.row,column:e.column}))}))},null,2));
console.log(`Gabarito e catálogo V6: ${context.ACTIVITIES.length} atividades, ${scenarios} cenários.`);
