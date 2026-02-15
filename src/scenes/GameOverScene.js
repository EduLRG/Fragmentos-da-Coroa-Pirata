// ============================================
// Fragmentos da Coroa Pirata
// Scene: GameOverScene
// Autor: Eduardo Goncalves
// ============================================

// ============================================
// CLASSE: GameOverScene
// Ecran alternativo de derrota.
// ============================================
export default class GameOverScene extends Phaser.Scene {
    // ------------------------------------------
    // METODO: constructor()
    // Regista a chave da scene.
    // ------------------------------------------
    constructor() {
        super('GameOver');
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
    // Mostra ecran de derrota e retorno ao menu.
    // ------------------------------------------
    create() {
        const { width, height } = this.sys.game.canvas;

        // ---------- FUNDO ----------
        const background = this.add.image(width / 2, height / 2, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        background.setScale(Math.max(scaleX, scaleY));

        this.add.rectangle(width / 2, height / 2, width * 0.7, height * 0.55, 0x000000, 0.65)
            .setStrokeStyle(3, 0xef4444, 0.9);

        // ---------- TEXTO ----------
        this.add.text(width / 2, height / 2 - 110, 'GAME OVER', {
            fontSize: '60px',
            fill: '#ef4444',
            stroke: '#3e2723',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 40, 'CAPTURADO PELOS INIMIGOS', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // ---------- ACAO ----------
        const menuBtn = this.add.text(width / 2, height / 2 + 40, 'RETORNAR AO MENU', {
            fontSize: '30px',
            fill: '#FFFFFF',
            backgroundColor: '#1E88E5',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuPrincipal');
        });
        menuBtn.on('pointerover', () => menuBtn.setScale(1.05));
        menuBtn.on('pointerout', () => menuBtn.setScale(1));
    }

    // ------------------------------------------
    // METODO: update()
    // Scene estatica; sem logica por frame.
    // ------------------------------------------
    update() {}
}
