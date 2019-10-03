import * as React from "react";

export interface AppProps {
  compiler: string;
  framework: string;
}

export const App = (props: AppProps): JSX.Element => (
  <h1>
    Minesweeper created with {props.compiler} and {props.framework}!
  </h1>
);
