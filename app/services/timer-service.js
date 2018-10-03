import Ember from 'ember';
import { 
  TIMER_TIMEOUT
} from 'minesweeper-game/lib/constants';

export default Ember.Service.extend({
  init(...args) {
    this._super(args);
    this.reset();
  },

  reset() {
    this.set('elapsedTime', 0);
    this.set('hasTimedOut', false);
  },

  start() {
    this.set('_runningTimer', this.incElapsedTime());
  },

  stop() {
    Ember.run.cancel(this.get('_runningTimer'));
  },

  incElapsedTime() {
    this.set('elapsedTime', this.get('elapsedTime') + 1);
    if (this.get('elapsedTime') >= TIMER_TIMEOUT) {
      this.set('hasTimedOut', true);
      this.stop();
    } else {
      return Ember.run.later(() => {
        this.set('_runningTimer', this.incElapsedTime());
      }, 1000);
    }
  }
});
