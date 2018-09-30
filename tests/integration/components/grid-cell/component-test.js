import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | grid cell', function() {
  setupComponentTest('grid-cell', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{grid-cell}}`);
    expect(this.$()).to.have.length(1);
  });
});
