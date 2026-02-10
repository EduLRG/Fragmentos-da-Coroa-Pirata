// Pirata/src/Player.js
// Classe para gerir o jogador com velocidade ajustada

const SCALE_FACTOR = 3; 

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Frame 7 é o frame de repouso (virado para baixo)
        super(scene, x, y, 'capitao', 7);
        
        scene.add.existing(this); 
        scene.physics.add.existing(this); 

        this.setScale(SCALE_FACTOR); 
        // Velocidade ajustada
        this.playerSpeed = 120 * SCALE_FACTOR; 
        this.lastDirection = 'down'; 
        
        // CORREÇÃO: Alinhamento do Corpo de Física (18x24px, alinhado à base)
        const unscaledBodyWidth = 18; 
        const unscaledBodyHeight = 24; 
        
        // Offset X: 3px para centrar horizontalmente
        const unscaledOffsetX = (24 - unscaledBodyWidth) / 2; 
        // Offset Y: 8px para alinhar o fundo do corpo com o fundo do frame
        const unscaledBodyOffsetY = 32 - unscaledBodyHeight; 

        this.body.setSize(unscaledBodyWidth, unscaledBodyHeight); 
        this.body.setOffset(unscaledOffsetX, unscaledBodyOffsetY); 

        this.body.setAllowRotation(false);
        this.setCollideWorldBounds(false); 
    }

    updateMovement(cursors) {
        this.setVelocity(0); 
        let isMoving = false;
        this.setFlipX(false);
        
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

        } else {
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
}