// scenes/GameCompleteScene.js

export default class GameCompleteScene extends Phaser.Scene {
    constructor() {
        super('GameComplete');
    }

    preload() {
        this.load.image('menuBackground', 'assets/images/imagemBackground.jpg');
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        const score = this.scene.settings.data?.score ?? 0;
        const maxScore = this.scene.settings.data?.maxScore ?? 0;

        const background = this.add.image(width / 2, height / 2, 'menuBackground');
        const scaleX = width / background.width;
        const scaleY = height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        this.add.rectangle(width / 2, height / 2, width * 0.75, height * 0.62, 0x000000, 0.65)
            .setStrokeStyle(3, 0xfcd34d, 0.9);

        this.add.text(width / 2, height / 2 - 140, 'PARABÉNS!', {
            fontSize: '60px',
            fill: '#fcd34d',
            stroke: '#3e2723',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 70, 'COMPLETASTE O JOGO', {
            fontSize: '30px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 20, `Score: ${score}`, {
            fontSize: '30px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        if (maxScore > 0) {
            this.add.text(width / 2, height / 2 + 20, `Máximo possível: ${maxScore}`, {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);
        }

        const menuBtn = this.add.text(width / 2, height / 2 + 90, 'VOLTAR AO MENU', {
            fontSize: '28px',
            fill: '#ffffff',
            backgroundColor: '#1e88e5',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const goMenu = () => {
            this.scene.start('MenuPrincipal');
        };

        menuBtn.on('pointerdown', goMenu);

        this.input.keyboard.on('keydown-ENTER', goMenu);

        menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#1565c0' }));
        menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#1e88e5' }));
    }
}
