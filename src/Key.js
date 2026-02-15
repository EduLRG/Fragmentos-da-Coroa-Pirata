// ============================================
// Fragmentos da Coroa Pirata
// Classe: Key
// Autor: Eduardo Goncalves
// ============================================

// ---------- CONSTANTES ----------
const SCALE_FACTOR = 1.2;

// ============================================
// CLASSE: Key
// Item colecionavel necessario para abrir
// o tesouro.
// ============================================
export default class Key extends Phaser.Physics.Arcade.Sprite {
    // ------------------------------------------
    // METODO: constructor(scene, x, y)
    // Cria o item de chave como corpo estatico.
    // ------------------------------------------
    constructor(scene, x, y) {
        super(scene, x, y, 'key');

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.setScale(SCALE_FACTOR);
    }
}
