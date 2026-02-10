// Pirata/src/scenes/GameScene.js - CÓDIGO FINAL E OTIMIZADO

import Player from '../Player.js';
import Pirate from '../Pirate.js';
import Key from '../Key.js';
import Coin from '../Coin.js';

const SCALE_FACTOR = 3; 
const ENEMY_TEXTURE_KEYS = [
    'inimigo1', 'inimigo2', 'inimigo3', 
    'inimigo4', 'inimigo5', 'inimigo6'
]; 

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.cursors = null; 
        this.hasKey = false;
        this.pirates = null; 
        this.player = null; 
        this.level = 1;
        this.mapKey = 'mapa_ilha1';
    }

    init(data) {
        this.level = data?.level || 1;
        this.mapKey = this.level === 2 ? 'mapa_ilha2' : 'mapa_ilha1';
        this.score = data?.score ?? 0;
        this.maxScore = data?.maxScore ?? 0;
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
        // Assets principais

        // Carregar a spritesheet do Capitão
        this.load.spritesheet('capitao', 'assets/images/capitao.png', { 
            frameWidth: 24, 
            frameHeight: 32 
        });
        
        // CARREGAR AS SPRITESHEETS DOS INIMIGOS (24x32)
        ENEMY_TEXTURE_KEYS.forEach(key => {
            this.load.spritesheet(key, `assets/images/${key}.png`, { 
                frameWidth: 24, 
                frameHeight: 32 
            });
        });
        
        // Carregar a imagem de fundo do mar
        this.load.image('fundo_mar', 'assets/images/mar.png'); 
    this.load.image('mar_tiles', 'assets/images/mar.png'); 
        
        this.load.image('ilha_pastel_img', 'assets/images/TILESET.png'); 
        
        // 1. Carregar a imagem para os PROPS
        this.load.image('props_img', 'assets/images/PROPS.png'); 

        // Carregar a imagem da chave
        this.load.image('key', 'assets/images/key.png');

    // Carregar a imagem da moeda
    this.load.image('coin', 'assets/images/coin.png');

    // SFX
    this.load.audio('sfx_collect', 'assets/audio/coin.mp3');

    // Virtual joystick (mobile)
    this.load.plugin('rexvirtualjoystickplugin', 'assets/plugins/rexvirtualjoystickplugin.min.js', true);
    this.load.image('joystick_base', 'assets/joystick/base.png');
    this.load.image('joystick_thumb', 'assets/joystick/thumb.png');

        this.load.tilemapTiledJSON('mapa_ilha1', 'assets/maps/mapa_ilha1.json'); 
        this.load.tilemapTiledJSON('mapa_ilha2', 'assets/maps/mapa_ilha2.json'); 
        
        this.createTemporaryTextures();
    }
    
    createTemporaryTextures() {
        const treasureSize = 32;
        const treasureGraphics = this.add.graphics();
        treasureGraphics.fillStyle(0x0000FF, 1); treasureGraphics.fillRect(0, 0, treasureSize, treasureSize); treasureGraphics.generateTexture('treasure_sim', treasureSize, treasureSize); treasureGraphics.destroy();
        
        const enemyGraphics = this.add.graphics();
        enemyGraphics.fillStyle(0xFF0000, 1); enemyGraphics.fillTriangle(0, 32, 32, 32, 16, 0); enemyGraphics.generateTexture('enemy_sim', 32, 32); enemyGraphics.destroy(); 
    }


    create() {
        const { width, height } = this.sys.game.canvas;
        const hudX = width / 2;
        const hudY = height;
        // Criação do mapa e entidades
        
        // --- 1. CRIAR O MAPA E CAMADAS ---
        this.cameras.main.setBackgroundColor('#000000'); 

    this.hasKey = false;
    const map = this.make.tilemap({ key: this.mapKey });
        
        // Ligar o tileset principal e o novo tileset PROPS
    const tileset = map.addTilesetImage('TILESET', 'ilha_pastel_img'); 
    const marTileset = map.addTilesetImage('mar', 'mar_tiles'); 
    const propsTileset = map.addTilesetImage('PROPS', 'props_img'); 

        const allTilesets = [tileset, marTileset, propsTileset].filter(Boolean);

        const createScaledLayer = (layerName) => {
            const layer = map.createLayer(layerName, allTilesets, 0, 0);
            if (layer) {
                layer.setScale(SCALE_FACTOR);
                layer.filter = Phaser.Textures.FilterMode.NEAREST;
            }
            return layer;
        };

        // Adicionar a imagem de fundo PRIMEIRO
        const mapWidthScaled = map.widthInPixels * SCALE_FACTOR;
        const mapHeightScaled = map.heightInPixels * SCALE_FACTOR;
        
        const bgImage = this.add.image(0, 0, 'fundo_mar')
            .setOrigin(0) 
            .setDepth(-1) 
            .setDisplaySize(mapWidthScaled, mapHeightScaled); 
        
        // Camadas da Ilha
        const marLayer = createScaledLayer('mar');
        const groundLayer = createScaledLayer('chao');
        const farolLayer = createScaledLayer('farol');
        const camadaBlocos4 = createScaledLayer('Camada de Blocos 4');
        const camadaBlocos5 = createScaledLayer('Camada de Blocos 5');

        // 2. Criar a camada dos PROPS (o nome da camada no Tiled DEVE ser 'PROPS')
        const propsLayer = createScaledLayer('PROPS');


        // --- 2. CONFIGURAÇÃO DE COLISÃO DO POLÍGONO ---
        
        const limitsObjectLayer = map.getObjectLayer('Limites');
        const collisionGroup = this.physics.add.staticGroup();
    this.collisionGroup = collisionGroup;
        
        if (limitsObjectLayer) {
            limitsObjectLayer.objects.forEach(obj => {
                const bodyX = obj.x * SCALE_FACTOR + (obj.width * SCALE_FACTOR) / 2;
                const bodyY = obj.y * SCALE_FACTOR + (obj.height * SCALE_FACTOR) / 2;
                const bodyWidth = obj.width * SCALE_FACTOR;
                const bodyHeight = obj.height * SCALE_FACTOR;

                const colliderRect = this.add.rectangle(bodyX, bodyY, bodyWidth, bodyHeight);
                this.physics.world.enable(colliderRect, 1); 
                
                collisionGroup.add(colliderRect);
                colliderRect.setVisible(false); 
            });
        }


        // --- 3. LEITURA DOS SPAWN POINTS ---
        const getSpawnPoint = (name) => {
            const obj = map.findObject('SpawnPoints', obj => obj.name === name);
            return obj ? { x: obj.x * SCALE_FACTOR, y: obj.y * SCALE_FACTOR } : { x: map.widthInPixels / 2 * SCALE_FACTOR, y: map.heightInPixels / 2 * SCALE_FACTOR };
        };

        const playerStart = getSpawnPoint('PlayerStart');
        const treasureSpawn = getSpawnPoint('TreasureSpawn');
        const keySpawns = map.filterObjects('SpawnPoints', obj => obj.name === 'KeySpawn');
        const coinSpawns = map.filterObjects('SpawnPoints', obj => obj.name === 'CoinSpawn');
        
        // --- 4. INSTANCIAR JOGADOR E INIMIGOS ---
        
        this.createAnimations(); 
        
        this.player = new Player(this, playerStart.x, playerStart.y); 

        // Inimigos
        this.pirates = this.physics.add.group({ runChildUpdate: true }); 
        const enemySpawnObjects = map.filterObjects('SpawnPoints', obj => obj.name === 'EnemySpawn');

        const pickRandomSpawns = (spawns, count) => {
            if (!spawns || spawns.length === 0) {
                return [];
            }
            const maxCount = Math.min(count, spawns.length);
            return Phaser.Utils.Array.Shuffle([...spawns]).slice(0, maxCount);
        };

        const selectedEnemySpawns = this.level === 2
            ? pickRandomSpawns(enemySpawnObjects, 5)
            : enemySpawnObjects;

        const finalEnemyPositions = selectedEnemySpawns.length > 0
            ? selectedEnemySpawns.map(obj => ({ x: obj.x * SCALE_FACTOR, y: obj.y * SCALE_FACTOR }))
            : [{ x: playerStart.x - 200 * SCALE_FACTOR, y: playerStart.y }, { x: playerStart.x + 200 * SCALE_FACTOR, y: playerStart.y + 200 * SCALE_FACTOR }];
        
        finalEnemyPositions.forEach((pos) => {
            // SELEÇÃO ALEATÓRIA DA SPRITESHEET DO INIMIGO
            const randomTextureKey = Phaser.Utils.Array.GetRandom(ENEMY_TEXTURE_KEYS);

            // CRIAÇÃO DO PIRATA PASSANDO A CHAVE ALEATÓRIA
            const rival = new Pirate(this, pos.x, pos.y, randomTextureKey);
            this.pirates.add(rival);
        });

    // --- 5. COLLECTIBLES ---
        const selectedKeySpawn = this.level === 2
            ? pickRandomSpawns(keySpawns, 1)[0]
            : keySpawns[0];

        const keySpawn = selectedKeySpawn
            ? { x: selectedKeySpawn.x * SCALE_FACTOR, y: selectedKeySpawn.y * SCALE_FACTOR }
            : getSpawnPoint('KeySpawn');

        const selectedCoinSpawns = this.level === 2
            ? pickRandomSpawns(coinSpawns, 10)
            : coinSpawns;

        const levelMaxScore = selectedCoinSpawns.length * 10;
        this.maxScore += levelMaxScore;

        this.treasure = this.physics.add.sprite(treasureSpawn.x, treasureSpawn.y, 'treasure_sim')
            .setImmovable(true)
            .setScale(SCALE_FACTOR)
            .setVisible(false); 
        this.keyItem = new Key(this, keySpawn.x, keySpawn.y); 
        this.coins = this.physics.add.group({
            allowGravity: false,
            immovable: true
        }); 

        selectedCoinSpawns.forEach(spawn => {
            const coin = new Coin(this, spawn.x * SCALE_FACTOR, spawn.y * SCALE_FACTOR);
            this.coins.add(coin);
        });
        
    // --- 6. LIGAÇÃO DE COLISÕES ---
        
        this.physics.add.collider(this.player, collisionGroup);
        this.physics.add.collider(this.pirates, collisionGroup);
        
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.treasure, this.checkTreasureAccess, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.collider(this.player, this.pirates, this.onCaught, null, this);

        // --- 6.1 VIRTUAL JOYSTICK (MOBILE) ---
        if (this.sys.game.device.input.touch) {
            const joyX = 110;
            const joyY = height - 110;
            this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: joyX,
                y: joyY,
                radius: 40,
                base: this.add.image(0, 0, 'joystick_base').setDisplaySize(120, 120).setScrollFactor(0),
                thumb: this.add.image(0, 0, 'joystick_thumb').setDisplaySize(52, 52).setScrollFactor(0),
                enable: true
            });

            this.joystickCursors = this.joystick.createCursorKeys();
        }


        // --- 7. CÂMARA ---
        this.cameras.main.setBounds(0, 0, map.widthInPixels * SCALE_FACTOR, map.heightInPixels * SCALE_FACTOR);
        this.cameras.main.startFollow(this.player); 
    this.cameras.main.setZoom(0.85); 


        // --- 8. HUD E MENSAGENS ---
        this.blockMessage = this.add.text(hudX, hudY - 50, 'É NECESSÁRIO ENCONTRAR A CHAVE!', { 
            fontSize: '32px',
            fill: '#FF3B30',
            stroke: '#1f2937',
            strokeThickness: 4,
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);

        const hudPadding = 10;
        const hudHeight = 44;
        const hudRadius = 8;

        const scorePanelWidth = 170;
        const scorePanelX = 20 + scorePanelWidth / 2;
        const scorePanelY = 20 + hudHeight / 2;
        this.add.rectangle(scorePanelX, scorePanelY, scorePanelWidth, hudHeight, 0x111827, 0.7)
            .setStrokeStyle(2, 0xfcd34d, 0.9)
            .setScrollFactor(0);

        this.add.image(scorePanelX - scorePanelWidth / 2 + 18, scorePanelY, 'coin')
            .setScale(1.1)
            .setScrollFactor(0);

    this.score = this.score ?? 0; 
        this.scoreText = this.add.text(scorePanelX + 16, scorePanelY - 12, `${this.score}`, {
            fontSize: '24px',
            fill: '#fcd34d',
            stroke: '#1f2937',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0);

        const levelPanelWidth = 200;
        const levelPanelX = width - 20 - levelPanelWidth / 2;
        const levelPanelY = 20 + hudHeight / 2;
        this.add.rectangle(levelPanelX, levelPanelY, levelPanelWidth, hudHeight, 0x111827, 0.7)
            .setStrokeStyle(2, 0xfcd34d, 0.9)
            .setScrollFactor(0);

        this.add.text(levelPanelX, levelPanelY - 12, `NÍVEL ${this.level}`, {
            fontSize: '24px',
            fill: '#fcd34d',
            stroke: '#1f2937',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0);

    } // Fim de create()

    // --- CRIAÇÃO DE ANIMAÇÕES ---
    createAnimations() {
        // Animações do Player (Capitão) - Frames 0-2 (up), 3-5 (right), 6-8 (down)
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('capitao', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('capitao', { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('capitao', { start: 6, end: 8 }), frameRate: 10, repeat: -1 });
        
        // ANIMAÇÕES PARA CADA TIPO DE INIMIGO
        ENEMY_TEXTURE_KEYS.forEach(key => {
            this.anims.create({ key: key + '_up', frames: this.anims.generateFrameNumbers(key, { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: key + '_right', frames: this.anims.generateFrameNumbers(key, { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: key + '_down', frames: this.anims.generateFrameNumbers(key, { start: 6, end: 8 }), frameRate: 10, repeat: -1 });
        });
    }
    
    // --- MÉTODOS DE COLEÇÃO E GAME STATE ---

    onCaught(player, pirate) { this.scene.start('Resultados', { score: this.score, maxScore: this.maxScore }); }
    collectCoin(player, coin) {
        if (coin.active) {
            coin.disableBody(true, true);
            this.score += 10;
            this.scoreText.setText(this.score);
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.sound.play('sfx_collect', { volume: 0.25 });
        }
    }
    
    collectKey(player, keyItem) {
        keyItem.disableBody(true, true);
        this.hasKey = true;
        this.blockMessage.setText('CHAVE ENCONTRADA! APANHE O TESOURO.');
        this.blockMessage.setVisible(true);
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
    this.sound.play('sfx_collect', { volume: 0.25 });
    }
    
    checkTreasureAccess(player, treasure) {
        if (this.hasKey) {
            treasure.disableBody(true, true);
            this.blockMessage.setVisible(false);
            const nextLevel = this.level + 1;
            if (nextLevel > 2) {
                this.scene.start('GameComplete', { score: this.score, maxScore: this.maxScore });
            } else {
                this.scene.start('LevelComplete', { nextLevel, score: this.score, maxScore: this.maxScore });
            }
        } else {
            this.blockMessage.setText('É NECESSÁRIO ENCONTRAR A CHAVE!'); this.blockMessage.setVisible(true);
        }
    }

    // --- UPDATE ---

    update() {
        // Movimento e IA por frame
        const activeCursors = this.getActiveCursors();
        this.player.updateMovement(activeCursors);
        
        this.pirates.getChildren().forEach(pirateRival => {
            pirateRival.update(this.player);
        });
        
        // LÓGICA DE OCULTAR MENSAGEM
        if (this.blockMessage.visible && !this.physics.overlap(this.player, this.treasure)) {
            this.blockMessage.setVisible(false);
        }

    } // Fim de update()

    getActiveCursors() {
        if (!this.joystickCursors) {
            return this.cursors;
        }

        return {
            left: { isDown: this.cursors.left.isDown || this.joystickCursors.left.isDown },
            right: { isDown: this.cursors.right.isDown || this.joystickCursors.right.isDown },
            up: { isDown: this.cursors.up.isDown || this.joystickCursors.up.isDown },
            down: { isDown: this.cursors.down.isDown || this.joystickCursors.down.isDown }
        };
    }
}