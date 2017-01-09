/* globals __DEV__ */
import Phaser from 'phaser';

import GameState from './Game';
import levels from '../levels';

export default class extends Phaser.State {

  init (level) {
    this.level = level || 0;
    this.success = false;

    if (level >= levels.length) {
      this.success = true;
      this.level = 0;
    }
  }
  preload () {
  }
  create () {
    // Set the background color to blue
    game.stage.backgroundColor = '#3598db';

    const label = this.success ? 'Finish!' : ('level: ' + levels[this.level].name || (this.level + 1))
    const text = game.add.text(game.world.centerX, game.world.centerY, label, { font: "65px Arial", fill: "#ff0044", align: "center" });

    text.anchor.set(0.5);

    text.inputEnabled = true;

    text.events.onInputUp.add(() => {
      game.state.add('level_' + (this.level + 1), GameState, false);

      game.state.start('level_' + (this.level + 1), true, false, this.level)
    });
  }
}
