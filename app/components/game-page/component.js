import Ember from 'ember';
import { GAME_STATUS } from 'minesweeper-game/lib/constants';

export default Ember.Component.extend({
  classNames: ['game-page'],
  gameService: Ember.inject.service(),
  gameStatus: Ember.computed.oneWay('gameService.gameStatus'),
  gridCells: Ember.computed.oneWay('gameService.gridCells'),
  notificationText: '',

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

  gameStatusObserver: Ember.observer('gameService.gameStatus', function () {
    const gameStatus = this.get('gameStatus');

    if (gameStatus === GAME_STATUS.WIN ||
        gameStatus === GAME_STATUS.LOST || 
        gameStatus === GAME_STATUS.OUT_OF_TIME) {
      this.updateNotificationText(gameStatus === GAME_STATUS.WIN ?
        'Congratulations! You have win this game' :
        'Sorry! But you lose the game');
      // Move focus to restart button so that screen reader users can immediately restart
      const restartButton = this.$('.game-page__reset-btn');
      restartButton.focus();
    } else if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      this.updateNotificationText('The game has started');
    }
  }),

  elapsedTime: Ember.computed('gameService.elapsedTime', function () {
    const elapsedTime = '' + this.get('gameService.elapsedTime');

    return elapsedTime.padStart(3, '0');
  }),

  didInsertElement(...args) {
    this._super(args);

    Ember.run.scheduleOnce('afterRender', this, this.setupGlobalKeyHandler);
  },

  restartGame() {
    const gameService = this.get('gameService');

    gameService.reset();
  },

  setupGlobalKeyHandler() {
    const globalKeyHandler = (event) => {
      // alt + s will restart the game
      if (event.keyCode === 83 && event.altKey) {
        this.restartGame();
      }
    }
    this.set('_globalKeyHandler', globalKeyHandler);

    Ember.$(document).on('keydown', this.get('_globalKeyHandler'));
  },

  willDestroyElement(...args) {
    this._super(args);

    const globalKeyHandler = this.get('_globalKeyHandler');

    Ember.$(document).off('keydown', globalKeyHandler);
  },

  /**
   * Update the notification panel text so that screen reader can reads out the new text
   * @param  {String} text the new text that we want screen reader to read out
   * TODO: Need to investigate why this seems to only work on Safari Mac OS so far
   */
  updateNotificationText(text) {
    this.set('notificationText', text);
  },

  actions: {
    gridCellClicked(payload) {
      const gameService = this.get('gameService');

      gameService.updateCellState(payload);
    },

    restartGame() {
      this.restartGame();
    }
  }
});
