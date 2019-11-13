import { GameAction, GameActionType } from "./actions";
import {
  createBoard,
  Board,
  discoverCell,
  markCell,
  isMine,
  isWinningBoard,
  showFailure,
} from "./board";

export interface GameState {
  status: GameStatus;
  board: Board;
}

export enum GameStatus {
  Running,
  Win,
  Failure,
}

export const initialState: GameState = {
  status: GameStatus.Running,
  board: createBoard({ sizeX: 9, sizeY: 9 }),
};

export function rootReducer(
  state = initialState,
  action: GameAction
): GameState {
  switch (action.type) {
    case GameActionType.StartGame:
      return {
        ...state,
        status: GameStatus.Running,
        board: createBoard(state.board.size),
      };

    case GameActionType.CreateBoard:
      if (!action.payload) return state;
      return {
        ...state,
        board: createBoard(action.payload),
      };

    case GameActionType.DiscoverCell:
      if (!action.payload) return state;

      if (state.status === GameStatus.Win) return state;

      if (isMine(state.board, action.payload))
        return {
          ...state,
          status: GameStatus.Failure,
          board: showFailure(state.board, action.payload),
        };

      // eslint-disable-next-line no-case-declarations
      const newState = {
        ...state,
        board: discoverCell(state.board, action.payload),
      };

      if (isWinningBoard(newState.board))
        return { ...newState, status: GameStatus.Win };

      return newState;
    case GameActionType.MarkCell:
      if (!action.payload) return state;
      return { ...state, board: markCell(state.board, action.payload) };

    default:
      return state;
  }
}
