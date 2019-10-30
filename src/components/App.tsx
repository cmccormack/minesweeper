import * as React from "react";
import { GameStateProvider } from "../context/GameContext";
import Board from "./Board";

export interface AppProps {
  compiler: string;
  framework: string;
}

export const App = (props: AppProps): JSX.Element => (
  <GameStateProvider>
    Minesweeper created with {props.compiler} and {props.framework}!
    <Board />
  </GameStateProvider>
);
