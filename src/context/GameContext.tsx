import React from "react";
import PropTypes from "prop-types";
import { FC, useReducer } from "react";
import { GameAction } from "../logic/actions";
import { rootReducer, initialState, GameState } from "../logic/reducer";

interface ContextState {
  state: GameState;
  dispatch: React.Dispatch<GameAction<unknown>>;
}

const initialContextState: ContextState = {
  state: initialState,
  dispatch: () => {
    throw new Error("Tried to call dispatch on an uninitialized context");
  },
};

export const GameContext = React.createContext(initialContextState);

export const GameStateProvider: FC<{}> = props => {
  // Did someone whisper redux?
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GameContext.Provider>
  );
};

GameStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
