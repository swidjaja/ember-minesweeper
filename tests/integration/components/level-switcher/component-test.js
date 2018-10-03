import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

const SELECTORS = {
  difficultySelect: '#level-switcher__select',
  selectDifficultyBtn: '.level-switcher__btn'
};

describe('Integration | Component | level switcher', function() {
  setupComponentTest('level-switcher', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{level-switcher}}`);
    expect(this.$()).to.have.length(1);
  });

  it('has select element to choose game difficulty', function () {
    this.render(hbs`{{level-switcher}}`);
    expect(this.$(SELECTORS.difficultySelect)).to.have.length(1);
  });

  it('has button to change game difficulty', function () {
    this.render(hbs`{{level-switcher}}`);
    expect(this.$(SELECTORS.selectDifficultyBtn)).to.have.length(1);
  });
});
