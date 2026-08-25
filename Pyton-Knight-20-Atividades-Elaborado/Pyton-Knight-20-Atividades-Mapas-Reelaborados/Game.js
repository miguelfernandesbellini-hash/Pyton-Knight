class Game extends Phaser.Scene {
    constructor () { super('Game'); }
    init (data) { this.atividadeIndex = data && Number.isInteger(data.atividadeIndex) ? data.atividadeIndex : 0; this.requestedVariant = data && Number.isInteger(data.variantIndex) ? data.variantIndex : null; }
    create () {
        const dependencies = [window.GAME_CONSTANTS, window.ACTIVITIES, window.BarrierSystem, window.PythonSubsetParser, window.CodeBudgetValidator, window.PersistenceService, window.ProgressionSystem, window.MissionObjectiveSystem, window.TutorialSystem, window.DungeonSystem, window.PlayerController, window.CommandInterpreter, window.MapRenderer, window.GameUI];
        if (dependencies.some((item) => !item)) { this.add.text(40, 100, 'ERRO: um módulo obrigatório não foi carregado.', { font: '20px monospace', color: '#ff5a5a' }); return; }
        this.devMode = new URLSearchParams(window.location.search).get('dev') === '1'; this.playerProgress = window.ProgressionSystem.inicializar(this);
        this.atividadeIndex = Math.max(0, Math.min(window.ACTIVITIES.length - 1, this.atividadeIndex));
        if (!window.ProgressionSystem.atividadeDesbloqueada(this, this.atividadeIndex + 1)) this.atividadeIndex = Math.max(0, this.playerProgress.unlockedMax - 1);
        this.atividade = window.ACTIVITIES[this.atividadeIndex]; this.mapa = this.atividade.mapa; this.barreiras = this.atividade.barreiras || [];
        this.startPosition = { ...this.atividade.startPosition }; this.gutoPosition = { ...this.startPosition }; this.playerFacing = this.atividade.initialFacing || 'LESTE';
        this.livesRemaining = 3; this.executando = false; this.executionCount = 0; this.sessionVariantIndex = this.requestedVariant !== null ? this.requestedVariant : (this.atividade.id + new Date().getUTCDate()) % 3;
        const columns = this.mapa[0].length; const rows = this.mapa.length; this.tileSize = Math.floor(Math.min(68, 720 / columns, 500 / rows)); this.startX = 38 + this.tileSize / 2; this.startY = 185 + this.tileSize / 2;
        window.MapRenderer.desenhar(this); window.BarrierSystem.desenhar(this); window.GameUI.criar(this); window.DungeonSystem.resetRun(this); window.TutorialSystem.inicializar(this); window.GameUI.atualizarVidas(this); window.GameUI.atualizarOrientacao(this); window.GameUI.atualizarProgresso(this);
    }
}
const config = { type: Phaser.AUTO, width: 1360, height: 820, parent: 'game-container', backgroundColor: '#090711', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, dom: { createContainer: true }, scene: [Boot, Preloader, MainMenu, Game] };
new Phaser.Game(config);
