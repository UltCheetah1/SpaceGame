// lasers.js

// Make LaserGroup globally accessible
class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    // Create a group of 20 lasers
    this.createMultiple({
      key: 'laser',
      quantity: 25,
      active: false,
      visible: false,
      setXY: { x: -100, y: -100 }
    });
  }

}

// Global function to fire a laser from the player
function fireLaser(laserGroup, player) {
  const laser = laserGroup.getFirstDead(false);

  // Check if there is an available laser
  if (laser) {
    laser.setActive(true);
    laser.setVisible(true);
    laser.enableBody(true, player.x, player.y - 20, true, true);
    // Set laser to move upward
    laser.setVelocityY(-300);
  }
}

// Global function to deactivate lasers that go out of bounds
function checkAndDeactivateOutOfBoundsLasers(laserGroup, scene) {
laserGroup.getChildren().forEach(laser => {
if (laser.y < 0 || laser.y > scene.game.config.height) {
laser.setActive(false);
laser.disableBody(true, true);
laser.setVelocityY(0);
}
});
}

// Make both globally accessible
window.LaserGroup = LaserGroup;
window.fireLaser = fireLaser;
