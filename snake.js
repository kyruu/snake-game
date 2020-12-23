function Snake() {
  this.x = 160;
  this.y = 180;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.space = false;

  this.highScore = 0;

  this.draw = function() {
    ctx.fillStyle = "#08a322";
    for (let i=0; i<this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  }

  this.update = function() {
    for(let i=0; i<this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i+1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

// check if snake is within canvas boundariess
    if(this.x > (canvas.width-20)) {
      this.die();
    }
    if(this.y > (canvas.height-20)) {
      this.die();
    }
    if(this.x < 0) {
      this.die();
    }
    if(this.y < 0) {
      this.die();
    }
  }

  this.changeDirection = function(direction) {
    switch(direction) {
      case 'Up':
        up.play();
        this.xSpeed = 0;
        this.ySpeed = -scale * 1;
        break;
      case 'Down':
        down.play();
        this.xSpeed = 0;
        this.ySpeed = scale * 1;
        break;
      case 'Left':
        left.play();
        this.xSpeed = -scale * 1;
        this.ySpeed = 0;
        break;
      case 'Right':
        right.play();
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        break;
    }
  }

  document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      this.space = true;
      snake.xSpeed = 0;
      snake.ySpeed = 0;
      $('body').append(`<div id="popup" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
      <article class="message is-success">
        <div class="message-header">
          <p>Game Paused</p>
          <button id="msg_delete" class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          Current Score: ${snake.total+1}
        </div>
      </article>
      </div>
    </div>`);
    $('#msg_delete').on("click", handleMsgBtnPress);
    }
  };

  this.eat = function(fruit) {
    if(this.x === fruit.x && this.y === fruit.y) {
      eat.play();
      this.total++;
      return true;
    }
    return false;
  }

  this.trip = function(bomb) {
    if(this.x === bomb.x && this.y === bomb.y) {
      return true;
    }
    return false;
  }

  this.die = function() {
    dead.play();
    ctx.fillStyle = "#878c8b";
    ctx.fillRect(this.x, this.y, scale, scale);
    if((this.total+1) > this.highScore) {
      this.highScore = this.total+1;
      $('body').append(`<div id="popup" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
      <article class="message is-success">
        <div class="message-header">
          <p>Congratulations!</p>
          <button id="msg_delete" class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          New High Score: ${this.highScore}
        </div>
      </article>
      </div>
    </div>`);
  } else {
    $('body').append(`<div id="popup" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
    <article class="message is-success">
      <div class="message-header">
        <p>Game Over!</p>
        <button id="msg_delete" class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body">
        Score: ${this.total+1}
      </div>
    </article>
    </div>
  </div>`);  
  }
  this.reset();
  $('#msg_delete').on("click", handleMsgBtnPress);
}

  let handleMsgBtnPress = function () {
    $('#popup').remove();
  }

  this.bumpTail = function() {
    for(let j=0; j<this.tail.length - 1; j++) {
      if(this.x === this.tail[j].x && this.y === this.tail[j].y) {
        ctx.fillStyle = "#8c8f8e";
        ctx.fillRect(this.tail[j].x, this.tail[j].y, scale, scale);
        return true;
      }
    }
    return false;
  }

  this.drawScore = function() {
    $('#length').html(`Length: ${this.total+1}`);
   }

  this.drawHighScore = function() {
    $('#score').html(`High Score: ${this.highScore}`);
  }


   this.reset = function() {
     this.x = 160;
     this.y = 180;
     this.xSpeed = 0;
     this.ySpeed = 0;
     this.total = 0;
     this.tail = [];
     fruit.pickLocation();
   }
}
