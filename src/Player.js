// ============================================
// Fragmentos da Coroa Pirata
// Classe: Player
// Autor: Eduardo Goncalves
// ============================================

// ---------- CONSTANTES ----------
const SCALE_FACTOR = 3;

// ============================================
// CLASSE: Player
// Responsavel por controlar o movimento e as
// animacoes do capitao.
// ============================================
export default class Player extends Phaser.Physics.Arcade.Sprite {
    // ------------------------------------------
    // METODO: constructor(scene, x, y)
    // Cria o jogador, configura escala, velocidade
    // e hitbox de colisao.
    // ------------------------------------------
    constructor(scene, x, y) {
        // Frame 7 = idle virado para baixo
        super(scene, x, y, 'capitao', 7);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SCALE_FACTOR);
        this.playerSpeed = 120 * SCALE_FACTOR;
        this.lastDirection = 'down';

        // Hitbox manual para alinhar melhor com o sprite
        const unscaledBodyWidth = 18;
        const unscaledBodyHeight = 24;
        const unscaledOffsetX = (24 - unscaledBodyWidth) / 2;
        const unscaledBodyOffsetY = 32 - unscaledBodyHeight;

        this.body.setSize(unscaledBodyWidth, unscaledBodyHeight);
        this.body.setOffset(unscaledOffsetX, unscaledBodyOffsetY);
        this.body.setAllowRotation(false);
        this.setCollideWorldBounds(false);
    }

    // ------------------------------------------
    // METODO: updateMovement(cursors)
    // Atualiza velocidade, direcao e animacao
    // com base no input (teclado/joystick).
    // ------------------------------------------
    updateMovement(cursors) {
        this.setVelocity(0);
        this.setFlipX(false);

        let isMoving = false;
        let velX = 0;
        let velY = 0;

        if (cursors.left.isDown) {
            velX = -this.playerSpeed;
            this.lastDirection = 'left';
            isMoving = true;
        } else if (cursors.right.isDown) {
            velX = this.playerSpeed;
            this.lastDirection = 'right';
            isMoving = true;
        }

        if (cursors.up.isDown) {
            velY = -this.playerSpeed;
            this.lastDirection = 'up';
            isMoving = true;
        } else if (cursors.down.isDown) {
            velY = this.playerSpeed;
            this.lastDirection = 'down';
            isMoving = true;
        }

        this.setVelocity(velX, velY);

        // Mantem velocidade consistente em diagonal
        if (velX !== 0 && velY !== 0) {
            this.body.velocity.normalize().scale(this.playerSpeed);
        }

        if (isMoving) {
            let animationKey = this.lastDirection;

            if (this.lastDirection === 'left') {
                animationKey = 'right';
                this.setFlipX(true);
            } else if (this.lastDirection === 'right') {
                this.setFlipX(false);
            }

            this.anims.play(animationKey, true);
            return;
        }

        this.anims.stop();

        let stopFrame;

        if (this.lastDirection === 'up') {
            stopFrame = 1;
        } else if (this.lastDirection === 'down') {
            stopFrame = 7;
            this.setFlipX(false);
        } else if (this.lastDirection === 'right') {
            stopFrame = 4;
            this.setFlipX(false);
        } else if (this.lastDirection === 'left') {
            stopFrame = 4;
            this.setFlipX(true);
        }

        this.setFrame(stopFrame);
    }
}
