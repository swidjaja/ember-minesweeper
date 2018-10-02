import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import sinon from 'sinon';

const gameServiceResetSpy = sinon.spy();
const gameServiceUpdateCellSpy = sinon.spy();
let gameService;

describe('Unit | Component | game-page', () => {
  setupComponentTest('game-page', {
    unit: true,
    needs: [
      'service:game-service',
      'component:grid-cells'
    ]
  });

  beforeEach(function () {
    gameService = Ember.Service.extend({
      reset: gameServiceResetSpy,
      updateCellState: gameServiceUpdateCellSpy,
      gameStatus: 'not_started'
    });
    this.register('service:game-service', gameService);
  });

  it('updates the notification text correctly for in-progress game', function () {
    const component = this.subject();
    const updateNotificationTextSpy = sinon.spy();

    component.set('updateNotificationText', updateNotificationTextSpy);

    this.render();

    component.set('gameStatus', 'in_progress');
    expect(updateNotificationTextSpy.calledOnce).to.be.true;
    const call = updateNotificationTextSpy.getCall(0);
    expect(call.args[0]).to.equal('The game has started');
  });

  it('updates the notification text correctly for lost game', function () {
    const component = this.subject();
    const updateNotificationTextSpy = sinon.spy();

    component.set('updateNotificationText', updateNotificationTextSpy);

    this.render();

    component.set('gameStatus', 'lost');
    expect(updateNotificationTextSpy.calledOnce).to.be.true;
    const call = updateNotificationTextSpy.getCall(0);
    expect(call.args[0]).to.equal('Sorry! But you lose the game');
  });

  it('updates the notification text correctly for out-of-time game', function () {
    const component = this.subject();
    const updateNotificationTextSpy = sinon.spy();

    component.set('updateNotificationText', updateNotificationTextSpy);

    this.render();

    component.set('gameStatus', 'out_of_time');
    expect(updateNotificationTextSpy.calledOnce).to.be.true;
    const call = updateNotificationTextSpy.getCall(0);
    expect(call.args[0]).to.equal('Sorry! But you lose the game');
  });

  it('updates the notification text correctly for won game', function () {
    const component = this.subject();
    const updateNotificationTextSpy = sinon.spy();

    component.set('updateNotificationText', updateNotificationTextSpy);

    this.render();

    component.set('gameStatus', 'win');
    expect(updateNotificationTextSpy.calledOnce).to.be.true;
    const call = updateNotificationTextSpy.getCall(0);
    expect(call.args[0]).to.equal('Congratulations! You have win this game');
  });

  it('updates the notification text', function () {
    const component = this.subject();

    this.render();

    component.updateNotificationText('win');

    const notificationPanelEl = this.$('.game-page__notification');

    expect(notificationPanelEl.text().trim()).to.equal('win');
  });

  it('calls gameService reset when player restart', function () {
    const component = this.subject();

    component.restartGame();

    expect(gameServiceResetSpy.calledOnce).to.be.true;
  });

  it('calls gameService reset when player clicks on cell', function () {
    const component = this.subject();

    component.onGridCellClicked({});

    expect(gameServiceUpdateCellSpy.calledOnce).to.be.true;
  });
});
