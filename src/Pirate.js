// Pirata/src/Pirate.js
// Classe para gerir o pirata inimigo com Campo de Visão (FOV)

const STATE = {
    PATROL: 'patrol',
    CHASE: 'chase'
};
const SCALE_FACTOR = 3; 

export default class Pirate extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey) {
        // Inimigo com patrulha e perseguição
        // Usa a chave de textura dinâmica e o frame 7 (idle down)
        super(scene, x, y, textureKey, 7);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SCALE_FACTOR); 
        // Velocidade ajustada
        this.pirateSpeed = 80 * SCALE_FACTOR;
        this.nextMoveTime = 0; 
        this.state = STATE.PATROL; 
        // Raio de deteção reduzido (300 pixels)
        this.detectionRadius = 100 * SCALE_FACTOR; 

        this.lastDirection = 'down'; 
        this.textureKey = textureKey; 

        // Colisão (Corpo do sprite 24x32)
        const unscaledBodyWidth = 18; 
        const unscaledBodyHeight = 24; 
        const unscaledOffsetX = (24 - unscaledBodyWidth) / 2; // 3
        const unscaledBodyOffsetY = 32 - unscaledBodyHeight; // 8

        this.body.setSize(unscaledBodyWidth, unscaledBodyHeight); 
        this.body.setOffset(unscaledOffsetX, unscaledBodyOffsetY);
        
        this.body.setAllowRotation(false);
        
        // INDICADOR VISUAL DE PERSEGUIÇÃO (!)
        this.indicatorYOffset = - (32 * SCALE_FACTOR / 2) - 15; // -63 pixels
        
        this.indicator = scene.add.text(x, y + this.indicatorYOffset, '!', { 
            fontSize: '48px',
            fill: '#FF0000',
            stroke: '#1f2937',
            strokeThickness: 4,
            padding: { x: 5, y: 0 }
        }).setOrigin(0.5); 
        
        this.indicator.setVisible(false);
    }
    
    // --- NOVO MÉTODO: Mapeia a direção visual para um vetor ---
    getFacingVector() {
        switch (this.lastDirection) {
            case 'up': return new Phaser.Math.Vector2(0, -1);
            case 'down': return new Phaser.Math.Vector2(0, 1);
            case 'left': return new Phaser.Math.Vector2(-1, 0);
            case 'right': return new Phaser.Math.Vector2(1, 0);
            default: return new Phaser.Math.Vector2(0, 1); // Default
        }
    }
    
    // Obtém a chave da animação
    getAnimationKey(direction) {
        if (direction === 'left' || direction === 'right') {
            return this.textureKey + '_right';
        }
        return this.textureKey + '_' + direction;
    }
    
    // Obtém o frame de repouso
    getStopFrame(direction) {
        switch(direction) {
            case 'up': return 1;
            case 'right': 
            case 'left': return 4;
            case 'down': 
            default: return 7;
        }
    }
    
    // Atualiza a direção do sprite e o flipX
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
    
    moveRandomly() {
        if (this.scene.time.now > this.nextMoveTime) {
            
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
    }

    update(player) {
        // IA simples: deteta jogador e persegue
        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
        let chasing = false;

        // Atualiza a posição do indicador
        this.indicator.x = this.x;
        this.indicator.y = this.y + this.indicatorYOffset;

        // 1. Verifica se o jogador está dentro do raio de deteção
        if (distance < this.detectionRadius) {
            
            // 2. Cria o vetor do Pirata para o Jogador e normaliza
            const toPlayer = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
            
            // 3. Obtém o vetor da direção do Pirata
            const facing = this.getFacingVector();
            
            // 4. Calcula o produto escalar (Dot Product)
            const dotProduct = facing.dot(toPlayer);
            
            // 5. Verifica o FOV: Dot product > 0 significa que o jogador está no arco frontal de 180 graus.
            if (dotProduct > 0) {
                this.state = STATE.CHASE;
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                this.scene.physics.velocityFromRotation(angle, this.pirateSpeed, this.body.velocity);
                
                // Animação de Perseguição
                this.updateDirectionFromVelocity();
                this.anims.play(this.getAnimationKey(this.lastDirection), true);
                
                chasing = true;
            }
        }
        
        if (!chasing) {
            this.state = STATE.PATROL;
            this.moveRandomly();
        }
        
        // Controlo do indicador (!)
        this.indicator.setVisible(chasing);
        
        return chasing;
    }
}