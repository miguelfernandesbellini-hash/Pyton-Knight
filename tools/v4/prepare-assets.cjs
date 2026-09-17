// Technical atlas normalization only: preserve source art and genuine alpha.
const fs=require('node:fs'),path=require('node:path');
const sharp=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'../../node_modules','sharp'));
const root=path.resolve(__dirname,'../..');
(async()=>{
 const source=path.join(root,'assets/v4/totem-source.png');
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const frames=[];
 for(let frame=0;frame<2;frame++){
  let left=info.width,top=info.height,right=0,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=Math.floor(frame*info.width/2);x<Math.floor((frame+1)*info.width/2);x++)if(data[(y*info.width+x)*4+3]>0){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
  frames.push({left,top,width:right-left+1,height:bottom-top+1});
 }
 const scale=Math.min(54/Math.max(...frames.map(f=>f.height)),44/Math.max(...frames.map(f=>f.width)));
 for(let i=0;i<frames.length;i++){
  const frame=frames[i],w=Math.round(frame.width*scale),h=Math.round(frame.height*scale);
  const sprite=await sharp(source).extract(frame).resize(w,h,{kernel:'nearest'}).png().toBuffer();
  await sharp({create:{width:64,height:64,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:sprite,left:Math.round((64-w)/2),top:59-h}]).png().toFile(path.join(root,`assets/v4/totem-${i?'on':'off'}.png`));
 }
 console.log('Totens OFF/ON: quadros RGBA 64 × 64; mesma escala e linha de base.');
})().catch(e=>{console.error(e);process.exitCode=1;});
