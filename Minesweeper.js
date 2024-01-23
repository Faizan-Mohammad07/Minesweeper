const SIZE = 10;
const MINES = 10;

let grid = [];
let timer = null;
let time = 0;

function createGrid() {
  for (let i = 0; i < SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < SIZE; j++) {
      grid[i][j] = { mine: false, revealed: false, flagged: false };
    }
  }
}

function placeMines() {
  let placed = 0;
  let text = document.getElementById("text");
  while (placed < MINES) {
    let x = Math.floor(Math.random() * SIZE);
    let y = Math.floor(Math.random() * SIZE);
    if (!grid[x][y].mine) {
      grid[x][y].mine = true;
      placed++;
    }
  }
}

function drawGrid() {
  let table = document.getElementById("grid");
  table.innerHTML = "";
  for (let i = 0; i < SIZE; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < SIZE; j++) {
      let cell = document.createElement("td");
      if (grid[i][j].revealed) {
        if (grid[i][j].mine) {
          cell.classList.add("mine");
        } else {
          cell.innerHTML = countMines(i, j);
        }
      } else if (grid[i][j].flagged) {
        var img = document.createElement("img");
        img.src = "https://img.icons8.com/ios-filled/100/FA5252/empty-flag.png";
        cell.innerHTML = "";
        cell.appendChild(img);
      }
      cell.onclick = () => revealCell(i, j);
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        flagCell(i, j);
      };
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function countMines(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;
      if (x + i >= 0 && x + i < SIZE && y + j >= 0 && y + j < SIZE) {
        if (grid[x + i][y + j].mine) count++;
      }
    }
  }
  return count;
}

function revealCell(x, y) {
  if (grid[x][y].revealed || grid[x][y].flagged) return;
  grid[x][y].revealed = true;
  drawGrid();
  if (grid[x][y].mine) {
    gameOver();
  } else if (countMines(x, y) == 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) continue;
        if (x + i >= 0 && x + i < SIZE && y + j >= 0 && y + j < SIZE) {
          revealCell(x + i, y + j);
        }
      }
    }
  }
  checkWin();
}

function flagCell(x, y) {
  if (grid[x][y].revealed) return;
  grid[x][y].flagged = !grid[x][y].flagged;
  drawGrid();
}

function gameOver() {
  clearInterval(timer);
  alert("Game Over!");
  resetGame();
}

function checkWin() {
  let win = true;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (!grid[i][j].mine && !grid[i][j].revealed) {
        win = false;
        break;
      }
    }
  }
  if (win) {
    clearInterval(timer);
    alert("You win!");
    resetGame();
  }
}

function resetGame() {
  createGrid();
  placeMines();
  drawGrid();
  clearInterval(timer);
  time = 0;
  document.getElementById("time").innerHTML = time;
  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerHTML = time;
  }, 1000);
}

resetGame();
var div = document.getElementById("reset-game");
div.addEventListener("click", resetGame);
