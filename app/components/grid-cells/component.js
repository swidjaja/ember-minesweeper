import Ember from 'ember';
// import { CELL_ACTION_TYPES } from 'minesweeper-game/lib/constants'

export default Ember.Component.extend({
  classNames: ['grid-cells'],

  actions: {
    gridCellClicked(payload) {
      this.sendAction('gridCellClicked', payload);
    }
  }
});
