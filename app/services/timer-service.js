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
    this.set('timerActive', false);
    this.set('hasTimedOut', false);
  },

  start() {
    this.set('timerActive', true);
    this.incElapsedTime();
  },

  stop() {
    this.set('timerActive', false);
  },

  incElapsedTime() {
    if (this.get('timerActive')) {
      this.set('elapsedTime', this.get('elapsedTime') + 1);

      if (this.get('elapsedTime') >= TIMER_TIMEOUT) {
        this.set('hasTimedOut', true);
        this.stopTimer();
      } else {
        Ember.run.later(() => {
          this.incElapsedTime();
        }, 1000);
      }
    }
  },
});
