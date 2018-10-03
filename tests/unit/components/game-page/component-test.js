import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import sinon from 'sinon';
import Utils from '../../../lib/utils';

const gameServiceResetSpy = sinon.spy();
const gameServiceUpdateCellSpy = sinon.spy();
let gameService;

describe('Unit | Component | game-page', () => {
  setupComponentTest('game-page', {
    unit: true,
    needs: [
      'service:game-service',
      'component:grid-cells',
      'component:level-switcher'
    ]
  });

  beforeEach(function () {
    gameService = Ember.Service.extend({
      reset: gameServiceResetSpy,
      updateCellState: gameServiceUpdateCellSpy,
      gameStatus: 'not_started',
      gridCells: Utils.generateEmptyGridCells(9)
    });
    this.register('service:game-service', gameService);
  });

  it('calls function to update restart button with correct label when game is lost', function () {
    const component = this.subject();
    const updateRestartButtonLabelSpy = sinon.spy();

    component.set('updateRestartButtonLabel', updateRestartButtonLabelSpy);

    this.render();

    component.set('gameStatus', 'lost');
    expect(updateRestartButtonLabelSpy.calledOnce).to.be.true;
    const call = updateRestartButtonLabelSpy.getCall(0);
    expect(call.args[0]).to.equal('Sorry! But you lose the game');
  });

  it('calls function to update restart button with correct label when game times out', function () {
    const component = this.subject();
    const updateRestartButtonLabelSpy = sinon.spy();

    component.set('updateRestartButtonLabel', updateRestartButtonLabelSpy);

    this.render();

    component.set('gameStatus', 'out_of_time');
    expect(updateRestartButtonLabelSpy.calledOnce).to.be.true;
    const call = updateRestartButtonLabelSpy.getCall(0);
    expect(call.args[0]).to.equal('Sorry! But you lose the game');
  });

  it('calls function to update restart button with correct label when game is won', function () {
    const component = this.subject();
    const updateRestartButtonLabelSpy = sinon.spy();

    component.set('updateRestartButtonLabel', updateRestartButtonLabelSpy);

    this.render();

    component.set('gameStatus', 'win');
    expect(updateRestartButtonLabelSpy.calledOnce).to.be.true;
    const call = updateRestartButtonLabelSpy.getCall(0);
    expect(call.args[0]).to.equal('Congratulations! You have win this game');
  });


  it('calls gameService reset when player restart', function () {
    const component = this.subject();

    component.send('restartGame');
    expect(gameServiceResetSpy.calledOnce).to.be.true;
  });

  it('calls gameService updateCell when player clicks on cell', function () {
    const component = this.subject();

    component.send('gridCellClicked', {});
    expect(gameServiceUpdateCellSpy.calledOnce).to.be.true;
  });

  it('updates the restart button label with correct text', function () {
    const setSpy = sinon.spy();
    const component = this.subject({});
    component.set = setSpy;

    component.updateRestartButtonLabel('test');
    expect(setSpy.calledWith('restartButtonLabel', 'test Click to restart the game'))
      .to.equal(true);
  });

  it('calls function to restart game when player clicks alt + s key', function () {
    this.render();

    const evt = Ember.$.Event('keydown');
    evt.which = 83;
    evt.altKey = true;

    Ember.$(document).trigger(evt);

    expect(gameServiceResetSpy.calledOnce).to.be.true;
  });
});
