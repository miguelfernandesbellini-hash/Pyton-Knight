const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { setup, root } = require('./helpers.cjs');
const { context:c } = setup();
const ed = c.CodeEditor;
for (const [label, text, key, shift, expected] of [
 ['Enter após dois pontos','if True:','Enter',false,'if True:\n    '],
 ['Enter mantém bloco','    print(1)','Enter',false,'    print(1)\n    '],
 ['Enter após comentário','if True: # teste','Enter',false,'if True: # teste\n    '],
 ['Enter ignora # em string','    print("#")','Enter',false,'    print("#")\n    '],
 ['Tab acrescenta quatro espaços','','Tab',false,'    '],
 ['Shift Tab recua','    print(1)','Tab',true,'print(1)'],
 ['Shift Tab recua parcial','  x','Tab',true,'x'],
 ['Shift Tab no nível zero','x','Tab',true,'x']
]) test(label, () => {const r=ed.transform(text,text.length,text.length,key,shift);assert.equal(r.text,expected);assert.ok(r.start>=0);assert.equal(r.start,r.end);});
test('Tab e Shift Tab em seleção multilinha preservam linhas externas',()=>{let text='a\nb\nc';const r=ed.transform(text,0,4,'Tab',false);assert.equal(r.text,'    a\n    b\nc');assert.equal(ed.transform(r.text,r.start,r.end,'Tab',true).text,text);});
test('Enter substitui seleção sem apagar o restante',()=>assert.equal(ed.transform('if True:abc',8,11,'Enter',false).text,'if True:\n    '));
test('else retorna ao nível do if',()=>{const t='if True:\n    x = 1\n    else:';assert.equal(ed.alignBranch(t,t.length).text,'if True:\n    x = 1\nelse:');});
test('elif em bloco aninhado alinha com if interno',()=>{const t='if True:\n    if False:\n        x = 1\n        elif True:';assert.equal(ed.alignBranch(t,t.length).text,'if True:\n    if False:\n        x = 1\n    elif True:');});
class Field {
 constructor(){this.value='';this.style={};this.listeners={};this.scrollTop=0;this.scrollLeft=0;this.clientHeight=100;this.selectionStart=0;this.selectionEnd=0;this.attrs={};}
 addEventListener(k,f){this.listeners[k]=f;} removeEventListener(k){delete this.listeners[k];} setAttribute(k,v){this.attrs[k]=v;} setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
}
test('Editor: eventos reais do componente, numeração, erro, scroll e limpeza',()=>{const f=new Field(),g=new Field(),h=new Field();f.value='if True:';f.selectionStart=f.selectionEnd=8;let changes=0;const editor=ed.attach(f,g,h,()=>changes++);let prevented=false;f.listeners.keydown({key:'Enter',preventDefault(){prevented=true;}});assert.equal(f.value,'if True:\n    ');assert.equal(g.textContent,'1\n2');assert.equal(prevented,true);editor.markError(20);assert.equal(f.attrs['aria-invalid'],'true');assert.equal(h.hidden,false);assert.ok(f.scrollTop>0);f.listeners.input({});assert.equal(h.hidden,true);assert.ok(changes>=3);editor.destroy();assert.equal(Object.keys(f.listeners).length,0);});
const Model=c.CameraController.CameraModel;
test('Zoom inicial, mínimo e máximo',()=>{const m=new Model(2000,1800,600,400);assert.equal(m.zoom,1);m.setZoom(99);assert.equal(m.zoom,2);m.setZoom(.01);assert.equal(m.zoom,.55);});
test('Zoom mantém ponto sob cursor fora dos limites',()=>{const m=new Model(2000,1800,600,400);const x=110,y=90;const before=m.centerX+(x-300)/m.zoom;const by=m.centerY+(y-200)/m.zoom;m.setZoom(1.4,x,y);assert.ok(Math.abs(before-(m.centerX+(x-300)/m.zoom))<1e-9);assert.ok(Math.abs(by-(m.centerY+(y-200)/m.zoom))<1e-9);});
test('Pan considera zoom e limita os quatro lados',()=>{const m=new Model(2000,1800,600,400);m.setZoom(2);const x=m.centerX;m.pan(100,0);assert.equal(m.centerX,x-50);for(const [dx,dy] of [[1e6,1e6],[-1e6,-1e6]]){m.pan(dx,dy);const v=m.view();assert.ok(v.left>=0&&v.top>=0);assert.ok(v.left+v.width<=2000&&v.top+v.height<=1800);}});
test('Mapa menor que viewport permanece centralizado',()=>{const m=new Model(100,80,600,400);m.pan(999,999);assert.equal(m.centerX,50);assert.equal(m.centerY,40);m.resize(900,700);assert.equal(m.centerX,50);});
test('Acompanhamento aproxima suavemente e converge',()=>{const m=new Model(2000,1800,600,400);const initial=m.centerX;m.approach(500,500,16);assert.ok(m.centerX<initial&&m.centerX>500);for(let i=0;i<100;i++)m.approach(500,500,16);assert.ok(Math.abs(m.centerX-500)<.01);});
test('Câmera integra eventos, recenter, viewport Phaser e remoção de listeners',()=>{
 const e=new Field();e.getBoundingClientRect=()=>({x:16,y:100,left:16,top:100,width:600,height:400});e.classList={add(){},remove(){}};e.setPointerCapture=()=>{};e.hasPointerCapture=()=>false;
 const camera={setViewport(...v){this.viewport=v;},setZoom(v){this.zoom=v;},setScroll(x,y){this.scrollX=x;this.scrollY=y;}};
 const s={mapa:Array.from({length:30},()=>Array(40).fill(0)),tileSize:64,startX:32,startY:32,gutoPosition:{linha:15,coluna:20},cameras:{main:camera},scale:{on(){},off(){}},executando:false};
 const controller=c.CameraController.attach(s,e);assert.deepEqual(camera.viewport,[16,100,600,400]);let z=camera.zoom;e.listeners.wheel({deltaY:-100,clientX:300,clientY:250,preventDefault(){}});assert.ok(camera.zoom>z);
 const original=JSON.stringify(s.gutoPosition);let x=controller.model.centerX;e.listeners.pointerdown({button:0,clientX:100,clientY:100,pointerId:1});e.listeners.pointermove({clientX:200,clientY:150,pointerId:1});assert.ok(controller.model.centerX<x);assert.equal(JSON.stringify(s.gutoPosition),original);e.listeners.pointerup({pointerId:1});
 controller.centerOnGuto();controller.update(16);assert.equal(controller.centering,true);for(let i=0;i<60;i++)controller.update(16);assert.equal(controller.centering,false);controller.setExecuting(true);assert.equal(controller.tracking,true);controller.setExecuting(false);controller.destroy();assert.equal(Object.keys(e.listeners).length,0);
});
test('Todos os spritesheets têm quadros compatíveis com as dimensões PNG',()=>{const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/official-manifest.json')));for(const [name,a] of Object.entries(catalog)){const png=fs.readFileSync(path.join(root,a.path));assert.equal(png.toString('ascii',1,4),'PNG',name);const w=png.readUInt32BE(16),h=png.readUInt32BE(20);if(a.frameWidth){assert.equal(w%a.frameWidth,0,name);assert.equal(h%a.frameHeight,0,name);assert.ok(w>=a.frameWidth&&h>=a.frameHeight,name);}}});
test('Contrato CSS: livro limitado, áreas roláveis e rodapé não encolhe (análise estática)',()=>{const css=fs.readFileSync(path.join(root,'ui/game.css'),'utf8');assert.match(css,/\.magic-book\{[^}]*max-height:100%[^}]*overflow:hidden/);assert.match(css,/\.feedback\{[^}]*max-height:[^}]*overflow:auto/);assert.match(css,/\.actions\{[^}]*flex:none/);assert.match(css,/#pk-code\{[^}]*overflow:auto/);});
