import React from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { startGame } from "../logic/actions";

const Board = (): React.ReactElement => {
  const { state, dispatch } = useContext(GameContext);

  return (
    <>
      <div>{JSON.stringify(state)}</div>
      <button onClick={(): void => dispatch(startGame())}>Start</button>
    </>
  );
};

export default Board;
