import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

const SELECTORS = {
  gridCell: '.grid-cell',
  cellWithMineStepped: '.grid-cell--mine-stepped',
  cellRevealed: '.grid-cell--revealed',
  cellIsFlagged: '.grid-cell--flagged',
  cell1MineNeighbor: '.grid-cell--1mines',
  cell2MineNeighbor: '.grid-cell--2mines',
  cell3MineNeighbor: '.grid-cell--3mines',
  cell4MineNeighbor: '.grid-cell--4mines',
  cell5MineNeighbor: '.grid-cell--5mines',
  cell6MineNeighbor: '.grid-cell--6mines',
  cell7MineNeighbor: '.grid-cell--7mines',
  cell8MineNeighbor: '.grid-cell--8mines'
};

const assertNeigborMinesCountClass = () => {
  [1, 2, 3, 4, 5, 6, 7, 8].forEach((mineCount) => {
    it(`uses correct neighbor mines count class for ${mineCount} mines count`, function () {
      const cellState = { neighborMineCellCount: mineCount, hasMine: false };
      this.set('cellState', cellState);
      this.render(hbs`{{grid-cell cellState=cellState}}`);
      expect(this.$(SELECTORS[`cell${mineCount}MineNeighbor`])).to.have.length(1);
    });
  });
};

describe('Integration | Component | grid cell', function() {
  setupComponentTest('grid-cell', {
    integration: true
  });

  it('renders', function () {
    const cellState = { row: 0, column: 0 };
    this.set('cellState', cellState);
    this.render(hbs`{{grid-cell cellState=cellState}}`);
    expect(this.$()).to.have.length(1);
  });

  it('has correct focusable class', function () {
    const cellState = { row: 0, column: 0 };
    this.set('cellState', cellState);
    this.render(hbs`{{grid-cell cellState=cellState}}`);
    expect(this.$(SELECTORS.gridCell).hasClass('focusable')).to.be.true;
  });

  it('uses correct cell reveal class if cell is revealed', function () {
    const cellState = { row: 0, column: 0, isRevealed: true };
    this.set('cellState', cellState);
    this.render(hbs`{{grid-cell cellState=cellState}}`)
    expect(this.$(SELECTORS.cellRevealed)).to.have.length(1);
  });

  it('uses correct cell reveal class if cell is flagged', function () {
    const cellState = { row: 0, column: 0, isFlagged: true };
    this.set('cellState', cellState);
    this.render(hbs`{{grid-cell cellState=cellState}}`)
    expect(this.$(SELECTORS.cellIsFlagged)).to.have.length(1);
  });

  it('uses correct cell reveal class if cell has mine and game is lost', function () {
    const cellState = { row: 0, column: 0, hasMine: true };
    const gameStatus = 'lost';
    this.set('cellState', cellState)
    this.set('gameStatus', gameStatus);
    this.render(hbs`{{grid-cell cellState=cellState gameStatus=gameStatus}}`)
    expect(this.$(SELECTORS.cellWithMineStepped)).to.have.length(1);
  });

  assertNeigborMinesCountClass();
});
