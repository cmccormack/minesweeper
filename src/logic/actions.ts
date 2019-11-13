import { Position } from "./board";

export interface Action<ActionType, PayloadType> {
  type: ActionType;
  payload?: PayloadType;
}

export type GameAction =
  | Action<GameActionType.StartGame, void>
  | Action<GameActionType.CreateBoard, BoardSize>
  | Action<GameActionType.DiscoverCell, Position>
  | Action<GameActionType.MarkCell, Position>;

export enum GameActionType {
  StartGame,
  CreateBoard,
  DiscoverCell,
  MarkCell,
}

export interface BoardSize {
  sizeX: number;
  sizeY: number;
}

export function startGame(): Action<GameActionType.StartGame, void> {
  return { type: GameActionType.StartGame };
}

export function createBoard(
  size: BoardSize
): Action<GameActionType.CreateBoard, BoardSize> {
  return {
    type: GameActionType.CreateBoard,
    payload: size,
  };
}

export function discoverCell(
  position: Position
): Action<GameActionType.DiscoverCell, Position> {
  return {
    type: GameActionType.DiscoverCell,
    payload: position,
  };
}

export function markCell(
  position: Position
): Action<GameActionType.MarkCell, Position> {
  return {
    type: GameActionType.MarkCell,
    payload: position,
  };
}
