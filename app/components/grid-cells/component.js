import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['grid-cells'],

  init(...args) {
    this._super(args);

    const gridCells = this.get('gridCells');

    this._size = gridCells.length;
  },

  isValidCell(rowIdx, columnIdx) {
    const size = this.get('_size');

    return rowIdx >= 0 && rowIdx < size && 
      columnIdx >= 0 && columnIdx < size;
  },

  actions: {
    gridCellClicked(payload) {
      this.sendAction('gridCellClicked', payload);
    },

    moveByKeyboard(payload) {
      const { direction, row, column } = payload;
      let newRow = row;
      let newColumn = column;

      switch(direction) {
        case 'down':
          newRow += 1;
          break;
        case 'up':
          newRow -= 1;
          break;
        case 'left':
          newColumn -= 1;
          break;
        case 'right':
          newColumn += 1;
          break;
      }
      if (this.isValidCell(newRow, newColumn)) {
        const selector = `.grid-cell[data-row="${newRow}"][data-column="${newColumn}"]`;
        const nextCellToFocus = this.$(selector);

        if (nextCellToFocus.length) {
          nextCellToFocus.focus();
        }
      }
    }
  }
});
