const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
global.window = global;
function load (file) { vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file }); }
[
    'systems/GameConstants.js', 'activities.js', 'systems/BarrierSystem.js',
    'systems/PythonSubsetParser.js', 'systems/CodeBudgetValidator.js',
    'systems/PersistenceService.js', 'systems/ProgressionSystem.js',
    'systems/MissionObjectiveSystem.js', 'systems/TutorialSystem.js',
    'systems/DungeonSystem.js', 'systems/PlayerController.js',
    'systems/CommandInterpreter.js'
].forEach(load);
window.MapRenderer = { atualizarEntidades () {} };
window.GameUI = { atualizarObjetivos () {}, atualizarTutor () {}, atualizarVidas () {}, atualizarOrientacao () {}, atualizarProgresso () {}, atualizarMoedasDaExecucao () {}, definirFeedback () {}, adicionarConsole () {}, limparConsole () {}, definirExecutando () {}, mostrarResumoConclusao () {}, solicitarEntrada () { return Promise.resolve(''); } };

function assert (condition, message) { if (!condition) throw new Error(message); }
function createScene (activity, variantIndex = 0, code = activity.officialSolution, inputs = activity.testInputs || []) {
    const scene = { atividade: activity, atividadeIndex: activity.id - 1, mapa: activity.mapa, barreiras: activity.barreiras || [], startPosition: { ...activity.startPosition }, gutoPosition: { ...activity.startPosition }, playerFacing: activity.initialFacing, tileSize: 64, startX: 0, startY: 0, livesRemaining: 3, executando: false, executionCount: 0, sessionVariantIndex: variantIndex, testMode: true, testInputQueue: [...inputs], editorTexto: { value: code }, guto: null, gutoFacingIndicator: null, playerProgress: window.PersistenceService.load(), devMode: true, completionProcessed: false, tutorialStepIndex: activity.tutorialSteps ? activity.tutorialSteps.length - 1 : 0 };
    window.DungeonSystem.resetRun(scene); return scene;
}
async function execute (activity, options = {}) {
    const variantIndex = options.variantIndex || 0;
    const code = options.code === undefined ? activity.officialSolution : options.code;
    const inputs = options.inputs === undefined ? (activity.testInputs || []) : options.inputs;
    const scene = createScene(activity, variantIndex, code, inputs);
    if (options.lives) scene.livesRemaining = options.lives;
    return { scene, result: await window.CommandInterpreter.executar(scene) };
}
function officialCasesFor (activity) {
    if (activity.officialCases) return activity.officialCases.map((item, index) => ({ variantIndex: item.variantIndex || 0, inputs: item.inputs || activity.testInputs || [], label: item.label || `caso ${index + 1}` }));
    const variants = activity.chestKeyVariants ? activity.chestKeyVariants.length : activity.variantStates ? activity.variantStates.length : 1;
    return Array.from({ length: variants }, (_, variantIndex) => ({ variantIndex, inputs: activity.testInputs || [], label: variants > 1 ? `variante ${variantIndex + 1}` : 'padrão' }));
}
async function runTutorial (activity) {
    window.PersistenceService.resetForTests();
    const scene = createScene(activity, 0, ''); scene.tutorialStepIndex = 0; window.TutorialSystem.inicializar(scene);
    const results = [];
    for (let index = 0; index < activity.tutorialSteps.length; index++) {
        scene.testInputQueue = [...(activity.testInputs || [])];
        const result = await window.CommandInterpreter.executar(scene); results.push(result.cause);
        const expected = index === activity.tutorialSteps.length - 1 ? 'SUCCESS' : 'TUTORIAL_STEP_COMPLETE';
        assert(result.cause === expected, `Tutorial ${activity.id}, etapa ${index + 1}: ${result.cause}`);
    }
    return results;
}
function futureConceptProbe (activity) {
    if (activity.id <= 5) return 'print("teste")';
    if (activity.id === 6) return 'resposta = input()';
    if (activity.id === 7) return 'numero = int("1")';
    if (activity.id <= 10) return 'if True:\n    andar_frente()';
    if (activity.id === 11) return 'if True:\n    andar_frente()\nelse:\n    virar_direita()';
    if (activity.id === 12) return 'if 1 == 1:\n    andar_frente()';
    if (activity.id === 13) return 'if True and True:\n    andar_frente()';
    if (activity.id === 14) return 'if True:\n    andar_frente()\nelif False:\n    virar_direita()';
    if (activity.id === 15) return 'for i in range(1):\n    andar_frente()';
    if (activity.id <= 17) return 'while False:\n    andar_frente()';
    if (activity.id === 18) return 'while True:\n    break';
    return 'if not True:\n    andar_frente()';
}
function validateReset (activity) {
    const scene = createScene(activity, 0, activity.officialSolution); const baseline = JSON.stringify(scene.runState.entities);
    scene.gutoPosition = { linha: 99, coluna: 99 }; scene.playerFacing = 'NORTE'; scene.runState.coinsPending = 99;
    if (scene.runState.entities[0]) scene.runState.entities[0].state = '__mutated__';
    const code = scene.editorTexto.value; window.DungeonSystem.resetRun(scene);
    assert(scene.gutoPosition.linha === activity.startPosition.linha && scene.gutoPosition.coluna === activity.startPosition.coluna, `Reset de posição falhou na Atividade ${activity.id}.`);
    assert(scene.playerFacing === activity.initialFacing, `Reset de orientação falhou na Atividade ${activity.id}.`);
    assert(scene.runState.coinsPending === 0 && JSON.stringify(scene.runState.entities) === baseline, `Reset do estado temporário falhou na Atividade ${activity.id}.`);
    assert(scene.editorTexto.value === code, `Reset apagou o código na Atividade ${activity.id}.`);
}

const ORIENTATIONS = window.GAME_CONSTANTS.ORIENTACOES;
const VECTORS = window.GAME_CONSTANTS.VETORES_ORIENTACAO;
function turnsTo (initial, target) {
    const difference = (ORIENTATIONS.indexOf(target) - ORIENTATIONS.indexOf(initial) + 4) % 4;
    if (difference === 0) return [];
    if (difference === 1) return ['virar_direita()'];
    if (difference === 2) return ['virar_direita()', 'virar_direita()'];
    return ['virar_esquerda()'];
}
function wallCollisionCode (activity) {
    const start = activity.startPosition;
    for (const direction of ORIENTATIONS) {
        const vector = VECTORS[direction]; const row = start.linha + vector.linha; const column = start.coluna + vector.coluna;
        if (!activity.mapa[row] || activity.mapa[row][column] === window.GAME_CONSTANTS.TILE.PAREDE) return [...turnsTo(activity.initialFacing, direction), 'andar_frente()'].join('\n');
    }
    throw new Error(`Atividade ${activity.id}: início sem parede adjacente para o teste de colisão.`);
}
function hazardFixture (activity) {
    const clone = JSON.parse(JSON.stringify(activity)); const start = clone.startPosition;
    for (const direction of ORIENTATIONS) {
        const vector = VECTORS[direction]; const row = start.linha + vector.linha; const column = start.coluna + vector.coluna;
        if (clone.mapa[row] && clone.mapa[row][column] !== window.GAME_CONSTANTS.TILE.PAREDE) {
            clone.mapa[row][column] = window.GAME_CONSTANTS.TILE.PERIGO; clone.barreiras = [];
            clone.entities = (clone.entities || []).filter((entity) => entity.row !== row || entity.column !== column);
            return { activity: clone, code: [...turnsTo(clone.initialFacing, direction), 'andar_frente()'].join('\n') };
        }
    }
    throw new Error(`Atividade ${activity.id}: início sem piso adjacente para o teste de perigo.`);
}

async function runRequiredMatrix (activity, officialCases) {
    let check = await execute(activity, { code: 'andar_frente(0)' });
    assert(check.result.cause === 'INCOMPLETE_EXECUTION', `Atividade ${activity.id}: parada no meio foi classificada como ${check.result.cause}.`);
    check = await execute(activity, { code: 'if True\n    andar_frente()' });
    assert(check.result.cause === 'SYNTAX_ERROR', `Atividade ${activity.id}: erro de sintaxe foi classificado como ${check.result.cause}.`);
    check = await execute(activity, { code: 'voar()' });
    assert(check.result.cause === 'UNKNOWN_COMMAND', `Atividade ${activity.id}: comando desconhecido foi classificado como ${check.result.cause}.`);
    validateReset(activity);
    check = await execute(activity, { code: wallCollisionCode(activity) });
    assert(check.result.cause === 'WALL_COLLISION' && check.scene.livesRemaining === 3, `Atividade ${activity.id}: colisão real/vidas falhou (${check.result.cause}).`);
    const hazard = hazardFixture(activity); check = await execute(hazard.activity, { code: hazard.code });
    assert(check.result.cause === 'HAZARD_DEATH' && check.scene.livesRemaining === 2 && check.scene.editorTexto.value === hazard.code, `Atividade ${activity.id}: perigo, vida ou preservação de código falhou.`);
    check = await execute(hazard.activity, { code: hazard.code, lives: 1 });
    assert(check.result.cause === 'HAZARD_DEATH' && check.scene.livesRemaining === 3, `Atividade ${activity.id}: reinício da sessão após zerar vidas falhou.`);
    check = await execute(activity, { code: futureConceptProbe(activity) });
    assert(check.result.cause === 'LOCKED_CONCEPT', `Atividade ${activity.id}: conceito futuro foi classificado como ${check.result.cause}.`);
    const officialPass = officialCases.length > 0 && officialCases.every((item) => item.cause === 'SUCCESS' && item.objectivesCompleted);
    const replayPass = officialCases.every((item) => item.replayCause === 'SUCCESS' && item.codePreserved && item.rewardStableOnReplay);
    const rewardPass = officialCases.some((item) => item.rewardGranted) && officialCases.every((item) => item.rewardStableOnReplay);
    assert(officialPass, `Atividade ${activity.id}: solução ou objetivo pedagógico falhou.`);
    assert(replayPass, `Atividade ${activity.id}: nova execução/reset/código falhou.`);
    assert(rewardPass, `Atividade ${activity.id}: recompensa ou idempotência falhou.`);
    let budget = 'N/A';
    if (activity.instructionBudget) {
        const tooLong = Array.from({ length: activity.instructionBudget + 1 }, (_, index) => `v${index} = ${index}`).join('\n'); check = await execute(activity, { code: tooLong });
        assert(check.result.cause === 'CODE_BUDGET_EXCEEDED' && check.scene.livesRemaining === 3, `Atividade ${activity.id}: orçamento obrigatório falhou.`); budget = 'PASS';
    }
    return { activity: activity.id, correct:'PASS', incomplete:'PASS', syntaxError:'PASS', unknownCommand:'PASS', reset:'PASS', rerun:'PASS', wallCollision:'PASS', midStop:'PASS', lethalHazard:'PASS', lifeLoss:'PASS', codePreserved:'PASS', futureConceptBlocked:'PASS', pedagogicalObjective:'PASS', reward:'PASS', noDuplication:'PASS', budget, status:'PASS' };
}

const TARGET_DIMENSIONS = { 6:[10,7], 7:[11,8], 8:[13,9], 9:[15,10], 10:[17,12], 11:[11,8], 12:[13,9], 13:[14,10], 14:[16,11], 15:[18,12], 16:[12,8], 17:[14,10], 18:[16,11], 19:[18,12], 20:[20,14] };
function floorPositions (activity) {
    const points = [];
    for (let row = 0; row < activity.mapa.length; row++) for (let column = 0; column < activity.mapa[row].length; column++) if (activity.mapa[row][column] !== window.GAME_CONSTANTS.TILE.PAREDE) points.push({ row, column });
    return points;
}
function reachablePositions (activity) {
    const queue = [{ row: activity.startPosition.linha, column: activity.startPosition.coluna }]; const seen = new Set([`${queue[0].row},${queue[0].column}`]);
    for (let index = 0; index < queue.length; index++) {
        const point = queue[index];
        for (const entity of activity.entities || []) {
            if (entity.row === point.row && entity.column === point.column && entity.target) {
                const targetKey = `${entity.target.row},${entity.target.column}`;
                if (activity.mapa[entity.target.row] && activity.mapa[entity.target.row][entity.target.column] !== window.GAME_CONSTANTS.TILE.PAREDE && !seen.has(targetKey)) { seen.add(targetKey); queue.push({ row:entity.target.row, column:entity.target.column }); }
            }
        }
        for (const vector of Object.values(VECTORS)) {
            const row = point.row + vector.linha; const column = point.column + vector.coluna; const key = `${row},${column}`;
            if (activity.mapa[row] && activity.mapa[row][column] !== window.GAME_CONSTANTS.TILE.PAREDE && !seen.has(key)) { seen.add(key); queue.push({ row, column }); }
        }
    }
    return seen;
}
function findAdjacentApproach (activity, entity) {
    for (const direction of ORIENTATIONS) {
        const vector = VECTORS[direction]; const row = entity.row - vector.linha; const column = entity.column - vector.coluna;
        if (activity.mapa[row] && activity.mapa[row][column] !== window.GAME_CONSTANTS.TILE.PAREDE) return { row, column, facing: direction };
    }
    return null;
}
function findFarFloor (activity, entity) { return floorPositions(activity).find((point) => Math.abs(point.row - entity.row) + Math.abs(point.column - entity.column) >= 4); }
const INTERACTION_PROBES = {
    6: { type:'output_rune', api:'print', mode:'same' }, 7: { type:'guardian', api:'abrir_porta', mode:'ahead' },
    8: { type:'lever', api:'ativar_alavanca', mode:'same' }, 9: { type:'mirror', api:'entrar_espelho', mode:'same' },
    10: { type:'lever', api:'ativar_alavanca', mode:'same' }, 11: { type:'door', api:'abrir_porta', mode:'ahead' },
    12: { type:'hazard', api:'desativar_armadilha', mode:'ahead' }, 13: { type:'guardian', api:'abrir_porta', mode:'ahead' },
    14: { type:'lever', api:'ativar_alavanca', mode:'same' }, 15: { type:'portal', api:'entrar_portao', mode:'same' },
    16: { type:'totem', api:'ativar_runa', mode:'same' }, 17: { type:'coin', api:'coletar_rubi', mode:'same' },
    18: { type:'hazard', api:'desativar_armadilha', mode:'ahead' }, 19: { type:'chest', api:'abrir_bau', mode:'ahead' },
    20: { type:'chest', api:'abrir_bau', mode:'ahead' }
};
function prepareRequirements (scene, entity) {
    scene.runState.hasKey = true;
    (entity.requires || []).forEach((flag) => { scene.runState.flags[flag] = true; });
    (entity.requiresAny || []).forEach((flag) => { scene.runState.flags[flag] = true; });
    entity.state = ({ door:'closed', gate:'closed', guardian:'blocking', lever:'off', mirror:'inactive', portal:'available', totem:'inactive', coin:'available', hazard:'active', chest:'closed', output_rune:'off' })[entity.type] || entity.state;
}
async function invokeProbe (scene, probe, entity) {
    if (probe.api === 'print') return window.DungeonSystem.callApi(scene, probe.api, ['PROXIMIDADE'], { lineNumber: 1 });
    return window.DungeonSystem.callApi(scene, probe.api, [entity.id], { lineNumber: 1 });
}
async function validateContextInteraction (activity) {
    const probe = INTERACTION_PROBES[activity.id];
    const remoteScene = createScene(activity); const remoteEntity = remoteScene.runState.entities.find((entity) => entity.type === probe.type);
    assert(remoteEntity, `Atividade ${activity.id}: entidade do teste contextual ausente.`); prepareRequirements(remoteScene, remoteEntity);
    const far = findFarFloor(activity, remoteEntity); assert(far, `Atividade ${activity.id}: sem ponto remoto para teste contextual.`);
    remoteScene.gutoPosition = { linha: far.row, coluna: far.column }; remoteScene.playerFacing = activity.initialFacing;
    let rejected = false;
    try { await invokeProbe(remoteScene, probe, remoteEntity); } catch (error) { rejected = error.cause === window.GAME_CONSTANTS.TERMINOS.SEMANTIC_ERROR; }
    assert(rejected, `Atividade ${activity.id}: ${probe.api} aceitou telecomando remoto.`);

    const localScene = createScene(activity); const localEntity = localScene.runState.entities.find((entity) => entity.type === probe.type); prepareRequirements(localScene, localEntity);
    if (probe.mode === 'same') { localScene.gutoPosition = { linha: localEntity.row, coluna: localEntity.column }; }
    else { const approach = findAdjacentApproach(activity, localEntity); assert(approach, `Atividade ${activity.id}: entidade sem aproximação.`); localScene.gutoPosition = { linha: approach.row, coluna: approach.column }; localScene.playerFacing = approach.facing; }
    await invokeProbe(localScene, probe, localEntity);
    if (probe.api === 'print') assert(localScene.runState.outputs.length === 1, `Atividade ${activity.id}: print local não registrado.`);
    else if (probe.api === 'desativar_armadilha') assert(localEntity.state === 'inactive', `Atividade ${activity.id}: armadilha local não foi desativada.`);
    else if (probe.api === 'abrir_bau') assert(localEntity.state === 'open', `Atividade ${activity.id}: baú local não abriu.`);
    else if (probe.api === 'coletar_rubi') assert(localEntity.state === 'collected', `Atividade ${activity.id}: rubi local não foi coletado.`);
    else if (probe.api === 'ativar_alavanca') assert(localEntity.state === 'on', `Atividade ${activity.id}: alavanca local não foi ativada.`);
    else if (probe.api === 'ativar_runa') assert(localEntity.state === 'active', `Atividade ${activity.id}: runa local não foi ativada.`);
    else if (probe.api === 'abrir_porta') assert(['open','defeated'].includes(localEntity.state), `Atividade ${activity.id}: bloqueio local não abriu.`);
    else assert(localEntity.state === 'active', `Atividade ${activity.id}: portal/espelho local não foi ativado.`);
}
function findOrientationProbe (activity) {
    for (const point of floorPositions(activity)) for (const facing of ORIENTATIONS) {
        const vector = VECTORS[facing]; const ahead = { row: point.row + vector.linha, column: point.column + vector.coluna };
        const rightFacing = ORIENTATIONS[(ORIENTATIONS.indexOf(facing) + 1) % 4]; const rightVector = VECTORS[rightFacing]; const right = { row: point.row + rightVector.linha, column: point.column + rightVector.coluna };
        if (activity.mapa[ahead.row] && activity.mapa[ahead.row][ahead.column] !== window.GAME_CONSTANTS.TILE.PAREDE && activity.mapa[right.row] && activity.mapa[right.row][right.column] !== window.GAME_CONSTANTS.TILE.PERIGO) return { point, ahead, facing };
    }
    return null;
}
async function validateSensorOrientation (activity) {
    const probe = findOrientationProbe(activity); assert(probe, `Atividade ${activity.id}: sem geometria para sensor orientado.`);
    const scene = createScene(activity); scene.gutoPosition = { linha: probe.point.row, coluna: probe.point.column }; scene.playerFacing = probe.facing;
    scene.runState.entities = [{ id:'orientation_probe', type:'hazard', row:probe.ahead.row, column:probe.ahead.column, state:'active' }];
    const ahead = await window.DungeonSystem.callApi(scene, 'tem_armadilha_a_frente', [], { lineNumber:1 });
    window.PlayerController.virar(scene, 1);
    const afterTurn = await window.DungeonSystem.callApi(scene, 'tem_armadilha_a_frente', [], { lineNumber:2 });
    assert(ahead === true && afterTurn === false, `Atividade ${activity.id}: sensor não respeitou a orientação.`);
}
async function runMapDesignMatrix (activity, officialCases) {
    const expected = TARGET_DIMENSIONS[activity.id]; const width = activity.mapa[0].length; const height = activity.mapa.length;
    assert(width === expected[0] && height === expected[1], `Atividade ${activity.id}: dimensão ${width}x${height}, esperada ${expected[0]}x${expected[1]}.`);
    assert(activity.mapa.every((row) => row.length === width), `Atividade ${activity.id}: linhas irregulares.`);
    const starts = []; const exits = [];
    for (let row = 0; row < height; row++) for (let column = 0; column < width; column++) { if (activity.mapa[row][column] === window.GAME_CONSTANTS.TILE.INICIO) starts.push({ row, column }); if (activity.mapa[row][column] === window.GAME_CONSTANTS.TILE.SAIDA) exits.push({ row, column }); }
    assert(starts.length === 1 && exits.length === 1, `Atividade ${activity.id}: início/saída inválidos.`);
    assert(starts[0].row === activity.startPosition.linha && starts[0].column === activity.startPosition.coluna, `Atividade ${activity.id}: startPosition não coincide com S.`);
    const reachable = reachablePositions(activity); assert(reachable.has(`${exits[0].row},${exits[0].column}`), `Atividade ${activity.id}: cristal sem conexão geométrica.`);
    const occupied = new Set();
    for (const entity of activity.entities || []) {
        assert(Number.isInteger(entity.row) && Number.isInteger(entity.column) && activity.mapa[entity.row] && activity.mapa[entity.row][entity.column] !== window.GAME_CONSTANTS.TILE.PAREDE, `Atividade ${activity.id}: entidade ${entity.id} dentro de parede/fora do mapa.`);
        const key = `${entity.row},${entity.column}`; assert(!occupied.has(key), `Atividade ${activity.id}: entidades sobrepostas em ${key}.`); occupied.add(key);
        assert(reachable.has(key), `Atividade ${activity.id}: entidade ${entity.id} não acessível geometricamente.`);
    }
    assert(activity.mapDesign && activity.mapDesign.areas >= 3 && activity.mapDesign.curves >= 3, `Atividade ${activity.id}: metadados de exploração insuficientes.`);
    assert((activity.regions || []).length === activity.mapDesign.areas, `Atividade ${activity.id}: contagem de regiões divergente.`);
    for (const region of activity.regions || []) assert(region.row >= 0 && region.column >= 0 && region.row + region.height <= height && region.column + region.width <= width, `Atividade ${activity.id}: região ${region.id} fora do mapa.`);
    const turnRightCount = (activity.officialSolution.match(/virar_direita\(\)/g) || []).length; const turnLeftCount = (activity.officialSolution.match(/virar_esquerda\(\)/g) || []).length;
    assert(turnRightCount > 0 && turnLeftCount > 0 && turnRightCount + turnLeftCount >= 2, `Atividade ${activity.id}: solução oficial não explora curvas suficientes.`);
    const analysis = window.PythonSubsetParser.parse(activity.officialSolution).analysis;
    for (const concept of activity.requiredConcepts || []) {
        assert(analysis.concepts.has(concept), `Atividade ${activity.id}: solução não usa o conceito obrigatório ${concept}.`);
        assert((activity.objectives || []).some((objective) => objective.type === 'used_concept' && objective.concept === concept), `Atividade ${activity.id}: ${concept} não está protegido contra atalho por objetivo.`);
    }
    assert(officialCases.every((item) => item.cause === 'SUCCESS' && item.objectivesCompleted), `Atividade ${activity.id}: rota oficial física falhou.`);
    validateReset(activity); await validateSensorOrientation(activity); await validateContextInteraction(activity);
    const incomplete = await execute(activity, { code:'andar_frente(0)' }); assert(incomplete.result.cause === 'INCOMPLETE_EXECUTION', `Atividade ${activity.id}: solução incompleta virou ${incomplete.result.cause}.`);
    return { activity:activity.id, dimensions:`${width} x ${height}`, start:'PASS', crystalReachable:'PASS', entities:'PASS', noEntityInWall:'PASS', connectivity:'PASS', turns:'PASS', sensors:'PASS', contextualInteraction:'PASS', officialRoute:'PASS', reset:'PASS', dangers:'PASS', objectives:'PASS', incomplete:'PASS', noPedagogicalShortcut:'PASS', status:'PASS' };
}

async function main () {
    window.PersistenceService.resetForTests(); const official = [];
    assert(window.ACTIVITIES.length === 20, 'Devem existir 20 atividades.');
    assert(window.ACTIVITIES.every((item, index) => item.id === index + 1), 'Atividades fora de ordem.');
    const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8'); const scripts = [...indexSource.matchAll(/<script\s+src=["']([^"']+)["']/g)].map((match) => match[1]);
    scripts.forEach((source) => assert(fs.existsSync(path.join(root, source)), `Script ausente: ${source}`));
    const preloaderSource = fs.readFileSync(path.join(root, 'Preloader.js'), 'utf8');
    const assets = [...preloaderSource.matchAll(/["'](assets\/imagens\/[^"']+\.png)["']/g)].map((match) => match[1]);
    assert(assets.length === 5, `Preloader deve referenciar 5 assets; encontrou ${assets.length}.`);
    assets.forEach((source) => assert(fs.existsSync(path.join(root, source)) && fs.statSync(path.join(root, source)).size > 0, `Asset ausente ou vazio: ${source}`));
    const authored = ['Boot.js','Game.js','MainMenu.js','Preloader.js','activities.js', ...fs.readdirSync(path.join(root,'systems')).filter((x)=>x.endsWith('.js')).map((x)=>`systems/${x}`), ...fs.readdirSync(path.join(root,'ui')).filter((x)=>x.endsWith('.js')).map((x)=>`ui/${x}`)].map((file)=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
    assert(!/andar_(cima|baixo|direita|esquerda)/.test(authored), 'Movimento absoluto reintroduzido.');
    assert(!/\beval\s*\(|\bnew\s+Function\b/.test(authored), 'Execução dinâmica proibida.');
    const normalAccess = { devMode:false, playerProgress:{ unlockedMax:1 } }; const developerAccess = { devMode:true, playerProgress:{ unlockedMax:1 } };
    assert(!window.ProgressionSystem.atividadeDesbloqueada(normalAccess, 20) && window.ProgressionSystem.atividadeDesbloqueada(developerAccess, 20), 'Modo ?dev=1 não preservou o desbloqueio exclusivo de desenvolvimento.');
    const gameSource = fs.readFileSync(path.join(root,'Game.js'),'utf8'); const uiSource = fs.readFileSync(path.join(root,'ui/GameUI.js'),'utf8');
    assert(gameSource.includes("get('dev') === '1'") && uiSource.includes(".previous") && uiSource.includes(".next"), 'Navegação ANTERIOR/PRÓXIMA ou leitura de ?dev=1 ausente.');
    for (const activity of window.ACTIVITIES) {
        for (const testCase of officialCasesFor(activity)) {
            const run = await execute(activity, testCase);
            assert(run.result.cause === 'SUCCESS', `Atividade ${activity.id}, ${testCase.label}: ${run.result.cause} — ${run.result.message}`);
            const afterFirst = window.PersistenceService.load(); const code = run.scene.editorTexto.value; run.scene.testInputQueue = [...testCase.inputs]; const replay = await window.CommandInterpreter.executar(run.scene); const afterReplay = window.PersistenceService.load();
            assert(replay.cause === 'SUCCESS', `Replay ${activity.id}/${testCase.label}: ${replay.cause}`); assert(run.scene.editorTexto.value === code, `Código apagado no replay ${activity.id}.`); assert(afterFirst.totalXp === afterReplay.totalXp && afterFirst.walletCoins === afterReplay.walletCoins, `Recompensa duplicada ${activity.id}.`);
            const objectivesCompleted = Array.isArray(run.result.objectives) && run.result.objectives.length > 0 && run.result.objectives.every((item) => item.completed);
            official.push({ activity: activity.id, variant: testCase.variantIndex, label:testCase.label, inputs:testCase.inputs, cause: run.result.cause, replayCause: replay.cause, codePreserved: true, rewardStableOnReplay: true, objectivesCompleted, rewardGranted: Boolean(run.result.reward && run.result.reward.xp > 0), message: run.result.message });
        }
    }
    const activityMatrix = [];
    for (const activity of window.ACTIVITIES) activityMatrix.push(await runRequiredMatrix(activity, official.filter((item) => item.activity === activity.id)));
    const mapDesignMatrix = [];
    for (const activity of window.ACTIVITIES.slice(5)) mapDesignMatrix.push(await runMapDesignMatrix(activity, official.filter((item) => item.activity === activity.id)));
    const tutorialSteps = {}; for (const id of [1,6,11,16]) tutorialSteps[id] = await runTutorial(window.ACTIVITIES[id - 1]);
    let check = await execute(window.ACTIVITIES[0], { code: 'andar_frente(1)' }); assert(check.result.cause === 'INCOMPLETE_EXECUTION', 'Código incompleto mal classificado.');
    check = await execute(window.ACTIVITIES[0], { code: wallCollisionCode(window.ACTIVITIES[0]) }); assert(check.result.cause === 'WALL_COLLISION' && check.scene.livesRemaining === 3, 'Parede deve ser colisão sem vida.');
    check = await execute(window.ACTIVITIES[3], { code: 'andar_frente(4)' }); assert(check.result.cause === 'HAZARD_DEATH' && check.scene.livesRemaining === 2, 'Lava deve remover uma vida.'); assert(check.scene.editorTexto.value === 'andar_frente(4)', 'Código apagado após morte.');
    check = await execute(window.ACTIVITIES[10], { code: 'andar_frente(6)\nvirar_direita()\nandar_frente(3)' }); assert(check.result.cause === 'CLOSED_DOOR_BLOCK' && check.scene.livesRemaining === 3, 'Porta fechada mal classificada.');
    check = await execute(window.ACTIVITIES[0], { code: 'voar()' }); assert(check.result.cause === 'UNKNOWN_COMMAND', 'Comando desconhecido mal classificado.');
    check = await execute(window.ACTIVITIES[7], { code: 'for i in range(2):\n    andar_frente()' }); assert(check.result.cause === 'LOCKED_CONCEPT', 'for liberado cedo.');
    check = await execute(window.ACTIVITIES[17], { code: 'while True:\n    virar_direita()' }); assert(check.result.cause === 'LOOP_GUARD_STOP' && check.scene.livesRemaining === 3, 'Loop guard falhou.');
    check = await execute(window.ACTIVITIES[0], { code: 'if True\n    andar_frente()' }); assert(check.result.cause === 'SYNTAX_ERROR', 'Sintaxe mal classificada.');
    check = await execute(window.ACTIVITIES[5], { code: 'x = "texto" - 1' }); assert(check.result.cause === 'SEMANTIC_ERROR', 'Tipo semântico mal classificado.');
    const parsed = window.PythonSubsetParser.parse('# comentário\na = 1; b = 2\nandar_frente(a)'); assert(parsed.analysis.instructionCount === 3, 'Ponto e vírgula burlou orçamento.');
    const tooLong = Array.from({ length: 16 }, (_, index) => `v${index} = ${index}`).join('\n'); check = await execute(window.ACTIVITIES[3], { code: tooLong }); assert(check.result.cause === 'CODE_BUDGET_EXCEEDED' && check.scene.livesRemaining === 3, 'Orçamento excedido falhou.');
    const xp = {}; for (const lives of [3,2,1]) { window.PersistenceService.resetForTests(); const run = await execute(window.ACTIVITIES[1], { lives }); assert(run.result.cause === 'SUCCESS', 'Teste XP não concluiu.'); xp[lives] = run.result.reward.xp; } assert(xp[3] > xp[2] && xp[2] > xp[1], 'XP não é monotônico.');
    process.stdout.write(JSON.stringify({ status: 'PASS', officialSolutions: official, activityMatrix, requiredChecksPerActivity: 15, mapDesignMatrix, mapDesignChecksPerActivity: 14, tutorialSteps, regressionChecks: { incompleteExecution:'PASS', wallCollision:'PASS', closedDoorBlock:'PASS', hazardLifeLoss:'PASS', codePreservedAfterDeath:'PASS', unknownCommand:'PASS', lockedConcept:'PASS', loopGuard:'PASS', syntaxError:'PASS', semanticTypeError:'PASS', semanticBudgetCount:'PASS', indexAssets:'PASS', noAbsoluteMovementApi:'PASS', noDynamicCodeExecution:'PASS', budgetExceededNoLifeLoss:'PASS', deterministicRerun:'PASS', guidedTutorials:'PASS', rewardIdempotency:'PASS', xpMonotonicity:'PASS', contextualInteractions:'PASS', orientedSensors:'PASS', redesignedMapGeometry:'PASS', devModeNavigation:'PASS' } }, null, 2));
}
main().catch((error) => { process.stderr.write(`${error.stack}\n`); process.exit(1); });
