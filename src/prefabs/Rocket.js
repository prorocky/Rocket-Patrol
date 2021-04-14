class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add objects to existing scene
        scene.add.existing(this);

        // speed rocket moves at
        this.moveSpeed = 2;
        this.isFiring = false;

        // add rocket sfx
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        if (this.isFiring) {
            this.y -= this.moveSpeed;

            if (this.y < borderUISize * 3) {
                this.y = game.config.height - borderUISize - borderPadding;
                this.isFiring = false;
            }
            if (keyF.isUp) {
                this.isFiring = false;
            }
        } else {

            // rocket controls (left and right)
            if (keyLEFT.isDown) {
                this.x -= this.moveSpeed;
            }
            if (keyRIGHT.isDown) {
                this.x += this.moveSpeed;
            }

            if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();
            }
        }
        // Make sure rocket stays in border of screen
        this.x = Phaser.Math.Clamp(this.x, borderUISize + borderPadding, game.config.width - borderUISize - borderPadding);
    }

    reset() {
        this.y = game.config.height - borderUISize - borderPadding;
        this.isFiring = false;
    }
}