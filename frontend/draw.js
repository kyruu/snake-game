const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const pixels = 400;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const board = {
  rows: 20,
  columns: 20,
  colors: {
    light: '#effce3',
    dark: '#dce8d1'
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function drawBoard() {
  ctx.beginPath();
  ctx.fillStyle = board.colors.dark;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = board.colors.light;
  for (let column = 0; column < board.columns; column++) {
    for (let row = 0; row < board.rows; row++) {
      if (row % 2 === 0 && column % 2 === 1 || row % 2 === 1 && column % 2 === 0) {
        ctx.rect(
          column * canvas.width / board.columns,
          row * canvas.height / board.rows,
          canvas.width / board.columns,
          canvas.height / board.rows
          );
        }
      }
    }
    ctx.fill();
  }

(function setup() {
  snake = new Snake();
  fruit = new Fruit();
  dead = new sound("audio/dead.mp3");
  eat = new sound("audio/eat.mp3");
  up = new sound("audio/up.mp3");
  down = new sound("audio/down.mp3");
  left = new sound("audio/left.mp3");
  right = new sound("audio/right.mp3");
  fruit.pickLocation();

  window.setInterval(() => {
    if (snake.pause) {
      
    } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    fruit.draw();
    snake.update();
    snake.draw();
    snake.drawScore();

    if (snake.eat(fruit)) {
      fruit.pickLocation();
    }

    if (snake.bumpTail()) {
      snake.die()
    }
  }
  }, 100);
}());

  window.addEventListener('keydown', ((evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
}))
