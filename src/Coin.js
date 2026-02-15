// ============================================
// Fragmentos da Coroa Pirata
// Classe: Coin
// Autor: Eduardo Goncalves
// ============================================

// ---------- CONSTANTES ----------
const SCALE_FACTOR = 3;

// ============================================
// CLASSE: Coin
// Item colecionavel que incrementa a pontuacao.
// ============================================
export default class Coin extends Phaser.Physics.Arcade.Sprite {
    // ------------------------------------------
    // METODO: constructor(scene, x, y)
    // Cria a moeda e configura o corpo fisico.
    // ------------------------------------------
    constructor(scene, x, y) {
        super(scene, x, y, 'coin');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SCALE_FACTOR);
        this.body.setAllowGravity(false);
        this.setImmovable(true);
    }
}
