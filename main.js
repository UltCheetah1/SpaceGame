// main.js

// Initialize Phaser
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

// Global variables
let player;
let playerSpeed = 200;
let cursors;
let keys;
let spaceKey;
let lasers;
let enemies;
let emitter;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let enemiesDestroyedSound;
let playerDestroyedSound;
let laserSound;

// Load assets
function preload() {
  this.load.image("player", "assets/player.png");
  this.load.image("laser", "assets/laser.png");
  this.load.image("enemy", "assets/enemy.png");
  this.load.atlas("explosion", "assets/explosion.png", "assets/explosion.json");
  this.load.audio("laserSound", "assets/sounds/laser_player.ogg");
  this.load.audio("playerDestroyed", "assets/sounds/player_destroyed.ogg");
  this.load.audio("enemyDestroyed", "assets/sounds/enemy_destroyed.ogg");
}

// Create player and set up keyboard input
function create() {
  player = this.physics.add.sprite(
    config.width / 2,
    config.height - 0,
    "player",
  );
  player.setScale(2);
  playerDestroyedSound = this.sound.add("playerDestroyed");

  // Increase the size of the player ship
  player.setCollideWorldBounds(true);

  // Keyboard input
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    D: Phaser.Input.Keyboard.KeyCodes.D,
  });
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Create laser group
  lasers = new LaserGroup(this);
  laserSound = this.sound.add("laserSound");

  // Create enemy group
  enemies = new EnemyGroup(this);
  enemies.getChildren().forEach((enemy) => {
    move(enemy, this);
  });
  enemiesDestroyedSound = this.sound.add("enemyDestroyed");

  // Create particle emitter for explosions
  emitter = this.add.particles(0, 0, "explosion", {
    frame: ["red", "yellow", "green", "blue", "purple"],
    lifespan: 1000,
    speed: { min: 50, max: 100 },
    emitting: false,
  });

  // Set up collision between lasers and enemies
  this.physics.add.overlap(enemies, lasers, (enemy, laser) => {
    laserCollision(enemy, laser, this);
    enemiesDestroyedSound.play();
  });
  // Set up collision between player and enemies
  this.physics.add.collider(player, enemies, (player, enemy) => {
    playerEnemyCollision(player, enemy, this);
  });

  // Display score
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#FFFF00",
  });
  // Display lives
  livesText = this.add.text(15, 40, 'Lives: ' + lives, {
    font: '20px',
    fill: '#ffffff'
  });
}
// Reset horizontal velocity
function update() {
  player.setVelocityX(0);

  // Move left
  if (cursors.left.isDown || keys.A.isDown) {
    player.setVelocityX(-playerSpeed);
  }
  // Move right
  else if (cursors.right.isDown || keys.D.isDown) {
    player.setVelocityX(playerSpeed);
  }

  // Fire laser when space is pressed unless lives are 0
  if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    if(lives > 0){
    laserSound.play();
    fireLaser(lasers, player);
  }
}
  // Deactivate lasers that go out of bounds
  checkAndDeactivateOutOfBoundsLasers(lasers, this);
  checkEnemies(enemies, this);
}

// Global function to handle laser hitting an enemy
function laserCollision(enemy, laser, scene) {
  emitter.explode(40, enemy.x, enemy.y);
  laser.setActive(false);
  laser.setVisible(false);
  laser.disableBody(true, true);
  move(enemy, scene);
  // Increase score when an enemy is hit
  score += 10;
  scoreText.setText("Score: " + score);
}
// Global function to handle player colliding with enemy
function playerEnemyCollision(player, enemy, scene) {
  playerDestroyedSound.play();
  emitter.explode(40, player.x, player.y);
  emitter.explode(40, player.x, player.y);
  emitter.explode(40, player.x, player.y);
  enemies.getChildren().forEach(enemy => {
    move(enemy, scene);
  });

// Decrement lives when player collides with an enemy
  lives--;
  livesText.setText('Lives: ' + lives); 
  // Update the displayed lives
  if (lives <= 0) {
// Display game over message
      const gameOverText = scene.add.text(300, 400, 'Game OVER', { fontSize: '48px', fill: '#FF0000' });
    gameOverText.setOrigin(0.5);
// Make the player inactive, invisible, and disable its body
    player.setActive(false);
    player.setVisible(false);
    player.disableBody(true, true);

  }
}