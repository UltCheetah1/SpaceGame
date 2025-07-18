// enemies.js
// Make sure to preload 'enemy' image in your main scene
class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    // Create a group of 25 enemies
    this.createMultiple({
      key: 'enemy',
      quantity: 25,
      active: false,
      visible: false,
      
      // position offscreen initially
      setXY: { x: -100, y: -100 } 
    });
  }
}

// Global function to move an enemy
function move(enemy, scene) {
  const x = Phaser.Math.Between(50, scene.scale.width - 50);
  const y = -50;
  const velocityX = Phaser.Math.Between(-50, 50);
  const velocityY = Phaser.Math.Between(100, 200);

  // Set enemy position and velocity
  enemy.setPosition(x, y);
  enemy.setActive(true);
  enemy.setVisible(true);
  enemy.enableBody(true, x, y, true, true);
  enemy.setVelocity(velocityX, velocityY);
}

// Global function to recycle enemies that go out of bounds
function checkEnemies(enemyGroup, scene) {
  enemyGroup.children.each(enemy => {
    if (enemy.active && enemy.y > scene.scale.height + 50) {
      move(enemy, scene);
    }
  });
}

// Make globally accessible
window.EnemyGroup = EnemyGroup;
window.move = move;
window.checkEnemies = checkEnemies;
