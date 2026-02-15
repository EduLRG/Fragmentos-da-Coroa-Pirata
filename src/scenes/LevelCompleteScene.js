// ============================================
// Fragmentos da Coroa Pirata
// Scene: LevelCompleteScene
// Autor: Eduardo Goncalves
// ============================================

// ============================================
// CLASSE: LevelCompleteScene
// Mostra transicao entre niveis.
// ============================================
export default class LevelCompleteScene extends Phaser.Scene {
    // ------------------------------------------
    // METODO: constructor()
    // Regista a chave da scene.
    // ------------------------------------------
    constructor() {
        super('LevelComplete');
    }

    // ------------------------------------------
    // METODO: preload()
    // Carrega assets usados nesta scene.
    // ------------------------------------------
    preload() {
        this.load.image('menuBackground', 'assets/images/imagemBackground.jpg');
    }

    // ------------------------------------------
    // METODO: create()
    // Apresenta mensagem de nivel concluido e
    // botao para avancar.
    // ------------------------------------------
    create() {
        const { width, height } = this.sys.game.canvas;

        // ---------- FUNDO ----------
        const background = this.add.image(width / 2, height / 2, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        background.setScale(Math.max(scaleX, scaleY));

        this.add.rectangle(width / 2, height / 2, width * 0.7, height * 0.55, 0x000000, 0.65)
            .setStrokeStyle(3, 0xfcd34d, 0.9);

        // ---------- TEXTO ----------
        this.add.text(width / 2, height / 2 - 110, 'PARABÉNS!', {
            fontSize: '64px',
            fill: '#fcd34d',
            stroke: '#3e2723',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 40, 'NÍVEL COMPLETO', {
            fontSize: '34px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // ---------- ACAO ----------
        const button = this.add.text(width / 2, height / 2 + 80, 'NÍVEL SEGUINTE', {
            fontSize: '30px',
            fill: '#ffffff',
            backgroundColor: '#1e88e5',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const goNextLevel = () => {
            const nextLevel = this.scene.settings.data?.nextLevel || 2;
            const score = this.scene.settings.data?.score ?? 0;
            const maxScore = this.scene.settings.data?.maxScore ?? 0;
            this.scene.start('GameScene', { level: nextLevel, score, maxScore });
        };

        button.on('pointerdown', goNextLevel);
        button.on('pointerover', () => button.setStyle({ backgroundColor: '#1565c0' }));
        button.on('pointerout', () => button.setStyle({ backgroundColor: '#1e88e5' }));

        this.input.keyboard.on('keydown-ENTER', goNextLevel);
    }

    // ------------------------------------------
    // METODO: update()
    // Scene estatica; sem logica por frame.
    // ------------------------------------------
    update() {}
}
