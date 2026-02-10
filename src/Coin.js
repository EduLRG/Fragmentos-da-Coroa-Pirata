// Pirata/src/Coin.js
// Classe para gerir a moeda

const SCALE_FACTOR = 3;

export default class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'coin');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SCALE_FACTOR);
        this.body.setAllowGravity(false);
        this.setImmovable(true);
    }
}
