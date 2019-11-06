import React from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { startGame, discoverCell, markCell } from "../logic/actions";

import styled from "styled-components";
import { GridElement, GridElementState } from "../logic/board";
import { GameStatus } from "../logic/reducer";
import PropTypes from "prop-types";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.sizeX}, 2rem);
  grid-template-rows: repeat(${props => props.sizeY}, 2rem);

  .cell {
    display: flex;
    justify-content: center;
    align-items: center;

    &.mine {
      background: red;
    }

    &.marked {
      background: blue;
    }

    &.unsure {
      background: grey;
    }

    &.failure {
      background: green;
    }

    &.hidden {
      background: #ccc;
      border: 3px inset #ccc;
    }
  }
`;

interface CellProps {
  cell: GridElement;
}

const Cell: React.FC<CellProps> = ({ cell }) => {
  const { dispatch } = useContext(GameContext);
  const classMapping = {
    [GridElementState.Hidden]: "hidden",
    [GridElementState.MarkedAsMine]: "marked",
    [GridElementState.MarkedAsUnsure]: "unsure",
    [GridElementState.MarkedAsFailure]: "failure",
  };

  switch (cell.state) {
    case GridElementState.Hidden:
    case GridElementState.MarkedAsMine:
    case GridElementState.MarkedAsUnsure:
    case GridElementState.MarkedAsFailure:
      return (
        <div
          className={"cell " + classMapping[cell.state]}
          onContextMenu={event => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(markCell(cell.position));
          }}
          onClick={() => dispatch(discoverCell(cell.position))}
        ></div>
      );
    case GridElementState.Discovered:
      if (cell.isMine) {
        return <div className="cell mine"></div>;
      }
      return <div className="cell">{cell.minesNear}</div>;
  }
};

Cell.propTypes = {
  cell: PropTypes.any,
};

const Board = (): React.ReactElement => {
  const { state, dispatch } = useContext(GameContext);

  return (
    <>
      <Grid {...state.board.size}>
        {state.board.grid.map((row, y) =>
          row.map((cell, x) => <Cell key={"" + y + x} cell={cell} />)
        )}
      </Grid>
      Status: {state.status}
      {state.status === GameStatus.Win ? "WIN!" : ""}
      <button onClick={() => dispatch(startGame())}>Restart</button>
    </>
  );
};

export default Board;
