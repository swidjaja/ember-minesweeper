export const CELL_GRIDS_SIZE = 9;

export const MINES_COUNT = 10;

export const CELL_ACTION_TYPES = {
  REVEAL: 'reveal',
  FLAG: 'flag'
};

export const GAME_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  OUT_OF_TIME: 'out_of_time',
  WIN: 'win',
  LOST: 'lost'
};

export const GAME_DIFFICULTY = ['EASY', 'MEDIUM', 'HARD'];

export const GAME_DIFFICULTY_CONFIGS = {
  EASY: { gridSize: 9, mines: 10 },
  MEDIUM: { gridSize: 15, mines: 30 },
  HARD: { gridSize: 20, mines: 50 }
}

export const KEY_CODES = {
  ARROW_UP: 38,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  CHARACTER_S: 83,
  CHARACTER_T: 84,
  CHARACTER_F: 70
};

export const KEY_NAMES = {
  ARROW_UP: 'ArrowUp',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown'
};

// Number of secs before the timer service time-outs
export const TIMER_TIMEOUT = 999;

export const DEFAULT_RESTART_BTN_LABEL = 'Click to restart the game';
