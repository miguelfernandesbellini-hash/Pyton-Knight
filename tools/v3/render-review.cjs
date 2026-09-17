// Static art/layout review, NOT a browser homologation or gameplay screenshot.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {createCanvas,loadImage}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/@napi-rs/canvas');
const {setupV3}=require('../../tests/v3-helpers.cjs');
const v4=process.argv.includes('--v4'),setup=v4?require('../../tests/v4-helpers.cjs').setupV4:setupV3;
const root=path.resolve(__dirname,'../..'),out=path.join(root,v4?'docs/v4/evidencias/visual':'docs/v3/evidencias/visual');fs.mkdirSync(out,{recursive:true});
const document={createElement:()=>createCanvas(1,1)};
(async()=>{
 const env=setup({document}),c=env.context;env.load('systems/SpriteAtlasSystem.js');env.load('systems/MapRenderer.js');
 const guto=c.SpriteAtlasSystem.normalize(await loadImage(path.join(root,'assets/v3/guto-source.png')),[0,345,630,910,1254],50,42);
 const props=c.SpriteAtlasSystem.normalize(await loadImage(path.join(root,'assets/v3/props-source.png')),[0,310,600,910,1254],54,54);
 fs.writeFileSync(path.join(out,'guto-atlas.png'),guto.toBuffer('image/png'));fs.writeFileSync(path.join(out,'props-atlas.png'),props.toBuffer('image/png'));
 const tiles=c.SpriteAtlasSystem.tiles(await loadImage(path.join(root,'assets/v3/tiles-source.png')));
 const images={};for(const [role,asset] of Object.entries(c.AssetCatalog)){if(asset.derived&&asset.path.includes('tiles-source')){images[role]=tiles[c.SpriteAtlasSystem.tileNames.indexOf(role.replace('v3_',''))];}else if(asset.derived){const i=c.SpriteAtlasSystem.names.indexOf(role.replace('v3_',''));const canvas=createCanvas(64,64);canvas.getContext('2d').drawImage(props,i%4*64,Math.floor(i/4)*64,64,64,0,0,64,64);images[role]=canvas;}else images[role]=await loadImage(path.join(root,asset.path));}
 function texture(ctx,role,x,y,size,frame=0){const image=images[role],asset=c.AssetCatalog[role]||{};if(!image)throw Error(role);if(asset.frameWidth)ctx.drawImage(image,frame*asset.frameWidth,0,asset.frameWidth,asset.frameHeight,x,y,size,size);else ctx.drawImage(image,x,y,size,size);}
 const maps=[];
 for(const a of c.ACTIVITIES){const s=env.scene(a),tile=32,w=a.mapa[0].length*tile,h=a.mapa.length*tile;const canvas=createCanvas(w,h+62),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#0b101a';ctx.fillRect(0,0,w,h+62);ctx.fillStyle='#ebd29d';ctx.font='bold 19px sans-serif';ctx.fillText(`${a.id}. ${a.nome}`,15,25);ctx.fillStyle='#94a8bf';ctx.font='11px sans-serif';ctx.fillText('Planta para revisão de arte e percursos · regiões reveladas apenas nesta prancha',15,44);ctx.translate(0,62);
 for(let r=0;r<a.mapa.length;r++)for(let col=0;col<a.mapa[r].length;col++){const t=a.mapa[r][col],below=a.mapa[r+1]?.[col]!==0;texture(ctx,c.MapRenderer.tileRole(s,r,col),col*tile,r*tile,tile);if(t===3)texture(ctx,'v3_crystal',col*tile,r*tile,tile);if(t===4)texture(ctx,'fireplace_bright',col*tile,r*tile,tile);}
 for(const d of a.decorations||[]){const size=tile*(d.size||1),offset=(tile-size)/2;texture(ctx,d.role,d.column*tile+offset,d.row*tile+offset,size);}
 for(const e of s.runState.entities){const look=c.MapRenderer.appearance(e);const size=tile*(look.size||1),offset=(tile-size)/2;texture(ctx,look.role,e.column*tile+offset,e.row*tile+offset,size,look.frame||0);}
 for(const r of a.regions){ctx.fillStyle='#060e18ba';ctx.fillRect(r.column*tile-3,r.row*tile-11,Math.min(w-r.column*tile,ctx.measureText(r.label).width+8),13);ctx.fillStyle='#e8ce9c';ctx.font='9px sans-serif';ctx.fillText(r.label,r.column*tile,r.row*tile);}
 ctx.drawImage(guto,0,64,64,64,a.startPosition.coluna*tile,a.startPosition.linha*tile,tile,tile);
 fs.writeFileSync(path.join(out,`atividade-${String(a.id).padStart(2,'0')}.png`),canvas.toBuffer('image/png'));maps.push(canvas);
 }
 for(let unit=0;unit<4;unit++){const page=createCanvas(1500,1220),ctx=page.getContext('2d');ctx.fillStyle='#0c121d';ctx.fillRect(0,0,1500,1220);ctx.fillStyle='#ebd29d';ctx.font='26px sans-serif';ctx.fillText(`Pyton Knight · Unidade ${unit+1} · revisão estática dos mapas`,24,38);for(let i=0;i<5;i++){const map=maps[unit*5+i];const scale=Math.min(715/map.width,365/map.height);const x=20+(i%2)*750,y=62+Math.floor(i/2)*385;ctx.drawImage(map,x,y,map.width*scale,map.height*scale);}fs.writeFileSync(path.join(out,`unidade-${unit+1}.png`),page.toBuffer('image/png'));}
 console.log('20 plantas + 4 pranchas + 2 atlas para revisão estática.');
})();
