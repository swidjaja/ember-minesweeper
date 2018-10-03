import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import sinon from 'sinon';
import { KEY_CODES } from 'minesweeper-game/lib/constants';

const assertIsLostValue = () => {
  const testCaseConfigs = {
    not_started: false,
    in_progress: false,
    out_of_time: true,
    win: false,
    lost: true
  };

  Object.keys(testCaseConfigs).forEach((status) => {
    it(`computes the correct isLost value for game with status ${status}`, function () {
      const component = this.subject({ gameStatus: status });
      expect(component.get('isLost')).to.equal(testCaseConfigs[status]);
    });
  });
};

describe('Unit | Component | grid cell', () => {
  setupComponentTest('grid-cell', {
    unit: true
  });

  assertIsLostValue();

  it('send gridCellClicked action with correct params when user right click on cell', function () {
    const component = this.subject({ cellState: {} });
    const sendActionSpy = sinon.spy();
    const mockedEvent = {
      preventDefault: () => {},
      altKey: true
    };

    Ember.set(component, 'sendAction', sendActionSpy);

    component.contextMenu(mockedEvent);

    const args = sendActionSpy.firstCall.args;
    expect(args[0]).to.equal('gridCellClicked');
    expect(args[1]).to.deep.equal({ cellState: {}, actionType: 'flag'});
  });

  it('send gridCellClicked action with correct params when user click on cell', function () {
    const component = this.subject({ cellState: {} });
    const sendActionSpy = sinon.spy();
    const mockedEvent = {
      preventDefault: () => {}
    };

    Ember.set(component, 'sendAction', sendActionSpy);

    component.click(mockedEvent);

    const args = sendActionSpy.firstCall.args;
    expect(args[0]).to.equal('gridCellClicked');
    expect(args[1]).to.deep.equal({ cellState: {}, actionType: 'reveal'});
  });

  it('send gridCellClicked action with correct params when keyboard user press enter + alt', function () {
    const component = this.subject({ cellState: {} });
    const sendActionSpy = sinon.spy();
    const mockedEvent = {
      preventDefault: () => {},
      altKey: true
    };

    Ember.set(component, 'sendAction', sendActionSpy);

    component.click(mockedEvent);

    const args = sendActionSpy.firstCall.args;
    expect(args[0]).to.equal('gridCellClicked');
    expect(args[1]).to.deep.equal({ cellState: {}, actionType: 'flag'});
  });

  it('does not send gridCellClicked action if user tries to flag a revealed cell', function () {
    const component = this.subject({ cellState: { isRevealed: true } });
    const sendActionSpy = sinon.spy();
    const mockedEvent = {
      preventDefault: () => {},
      altKey: true
    };

    Ember.set(component, 'sendAction', sendActionSpy);

    component.click(mockedEvent);

    expect(sendActionSpy.calledOnce).to.equal(false);
  });

  it('does not send gridCellClicked action if user tries to reveal a revealed cell', function () {
    const component = this.subject({ cellState: { isRevealed: true } });
    const sendActionSpy = sinon.spy();
    const mockedEvent = {
      preventDefault: () => {}
    };

    Ember.set(component, 'sendAction', sendActionSpy);

    component.click(mockedEvent);

    expect(sendActionSpy.calledOnce).to.equal(false);
  });

  it('send moveByKeyboard action with correct params when user navigates on cells using keyboard', function () {
    const component = this.subject({ cellState: { row: 0, column: 0 } });
    const sendActionSpy = sinon.spy();

    Ember.set(component, 'sendAction', sendActionSpy);

    let mockedEvent = {
      preventDefault: () => {},
      keyCode: KEY_CODES.ARROW_UP
    };

    component.keyDown(mockedEvent);
    expect(sendActionSpy.calledWith({ row: 0, column: 0, direction: 'up'}));
    sendActionSpy.reset();

    mockedEvent.keyCode = KEY_CODES.ARROW_LEFT;

    component.keyDown(mockedEvent);
    expect(sendActionSpy.calledWith({ row: 0, column: 0, direction: 'left'}));
    sendActionSpy.reset();

    mockedEvent.keyCode = KEY_CODES.ARROW_RIGHT;

    component.keyDown(mockedEvent);
    expect(sendActionSpy.calledWith({ row: 0, column: 0, direction: 'right'}));
    sendActionSpy.reset();

    mockedEvent.keyCode = KEY_CODES.ARROW_DOWN;

    component.keyDown(mockedEvent);
    expect(sendActionSpy.calledWith({ row: 0, column: 0, direction: 'down'}));
    sendActionSpy.reset();
  });
});
