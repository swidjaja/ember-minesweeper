import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['grid-cells'],

  actions: {
    gridCellClicked(payload) {
      this.sendAction('gridCellClicked', payload);
    }
  }
});
