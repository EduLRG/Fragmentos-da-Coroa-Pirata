// scenes/ResultadosScene.js

export default class ResultadosScene extends Phaser.Scene {
    constructor() {
        super('Resultados');
    }

    preload() {
        // Fundo e áudio do game over
        this.load.image('menuBackground', 'assets/images/imagemBackground.jpg');
        this.load.audio('gameover', 'assets/audio/gameover.mp3');
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        const score = this.scene.settings.data?.score ?? 0;
        const maxScore = this.scene.settings.data?.maxScore ?? 0;

        // Parar música de fundo e tocar game over
        const bgm = this.sound.get('bgm');
        if (bgm && bgm.isPlaying) {
            bgm.stop();
        }
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
    this.sound.play('gameover', { volume: 0.2 });

    // Fundo e painel
    const background = this.add.image(width / 2, height / 2, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        this.add.rectangle(width / 2, height / 2, width * 0.72, height * 0.6, 0x000000, 0.65)
            .setStrokeStyle(3, 0xef4444, 0.9);

        this.add.text(width / 2, height / 2 - 130, 'RESULTADOS', {
            fontSize: '56px',
            fill: '#fcd34d',
            stroke: '#3e2723',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 50, `Score: ${score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        if (maxScore > 0) {
            this.add.text(width / 2, height / 2 - 10, `Máximo possível: ${maxScore}`, {
                fontSize: '26px',
                fill: '#ffffff'
            }).setOrigin(0.5);
        }

    // Botão de voltar ao menu
    const retryBtn = this.add.text(width / 2, height / 2 + 80, 'VOLTAR AO MENU', {
            fontSize: '30px',
            fill: '#ffffff',
            backgroundColor: '#1e88e5',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const goMenu = () => {
            this.scene.start('MenuPrincipal');
        };

        retryBtn.on('pointerdown', goMenu);

        this.input.keyboard.on('keydown-ENTER', goMenu);

        retryBtn.on('pointerover', () => retryBtn.setStyle({ backgroundColor: '#1565c0' }));
        retryBtn.on('pointerout', () => retryBtn.setStyle({ backgroundColor: '#1e88e5' }));
    }
}
