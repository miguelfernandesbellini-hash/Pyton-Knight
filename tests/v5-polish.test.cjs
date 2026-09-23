const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const {EventEmitter} = require('node:events');
const {fixture} = require('./ui-fixture.cjs');
const root = path.resolve(__dirname,'..');
const load = (context,file) => vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});

function audioHarness () {
    const document = new EventEmitter();
    document.addEventListener = document.on.bind(document); document.removeEventListener = document.off.bind(document);
    let clock = 0;
    const context = vm.createContext({document,performance:{now:()=>clock}}); context.window=context;
    load(context,'systems/AudioSystem.js');
    const sounds=[], manager=new EventEmitter(); manager.locked=true;
    manager.add = (key,config) => {
        const sound={key,...config,plays:0,isPlaying:false,isPaused:false,destroyed:false,
            play(){this.isPlaying=true;this.plays++;},setVolume(v){this.volume=v;},setMute(v){this.mute=v;},destroy(){this.destroyed=true;}};
        sounds.push(sound);return sound;
    };
    const game={sound:manager,events:new EventEmitter(),cache:{audio:{exists:()=>true}}};
    const scene={game}, audio=context.AudioSystem.forScene(scene);
    const unlock=()=>{document.emit('pointerdown',{isTrusted:true});manager.locked=false;manager.emit('unlocked');};
    return {context,document,game,scene,audio,sounds,manager,unlock,tick:()=>clock+=200};
}

test('V5 autoplay: aguarda gesto real e desbloqueio; uma única música atravessa cenas',()=>{
    const h=audioHarness();h.audio.start();assert.equal(h.sounds.length,0);
    h.document.emit('pointerdown',{isTrusted:false});h.manager.locked=false;h.manager.emit('unlocked');assert.equal(h.sounds.length,0);
    h.manager.locked=true;h.document.emit('keydown',{isTrusted:true});assert.equal(h.sounds.length,0);
    h.manager.locked=false;h.manager.emit('unlocked');
    const first=h.audio.music;assert.equal(first.plays,1);assert.equal(first.loop,true);assert.equal(first.volume,.18);
    for(let i=0;i<30;i++){assert.equal(h.context.AudioSystem.forScene({sys:{game:h.game}}),h.audio);h.audio.start();}
    assert.equal(h.sounds.length,1);assert.equal(h.audio.music,first);assert.equal(first.plays,1);
});
test('V5 volumes independentes e mudo preservam trilha e preferências entre cenas',()=>{
    const h=audioHarness();h.unlock();h.audio.play('collect');h.audio.setVolume('music',.12);h.audio.setVolume('effects',.42);
    assert.equal(h.audio.music.volume,.12);assert.equal(h.audio.effects.get('collect').volume,.42);
    h.audio.setMuted(true);assert.equal(h.audio.music.mute,true);assert.equal(h.audio.effects.get('collect').mute,true);
    h.tick();h.audio.play('portal');assert.equal(h.audio.effects.has('portal'),false);
    const session=h.context.AudioSystem.forScene({game:h.game});assert.equal(session.muted,true);assert.equal(session.effectsVolume,.42);
    session.setMuted(false);assert.equal(h.audio.music.mute,false);assert.equal(h.audio.music.plays,1);
    h.audio.setVolume('effects',0);h.audio.play('portal');assert.equal(h.audio.effects.has('portal'),false);
    h.audio.setVolume('music',5);assert.equal(h.audio.musicVolume,1);h.audio.setVolume('music',NaN);assert.equal(h.audio.musicVolume,1);
});
test('V5 efeitos têm limite de frequência e instâncias reutilizadas; destroy remove listeners',()=>{
    const h=audioHarness();h.unlock();h.audio.play('mechanism');h.audio.play('collect');assert.equal(h.audio.effects.size,1);
    h.tick();h.audio.play('mechanism');assert.equal(h.audio.effects.get('mechanism').plays,1);
    h.audio.effects.get('mechanism').isPlaying=false;h.tick();h.audio.play('mechanism');assert.equal(h.audio.effects.get('mechanism').plays,2);
    assert.equal(h.document.listenerCount('pointerdown'),1);assert.equal(h.manager.listenerCount('unlocked'),1);
    h.game.events.emit('destroy');h.audio.destroy();
    assert.equal(h.document.listenerCount('pointerdown'),0);assert.equal(h.document.listenerCount('keydown'),0);assert.equal(h.manager.listenerCount('unlocked'),0);
    assert.ok(h.sounds.every(s=>s.destroyed));assert.equal(h.audio.listeners.size,0);
});
test('V5 sem áudio decodificado continua silencioso, sem erro e sem instâncias',()=>{
    const h=audioHarness();h.game.cache.audio.exists=()=>false;h.unlock();h.audio.play('damage');
    assert.equal(h.sounds.length,0);assert.match(h.audio.status(),/indisponível/);
});
test('V5 assets WAV são locais, completos, pequenos e com emenda contínua do loop',()=>{
    const h=audioHarness();let bytes=0;
    for(const [name,file] of Object.entries(h.context.AudioSystem.ASSETS)){
        const b=fs.readFileSync(path.join(root,file));bytes+=b.length;
        assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WAVE');
        assert.equal(b.readUInt32LE(24),22050);assert.equal(b.readUInt16LE(22),1);assert.equal(b.readUInt16LE(34),16);
        assert.equal(b.readUInt32LE(40),b.length-44);
        let peak=0;for(let i=44;i<b.length;i+=2)peak=Math.max(peak,Math.abs(b.readInt16LE(i)));assert.ok(peak>1000 && peak<32767);
        if(name==='ambient'){
            assert.equal((b.length-44)/44100,32);
            const seam=b.readInt16LE(44)-b.readInt16LE(b.length-2);
            const before=b.readInt16LE(b.length-2)-b.readInt16LE(b.length-4), after=b.readInt16LE(46)-b.readInt16LE(44);
            // Adjacent samples differ even in a continuous tone; compare slopes.
            assert.ok(Math.abs(seam-before)<100 && Math.abs(seam-after)<100,'loop sem descontinuidade na emenda');
        }
    }
    assert.ok(bytes<1_700_000);assert.match(fs.readFileSync(path.join(root,'assets/audio/README.md'),'utf8'),/CC0-1.0/);
});

function renderHarness(index=0){
    const h=fixture({v4:true}),s=h.game(index),nodes=[];
    h.load('systems/AtmosphereSystem.js');s.testMode=false;s.events=new EventEmitter();
    class Node {
        constructor(x=0,y=0){Object.assign(this,{x,y,alpha:1,scaleX:1,scaleY:1,visible:true,active:true});nodes.push(this);}
        setPosition(x,y){this.x=x;this.y=y;return this;}setDisplaySize(w,h){this.width=w;this.height=h;return this;}
        setTint(v){this.tint=v;return this;}setAlpha(v){this.alpha=v;return this;}setDepth(v){this.depth=v;return this;}
        setOrigin(){return this;}setVisible(v){this.visible=v;return this;}setScale(x,y){this.scaleX=x;this.scaleY=y;return this;}
        clear(){return this;}fillStyle(){return this;}fillCircle(){return this;}lineStyle(){return this;}strokeCircle(){return this;}
        destroy(){this.active=false;}
    }
    const textures=new Set();s.textures={exists:k=>textures.has(k),createCanvas(k){textures.add(k);return{getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){}}),refresh(){}};}};
    s.add={image:(x,y)=>new Node(x,y),rectangle:(x,y)=>new Node(x,y),graphics:()=>new Node()};
    s.guto=new Node(s.startX+s.gutoPosition.coluna*64,s.startY+s.gutoPosition.linha*64);
    return {...h,s,nodes,textures,attach:()=>h.context.AtmosphereSystem.attach(s)};
}
test('V5 atmosfera em todas as 20 atividades: fontes limitadas, sob a névoa, sem alterar estado',()=>{
    for(let index=0;index<20;index++){
        const h=renderHarness(index),s=h.s,before=JSON.stringify([s.atividade,s.runState,s.discoveryState]);
        const atmosphere=h.attach(),count=h.nodes.length;
        for(let frame=0;frame<80;frame++)atmosphere.update(16);
        assert.ok(atmosphere.lights.length<=h.context.AtmosphereSystem.MAX_LIGHTS);assert.ok(atmosphere.halo);
        assert.ok(h.nodes.every(n=>n.depth===undefined || n.depth<80));assert.equal(h.nodes.length,count,'nenhum objeto criado por frame');
        assert.equal(JSON.stringify([s.atividade,s.runState,s.discoveryState]),before,'lógica de descoberta e puzzles intacta');
        s.events.emit('shutdown');assert.equal(s.atmosphere,null);assert.equal(s.events.listenerCount('shutdown'),0);
        assert.ok(h.nodes.filter(n=>n!==s.guto).every(n=>!n.active));
    }
});
test('V5 luzes ocultas e moedas coletadas não vazam; movimento reduzido elimina pulsação e idle',()=>{
    const h=renderHarness(),a=h.attach();h.context.DiscoverySystem.canSee=()=>false;a.update(16);
    assert.ok(a.lights.filter(x=>!x.player).every(x=>!x.image.visible));assert.equal(a.halo.image.visible,true);
    h.context.DiscoverySystem.canSee=()=>true;const coin=h.s.runState.entities.find(e=>e.type==='coin');coin.state='collected';a.update(16);
    assert.equal(a.lights.find(l=>l.id===coin.id).image.visible,false);
    h.context.AnimationSystem.reducedMotion=()=>true;a.update(16);const alpha=a.lights.map(l=>l.image.alpha);a.update(80);
    assert.deepEqual(a.lights.map(l=>l.image.alpha),alpha);assert.equal(h.s.guto.scaleY,1);
});
test('V5 efeitos e luzes não acumulam em reattach/reinício; bursts têm limite e expiram',()=>{
    const h=renderHarness();let a=h.attach();const first=a;
    a=h.attach();assert.equal(first.disposed,true);assert.equal(h.s.events.listenerCount('shutdown'),1);assert.equal(h.textures.size,1);
    for(let i=0;i<100;i++)a.burst(1,1);assert.equal(a.bursts.length,h.context.AtmosphereSystem.MAX_BURSTS);
    for(let i=0;i<10;i++)a.update(100);assert.equal(a.bursts.length,0);
    h.s.events.emit('shutdown');assert.equal(h.s.atmosphere,null);a.destroy();
});
test('V5 coleta tem feedback uma vez; reset, valores iguais e objetos ocultos são silenciosos',()=>{
    const h=fixture({v4:true}),s=h.game(0),calls=[];h.load('systems/AtmosphereSystem.js');s.testMode=false;
    h.context.AudioSystem={play:(_s,name)=>calls.push(name)};h.context.DiscoverySystem.canSee=()=>true;
    const e=s.runState.entities.find(e=>e.type==='coin');s.gutoPosition={linha:e.row,coluna:e.column};
    h.context.DungeonSystem.onEnter(s,e.row,e.column);h.context.MapRenderer.atualizarEntidades(s);
    assert.deepEqual(calls,['collect']);h.context.DungeonSystem.resetRun(s);assert.deepEqual(calls,['collect']);
    h.context.DiscoverySystem.canSee=()=>false;h.context.AtmosphereSystem.changed(s,{row:1,column:1,type:'door',state:'open'},'closed');assert.equal(calls.length,1);
});
test('V5 teleporte enquadra durante fade e preserva a ação física existente',async()=>{
    const h=fixture({v4:true}),s=h.game(12),events=[];
    h.context.AnimationSystem.tween=async(_s,_target,values)=>events.push(values.alpha);
    h.context.AudioSystem={play:(_s,name)=>events.push(name)};
    s.cameraController={tracking:true,centerOnGuto:smooth=>events.push(smooth)};
    await h.context.AnimationSystem.teleport(s,()=>events.push('ação'));
    assert.deepEqual(events,['portal',0,'ação',false,1]);
});
test('V5 conclusão mostra progresso real, informa moedas e mantém XP idempotente',async()=>{
    const h=fixture({v4:true}),s=h.game(0);s.tutorialStepIndex=3;s.editorTexto.value=s.atividade.officialSolution;
    await h.context.CommandInterpreter.executar(s);
    assert.equal(h.host.querySelector('.completion-progress').value,1);assert.equal(h.host.querySelector('.completion-progress').max,20);
    assert.match(h.host.querySelector('.completion-journey').textContent,/já creditadas/);
    const xp=s.playerProgress.totalXp;await h.context.CompletionSystem.retry(s);await h.context.CommandInterpreter.executar(s);
    assert.equal(s.playerProgress.totalXp,xp);assert.match(h.host.querySelector('#completion-reward').textContent,/já recebida/);
});
test('V5 controles DOM funcionam no jogo e menu; troca de cena remove assinaturas antigas',async()=>{
    const h=fixture({v4:true}),s=h.game(0),a=audioHarness(),docEvents=new EventEmitter();
    h.context.document.addEventListener=docEvents.on.bind(docEvents);h.context.document.removeEventListener=docEvents.off.bind(docEvents);
    const create=h.context.document.createElement;
    h.context.document.createElement=tag=>{const node=create(tag);node.remove=()=>{if(node.parentNode)node.parentNode.children=node.parentNode.children.filter(n=>n!==node);};return node;};
    h.context.performance={now:()=>0};h.load('systems/AudioSystem.js');delete a.game.pkAudio;
    s.game=a.game;s.events=new EventEmitter();h.context.AudioSystem.mount(s,h.host.querySelector('.map-header'));
    const audio=a.game.pkAudio,first=h.host.querySelector('.audio-controls');
    docEvents.emit('keydown',{isTrusted:true});a.manager.locked=false;a.manager.emit('unlocked');
    const music=h.host.querySelector('.music-volume');music.value='27';await music.emit('input',{target:music});
    assert.equal(audio.musicVolume,.27);assert.equal(h.host.querySelector('.music-value').textContent,'27%');
    await h.host.querySelector('.audio-mute').emit('click');assert.equal(audio.muted,true);assert.equal(h.host.querySelector('.audio-mute').attributes['aria-pressed'],'true');
    s.events.emit('shutdown');assert.equal(audio.listeners.size,0);assert.equal(first.listeners.keydown.length,0);
    const Menu=h.context.pytonKnightGame.config.scene[2],menu=new Menu();menu.game=a.game;menu.events=new EventEmitter();menu.create();
    assert.equal(h.host.querySelector('.music-volume').value,'27');assert.equal(h.host.querySelector('.audio-mute').textContent,'Ativar áudio');
    assert.equal(audio.listeners.size,1);assert.equal(audio.music.plays,1);
    const panel=h.host.querySelector('.audio-controls');panel.open=true;await panel.emit('keydown',{key:'Escape'});assert.equal(panel.open,false);
    for(let i=0;i<20;i++)h.context.AudioSystem.mount(menu,h.host.querySelector('.menu-card'));
    assert.equal(audio.listeners.size,1);assert.equal(h.host.querySelectorAll('.audio-controls').length,1);
    menu.events.emit('shutdown');assert.equal(audio.listeners.size,0);a.game.events.emit('destroy');
});
