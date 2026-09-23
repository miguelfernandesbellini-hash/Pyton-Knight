const test=require('node:test'),assert=require('node:assert/strict');
const {setupV6,fixtureV6}=require('./v6-helpers.cjs');
test('V6 todas as portas das 20 atividades passam pelo sistema de transição',async()=>{
    for(let id=1;id<=20;id++){const h=setupV6(),a=h.context.ACTIVITIES[id-1],seen=new Set(),original=h.context.AnimationSystem.transition;
        h.context.AnimationSystem.transition=async(s,e,from,to)=>{if(['open','defeated'].includes(to))seen.add(e.id);return original.call(h.context.AnimationSystem,s,e,from,to);};
        assert.equal((await h.run(a)).result.cause,'SUCCESS');for(const e of a.entities.filter(e=>['door','gate','guardian'].includes(e.type)))assert.ok(seen.has(e.id),`A${id}/${e.id} abriu sem transição`);
    }
});
for(const type of ['door','gate','guardian'])test(`V6 animação ${type}: abertura e fechamento aguardam tween e mantêm colisão`,async()=>{
    const h=setupV6(),s=h.scene(h.context.ACTIVITIES[type==='guardian'?10:0]);const e=s.runState.entities.find(e=>['door','gate','guardian'].includes(e.type));e.type=type;s.testMode=false;
    let config;const image={y:32,alpha:1,setY(y){this.y=y;},setAlpha(a){this.alpha=a;}};s.entitySprites=new Map([[e.id,{image}]]);s.tweens={add(c){config=c;}};
    for(const [from,to,interim] of [['closed','open','opening'],['open','closed','closing']]){const p=h.context.AnimationSystem.transition(s,e,from,to);assert.equal(e.state,interim);assert.ok(h.context.DungeonSystem.isBlocked(s,e.row,e.column));assert.equal(config.duration,260);config.onComplete();await p;assert.equal(e.state,to);assert.equal(image.y,32);assert.equal(image.alpha,1);assert.equal(e.transitionTo,undefined);assert.equal(e.transitionFrom,undefined);}
});
test('V6 interruptor discreto: representação idêntica ligado/desligado e sem burst',()=>{
    const h=setupV6();h.load('systems/MapRenderer.js');h.load('systems/AtmosphereSystem.js');const s=h.scene(h.context.ACTIVITIES[11]),e=h.context.DungeonSystem.getEntity(s,'route_switch');
    const off=h.context.MapRenderer.appearance(e);e.state='on';assert.deepEqual(h.context.MapRenderer.appearance(e),off);let bursts=0;s.atmosphere={burst:()=>bursts++};s.testMode=false;h.context.AtmosphereSystem.changed(s,e,'off');assert.equal(bursts,0);
});
test('V6 derivados: máscara preserva pixels dourados e remove piso; parede preserva alpha e contraste',()=>{
    const makeCanvas=()=>{const c={width:0,height:0};c.getContext=()=>({drawImage(image){c.pixels=new Uint8ClampedArray(image.pixels);},getImageData(){return {data:c.pixels};},putImageData(data){c.pixels=data.data;}});return c;};
    const h=setupV6({document:{createElement:makeCanvas}});h.load('systems/SpriteAtlasSystem.js');
    const pixels=[65,65,65,255,240,190,70,255,100,65,22,255,50,50,50,0],image={width:4,height:1,pixels};
    assert.deepEqual([...h.context.SpriteAtlasSystem.coinCutout(image).pixels],[65,65,65,0,240,190,70,255,100,65,22,255,50,50,50,0]);
    const wall=h.context.SpriteAtlasSystem.wallPalette(image).pixels;assert.equal(wall[3],255);assert.equal(wall[15],0);assert.ok(wall[2]>wall[1]);assert.notEqual(wall[0],wall[4]);
});
test('V6 interface A6 e A13 reutiliza input, separa resposta do editor e associa perguntas',async()=>{
    for(const id of [6,13]){const h=fixtureV6('?dev=1'),s=h.game(id-1),editor='codigo_do_jogador = 1';s.editorTexto.value=editor;
        const e=s.runState.entities.find(e=>e.questions);for(const clue of e.requiresClues)h.context.DiscoverySystem.examine(s,s.runState.entities.find(x=>x.id===clue));
        s.gutoPosition={linha:e.row,coluna:e.column};s.testInputQueue=[];
        for(const question of e.questions){const result=h.context.DungeonSystem.callApi(s,'input',['prompt genérico']);assert.equal(h.host.querySelector('.input-area').hidden,false);assert.equal(h.host.querySelector('.input-prompt').textContent,question.prompt);h.host.querySelector('.runtime-input').value=String(question.expected);await h.host.querySelector('.input-area').emit('submit');await result;assert.equal(s.editorTexto.value,editor);assert.equal(h.host.querySelector('.input-area').hidden,true);}
    }
});
test('V6 save retomado: Diário, vidas, variante e rascunho; estado físico sempre seguro',async()=>{
    const h=fixtureV6('?dev=1'),s=h.game(5);s.editorTexto.value=s.atividade.officialSolution;s.testInputQueue=['AURORA'];await h.context.CommandInterpreter.executar(s);s.livesRemaining=2;h.context.JourneySystem.checkpoint(s);
    const again=h.game(5);assert.equal(again.livesRemaining,2);assert.equal(again.editorTexto.value,s.editorTexto.value);assert.ok(again.discoveryState.inscriptions.juramento);assert.equal(again.gutoPosition.coluna,again.startPosition.coluna);assert.equal(again.runState.hasKey,false);assert.equal(again.runState.answers.juramento,undefined);
    const seen=h.context.JourneySystem.stats().discoveries;h.context.DiscoverySystem.resetActivity(again);h.context.JourneySystem.checkpoint(again);assert.equal(h.context.JourneySystem.stats().discoveries,seen);
});
test('V6 game over reaparece após recarregar e não oferece botão de continuar a mesma missão',async()=>{
    const h=fixtureV6('?dev=1'),s=h.game(13);h.context.JourneySystem.die(s);h.context.JourneySystem.die(s);h.context.JourneySystem.die(s);h.context.JourneySystem.result(s,{cause:'HAZARD_DEATH'});
    assert.equal(h.host.querySelector('#journey-title').textContent,'GUTO MORREU');assert.equal(h.host.querySelector('.journey-actions').querySelectorAll('button').length,1);assert.match(h.host.querySelector('.journey-actions').textContent,/ATIVIDADE 13/);
    const Menu=h.context.pytonKnightGame.config.scene[2],menu=new Menu();menu.create();assert.equal(h.host.querySelector('#journey-title').textContent,'GUTO MORREU');await h.host.querySelector('.journey-actions').querySelector('button').emit('click');assert.equal(menu.transition.data.atividadeIndex,12);
    assert.equal(h.context.PersistenceService.load().journey.pendingReturn,null);
    const resumed=h.game(12);assert.equal(resumed.gameOverPending,false);assert.equal(resumed.livesRemaining,3);
});
test('V6 fim da jornada persiste no menu e reset não regrava checkpoint antigo',async()=>{
    const h=fixtureV6('?dev=1'),s=h.game(19);s.editorTexto.value=s.atividade.officialSolution;s.testInputQueue=[...s.atividade.testInputs];await h.context.CommandInterpreter.executar(s);
    const Menu=h.context.pytonKnightGame.config.scene[2],menu=new Menu();menu.create();assert.equal(h.host.querySelector('#journey-title').textContent,'JORNADA CONCLUÍDA');
    await h.host.querySelector('.journey-actions').querySelector('button').emit('click');h.context.JourneySystem.checkpoint(menu);assert.equal(h.context.PersistenceService.load().journey.currentActivity,1);assert.equal(h.context.PersistenceService.load().journey.completed,false);
});
