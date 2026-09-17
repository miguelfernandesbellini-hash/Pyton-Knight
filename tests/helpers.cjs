const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const MODULES = ['systems/GameConstants.js', 'activities.js', 'systems/BarrierSystem.js', 'systems/PythonSubsetParser.js', 'systems/CodeBudgetValidator.js', 'systems/PersistenceService.js', 'systems/ProgressionSystem.js', 'systems/MissionObjectiveSystem.js', 'systems/TutorialSystem.js', 'systems/DungeonSystem.js', 'systems/PlayerController.js', 'systems/CommandInterpreter.js', 'ui/CodeEditor.js', 'ui/ActivityGuide.js', 'systems/CameraController.js', 'systems/AssetCatalog.js'];
function setup (extra = {}) {
    const context = vm.createContext({ console, setTimeout, clearTimeout, URLSearchParams, ...extra }); context.window = context;
    const load = (file) => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename:file });
    MODULES.forEach(load);
    context.MapRenderer = { atualizarEntidades () {} };
    context.GameUI = Object.fromEntries(['atualizarObjetivos','atualizarTutor','atualizarVidas','atualizarOrientacao','atualizarProgresso','atualizarMoedasDaExecucao','definirFeedback','adicionarConsole','limparConsole','definirExecutando','mostrarResumoConclusao'].map((name) => [name, () => {}]));
    context.GameUI.solicitarEntrada = () => Promise.resolve('');
    function scene (activity, options = {}) {
        const s = { atividade:activity, atividadeIndex:activity.id - 1, mapa:activity.mapa, barreiras:activity.barreiras || [], startPosition:{ ...activity.startPosition }, gutoPosition:{ ...activity.startPosition }, playerFacing:activity.initialFacing, tileSize:64, startX:32, startY:32, livesRemaining:options.lives || 3, executando:false, sessionVariantIndex:options.variant || 0, testMode:true, testInputQueue:[...(options.inputs || activity.testInputs || [])], editorTexto:{ value:options.code === undefined ? activity.officialSolution : options.code }, guto:null, gutoFacingIndicator:null, playerProgress:context.PersistenceService.load(), devMode:false, completionProcessed:false, tutorialStepIndex:activity.tutorialSteps ? activity.tutorialSteps.length - 1 : 0 };
        context.DungeonSystem.resetRun(s); return s;
    }
    async function run (activity, options) { const s = scene(activity, options); return { scene:s, result:await context.CommandInterpreter.executar(s) }; }
    const languageActivity = { ...context.ACTIVITIES[0], tutorialSteps:null, allowedConcepts:['print','input','int','if','elif','else','comparison','and','or','not','for','range','while','break'], allowedCommands:[], objectives:[{type:'used_concept',concept:'variables',label:'Variável'}] };
    return { context, scene, run, load, languageActivity };
}
module.exports = { setup, root };
