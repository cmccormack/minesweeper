import { BoardSize } from "./actions";

const CHANCE_FOR_MINE_PER_FIELD = 0.2;

export enum GridElementState {
  Hidden,
  Discovered,
  MarkedAsMine,
  MarkedAsUnsure,
  MarkedAsFailure,
}

export type Board = {
  size: BoardSize;
  grid: GridElement[][];
};

export interface Position {
  x: number;
  y: number;
}

export interface GridElement {
  isMine: boolean;
  minesNear: number;
  state: GridElementState;
  position: Position;
}

/**
 * Creates an array through an element-initialisation function
 *
 * @param length The length of the target Array
 * @param init A function which is called for every element for initialisation
 */
function createArray<T>(length: number, init: (index: number) => T) {
  return Array.from({ length }, (_, index) => init(index));
}

/**
 * Infers the positions around the given position while taking the
 * board boundaries into account
 *
 * @param board The board
 * @param position The position from which to infer the surrounding positions
 */
function surroundingPositions(board: Board, position: Position): Position[] {
  const { sizeX, sizeY } = board.size;

  return [
    // Above
    { x: position.x - 1, y: position.y - 1 },
    { x: position.x, y: position.y - 1 },
    { x: position.x + 1, y: position.y - 1 },

    // Below
    { x: position.x - 1, y: position.y + 1 },
    { x: position.x, y: position.y + 1 },
    { x: position.x + 1, y: position.y + 1 },

    // Sides
    { x: position.x - 1, y: position.y },
    { x: position.x + 1, y: position.y },
  ].filter(({ x, y }) => x >= 0 && y >= 0 && x < sizeX && y < sizeY);
}

/**
 * Returns the fields surrounding the given position
 *
 * @param board The board
 * @param position The origin position
 */
function surroundingFields(board: Board, position: Position): GridElement[] {
  return surroundingPositions(board, position).map(
    ({ x, y }) => board.grid[y][x]
  );
}

/**
 * Returns the number of mines around the given position
 *
 * @param board The board
 * @param position The origin position
 */
function surroundingMines(board: Board, position: Position): number {
  return surroundingPositions(board, position).filter(
    ({ x, y }) => board.grid[y][x].isMine
  ).length;
}

/**
 * Creates a minesweeper board with a given size
 *
 * @param size The target size of the board
 */
export function createBoard(size: BoardSize): Board {
  // Initialize bombs with mines
  const board: Board = {
    size,
    grid: createArray(size.sizeY, y =>
      createArray(size.sizeX, x => ({
        isMine: Math.random() <= CHANCE_FOR_MINE_PER_FIELD,
        minesNear: -1, // -1 is uninitialized
        state: GridElementState.Hidden,
        position: { x, y },
      }))
    ),
  };

  // Infer "minesNear" already so we don't have
  // to check for mines on every render
  for (let y = 0; y < board.size.sizeX; y++) {
    for (let x = 0; x < board.size.sizeY; x++) {
      board.grid[y][x].minesNear = surroundingMines(board, { x, y });
    }
  }

  return board;
}

/**
 * Tests two positions for equality
 */
export function isSamePosition(p1: Position, p2: Position): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Updates a board by applying a function to every one of its cells
 * and replacing the cell in the board with the returned value
 *
 * @param board The board
 * @param cellFn A function which gets applied for every cell
 */
export function updateBoard(
  board: Board,
  cellFn: (el: GridElement) => GridElement
) {
  return { ...board, grid: board.grid.map(row => row.map(cellFn)) };
}

/**
 * Updates one single cell in the board at the given position
 * by applying a mapping function
 *
 * @param board The board
 * @param position The position of the cell
 * @param action The mapping function for the cell
 */
export function updateSingleCell(
  board: Board,
  position: Position,
  action: (el: GridElement) => GridElement
): Board {
  return updateBoard(board, cell =>
    isSamePosition(cell.position, position) ? action(cell) : cell
  );
}

/**
 * Discovers the cell at the given position. If the cell has no
 * neighbouring mines, fields will be recursively discovered until
 * fields with neighbouring mines are discovered
 *
 * @param board The board
 * @param position The position of the cell
 */
export function discoverCell(board: Board, position: Position): Board {
  if (board.grid[position.y][position.x].state !== GridElementState.Hidden)
    return board;

  const boardCopy = updateBoard(board, cell => ({ ...cell }));

  const possibleAdditionalDiscoveries = (position: Position) =>
    surroundingFields(boardCopy, position).filter(
      cell => cell.state === GridElementState.Hidden
    );

  const discoverRecursive = (cell: GridElement) => {
    cell.state = GridElementState.Discovered;

    if (cell.isMine || cell.minesNear !== 0) return;

    possibleAdditionalDiscoveries(cell.position).forEach(discoverRecursive);
  };

  discoverRecursive(boardCopy.grid[position.y][position.x]);

  return boardCopy;
}

/**
 * Toggles the marking state of the cell at the given position.
 * Hidden -> Mine -> Unsure -> Hidden -> Mine -> ....
 *
 * @param board The board
 * @param position The position of the cell
 */
export function markCell(board: Board, position: Position) {
  return updateSingleCell(board, position, cell => ({
    ...cell,
    state: {
      [GridElementState.Hidden]: GridElementState.MarkedAsMine,
      [GridElementState.MarkedAsMine]: GridElementState.MarkedAsUnsure,
      [GridElementState.MarkedAsUnsure]: GridElementState.Hidden,
      [GridElementState.Discovered]: GridElementState.Discovered,
      [GridElementState.MarkedAsFailure]: GridElementState.MarkedAsFailure,
    }[cell.state],
  }));
}

/**
 * Returns true if the cell at the given position is a mine
 * returns false otherwise
 *
 * @param board The board
 * @param position The position of the cell
 */
export function isMine(board: Board, position: Position): boolean {
  return board.grid[position.y][position.x].isMine;
}

/**
 * Updates the board state to show a failure at the given position
 *
 * @param board The board
 * @param position The position of the cell at which the failure occurred
 */
export function showFailure(board: Board, position: Position): Board {
  return updateBoard(board, cell => ({
    ...cell,
    state: isSamePosition(cell.position, position)
      ? GridElementState.MarkedAsFailure
      : GridElementState.Discovered,
  }));
}

/**
 * Returns true if the board is in a winning state,
 * false otherwise
 *
 * @param board The board
 */
export function isWinningBoard(board: Board): boolean {
  return board.grid.every(row =>
    row.every(
      cell =>
        (cell.state === GridElementState.Discovered && !cell.isMine) ||
        cell.isMine
    )
  );
}
