import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

const SELECTORS = {
  gridCellColumn: '.grid-cells__column',
  gridCell: '.grid-cell'
}

describe('Integration | Component | grid cells', function() {
  setupComponentTest('grid-cells', {
    integration: true
  });

  it('renders', function() {
    this.render(hbs`{{grid-cells}}`);
    expect(this.$()).to.have.length(1);
  });

  it('renders correct number of columns', function () {
    const gridCells = [
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
    ];
    this.set('gridCells', gridCells);
    this.render(hbs`{{grid-cells gridCells=gridCells}}`);
    expect(this.$(SELECTORS.gridCellColumn)).to.have.length(3);
  });

  it('renders correct number of cells', function () {
    const gridCells = [
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
      [{ cellState: {} }, { cellState: {} }, { cellState: {} }],
    ];
    this.set('gridCells', gridCells);
    this.render(hbs`{{grid-cells gridCells=gridCells}}`);
    expect(this.$(SELECTORS.gridCell)).to.have.length(9);
  });
});
