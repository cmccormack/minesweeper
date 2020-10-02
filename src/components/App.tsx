import * as React from "react";
import { createGlobalStyle } from "styled-components";
import { GameStateProvider } from "../context/GameContext";
import Board from "./Board";
import Title from "./Title";

export interface AppProps {
  compiler: string;
  framework: string;
}

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, Helvetica, sans-serif;
  }
`;

export const App = (props: AppProps): JSX.Element => (
  <GameStateProvider>
    <GlobalStyle />
    <Title fontSize="2rem" fontStyle="italic">
      Minesweeper
    </Title>
    <Title>
      Created with {props.compiler} and {props.framework}!
    </Title>
    <Board />
  </GameStateProvider>
);
