class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add objects to existing scene
        scene.add.existing(this);

        // speed rocket moves at
        this.moveSpeed = 2;
    }

    update() {
        if (keyLEFT.isDown) {
            this.x -= this.moveSpeed;
        }
        if (keyRIGHT.isDown) {
            this.x += this.moveSpeed;
        }
    }
}