import Ember from 'ember';
import { GAME_DIFFICULTY, GAME_DIFFICULTY_CONFIGS } from 'minesweeper-game/lib/constants';

export default Ember.Component.extend({
  classNames: ['level-switcher'],

  levelSelections: Ember.computed(function () {
    return GAME_DIFFICULTY.reduce((list, difficulty) => {
      const levelConfig = GAME_DIFFICULTY_CONFIGS[difficulty];

      if (levelConfig) {
        const { gridSize, mines } = levelConfig;

        list.push({
          value: difficulty.toUpperCase(),
          text: `${difficulty} Board Size: ${gridSize}x${gridSize}, mines: ${mines}`
        });
      }
      return list;
    }, []);
  }),

  actions: {
    selectLevel() {
      const selectEl = this.$('#level-switcher__select');
      const level = selectEl.val();

      this.sendAction('switchLevel', level);
    }
  }
});
