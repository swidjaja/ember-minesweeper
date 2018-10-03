import { expect } from 'chai';
import { describe, it, beforeEach, afterEach  } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import Ember from 'ember';
import Utils from '../../../lib/utils';

const SELECTORS = {
  resetBtn: '.game-page__reset-btn',
  winBtnRestart: '.game-page__reset-btn.bg-cool_face',
  loseBtnRestart: '.game-page__reset-btn.bg-sad_face',
  onProgressBtnRestart: '.game-page__reset-btn.bg-happy_face',
  timer: '.game-page__timer',
  minesCounter: '.game-page__mines-count',
  mouseUserInstruction: '.game-page__instruction--mouse',
  keyboardUserInstruction: '.game-page__instruction--keyboard',
  legendsInstruction: '.game-page__instruction--legends'
};

const constructMockedGameService = (configs = {}) => {
  const { gameStatus = 'not_started', elapsedTime = 1, minesCount = 10 } = configs;
  const gameServiceMockedObject = {
    gameStatus,
    elapsedTime,
    minesCount,
    gridCells: Utils.generateEmptyGridCells(9),
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

  it('renders timer with 0 elapsed time initially', function () {
    this.render(hbs`{{game-page}}`);

    const timerEl = this.$(SELECTORS.timer);
    expect(timerEl).to.have.length(1);
    expect(timerEl.text().trim()).to.equal('0');
  });

  it('renders start button with correct label', function () {
    this.render(hbs`{{game-page}}`);

    const resetBtnEl = this.$(SELECTORS.resetBtn);
    expect(resetBtnEl).to.have.length(1);
    expect(resetBtnEl.attr('aria-label')).to.equal('Click to restart the game');
  });

  it('renders mines counter with 10 mines count initially', function () {
    const mockedService = constructMockedGameService();

    this.register('service:gameService', mockedService);
    this.inject.service('gameService', { as: 'gameService' });
    this.render(hbs`{{game-page}}`);

    const minesCounterEl = this.$(SELECTORS.minesCounter);
    expect(minesCounterEl).to.have.length(1);
    expect(minesCounterEl.text().trim()).to.equal('10');
  });

  assertRestartButtonClass();

  it('renders the game instruction sections', function () {
    const mockedService = constructMockedGameService({});

    this.register('service:gameService', mockedService);
    this.inject.service('gameService', { as: 'gameService' });
    this.render(hbs`{{game-page}}`);

    expect(this.$(SELECTORS.mouseUserInstruction)).to.have.length(1);
    expect(this.$(SELECTORS.keyboardUserInstruction)).to.have.length(1);
    expect(this.$(SELECTORS.legendsInstruction)).to.have.length(1);
  });
});
