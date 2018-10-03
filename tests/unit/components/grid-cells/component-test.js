import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import sinon from 'sinon';
import Utils from '../../../lib/utils';

describe('Unit | Component | grid cells', () => {
  setupComponentTest('grid-cells', {
    unit: true
  });

  it('returns correct result on checking cell validity on all cases', function () {
    const component = this.subject({
      gridCells: Utils.generateEmptyGridCells(9)
    });

    expect(component.isValidCell(8, 8)).to.equal(true);
    expect(component.isValidCell(8, -1)).to.equal(false);
    expect(component.isValidCell(-1, 8)).to.equal(false);
    expect(component.isValidCell(9, 9)).to.equal(false);
  });

  it('focuses on sibling cell when player is using keyboard to navigate to valid sibling cell', function () {
    const component = this.subject({
      gridCells: Utils.generateEmptyGridCells(3),
    });
    const focusOnSiblingCellSpy = sinon.spy();

    component.focusOnSiblingCell = focusOnSiblingCellSpy;

    // Position (0, 0)
    component.send('moveByKeyboard', { row: 0, column: 0, direction: 'up'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 0, direction: 'left'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 0, direction: 'right'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 0, direction: 'down'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    // Position (0, 2)
    component.send('moveByKeyboard', { row: 0, column: 2, direction: 'up'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 2, direction: 'left'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 2, direction: 'right'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 0, column: 2, direction: 'down'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    // Position (1,1)
    component.send('moveByKeyboard', { row: 1, column: 1, direction: 'up'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 1, column: 1, direction: 'left'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 1, column: 1, direction: 'right'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 1, column: 1, direction: 'down'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    // Position (2, 0)
    component.send('moveByKeyboard', { row: 2, column: 0, direction: 'up'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 0, direction: 'left'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 0, direction: 'right'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 0, direction: 'down'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    // Position (2, 2)
    component.send('moveByKeyboard', { row: 2, column: 2, direction: 'up'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 2, direction: 'left'});
    expect(focusOnSiblingCellSpy.called).to.equal(true);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 2, direction: 'right'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();

    component.send('moveByKeyboard', { row: 2, column: 2, direction: 'down'});
    expect(focusOnSiblingCellSpy.called).to.equal(false);
    focusOnSiblingCellSpy.reset();
  });

  it('send gridCellClicked action with correct params', function () {
    const payload = { cellState: {}, actionType: 'flag' };
    const component = this.subject({
      gridCells: Utils.generateEmptyGridCells(3)
    });
    const sendActionSpy = sinon.spy();

    Ember.set(component.actions, 'sendAction', sendActionSpy);

    component.actions.gridCellClicked(payload);

    const args = sendActionSpy.firstCall.args;
    expect(args[0]).to.equal('gridCellClicked');
    expect(args[1]).to.deep.equal(payload);
  });
});
