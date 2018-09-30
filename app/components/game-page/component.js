import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-page'],
  gameService: Ember.inject.service(),
  gameStatus: Ember.computed.oneWay('gameService.gameStatus'),
  gridCells: Ember.computed.oneWay('gameService.gridCells'),

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
