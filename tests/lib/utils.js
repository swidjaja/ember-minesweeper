const generateEmptyGridCells = (gridSize) => {
  let gridCells = [];

  for (let idx = 0; idx < gridSize; idx += 1) {
    gridCells[idx] = [];
    for (let idy = 0; idy < gridSize; idy +=1 ) {
      gridCells[idx][idy] = { cellState: { row: idy, column: idx } };
    }
  }

  return gridCells;
};

export default {
  generateEmptyGridCells
};
