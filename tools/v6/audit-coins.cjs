const fs=require('node:fs'),path=require('node:path');
const {auditCoins}=require('../v4/audit-coins.cjs');
auditCoins(require('../../tests/v6-helpers.cjs').setupV6).then(report=>{const dir=path.resolve(__dirname,'../../docs/v6/evidencias');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'auditoria-moedas.json'),JSON.stringify(report,null,2));console.log(`PASS V6: ${report.coinAccessChecks} acessos em ${report.scenarios} cenários; ${report.uniqueIds} moedas.`);}).catch(error=>{console.error(error);process.exitCode=1;});
