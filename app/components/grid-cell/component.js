import Ember from 'ember';
import { CELL_ACTION_TYPES, GAME_STATUS } from 'minesweeper-game/lib/constants'

export default Ember.Component.extend({
  classNames: ['grid-cell', 'focusable'],
  classNameBindings: ['gridCellRevealStateClass', 'neighborMineCountClass'],
  tagName: 'button',
  attributeBindings: ['_ariaLabel:aria-label'],
  isRevealed: Ember.computed.alias('cellState.isRevealed'),
  isFlagged: Ember.computed.alias('cellState.isFlagged'),
  hasMine: Ember.computed.alias('cellState.hasMine'),
  neighborMineCellCount: Ember.computed.alias('cellState.neighborMineCellCount'),

  isLost: Ember.computed('gameStatus', function () {
    const gameStatus = this.get('gameStatus');

    return gameStatus === GAME_STATUS.LOST || 
      gameStatus === GAME_STATUS.OUT_OF_TIME;
  }),

  gridCellRevealStateClass: Ember.computed('isLost', 'isRevealed', 'isFlagged', function () {
    const isLost = this.get('isLost');
    const isRevealed = this.get('isRevealed');
    const isFlagged = this.get('isFlagged');
    const hasMine = this.get('hasMine');

    if (isLost && hasMine) {
      return 'grid-cell--mine-stepped';
    } else if (isRevealed) {
      return 'grid-cell--revealed';
    } else if (isFlagged) {
      return 'grid-cell--flagged';
    }

    return '';
  }),

  neighborMineCountClass: Ember.computed('neighborMineCellCount', 'hasMine', function () {
    const neighborMineCellCount = this.get('neighborMineCellCount');
    const hasMine = this.get('hasMine');

    if (neighborMineCellCount && !hasMine) {
      return `grid-cell--${neighborMineCellCount}mines`;
    }

    return '';
  }),

  _ariaLabel: 'Reveal Cell',

  notifyCellClick(actionType) {
    const cellState = this.get('cellState');

    this.sendAction('gridCellClicked', { cellState, actionType });
  },

  // Keyboard user can flag the cell by pressing enter/space-bar and alt key 
  click(event) {
    this.notifyCellClick(event.altKey ? CELL_ACTION_TYPES.FLAG : CELL_ACTION_TYPES.REVEAL);
  },

  // Mouse user can use right click to flag a cell
  contextMenu(event) {
    this.notifyCellClick(CELL_ACTION_TYPES.FLAG);

    event.preventDefault();
  }
});
