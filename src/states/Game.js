/* globals __DEV__ */
import Phaser from 'phaser'

import levels from '../levels'

export default class extends Phaser.State {

  init (currentLevel) {
    this.currentLevel = currentLevel
    this.level = levels[this.currentLevel]
    this.blockSize = this.level.blockSize || 20
  }
  preload () {
    // create a new player bitmap data object
    this.playerSpr = game.add.bitmapData(this.blockSize, this.blockSize)

    // draw to the canvas context like normal
    this.playerSpr.ctx.beginPath()
    this.playerSpr.ctx.rect(0, 0, this.blockSize, this.blockSize)
    this.playerSpr.ctx.fillStyle = '#ff0000'
    this.playerSpr.ctx.fill()

    // create a new wall bitmap data object
    this.wallSpr = game.add.bitmapData(this.blockSize, this.blockSize)

    // draw to the canvas context like normal
    this.wallSpr.ctx.beginPath()
    this.wallSpr.ctx.rect(0, 0, this.blockSize, this.blockSize)
    this.wallSpr.ctx.fillStyle = '#000080'
    this.wallSpr.ctx.fill()

    // create a new coin bitmap data object
    this.coinSpr = game.add.bitmapData(this.blockSize, this.blockSize)

    // draw to the canvas context like normal
    this.coinSpr.ctx.beginPath()
    this.coinSpr.ctx.rect(0, 0, this.blockSize, this.blockSize)
    this.coinSpr.ctx.fillStyle = '#ffff00'
    this.coinSpr.ctx.fill()
  }

  create () {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db'

    // Start the Arcade physics system (for movements and collisions)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Add the physics engine to all game objects
    game.world.enableBody = true

    this.walls = game.add.group()
    this.coins = game.add.group()

    
    // use the bitmap data as the texture for the sprite
    this.player = game.add.sprite(this.level.start.x || this.blockSize, this.level.start.y || game.height - 2 * this.blockSize, this.playerSpr)

    // Variable to store the arrow key pressed
    this.cursor = game.input.keyboard.createCursorKeys()

    // Gravitiy switcher
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.spaceKey.onDown.add(() => {
      // Switch gravity
      this.player.body.gravity.y = this.player.body.gravity.y * -1
    });

    // Add gravity to make it fall
    this.player.body.gravity.y = 600

    // Generate level from map
    this.levelGenerator()
  }

  render () {
  }

  update() {
    // Make the player and the walls collide
    game.physics.arcade.collide(this.player, this.walls)

    // Call the 'takeCoin' function when the player takes a coin
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this)

    // Move the player when an arrow key is pressed
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200
    }
    else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200
    }
    else {
      this.player.body.velocity.x = 0
    }

    // Make the player jump if he is touching the ground
    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -200
    }
  }

  levelGenerator() {
    // Render borders
    const widthTiles = game.width / this.blockSize
    const heightTiles = game.height / this.blockSize
    let wall = null
    let coin = null

    // Create the level by going through the array
    for (let i = 0; i < this.level.map.length; i++) {
        for (let j = 0; j < this.level.map[i].length; j++) {

            // Create a wall and add it to the 'walls' group
            if (this.level.map[i][j] === 'x') {
              this.addWallTile(this.wallSpr, j * this.blockSize, i * this.blockSize)
            }

            // Create a coin and add it to the 'coins' group
            else if (this.level.map[i][j] == 'o') {
              this.addCoinTile(this.coinSpr, j * this.blockSize, i * this.blockSize)
            }
        }
    }
  }

  addWallTile(sprite, x, y) {
    const wall = game.add.sprite(x, y, sprite)
    wall.body.immovable = true

    this.walls.add(wall)
  }

  addCoinTile(sprite, x, y) {
    this.coins.add(game.add.sprite(x, y, sprite))
  }

  takeCoin(player, coin) {
    coin.kill()
    this.coins.remove(coin)

    if (!this.coins.length) {
      game.state.start('Menu', true, false, this.currentLevel + 1)
    }
  }
}
