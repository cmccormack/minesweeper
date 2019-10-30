import { GameState, GameStatus, GameActionType, GameAction } from "./types";

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

export function startGame(): GameAction<void> {
  return { type: GameActionType.StartGame };
}
