// ============================================
// Fragmentos da Coroa Pirata
// Scene: MenuPrincipalScene
// Autor: Eduardo Goncalves
// ============================================

// ============================================
// CLASSE: MenuPrincipalScene
// Gere o menu inicial e navegacao principal.
// ============================================
export default class MenuPrincipalScene extends Phaser.Scene {
    // ------------------------------------------
    // METODO: constructor()
    // Regista a chave da scene.
    // ------------------------------------------
    constructor() {
        super('MenuPrincipal');
    }

    // ------------------------------------------
    // METODO: preload()
    // Carrega imagem de fundo e musica.
    // ------------------------------------------
    preload() {
        this.load.image('menuBackground', 'assets/images/imagemBackground.jpg');
        this.load.audio('bgm', 'assets/audio/song2.mp3');
    }

    // ------------------------------------------
    // METODO: create()
    // Constroi layout do menu e eventos de input.
    // ------------------------------------------
    create() {
        const { width, height } = this.sys.game.canvas;
        const centerX = width / 2;
        const centerY = height / 2;

        // ---------- AUDIO ----------
        const bgm = this.sound.get('bgm') || this.sound.add('bgm', { loop: true, volume: 0.25 });
        const startBgm = () => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            if (!bgm.isPlaying) {
                bgm.play();
            }
        };

        // ---------- FUNDO ----------
        const background = this.add.image(centerX, centerY, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        background.setScale(Math.max(scaleX, scaleY));

        // ---------- TITULO ----------
        this.add.text(centerX, 150, 'FRAGMENTOS DA COROA PIRATA', {
            fontSize: '60px',
            fill: '#fcd34d',
            stroke: '#8d6e63',
            strokeThickness: 10
        }).setOrigin(0.5);

        // ---------- BOTOES ----------
        const buttonStyle = {
            fontSize: '40px',
            fill: '#fcd34d',
            stroke: '#8d6e63',
            strokeThickness: 8
        };

        let buttonY = centerY - 50;

        const startGame = () => {
            startBgm();
            this.scene.start('GameScene', { level: 1, score: 0, maxScore: 0 });
        };

        const openInstructions = () => {
            startBgm();
            this.scene.start('Instrucoes');
        };

        const novoJogoBtn = this.add.text(centerX, buttonY, 'NOVO JOGO', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', startGame);

        buttonY += 100;
        const instrucoesBtn = this.add.text(centerX, buttonY, 'INSTRUÇÕES', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', openInstructions);

        this.input.once('pointerdown', startBgm);

        // ---------- NAVEGACAO ----------
        const menuButtons = [novoJogoBtn, instrucoesBtn];
        let selectedIndex = 0;

        const updateSelection = () => {
            menuButtons.forEach((btn, index) => {
                if (index === selectedIndex) {
                    btn.setScale(1.08);
                    btn.setStyle({ fill: '#ffffff' });
                } else {
                    btn.setScale(1);
                    btn.setStyle({ fill: '#fcd34d' });
                }
            });
        };

        updateSelection();

        this.input.keyboard.on('keydown-UP', () => {
            selectedIndex = (selectedIndex - 1 + menuButtons.length) % menuButtons.length;
            updateSelection();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            selectedIndex = (selectedIndex + 1) % menuButtons.length;
            updateSelection();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (selectedIndex === 0) {
                startGame();
            } else {
                openInstructions();
            }
        });

        menuButtons.forEach((btn, index) => {
            btn.on('pointerover', () => {
                selectedIndex = index;
                updateSelection();
            });
            btn.on('pointerout', () => {
                updateSelection();
            });
        });
    }
}
