const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", "", ""];
  };
  return { getBoard, setCell, reset };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const Game = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let isGameOver = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const playTurn = (index) => {
    if (isGameOver) return;
    if (!Gameboard.setCell(index, currentPlayer.marker)) return;

    if (checkWin(currentPlayer.marker)) {
      isGameOver = true;
      console.log(`${currentPlayer.name} wins!`);
    } else if (Gameboard.getBoard().every((cell) => cell !== "")) {
      isGameOver = true;
      console.log("It's a tie.");
    } else {
      switchPlayer();
    }
  };

  const checkWin = (marker) => {
    return winningCombos.some((combo) =>
      combo.every((index) => Gameboard.getBoard()[index] === marker),
    );
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const restart = () => {
    Gameboard.reset();
    isGameOver = false;
    currentPlayer = player1;
  };

  return { playTurn, restart };
})();
