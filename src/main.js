import 'pixi'
import 'p2'
import Phaser from 'phaser'

import GameState from './states/Game'
import MenuState from './states/Menu'

class Game extends Phaser.Game {

  constructor () {
    super(500, 200, Phaser.AUTO, 'content', null)

    this.state.add('Menu', MenuState, false)

    this.state.start('Menu')
  }
}

window.game = new Game()
