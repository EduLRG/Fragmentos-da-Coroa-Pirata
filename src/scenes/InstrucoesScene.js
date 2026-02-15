// ============================================
// Fragmentos da Coroa Pirata
// Scene: InstrucoesScene
// Autor: Eduardo Goncalves
// ============================================

// ============================================
// CLASSE: InstrucoesScene
// Mostra objetivo, controlos e retorno ao menu.
// ============================================
export default class InstrucoesScene extends Phaser.Scene {
    // ------------------------------------------
    // METODO: constructor()
    // Regista a chave da scene.
    // ------------------------------------------
    constructor() {
        super('Instrucoes');
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
    // Construcao visual e eventos de input.
    // ------------------------------------------
    create() {
        const { width, height } = this.sys.game.canvas;

        // ---------- FUNDO ----------
        const background = this.add.image(width / 2, height / 2, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        background.setScale(Math.max(scaleX, scaleY));

        this.add.rectangle(width / 2, height / 2, width * 0.78, height * 0.68, 0x000000, 0.65)
            .setStrokeStyle(3, 0xfcd34d, 0.9);

        // ---------- TEXTO ----------
        this.add.text(width / 2, 120, 'INSTRUÇÕES', {
            fontSize: '54px',
            fill: '#fcd34d',
            stroke: '#3e2723',
            strokeThickness: 8
        }).setOrigin(0.5);

        const instructionsText = 'No jogo Fragmentos da Coroa Pirata, o bjetivo é explorar a ilha e encontrar a chave , abrir o tesouro e roubar o ouro. '
            + 'Evita os piratas inimigos para não seres capturado. '
            + 'Apanha as moedas ao longo do caminho para aumentar a tua riqueza. '
            + 'No computador jogas usa as setas do teclado para mover o capitāo. '
            + 'No telemóvel podes mover o capitão com o joystick.';

        this.add.text(width / 2, height / 2 - 30, instructionsText, {
            fontSize: '26px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: width * 0.68 }
        }).setOrigin(0.5);

        // ---------- ACAO ----------
        const backBtn = this.add.text(width / 2, height - 120, 'VOLTAR AO MENU', {
            fontSize: '30px',
            fill: '#ffffff',
            backgroundColor: '#1e88e5',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const goMenu = () => this.scene.start('MenuPrincipal');
        backBtn.on('pointerdown', goMenu);
        backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#1565c0' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#1e88e5' }));

        this.input.keyboard.on('keydown-ENTER', goMenu);
    }

    // ------------------------------------------
    // METODO: update()
    // Scene estatica; sem logica por frame.
    // ------------------------------------------
    update() {}
}
