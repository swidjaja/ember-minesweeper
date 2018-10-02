import { expect } from 'chai';
import { describe, it, beforeEach, afterEach  } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import Ember from 'ember';

const SELECTORS = {
  resetBtn: '.game-page__reset-btn',
  winBtnRestart: '.game-page__reset-btn.bg-cool_face',
  loseBtnRestart: '.game-page__reset-btn.bg-sad_face',
  onProgressBtnRestart: '.game-page__reset-btn.bg-happy_face',
  timer: '.game-page__timer',
  mouseUserInstruction: '.game-page__instruction--mouse',
  keyboardUserInstruction: '.game-page__instruction--keyboard',
  legendsInstruction: '.game-page__instruction--legends',
  notificationPanel: '.game-page__notification'
};

const constructMockedGameService = (configs) => {
  const { gameStatus = 'not_started', elapsedTime = 1 } = configs;
  const gameServiceMockedObject = {
    gameStatus,
    elapsedTime,
    reset: () => {},
    updateCellState: () => {}
  };

  return Ember.Service.extend(gameServiceMockedObject);
};

const assertRestartButtonClass = () => {
  const gameStatusToBtnSelectorMap = {
    'not_started': SELECTORS.onProgressBtnRestart,
    'in_progress': SELECTORS.onProgressBtnRestart,
    'lost': SELECTORS.loseBtnRestart,
    'out_of_time': SELECTORS.loseBtnRestart,
    'win': SELECTORS.winBtnRestart
  };

  Object.keys(gameStatusToBtnSelectorMap).forEach((gameStatus) => {
    it(`has the correct class name for restart button for game status ${gameStatus}`, function () {
      const mockedService = constructMockedGameService({ gameStatus });
      this.register('service:gameService', mockedService);
      this.inject.service('gameService', { as: 'gameService' });

      this.render(hbs`{{game-page}}`);
      expect(this.$(gameStatusToBtnSelectorMap[gameStatus])).to.have.length(1);
    });
  });
};

const assertElapsedTimeValues = () => {
  const elapsedTimes = {
    1: '001', 
    10: '010', 
    100: '100'
  };

  Object.keys(elapsedTimes).forEach((elapsedTime) => {
    it(`renders the elapsed time in correct format for elapsed time ${elapsedTime}`, function () {
      const mockedService = constructMockedGameService({ elapsedTime });

      this.register('service:gameService', mockedService);
      this.inject.service('gameService', { as: 'gameService' });
      this.render(hbs`{{game-page}}`);

      const timerEl = this.$(SELECTORS.timer);

      expect(timerEl).to.have.length(1);
      expect(timerEl.text().trim()).to.equal(elapsedTimes[elapsedTime]);
    });
  });
};

describe('Integration | Component | game page', function () {
  setupComponentTest('game-page', {
    integration: true
  });

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('renders', function () {
    this.render(hbs`{{game-page}}`);
    expect(this.$()).to.have.length(1);
  });

  assertRestartButtonClass();

  assertElapsedTimeValues();

  it('renders the game instruction sections', function () {
    const mockedService = constructMockedGameService({});

    this.register('service:gameService', mockedService);
    this.inject.service('gameService', { as: 'gameService' });
    this.render(hbs`{{game-page}}`);

    expect(this.$(SELECTORS.mouseUserInstruction)).to.have.length(1);
    expect(this.$(SELECTORS.keyboardUserInstruction)).to.have.length(1);
    expect(this.$(SELECTORS.legendsInstruction)).to.have.length(1);
  });

  it('renders the notification panel section', function () {
    const mockedService = constructMockedGameService({});

    this.register('service:gameService', mockedService);
    this.inject.service('gameService', { as: 'gameService' });
    this.render(hbs`{{game-page}}`);

    expect(this.$(SELECTORS.notificationPanel)).to.have.length(1);
  });
});
