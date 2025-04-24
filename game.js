const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
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
  let winner = null;
  let player1Score = 0;
  let player2Score = 0;

  const updateScore = () => {
    if (winner === player1.name) {
      player1Score++;
    } else if (winner === player2.name) {
      player2Score++;
    }
  };

  const getScores = () => {
    return { player1Score, player2Score };
  };

  const resetScores = () => {
    player1Score = 0;
    player2Score = 0;
  };

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

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const playTurn = (index) => {
    if (isGameOver) return;

    if (!Gameboard.setCell(index, currentPlayer.marker)) return;

    if (checkWin(currentPlayer.marker)) {
      isGameOver = true;
      winner = currentPlayer.name;
      updateScore();
      return;
    }

    if (checkTie()) {
      isGameOver = true;
      winner = null;
      return;
    }

    switchPlayer();
  };

  const checkWin = (marker) => {
    return winningCombos.some((combo) =>
      combo.every((index) => Gameboard.getBoard()[index] === marker),
    );
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayerName = () => currentPlayer.name;

  const restart = () => {
    Gameboard.reset();
    isGameOver = false;
    currentPlayer = player1;
    winner = null;
    resetScores();
  };

  const nextRound = () => {
    Gameboard.reset();
    isGameOver = false;
    currentPlayer = player1;
    winner = null;
  };

  return {
    playTurn,
    restart,
    nextRound,
    isOver: () => isGameOver,
    getResult: () => (winner ? `${winner} wins!` : "It's a tie!"),
    getCurrentPlayerName,
    getScores,
  };
})();

const DisplayController = (() => {
  const boardContainer = document.getElementById("gameboard");
  const messageBox = document.getElementById("message");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const player1Display = document.getElementById("player1");
  const player2Display = document.getElementById("player2");
  const player1ScoreDisplay = document.getElementById("player1-score");
  const player2ScoreDisplay = document.getElementById("player2-score");

  const updateScoreDisplay = () => {
    const scores = Game.getScores();
    player1ScoreDisplay.textContent = scores.player1Score;
    player2ScoreDisplay.textContent = scores.player2Score;
  };

  const render = () => {
    boardContainer.innerHTML = "";
    const board = Gameboard.getBoard();
    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => handleClick(index));
      boardContainer.appendChild(cellDiv);
    });
    updatePlayerIndicator();
    updateScoreDisplay();
  };

  const updatePlayerIndicator = () => {
    player1Display.classList.remove("current-player");
    player2Display.classList.remove("current-player");

    if (Game.getCurrentPlayerName() === "Player 1") {
      player1Display.classList.add("current-player");
    } else {
      player2Display.classList.add("current-player");
    }
  };

  const handleClick = (index) => {
    Game.playTurn(index);
    render();
    updateMessage();
    if (Game.isOver()) {
      nextBtn.disabled = false;
    }
  };

  const updateMessage = () => {
    if (Game.isOver()) {
      messageBox.textContent = Game.getResult();
      player1Display.classList.remove("current-player");
      player2Display.classList.remove("current-player");
    } else {
      messageBox.textContent = `${Game.getCurrentPlayerName()}'s turn`;
    }
  };

  restartBtn.addEventListener("click", () => {
    Game.restart();
    nextBtn.disabled = true;
    render();
    messageBox.textContent = "";
  });

  nextBtn.addEventListener("click", () => {
    Game.nextRound();
    nextBtn.disabled = true;
    render();
    messageBox.textContent = "";
  });

  return { render };
})();

DisplayController.render();
