const {setupV3}=require('./v3-helpers.cjs');
function setupV4(extra={}) {
 const env=setupV3(extra);
 for(const file of ['activities-v4.js','systems/CoinSystem.js','systems/CompletionSystem.js','systems/DecorationSystem.js'])env.load(file);
 return env;
}
function localStorageFixture(){const data=new Map();return {data,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
module.exports={setupV4,localStorageFixture};
