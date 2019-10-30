import { GameAction, GameActionType } from "./actions";

enum GridElementState {
  Hidden,
  Discovered,
}

export interface GridElement {
  state: GridElementState;
}

export interface GameState {
  status: GameStatus;
  board: GridElement[];
}

export enum GameStatus {
  Initial,
  Running,
  Ended,
}

export const initialState: GameState = {
  status: GameStatus.Initial,
  board: [],
};

export function rootReducer<T>(
  state = initialState,
  action: GameAction<T>
): GameState {
  switch (action.type) {
    case GameActionType.StartGame:
      return { ...state, status: GameStatus.Running };
    default:
      return state;
  }
}
