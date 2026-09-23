// Optional authoring check: NODE_PATH must resolve @napi-rs/canvas (already used by V3 review tooling).
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'../..'),sources=new Map(),derived=new Map();
const context=vm.createContext({document:{createElement:()=>createCanvas(1,1)}});context.window=context;
for(const file of ['activities.js','activities-v3.js','activities-v4.js','activities-v6.js','systems/AssetCatalog.js','systems/SpriteAtlasSystem.js','systems/MapRenderer.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
(async()=>{
    for(const [role,asset] of Object.entries(context.AssetCatalog)){assert.ok(fs.existsSync(path.join(root,asset.path)),`${role}: arquivo ausente`);if(!asset.derived)sources.set(`official_${role}`,await loadImage(path.join(root,asset.path)));}
    for(const [key,file] of [['v3_guto_source','guto'],['v3_props_source','props'],['v3_tiles_source','tiles']])sources.set(key,await loadImage(path.join(root,`assets/v3/${file}-source.png`)));
    const scene={textures:{get:key=>({getSourceImage:()=>sources.get(key)}),addCanvas:(key,value)=>derived.set(key,value),addSpriteSheet:(key,value)=>derived.set(key,value)}};
    context.SpriteAtlasSystem.prepare(scene);
    let references=0;
    for(const a of context.ACTIVITIES)for(const e of a.entities)for(const state of ['off','on','closed','opening','closing','open','active','inactive','incorrect','read','collected']){const role=`official_${context.MapRenderer.appearance({...e,state}).role}`;assert.ok(sources.has(role)||derived.has(role),`A${a.id}/${e.id}/${state}: ${role}`);references++;}
    const source=sources.get('official_coin_pile'),raw=createCanvas(source.width,source.height);raw.getContext('2d').drawImage(source,0,0);
    const before=raw.getContext('2d').getImageData(0,0,raw.width,raw.height).data,coin=derived.get('official_v6_coin'),after=coin.getContext('2d').getImageData(0,0,coin.width,coin.height).data;
    let opaque=0,removed=0;for(let i=0;i<after.length;i+=4){if(after[i+3]){opaque++;assert.deepEqual([...after.slice(i,i+4)],[...before.slice(i,i+4)]);}else if(before[i+3])removed++;}
    assert.ok(opaque>100 && removed>100);for(const [x,y] of [[0,0],[coin.width-1,0],[0,coin.height-1],[coin.width-1,coin.height-1]])assert.equal(after[(y*coin.width+x)*4+3],0);
    const sheet=createCanvas(640,192),ctx=sheet.getContext('2d');ctx.fillStyle='#171923';ctx.fillRect(0,0,640,192);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#eee0cb';ctx.font='14px sans-serif';
    const roles=['official_v3_floor','official_v6_wall_top_main','official_v6_wall_face_main','official_v6_wall_face_alt','official_v6_coin'];
    roles.forEach((key,i)=>{ctx.drawImage(derived.get('official_v3_floor'),i*128,32,128,128);ctx.drawImage(derived.get(key),i*128,32,128,128);ctx.fillText(['piso V3','topo V6','parede V6','variação','moedas'][i],i*128+8,182);});
    const dir=path.join(root,'docs/v6/evidencias');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'assets-derivados.png'),sheet.toBuffer('image/png'));
    const report={status:'PASS',catalogPaths:Object.keys(context.AssetCatalog).length,entityStateReferences:references,coin:{preservedOpaquePixels:opaque,removedBackgroundPixels:removed,cornersTransparent:true},derivedTextures:[...derived.keys()],limit:'Verificação técnica de pixels, referências e geração de texturas; não é homologação visual no jogo.'};
    fs.writeFileSync(path.join(dir,'assets-verificados.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
