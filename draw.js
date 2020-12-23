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
  bomb1 = new Bomb();
  bomb2 = new Bomb();
  dead = new sound("dead.mp3");
  eat = new sound("eat.mp3");
  up = new sound("up.mp3");
  down = new sound("down.mp3");
  left = new sound("left.mp3");
  right = new sound("right.mp3");
  fruit.pickLocation();
  bomb1.pickLocation();
  bomb2.pickLocation();

  window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    fruit.draw();
    // bomb1.draw();
    // bomb2.draw();
    snake.update();
    snake.draw();
    snake.drawScore();
    snake.drawHighScore();

    if(snake.eat(fruit)) {
      fruit.pickLocation();
      bomb1.pickLocation();
      bomb2.pickLocation();
  //    bomb3.pickLocation();
    }
    if(snake.bumpTail()) {
      snake.die()
    }
    // if(snake.trip(bomb1) || snake.trip(bomb2)) {
    //   snake.die();
    // }
  }, 115);
}());

  // document.body.onkeyup = function(e){
  //   if(e.keyCode == 32){
  //     snake.xSpeed = 0;
  //     snake.ySpeed = 0;
  //     $('body').append(`<div id="popup" class="modal is-active">
  //     <div class="modal-background"></div>
  //     <div class="modal-content">
  //     <article class="message is-success">
  //       <div class="message-header">
  //         <p>Game Paused</p>
  //         <button id="msg_delete" class="delete" aria-label="delete"></button>
  //       </div>
  //       <div class="message-body">
  //         Current Score: ${snake.total+1}
  //       </div>
  //     </article>
  //     </div>
  //   </div>`);
  //   $('#msg_delete').on("click", handleMsgBtnPress);
  //   }
  // };

  // let handleMsgBtnPress = function () {
  //   $('#popup').remove();
  // };

  window.addEventListener('keydown', ((evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
}))
