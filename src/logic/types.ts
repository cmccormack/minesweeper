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

export interface GameAction<PayloadType> {
  type: GameActionType;
  payload?: PayloadType;
}

export enum GameStatus {
  Initial,
  Running,
  Ended,
}

export enum GameActionType {
  StartGame,
}
