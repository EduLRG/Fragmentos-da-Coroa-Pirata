// ============================================
// Fragmentos da Coroa Pirata
// Classe: Pirate (Inimigo)
// Autor: Eduardo Goncalves
// ============================================

// ---------- CONSTANTES ----------
const STATE = {
    PATROL: 'patrol',
    CHASE: 'chase'
};
const SCALE_FACTOR = 3;

// ============================================
// CLASSE: Pirate
// Gere patrulha, deteccao por FOV e perseguicao
// dos inimigos no mapa.
// ============================================
export default class Pirate extends Phaser.Physics.Arcade.Sprite {
    // ------------------------------------------
    // METODO: constructor(scene, x, y, textureKey)
    // Cria o inimigo com hitbox ajustada e
    // indicador visual de perseguicao.
    // ------------------------------------------
    constructor(scene, x, y, textureKey) {
        // Frame 7 = idle virado para baixo
        super(scene, x, y, textureKey, 7);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SCALE_FACTOR);
        this.pirateSpeed = 80 * SCALE_FACTOR;
        this.nextMoveTime = 0;
        this.state = STATE.PATROL;
        this.detectionRadius = 100 * SCALE_FACTOR;
        this.lastDirection = 'down';
        this.textureKey = textureKey;

        // Hitbox manual para alinhar com o sprite
        const unscaledBodyWidth = 18;
        const unscaledBodyHeight = 24;
        const unscaledOffsetX = (24 - unscaledBodyWidth) / 2;
        const unscaledBodyOffsetY = 32 - unscaledBodyHeight;

        this.body.setSize(unscaledBodyWidth, unscaledBodyHeight);
        this.body.setOffset(unscaledOffsetX, unscaledBodyOffsetY);
        this.body.setAllowRotation(false);

        // Indicador visual quando entra em modo CHASE
        this.indicatorYOffset = -(32 * SCALE_FACTOR / 2) - 15;
        this.indicator = scene.add.text(x, y + this.indicatorYOffset, '!', {
            fontSize: '48px',
            fill: '#FF0000',
            stroke: '#1f2937',
            strokeThickness: 4,
            padding: { x: 5, y: 0 }
        }).setOrigin(0.5);

        this.indicator.setVisible(false);
    }

    // ------------------------------------------
    // METODO AUXILIAR: getFacingVector()
    // Converte a direcao atual num vetor unitario.
    // ------------------------------------------
    getFacingVector() {
        switch (this.lastDirection) {
            case 'up':
                return new Phaser.Math.Vector2(0, -1);
            case 'down':
                return new Phaser.Math.Vector2(0, 1);
            case 'left':
                return new Phaser.Math.Vector2(-1, 0);
            case 'right':
                return new Phaser.Math.Vector2(1, 0);
            default:
                return new Phaser.Math.Vector2(0, 1);
        }
    }

    // ------------------------------------------
    // METODO AUXILIAR: getAnimationKey(direction)
    // Escolhe a animacao correta para a direcao.
    // ------------------------------------------
    getAnimationKey(direction) {
        if (direction === 'left' || direction === 'right') {
            return this.textureKey + '_right';
        }
        return this.textureKey + '_' + direction;
    }

    // ------------------------------------------
    // METODO AUXILIAR: getStopFrame(direction)
    // Retorna o frame idle para cada direcao.
    // ------------------------------------------
    getStopFrame(direction) {
        switch (direction) {
            case 'up':
                return 1;
            case 'right':
            case 'left':
                return 4;
            case 'down':
            default:
                return 7;
        }
    }

    // ------------------------------------------
    // METODO AUXILIAR: updateDirectionFromVelocity()
    // Atualiza direcao visual e flip com base na
    // velocidade atual do corpo fisico.
    // ------------------------------------------
    updateDirectionFromVelocity() {
        const velX = this.body.velocity.x;
        const velY = this.body.velocity.y;

        if (Math.abs(velX) > Math.abs(velY) && Math.abs(velX) > 0) {
            this.lastDirection = velX > 0 ? 'right' : 'left';
            this.setFlipX(velX < 0);
        } else if (Math.abs(velY) > 0) {
            this.lastDirection = velY > 0 ? 'down' : 'up';
            this.setFlipX(false);
        }
    }

    // ------------------------------------------
    // METODO: moveRandomly()
    // Comportamento de patrulha com intervalos de
    // movimento e pausa aleatorios.
    // ------------------------------------------
    moveRandomly() {
        if (this.scene.time.now <= this.nextMoveTime) {
            return;
        }

        const angle = Phaser.Math.Between(0, 360);
        const moveTime = Phaser.Math.Between(800, 1500);
        const stopTime = Phaser.Math.Between(1000, 2000);

        this.scene.physics.velocityFromAngle(angle, this.pirateSpeed / 1.5, this.body.velocity);
        this.nextMoveTime = this.scene.time.now + moveTime;

        this.updateDirectionFromVelocity();
        this.anims.play(this.getAnimationKey(this.lastDirection), true);

        this.scene.time.delayedCall(moveTime, () => {
            this.setVelocity(0);
            this.anims.stop();
            this.setFrame(this.getStopFrame(this.lastDirection));
            this.nextMoveTime = this.scene.time.now + stopTime;
        }, [], this);
    }

    // ------------------------------------------
    // METODO: update(player)
    // Decide entre PATROL e CHASE com base na
    // distancia e campo de visao (dot product).
    // ------------------------------------------
    update(player) {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
        let chasing = false;

        // Mantem o indicador "!" preso ao inimigo
        this.indicator.x = this.x;
        this.indicator.y = this.y + this.indicatorYOffset;

        if (distance < this.detectionRadius) {
            const toPlayer = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
            const facing = this.getFacingVector();
            const dotProduct = facing.dot(toPlayer);

            // dotProduct > 0 => jogador no arco frontal (180 graus)
            if (dotProduct > 0) {
                this.state = STATE.CHASE;

                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                this.scene.physics.velocityFromRotation(angle, this.pirateSpeed, this.body.velocity);

                this.updateDirectionFromVelocity();
                this.anims.play(this.getAnimationKey(this.lastDirection), true);
                chasing = true;
            }
        }

        if (!chasing) {
            this.state = STATE.PATROL;
            this.moveRandomly();
        }

        this.indicator.setVisible(chasing);
        return chasing;
    }
}
