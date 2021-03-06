import Ember from 'ember';
import { 
  GAME_STATUS,
  DEFAULT_RESTART_BTN_LABEL,
  GAME_DIFFICULTY_CONFIGS,
  KEY_CODES
} from 'minesweeper-game/lib/constants';

export default Ember.Component.extend({
  classNames: ['game-page'],
  gameService: Ember.inject.service(),
  gameStatus: Ember.computed.oneWay('gameService.gameStatus'),
  gridCells: Ember.computed.oneWay('gameService.gridCells'),
  gameLevel: Ember.computed.oneWay('gameService.gameLevel'),
  elapsedTime: Ember.computed.oneWay('gameService.elapsedTime'),
  minesCount: Ember.computed.oneWay('gameService.minesCount'),
  restartButtonLabel: DEFAULT_RESTART_BTN_LABEL,

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

  gameStatusObserver: Ember.observer('gameStatus', function () {
    const gameStatus = this.get('gameStatus');

    if (gameStatus === GAME_STATUS.WIN ||
        gameStatus === GAME_STATUS.LOST || 
        gameStatus === GAME_STATUS.OUT_OF_TIME) {

      // Admittedly, this is a bit weird logic. What I do here is basically
      // change the button label when player lost/win the game. This is done so that
      // SR will read 'Congratulations! You have win this game Click to restart game'
      // or 'Sorry! But you lose the game Click to restart game'. 
      this.updateRestartButtonLabel(gameStatus === GAME_STATUS.WIN ?
        'Congratulations! You have win this game' :
        'Sorry! But you lose the game');
      const restartButton = this.$('.game-page__reset-btn');

      restartButton.on('blur', () => {
        restartButton.off('blur');
        this.updateRestartButtonLabel();
      });
      // Move focus to restart button so that screen reader or keyboard users
      //  can immediately restart
      restartButton.focus();
    }
  }),

  didInsertElement(...args) {
    this._super(args);

    Ember.run.scheduleOnce('afterRender', this, this.setupGlobalKeyHandler);
  },

  restartGame() {
    this.set('restartButtonLabel', DEFAULT_RESTART_BTN_LABEL);
    const gameService = this.get('gameService');

    gameService.reset();
  },

  jumpToLevelSelect() {
    const levelSelect = this.$('#level-switcher__select');

    levelSelect.focus();
  },

  jumpToFirstCell() {
    const firstCell = this.$('.grid-cell[data-row="0"][data-column="0"]');

    firstCell.focus();
  },

  onGridCellClicked(payload) {
    const gameService = this.get('gameService');

    gameService.updateCellState(payload);
  },

  setupGlobalKeyHandler() {
    const globalKeyHandler = (event) => {
      if (event.altKey) {
        // alt + s will restart the game
        if (event.keyCode === KEY_CODES.CHARACTER_S) {
          this.restartGame();
        // alt + t will jump to level select
        } else if (event.keyCode === KEY_CODES.CHARACTER_T) {
          this.jumpToLevelSelect();
        // alt + f will jump to first cell
        } else if (event.keyCode === KEY_CODES.CHARACTER_F) {
          this.jumpToFirstCell();
        }
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

  updateRestartButtonLabel(text = '') {
    this.set('restartButtonLabel', `${text} ${DEFAULT_RESTART_BTN_LABEL}`);
  },

  actions: {
    gridCellClicked(payload) {
      this.onGridCellClicked(payload)
    },

    restartGame() {
      this.restartGame();
    },

    switchLevel(level) {
      const gameService = this.get('gameService');
      const configs = GAME_DIFFICULTY_CONFIGS[level];

      if (configs) {
        gameService.switchLevel(level);
      }
    }
  }
});
