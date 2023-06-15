import React, { useState, Fragment } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  let groupedSquares = [];
  let row = [];
  let squareNumber = 1;
  for (let i=0; i < squares.length; i++) {
    row.push(
      <Square 
        key={i}
        value={squares[i]} 
        onSquareClick={() => handleClick(i)} 
      />
    );
    squareNumber++;

    if (squareNumber === 4) {
      groupedSquares.push(<div key={i} className="board-row">{row}</div>);
      squareNumber = 1;
      row = [];
    }
  }

  return (
    <Fragment>
      <div className="status">{status}</div>
      {groupedSquares}
    </Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);
  
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSort() {
    setSortAsc(!sortAsc);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = (move === currentMove ? 'You are on ' : 'Go to ') + 'move #' + move;
    } else {
      description = (move === currentMove ? 'You are at game start' : 'Go to game start');
    }

    return (
      <li key={move}>
        {
          move === currentMove ? (
            description
          ) : (
            <button onClick={() => { jumpTo(move) }}>{description}</button>
          )
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className='sort-button' onClick={handleSort}>{sortAsc ? 'Sort descending' : 'Sort ascending' }</button>
        <ol>{sortAsc ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
