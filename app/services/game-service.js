import Ember from 'ember';
import { 
  CELL_ACTION_TYPES,
  CELL_GRIDS_SIZE,
  MINES_COUNT,
  GAME_STATUS,
  GAME_DIFFICULTY_CONFIGS
} from 'minesweeper-game/lib/constants';

// Game service
export default Ember.Service.extend({
  timerService: Ember.inject.service(),
  elapsedTime: Ember.computed.oneWay('timerService.elapsedTime'),
  hasTimedOut: Ember.computed.oneWay('timerService.hasTimedOut'),
  gridSize: CELL_GRIDS_SIZE,
  minesCount: MINES_COUNT,
  gameLevel: 'EASY',

  timeOutObserver: Ember.observer('hasTimedOut', function () {
    if (this.get('hasTimedOut')) {
     this.set('gameStatus', GAME_STATUS.OUT_OF_TIME); 
    }
  }),

  gameStatusObserver: Ember.observer('gameStatus', function () {
    const gameStatus = this.get('gameStatus');
    const timerService = this.get('timerService');

    if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      timerService.start();
    } else {
      timerService.stop();
    }
  }),

  init(...args) {
    this._super(args);
    this.reset();
  },

  switchLevel(level) {
    const { mines, gridSize } = GAME_DIFFICULTY_CONFIGS[level];

    this.set('gameLevel', level);
    this.set('minesCount', mines);
    this.set('gridSize', gridSize);

    this.reset();
  },

  /**
   * Reset the minesweeper game state. This will do the following
   * 1. Set the game status to in progress
   * 2. Reset the remaining unreveal cells count
   * 3. Initialize the grid cells
   * 4. Place the mines randomly on 10 cells
   * 5. Set the neighbor mines count for each cell
   * 6. And, of course, reset the timer
   */
  reset() {
    const timerService = this.get('timerService');
    const gridSize = this.get('gridSize');
    const minesCount = this.get('minesCount');

    timerService.reset();
    this.set('gameStatus', GAME_STATUS.NOT_STARTED);
    this.remainingUnrevealedCells = (gridSize * gridSize) - minesCount;
    this.initializeGridCells();
    this.placeMines();
    this.setCellsNeighborMinesCount();
  },

  /**
   * Check if player has win the current game
   * @return {Boolean} true if player has win the current game, false otherwise
   */
  isWon() {
    return this.remainingUnrevealedCells === 0;
  },

  /**
   * Reset the configs of each cell to their basic state. The following properties
   * will be set on each cell
   * row - the row index of cell
   * column - the column index of cell
   * isRevealed - whether player has clicked on the cell
   * isFlagged - whether player has flagged the cell
   * hasMine - whether a given cell has mine on it
   * neighborMineCellCount - the number of neighbors of a given cell that has mines
   */
  initializeGridCells() {
    const gridSize = this.get('gridSize');

    this.set('gridCells', []);
    for (let idx = 0; idx < gridSize; ++idx) {
      const row = [];
      for (let idy = 0; idy < gridSize; ++idy) {
        row.push({
          row: idx,
          column: idy,
          isRevealed: false,
          isFlagged: false,
          hasMine: false,
          neighborMineCellCount: 0
        });
      }
      this.gridCells.push(row);
    }
  },

  /**
   * Update the cell state after player has clicked/flagged the cell
   * @param  {Object} payload the payload of cell click action
   */
  updateCellState(payload) {
    const gameStatus = this.get('gameStatus');

    if (gameStatus === GAME_STATUS.LOST) {
      return;
    } else if (gameStatus === GAME_STATUS.NOT_STARTED) {
      this.set('gameStatus', GAME_STATUS.IN_PROGRESS);
    }

    const { cellState, actionType } = payload;
    const { row, column } = cellState;
    const gridCells = this.get('gridCells');
    const gridCell = gridCells[row][column];

    if (actionType === CELL_ACTION_TYPES.REVEAL && !gridCell.isRevealed) {
      this.revealCell(gridCell);
    } else if (actionType === CELL_ACTION_TYPES.FLAG) {
      Ember.set(gridCell, 'isFlagged', !gridCell.isFlagged);
    }
  },

  /**
   * Update cell state on cell click
   * @param  {Object} gridCell the current cell properties
   */
  revealCell(gridCell) {
    Ember.set(gridCell, 'isRevealed', true);

    if (!gridCell.hasMine) {
      this.set('remainingUnrevealedCells', this.remainingUnrevealedCells - 1);

      if (this.isWon()) {
        this.set('gameStatus', GAME_STATUS.WIN);
      } else if (!gridCell.neighborMineCellCount) {
        const validNeighborCells = this.getValidNeighborCells(gridCell.row, gridCell.column);
        
        // Iterative version (BFS)
        let queue = [].concat(validNeighborCells);
        const gridCells = this.get('gridCells');

        while (queue.length !== 0) {
          const gridCellPosition = queue.shift();
          const { rowIdx, columnIdx } = gridCellPosition;
          const thisGridCell = gridCells[rowIdx][columnIdx];
          const { hasMine, isRevealed, neighborMineCellCount } = thisGridCell;

          if (!hasMine && !isRevealed) {
            Ember.set(thisGridCell, 'isRevealed', true);
            this.set('remainingUnrevealedCells', this.remainingUnrevealedCells - 1);

            if (!neighborMineCellCount) {
              const itemValidNeigborCells = this.getValidNeighborCells(rowIdx, columnIdx);
              queue = queue.concat(itemValidNeigborCells);
            }
          }
        }

        // Recursive version
        // validNeighborCells.forEach((validNeighborCell) => {
        //   const { rowIdx, columnIdx } = validNeighborCell;
        //   const gridCells = this.get('gridCells');
        //   const gridCell = gridCells[rowIdx][columnIdx];
        //   if (!gridCell.hasMine && !gridCell.isRevealed) {
        //     this.revealCell(gridCell);
        //   }
        // });
      }
    } else {
      this.set('gameStatus', GAME_STATUS.LOST);
    }
  },

  // Place mine on each cell
  placeMines() {
    const gridCells = this.get('gridCells');
    const gridSize = this.get('gridSize');
    let minesCount = this.get('minesCount');

    while (minesCount > 0) {
      const row = Math.floor(Math.random() * gridSize);
      const column = Math.floor(Math.random() * gridSize);
      const gridCell = gridCells[row][column];

      if (!gridCell.hasMine) {
        // console.error(row, column);
        Ember.set(gridCell, 'hasMine', true);
        minesCount -= 1;
      }
    }
  },

  /**
   * Given a row and column indices, determine whether they represent a valid cell
   * @param  {Number} rowIdx the row index
   * @param  {Number} columnIdx the column index
   * @return {Boolean} true if cell is valid
   */
  isValidCell(rowIdx, columnIdx) {
    const gridSize = this.get('gridSize');

    return rowIdx >= 0 && rowIdx < gridSize && 
      columnIdx >= 0 && columnIdx < gridSize;
  },

  /**
   * Given a row and column indices, get all valid neighbor cells
   * @param  {Number} row the row index
   * @param  {Number} column the column index
   * @return {Array.<Object>} all valid neighbor cells of a given cell
   */
  getValidNeighborCells(row, column) {
    const neighborCellsIndices = [
      { rowIdx: row + 1, columnIdx: column },
      { rowIdx: row - 1, columnIdx: column },
      { rowIdx: row, columnIdx: column + 1 },
      { rowIdx: row, columnIdx: column - 1 },
      { rowIdx: row - 1, columnIdx: column + 1 },
      { rowIdx: row - 1, columnIdx: column - 1 },
      { rowIdx: row + 1, columnIdx: column + 1 },
      { rowIdx: row + 1, columnIdx: column - 1 },
    ];

    return neighborCellsIndices
      .filter(({ rowIdx, columnIdx }) => this.isValidCell(rowIdx, columnIdx));
  },

  /**
   * Given a row and column indices, get the count of neighbors with mine
   * @param  {Number} row the row index
   * @param  {Number} column the column index
   * @return {Number} number of neighbors that have mine
   */
  getNeighborCellsWithMinesCount(row, column) {
    const gridCells = this.get('gridCells');
    const validNeighborCells = this.getValidNeighborCells(row, column);

    return validNeighborCells.reduce((count, { rowIdx, columnIdx }) => {
      return count + (gridCells[rowIdx][columnIdx].hasMine | 0);
    }, 0);
  },

  // Set the neighbor mines count for each cell that does not have mine
  setCellsNeighborMinesCount() {
    const gridCells = this.get('gridCells');
    const gridSize = this.get('gridSize');

    for (let idx = 0; idx < gridSize; ++idx) {
      for (let idy = 0; idy < gridSize; ++idy) {
        const gridCell = gridCells[idx][idy];

        if (!gridCell.hasMine) {
          const neighborCellsWithMinesCount = this.getNeighborCellsWithMinesCount(idx, idy);

          Ember.set(gridCell, 'neighborMineCellCount', neighborCellsWithMinesCount);
        }
      }
    }
  }
});
