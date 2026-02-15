// ============================================
// Fragmentos da Coroa Pirata
// Ficheiro: main.js
// Autor: Eduardo Goncalves
// ============================================

// ---------- IMPORTS ----------
import MenuPrincipalScene from './scenes/MenuPrincipalScene.js';
import InstrucoesScene from './scenes/InstrucoesScene.js';
import GameScene from './scenes/GameScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import ResultadosScene from './scenes/ResultadosScene.js';
import GameCompleteScene from './scenes/GameCompleteScene.js';

// ---------- CONFIGURACAO PRINCIPAL ----------
const config = {
    type: Phaser.AUTO,
    title: 'Fragmentos da Coroa Pirata',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#FFFFFF',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        MenuPrincipalScene,
        InstrucoesScene,
        GameScene,
        LevelCompleteScene,
        GameCompleteScene,
        ResultadosScene,
        GameOverScene
    ],
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.LANDSCAPE
    }
};

new Phaser.Game(config);
