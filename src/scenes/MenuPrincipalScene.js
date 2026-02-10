// scenes/MenuPrincipalScene.js

export default class MenuPrincipalScene extends Phaser.Scene {
    constructor() {
        super('MenuPrincipal'); 
    }

    preload() {
       // Carrega a imagem de fundo
       this.load.image('menuBackground', 'assets/images/imagemBackground.jpg');
         this.load.audio('bgm', 'assets/audio/song2.mp3');
    }

    create() {
        const { width, height } = this.sys.game.canvas; 
        const centerX = width / 2;
        const centerY = height / 2; // 360

        // Música de fundo (inicia no primeiro clique)

        const bgm = this.sound.get('bgm') || this.sound.add('bgm', { loop: true, volume: 0.25 });
        const startBgm = () => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            if (!bgm.isPlaying) {
                bgm.play();
            }
        };

    // --- 1. ADICIONAR E ESCALAR A IMAGEM DE FUNDO ---
        const background = this.add.image(centerX, centerY, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        const scale = Math.max(scaleX, scaleY); 
        background.setScale(scale);

    // --- 2. TÍTULO ---
        this.add.text(centerX, 150, 'FRAGMENTOS DA COROA PIRATA', { 
            fontSize: '60px', 
            fill: '#fcd34d', 
            stroke: '#8d6e63', 
            strokeThickness: 10 
        }).setOrigin(0.5);

    // --- 3. ESTILO DOS BOTÕES (Igual ao título) ---
        const buttonStyle = { 
            fontSize: '40px', 
            fill: '#fcd34d', 
            stroke: '#8d6e63', 
            strokeThickness: 8, 
        };

    // --- 4. BOTÕES INTERATIVOS (Movidos para cima) ---
        let buttonY = centerY - 50; // Começa 50 pixels ACIMA do centro

        const startGame = () => {
            startBgm();
            this.scene.start('GameScene', { level: 1, score: 0, maxScore: 0 });
        };

        const openInstructions = () => {
            startBgm();
            this.scene.start('Instrucoes');
        };

    // NOVO JOGO
        const novoJogoBtn = this.add.text(centerX, buttonY, 'NOVO JOGO', buttonStyle).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', startGame);

    // INSTRUÇÕES
        buttonY += 100; 
        const instrucoesBtn = this.add.text(centerX, buttonY, 'INSTRUÇÕES', buttonStyle).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', openInstructions);

    // Ativa áudio após o primeiro toque/clique
    this.input.once('pointerdown', startBgm);

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

        // Efeito visual (Hover)
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