// Pirata/src/Key.js
// Classe para o item Chave

const SCALE_FACTOR = 1.2; 

export default class Key extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Item de chave
        super(scene, x, y, 'key');
        
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // O 'true' cria um corpo estático

        this.setScale(SCALE_FACTOR); 
    }
}