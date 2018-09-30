import Ember from 'ember';
// import { CELL_ACTION_TYPES } from 'minesweeper-game/lib/constants'

export default Ember.Component.extend({
  classNames: ['grid-cells'],

  // updateNotification(actionType) {
  //   const notificationPanel = this.$('.notification-panel');

  //   notificationPanel.text('');
  //   notificationPanel.css('display', 'block');
  //   if (actionType === CELL_ACTION_TYPES.REVEAL) {
  //     notificationPanel.text('Cell Revealed');
  //   } else if (actionType === CELL_ACTION_TYPES.FLAGGED) {
  //     notificationPanel.text('Cell Flagged');
  //   }
  // },

  actions: {
    gridCellClicked(payload) {
      this.sendAction('gridCellClicked', payload);
      // this.updateNotification(CELL_ACTION_TYPES.REVEAL);
    }
  }
});
