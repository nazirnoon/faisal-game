var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false // set to true to see physics debug lines
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var cursors;
var star;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('dude', 'assets/student.png'); // Load as a single image now
    this.load.image('star', 'assets/book.png')
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    this.add.image(512, 512, 'sky');

    platforms = this.physics.add.staticGroup();

    // Calculate the number of tiles needed to cover the canvas width
    const groundWidth = this.textures.get('ground').getSourceImage().width;
    const count = Math.ceil(1024 / groundWidth)+1; // Assuming your game width is 800

    for (let i = 0; i < count; i++) {
        platforms.create(i * groundWidth, 920 , 'ground'); // Position based on tile size
    }
    platforms.create(850, 800, 'ground'); // Floating platform
    platforms.create(350, 620, 'ground'); // Floating platform
    platforms.create(0, 500, 'ground'); // Floating platform
    platforms.create(300, 250, 'ground'); // Floating platform

    player = this.physics.add.sprite(100, 550, 'dude').setOrigin(0.5,1)
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    star = this.physics.add.staticSprite(300, 130, 'star').setScale(0.15);
    
    // Adjust the physics body of the star to match the scale of the sprite
    // Ensure these values match the actual size of your sprite's frame after scaling
    star.body.setSize(star.width * 0.15, star.height * 0.15);
    
    // Center the body on the sprite if using a static sprite
    star.body.setOffset(
        (star.width - (star.width * 0.15)) / 2,
        (star.height - (star.height * 0.15)) / 2
    );

    this.physics.add.overlap(player, star, collectStar, null, this);
    this.physics.add.collider(player, platforms);

}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-260);
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-850); // adjust jump strength as needed
        console.log('Jumping!');
    }

}

function collectStar (player, star) {
    console.log("collect star triggered")
    star.disableBody(true, true); // remove the star

    // Display "Game Won" text
    var gameWonText = this.add.text(512, 512, 'Game Won!', { fontSize: '128px', fill: '#FFFF' });
    gameWonText.setOrigin(0.5, 0.5); // Center the text on screen
}