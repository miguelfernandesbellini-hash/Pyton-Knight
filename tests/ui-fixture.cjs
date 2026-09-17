// Adaptadores mínimos de DOM e Phaser para integração lógica; não renderizam CSS.
const {setup}=require('./helpers.cjs');
class Element {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.parentNode=null;this.attributes={};this.style={};this.dataset={};this.listeners={};this.className='';this._text='';this.value='';this.hidden=false;this.scrollTop=0;this.scrollLeft=0;this.clientHeight=120;this.selectionStart=this.selectionEnd=0;this.classList={add:(n)=>{this.className+=' '+n;},remove:(n)=>{this.className=this.className.split(' ').filter(x=>x!==n).join(' ');},contains:n=>this.className.split(' ').includes(n)};}
 set textContent(v){this._text=String(v??'');this.children=[];} get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}
 set innerHTML(html){this.children=[];const stack=[this];for(const t of html.match(/<[^>]+>|[^<]+/g)||[]){if(t.startsWith('</')){stack.pop();continue;}if(t.startsWith('<')){const name=t.match(/^<([\w-]+)/)?.[1];if(!name)continue;const e=new Element(name);for(const a of t.matchAll(/([\w-]+)(?:="([^"]*)")?/g)){if(a[1]!==name)e.setAttribute(a[1],a[2]??'');}stack.at(-1).appendChild(e);if(!['input','br','hr','img','meta','link'].includes(name))stack.push(e);}else stack.at(-1)._text+=t;}}
 setAttribute(k,v){this.attributes[k]=String(v);if(k==='class')this.className=v;if(k==='id')this.id=v;if(k==='hidden')this.hidden=true;}
 appendChild(e){this.children.push(e);e.parentNode=this;return e;}
 matches(s){return s.startsWith('.')?this.classList.contains(s.slice(1)):s.startsWith('#')?this.id===s.slice(1):this.tagName===s;}
 querySelectorAll(s){const parts=s.split(' ');let scope=[this];for(const p of parts){const next=[];const walk=n=>{for(const child of n.children){if(child.matches(p))next.push(child);walk(child);}};scope.forEach(walk);scope=next;}return scope;}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f);}removeEventListener(k,f){this.listeners[k]=(this.listeners[k]||[]).filter(x=>x!==f);}
 async emit(k,event={}){event.preventDefault??=()=>{};await Promise.all((this.listeners[k]||[]).map(f=>f(event)));}
 focus(){this.focused=true;}setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
 getBoundingClientRect(){return{x:16,y:100,left:16,top:100,width:740,height:600};}setPointerCapture(){}hasPointerCapture(){return false;}
}
function fixture(options={}){
 const host=new Element();host.id='interface';const document={getElementById:()=>host,createElement:t=>new Element(t)};
 class Sprite{constructor(x,y,key){this.x=x;this.y=y;this.key=key;this.active=true;}play(k){this.animation=k;return this;}setY(y){this.y=y;return this;}setDisplaySize(w,h){this.width=w;this.height=h;return this;}setDepth(){return this;}setAlpha(){return this;}setOrigin(){return this;}setVisible(v){this.visible=v;return this;}setTexture(k,f){this.key=k;this.frame=f;return this;}setText(t){this.text=t;return this;}setAngle(){return this;}setTint(){return this;}clearTint(){return this;}setFlipX(){return this;}setPosition(x,y){this.x=x;this.y=y;return this;}destroy(){this.active=false;}}
 class Scene{constructor(){this.objects=[];const add=(...a)=>{const o=new Sprite(...a);this.objects.push(o);return o;};this.add={image:add,sprite:add,text:add,rectangle:add,graphics:()=>({setDepth(){return this;},clear(){},fillStyle(){},fillRect(){}})};this.cameras={main:{setViewport(){},setZoom(){},setScroll(){},fadeIn(){},fadeOut(){}}};this.scale={width:1360,height:820,on(){},off(){}};this.hooks={};this.events={once:(k,f)=>this.hooks[k]=f};this.time={delayedCall:(_delay,f)=>f()};this.scene={start:(name,data)=>{this.transition={name,data};}};this.tweens={add(){},killTweensOf(){}};}}
 const env=setup({document,location:{search:'?dev=1'},innerWidth:1360,innerHeight:820,Phaser:{Scene,Game:class{constructor(config){this.config=config;}},AUTO:0,Scale:{RESIZE:1}},Boot:class{},Preloader:class{}});
 if(options.v3||options.v4)for(const f of ['activities-v3.js','systems/DiscoverySystem.js','systems/AnimationSystem.js','systems/MechanismSystem.js'])env.load(f);
 if(options.v4)for(const f of ['activities-v4.js','systems/CoinSystem.js','systems/CompletionSystem.js','systems/DecorationSystem.js'])env.load(f);
 env.load('systems/MapRenderer.js');env.load('ui/GameUI.js');env.load('MainMenu.js');env.load('Game.js');
 function game(index){const C=env.context.pytonKnightGame.config.scene[3];const s=new C();s.init({atividadeIndex:index,variantIndex:0});s.testMode=true;s.create();return s;}
 return {...env,host,game};
}
module.exports={fixture};
