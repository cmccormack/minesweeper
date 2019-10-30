export interface GameAction<PayloadType> {
  type: GameActionType;
  payload?: PayloadType;
}

export enum GameActionType {
  StartGame,
}

export function startGame(): GameAction<void> {
  return { type: GameActionType.StartGame };
}
