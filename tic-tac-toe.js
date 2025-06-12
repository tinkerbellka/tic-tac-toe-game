const board = document.getElementById("board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let gameBoard;
let isGameOver;

function createBoard() {
  board.innerHTML = "";
  gameBoard = Array.from({ length: 3 }, () => Array(3).fill(""));
  isGameOver = false;
  message.textContent = "";

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handlePlayerMove);
      board.appendChild(cell);
    }
  }
}

function handlePlayerMove(event) {
  if (isGameOver) return;
  const row = +event.target.dataset.row;
  const col = +event.target.dataset.col;

  if (gameBoard[row][col] === "") {
    gameBoard[row][col] = "X";
    updateCell(row, col, "X");

    if (checkWinner("X")) {
      endGame("Вы победили!", getWinningLine("X"));
      return;
    }

    if (isBoardFull()) {
      endGame("Ничья!");
      return;
    }

    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  if (isGameOver) return;

  let move = findBestMove("O") || findBestMove("X") || getRandomMove();
  if (!move) return;

  const { row, col } = move;
  gameBoard[row][col] = "O";
  updateCell(row, col, "O");

  if (checkWinner("O")) {
    endGame("Компьютер победил!", getWinningLine("O"));
    return;
  }

  if (isBoardFull()) {
    endGame("Ничья!");
  }
}

function updateCell(row, col, symbol) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cell.textContent = symbol;
  cell.classList.add("taken");
}

function checkWinner(player) {
  return getWinningLine(player) !== null;
}

function getWinningLine(player) {
  const lines = [
    // Горизонтали
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // Вертикали
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // Диагонали
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
  ];

  for (const line of lines) {
    if (line.every(([r, c]) => gameBoard[r][c] === player)) {
      return line;
    }
  }
  return null;
}

function endGame(text, winningLine = null) {
  isGameOver = true;
  message.textContent = text;

  if (winningLine) {
    for (const [r, c] of winningLine) {
      document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`)
        .classList.add("win");
    }
  }

  document.querySelectorAll(".cell").forEach(cell => cell.classList.add("taken"));
}

function isBoardFull() {
  return gameBoard.flat().every(cell => cell !== "");
}

// Ищет выигрышную позицию для себя или блокирует игрока
function findBestMove(player) {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (gameBoard[r][c] === "") {
        gameBoard[r][c] = player;
        if (checkWinner(player)) {
          gameBoard[r][c] = "";
          return { row: r, col: c };
        }
        gameBoard[r][c] = "";
      }
    }
  }
  return null;
}

function getRandomMove() {
  const empty = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (gameBoard[r][c] === "") {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

restartBtn.addEventListener("click", createBoard);
createBoard();
