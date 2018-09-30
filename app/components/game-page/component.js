import Ember from 'ember';
import { GAME_STATUS } from 'minesweeper-game/lib/constants';

export default Ember.Component.extend({
  classNames: ['game-page'],
  gameService: Ember.inject.service(),
  gameStatus: Ember.computed.oneWay('gameService.gameStatus'),
  gridCells: Ember.computed.oneWay('gameService.gridCells'),

  restartButtonClass: Ember.computed('gameService.gameStatus', function () {
    const gameStatus = this.get('gameStatus');

    switch (gameStatus) {
      case GAME_STATUS.NOT_STARTED:
      case GAME_STATUS.IN_PROGRESS:
        return 'bg-happy_face';
      case GAME_STATUS.LOST:
      case GAME_STATUS.OUT_OF_TIME:
        return 'bg-sad_face';
      case GAME_STATUS.WIN:
        return 'bg-cool_face';
      default: 
        return '';
    }
  }),

  elapsedTime: Ember.computed('gameService.elapsedTime', function () {
    const elapsedTime = '' + this.get('gameService.elapsedTime');

    return elapsedTime.padStart(3, '0');
  }),

  actions: {
    gridCellClicked(payload) {
      const gameService = this.get('gameService');

      gameService.updateCellState(payload);
    },

    restartGame() {
      const gameService = this.get('gameService');

      gameService.reset();
    }
  }
});
