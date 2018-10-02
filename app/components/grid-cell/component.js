import Ember from 'ember';
import { CELL_ACTION_TYPES, GAME_STATUS, KEY_CODES } from 'minesweeper-game/lib/constants'

export default Ember.Component.extend({
  classNames: ['grid-cell', 'focusable'],
  classNameBindings: ['gridCellRevealStateClass', 'neighborMineCountClass'],
  tagName: 'button',
  attributeBindings: [
    '_ariaLabel:aria-label', 
    'isRevealed:disabled',
    '_row:data-row',
    '_column:data-column'
  ],
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

  _ariaLabel: Ember.computed('isRevealed', 'isFlagged', 'neighborMineCellCount', function () {
    const isRevealed = this.get('isRevealed');
    const isFlagged = this.get('isFlagged');
    const neighborMineCellCount = this.get('neighborMineCellCount');
    const { row, column } = this.get('cellState');
    const label = [`row ${row} column ${column}`];

    if (isRevealed) {
      label.push('revealed');
      if (neighborMineCellCount) {
        label.push(`${neighborMineCellCount} mines count`);
      }
    } else if (isFlagged) {
      label.push('flagged');
    } else {
      label.push('not revealed');
    }

    return label.join(' ');
  }),

  _row: Ember.computed(function () {
    const cellState = this.get('cellState');

    return cellState.row;
  }),

  _column: Ember.computed(function () {
    const cellState = this.get('cellState');

    return cellState.column;
  }),

  notifyCellClick(actionType) {
    const cellState = this.get('cellState');

    this.sendAction('gridCellClicked', { cellState, actionType });
    console.error(document.activeElement);
    Ember.$(document.activeElement).focus();
  },

  // Keyboard user can flag the cell by pressing enter/space-bar and alt key 
  click(event) {
    this.notifyCellClick(event.altKey ? CELL_ACTION_TYPES.FLAG : CELL_ACTION_TYPES.REVEAL);
  },

  // Mouse user can use right click to flag a cell
  contextMenu(event) {
    this.notifyCellClick(CELL_ACTION_TYPES.FLAG);

    event.preventDefault();
  },

  keyDown(event) {
    const keyCode = event && event.keyCode;
    let direction = '';

    switch (keyCode) {
      case KEY_CODES.ARROW_UP:
        direction = 'up';
        break;
      case KEY_CODES.ARROW_LEFT:
        direction = 'left';
        break;
      case KEY_CODES.ARROW_RIGHT:
        direction = 'right';
        break;
      case KEY_CODES.ARROW_DOWN:
        direction = 'down';
        break;
      default:
        break;
    }

    if (direction) {
      const { row, column } = this.get('cellState');

      this.sendAction('moveByKeyboard', { row, column, direction });
      event.preventDefault();
    }
  }
});
