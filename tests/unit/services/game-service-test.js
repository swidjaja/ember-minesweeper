import Ember from 'ember';
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it, beforeEach } from 'mocha';
import { setupTest } from 'ember-mocha';
import { CELL_ACTION_TYPES, GAME_STATUS } from 'minesweeper-game/lib/constants';

let mockedTimerService;
let startSpy;
let stopSpy;

const mockTimerService = (elapsedTime, hasTimedOut) => {
  startSpy = sinon.spy();
  stopSpy = sinon.spy();

  return Ember.Service.extend({
    elapsedTime,
    hasTimedOut,
    reset: sinon.spy(),
    start: startSpy,
    stop: stopSpy
  });
};

describe('Unit | Service | game-service', () => {
  setupTest('service:game-service', {
    needs: ['service:timer-service']
  });

  beforeEach(function () {
    mockedTimerService = mockTimerService(998, false);
    this.register('service:timerService', mockedTimerService);
    this.inject.service('timerService', { as: 'timerService'});
  });

  it('sets game status to timed-out if the timer times out', function () {
    const service = this.subject({});

    service.set('gameStatus', GAME_STATUS.IN_PROGRESS);

    service.set('hasTimedOut', false);
    expect(service.get('gameStatus')).to.equal(GAME_STATUS.IN_PROGRESS);

    service.set('hasTimedOut', true);
    expect(service.get('gameStatus')).to.equal(GAME_STATUS.OUT_OF_TIME);
  });

  it('starts the timer if game starts', function () {
    const service = this.subject({});

    service.set('gameStatus', 'in_progress');
    expect(startSpy.calledOnce).to.equal(true);

  });

  it('stops the timer if game ends', function () {
    const service = this.subject({});

    service.set('gameStatus', GAME_STATUS.WIN);
    expect(stopSpy.calledOnce).to.equal(true);
    stopSpy.reset();

    service.set('gameStatus', GAME_STATUS.OUT_OF_TIME);
    expect(stopSpy.calledOnce).to.equal(true);
    stopSpy.reset();

    service.set('gameStatus', GAME_STATUS.LOST);
    expect(stopSpy.calledOnce).to.equal(true);
    stopSpy.reset();
  });

  it('marks game as won if there is no more unrevealed cells', function () {
    const service = this.subject({});

    service.set('remainingUnrevealedCells', 0);
    expect(service.isWon()).to.equal(true);
  });

  it('updates game status to in progress when player clicks on first cell', function () {
    const service = this.subject({});
    const payload = { cellState: { row: 0, column: 0 } };

    service.updateCellState(payload);
    expect(service.get('gameStatus')).to.equal(GAME_STATUS.IN_PROGRESS);
  });

  it('reveals cell when player clicks on unrevealed cell', function () {
    const service = this.subject({});
    const payload = { 
      cellState: { row: 0, column: 0, isRevealed: false },
      actionType: CELL_ACTION_TYPES.REVEAL
    };

    service.revealCell = sinon.spy();

    service.updateCellState(payload);
    expect(service.revealCell.calledOnce).to.equal(true);
  });

  it('marks cell as flagged when player flags an unrevealed cell', function () {
    const service = this.subject({});
    const payload = { 
      cellState: { row: 0, column: 0, isRevealed: false },
      actionType: CELL_ACTION_TYPES.FLAG
    };
    const gridCells = service.get('gridCells');

    service.updateCellState(payload);
    expect(gridCells[0][0].isFlagged).to.equal(true);
  });

  it('unflag flagged cell when player unflag a flagged cell', function () {
    const service = this.subject({});
    const payload = { 
      cellState: { row: 0, column: 0, isRevealed: false },
      actionType: CELL_ACTION_TYPES.FLAG
    };
    const gridCells = service.get('gridCells');

    service.updateCellState(payload);
    service.updateCellState(payload);
    expect(gridCells[0][0].isFlagged).to.equal(false);
  });

  it('marks game as lost if player click on cell with mine', function () {
    const service = this.subject({});
    const payload = { 
      cellState: { row: 0, column: 0, isRevealed: false },
      actionType: CELL_ACTION_TYPES.REVEAL
    };
    const gridCells = service.get('gridCells');
    gridCells[0][0].hasMine = true;

    service.updateCellState(payload);
    expect(service.get('gameStatus')).to.equal(GAME_STATUS.LOST);
  });

  it('marks game as win if player clicks on last unrevealed cell with no mine', function () {
    const service = this.subject({});
    const payload = { 
      cellState: { row: 0, column: 0, isRevealed: false },
      actionType: CELL_ACTION_TYPES.REVEAL
    };
    service.set('remainingUnrevealedCells', 1);

    service.updateCellState(payload);
    expect(service.get('gameStatus')).to.equal(GAME_STATUS.WIN);
  });
});
