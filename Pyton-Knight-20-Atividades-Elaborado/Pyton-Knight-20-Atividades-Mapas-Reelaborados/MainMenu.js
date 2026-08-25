class MainMenu extends Phaser.Scene {
    constructor () { super('MainMenu'); }
    create () {
        const cx = this.scale.width / 2; const cy = this.scale.height / 2; const progress = window.PersistenceService ? window.PersistenceService.load() : { unlockedMax: 1, totalXp: 0, walletCoins: 0 };
        this.add.text(cx, cy - 95, 'PYTON KNIGHT', { font: 'bold 58px Georgia', color: '#73b8ff', stroke: '#13132d', strokeThickness: 7 }).setOrigin(0.5);
        this.add.text(cx, cy - 25, 'Aprenda Python explorando a dungeon', { font: '22px Arial', color: '#f4e6c2' }).setOrigin(0.5);
        this.add.text(cx, cy + 25, `Atividade liberada: ${progress.unlockedMax}/20  ·  XP ${progress.totalXp}  ·  Moedas ${progress.walletCoins}`, { font: '17px monospace', color: '#b7c7e8' }).setOrigin(0.5);
        const button = this.add.rectangle(cx, cy + 95, 300, 62, 0x245a9b).setStrokeStyle(2, 0x92c7ff).setInteractive();
        this.add.text(cx, cy + 95, 'ENTRAR NO LIVRO MÁGICO', { font: 'bold 17px Arial', color: '#ffffff' }).setOrigin(0.5);
        button.on('pointerdown', () => this.scene.start('Game', { atividadeIndex: Math.max(0, progress.unlockedMax - 1) }));
    }
}
