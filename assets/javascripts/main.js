"use strict";


/**
 * VARIABLES
 */

var state = {};

state.running       = false;
state.generation    = 0;
state.total_columns = 20;
state.total_rows    = 15;
state.total_cells   = state.total_columns * state.total_rows;
state.board_width   = 400;
state.cells         = Array(state.total_cells).fill("dead");
state.cell_width    = state.board_width / state.total_columns - 1;

var animation = undefined;


/**
 * COMPONENTS
 */

function App() {
  return (
    <div className="container">
      <h1 className="title">Game of Life</h1>
      <div className="controls">
        <button
          onClick={ runApp }
          disabled={ state.running }
        >Run</button>
        <button onClick={ pauseApp }>Pause</button>
        <button onClick={ clearApp }>Clear</button>
        <div className="counter">
          Generation: { state.generation }
        </div>
      </div>
      <div
        className="board"
        style={{ width: state.board_width }}
      >{
        state.cells.map((status, i) => (
          <div
            onClick={ toggleLife }
            class={ `cell cell--${status}` }
            style={{
              width: state.cell_width,
              height: state.cell_width
            }}
            data-index={ i }
          />
        ))
      }</div>
    </div>
  );
}


/**
 * METHODS
 */

function runApp() {
  setState({ running: true });

  function anim() {
    let cells = state.cells;

    for (let j = 0; j < cells.length; j++) {
      transformCell(j);
    }

    setState({
      generation: state.generation += 1,
      cells
    });

    animation = window.requestAnimationFrame(anim);
  }

  anim();
}

function pauseApp() {
  window.cancelAnimationFrame(animation);
  setState({ running: false });
}

function clearApp() {
  pauseApp();
  setState({
    generation: 0,
    cells: state.cells.map(() => "dead")
  });
}

function toggleLife(e) {
  if (!state.running) {
    const cell_index =
      e.target.getAttribute("data-index");

    let cells = state.cells;

    cells[cell_index] === "dead"
      ? cells[cell_index] = "alive"
      : cells[cell_index] = "dead";

    setState({ cells });
  }
}

function createWorld() {
  let cells = Array(state.cells.length).fill("dead");

  for (let i = 0; i <= 50; i++) {
    let random_cell_indexes = cells.filter(
      (cell, i) => {
        if (cell === "dead") {
          return i;
        }
      }
    );

    cells[Math.floor(
      Math.random() * (random_cell_indexes.length - 0)
    ) + 0] = "alive";
  }

  setState({ cells });
}

function transformCell(i) {
  let cells = state.cells,
      total_live_neighbours = 0;

  // Loop to check value of each neighbour of a cell
  for (let j = 0; j < 8; j++) {
    let neighbour_index = i;

    // Positioning for top neighbours
    if (j < 3) {
      if (i < state.total_columns) {
        neighbour_index += state.total_cells - state.total_columns;
      }
      else {
        neighbour_index -= state.total_columns;
      }
    }

    // Positioning for bottom neighbours
    if (j > 4) {
      if (i >= state.total_cells - state.total_columns) {
        neighbour_index -= state.total_cells - state.total_columns;
      }
      else {
        neighbour_index += state.total_columns;
      }
    }

    // Positioning for left side neighbours
    if (j === 0 || j === 3 || j === 5) {
      if (i % state.total_columns === 0) {
        neighbour_index += state.total_columns - 1;
      }
      else {
        neighbour_index -= 1;
      }
    }

    // Positioning for right side neighbours
    if (j === 2 || j === 4 || j === 7) {
      if (i % state.total_columns === state.total_columns - 1) {
        neighbour_index -= state.total_columns - 1;
      }
      else {
        neighbour_index += 1;
      }
    }

    // Add to total_live_neighbours if neighbour is alive
    if (
      cells[neighbour_index] === "alive" ||
      cells[neighbour_index] === "old"
    ) {
      total_live_neighbours += 1;
    }
  }

  // Check if cell should live or die
  if (cells[i] === "alive" || cells[i] === "old") {
    if (
      total_live_neighbours < 2 ||
      total_live_neighbours > 3
    ) {
      cells[i] = "dead";
    }
    else if (
      total_live_neighbours === 2 ||
      total_live_neighbours === 3
    ) {
      cells[i] = "old";
    }
  }
  else if (
    cells[i] === "dead" &&
    total_live_neighbours === 3
  ) {
    cells[i] = "alive";
  }

  setState({ cells });
}


/**
 * HELPERS
 */

function setState(newState) {
  Object.assign(state, newState);
  renderApp();
}


/**
 * RENDER
 */

function renderApp() {
  if (!document.getElementById("app")) {
    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
  }
  ReactDOM.render(
    <App />,
    document.getElementById("app")
  );
}

renderApp();
createWorld();
