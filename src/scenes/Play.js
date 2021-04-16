class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/sprites
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    
        // load audio
        this.load.audio('sfx_select', 'assets/blip_select12.wav');
        this.load.audio('sfx_explosion', 'assets/explosion38.wav');
        this.load.audio('sfx_rocket', 'assets/rocket_shot.wav');
    
    }

    create() {
        // starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // rocket
        this.p1Rocket = new Rocket(
            this,
            game.config.width / 2,
            game.config.height - borderUISize - borderPadding,
            'rocket'
        ).setOrigin(0.5, 0);

        // enemy ship1
        this.ship1 = new Ship(
            this,
            game.config.width + borderUISize*6, 
            borderUISize*4, 
            'spaceship', 
            0, 
            30
        ).setOrigin(0, 0);

        // enemy ship2
        this.ship2 = new Ship(
            this,
            game.config.width + borderUISize*3,
            borderUISize*5 + borderPadding*2,
            'spaceship',
            0,
            20
        ).setOrigin(0, 0);


        // enemy ship3
        this.ship3 = new Ship(
            this,
            game.config.width,
            borderUISize*6 + borderPadding*4,
            'spaceship',
            0,
            10
        ).setOrigin(0, 0);


        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2,0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        
        // keyboard input
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // explosion animation
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, this.scoreConfig);
 
       // 60-second timer
        this.gameOver = false;

       scoreConfig.fixedWidth = 0;
       this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
           this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
           this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for menu', scoreConfig).setOrigin(0.5);
           this.gameOver = true;
       }, null, this);
    }

    update() {
        // check for key input duriing restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
        }
        

        // collision code
        if (this.checkCollision(this.p1Rocket, this.ship1)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship2)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }
        if (this.checkCollision(this.p1Rocket, this.ship3)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
        rocket.x + rocket.width > ship.x &&
        rocket.y < ship.y + ship.height &&
        rocket.y + rocket.height > ship.y) {
            return true;
        }
        return false;
    }

    shipExplode(ship) {
        // make ship invisible
        ship.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explosion');
        boom.on('animationcomplete', () => {
            ship.reset();
            boom.destroy();
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // play audio for explosion
        this.sound.play('sfx_explosion');
    }
}
// ERROR: POINTS NOT BEING ADDED CORRECTLY