function Snake() {
  this.x = 160;
  this.y = 180;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.pause = false;
  this.highScore = 0;

  this.draw = function () {
    ctx.fillStyle = "#08a322";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // check if snake is within canvas boundariess
    if (this.x > canvas.width - 20) {
      this.die();
    }
    if (this.y > canvas.height - 20) {
      this.die();
    }
    if (this.x < 0) {
      this.die();
    }
    if (this.y < 0) {
      this.die();
    }
  };

  this.changeDirection = function (direction) {
    if ($("#popup").length) {
      return;
    } else {
      switch (direction) {
        case "Up":
          // up.play();
          this.xSpeed = 0;
          this.ySpeed = -scale * 1;
          break;
        case "Down":
          // down.play();
          this.xSpeed = 0;
          this.ySpeed = scale * 1;
          break;
        case "Left":
          // left.play();
          this.xSpeed = -scale * 1;
          this.ySpeed = 0;
          break;
        case "Right":
          // right.play();
          this.xSpeed = scale * 1;
          this.ySpeed = 0;
          break;
      }
    }
  };

  document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
      snake.pause = true;
      $("body").append(`<div id="pause_popup" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
      <article class="message is-success">
        <div class="message-header">
          <p>Game Paused</p>
          <button id="pause_button" class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          Current Score: ${snake.total + 1}
        </div>
      </article>
      </div>
    </div>`);
      $("#pause_button").on("click", handlePauseBtnPress);
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      // eat.play();
      this.total++;
      return true;
    }
    return false;
  };

  this.trip = function (bomb) {
    if (this.x === bomb.x && this.y === bomb.y) {
      return true;
    }
    return false;
  };

  this.die = function () {
    // dead.play();
    this.pause = true;
    // ctx.fillStyle = "#878c8b";
    // ctx.fillRect(this.x, this.y, scale, scale);

    let score = this.total + 1;

    // add current score to score array
    var user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      const users = db.collection("users");
      const leaderboard = db.collection("leaderboard");
      const currUser = users.doc(user.uid);
      currUser.get().then(function (snapshot) {
        let scores = snapshot.data().scores;
        let email = snapshot.data().email;
        let entries = [];

        // check for duplicates
        scores.forEach((entry) => entries.push(entry.score));
        if (!entries.includes(score)) {
          // fetch current date and time
          let date = fetchDate();
          let time = fetchTime();

          // add score to current user's score field
          currUser.update({
            scores: firebase.firestore.FieldValue.arrayUnion({
              score: score,
              date: date,
              time: time,
            }),
          });

          // add score to leaderboard collection
          leaderboard.add({
            user: email,
            score: score,
            date: date,
            time: time,
          });

          // check if current score beats high score
          const highScore = snapshot.data().highScore;
          // update user's highScore field
          if (score > highScore) {
            // update High Score button
            $("#score").html(`High Score: ${score}`);
            currUser.update({
              highScore: score,
            });
            // append congratulations message
            $("body").append(`<div id="popup_1" class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-content">
            <article class="message is-success">
              <div class="message-header">
                <p>Congratulations!</p>
                <button id="msg_delete_1" class="delete" aria-label="delete"></button>
              </div>
              <div class="message-body">
              <h1>New High Score: <strong>${score}</strong></h1>
              </div>
            </article>
            </div>
          </div>`);
            $("#msg_delete_1").on("click", handleMsgBtnPress_1);
          } else {
            renderPopup(score);
            $("#msg_delete_2").on("click", handleMsgBtnPress_2);
          }
        } else {
          // since score already exists, append current score message
          renderPopup(score);
          $("#msg_delete_2").on("click", handleMsgBtnPress_2);
        }
      });
    } else {
      console.log("score not recorded");
      renderPopup(score);
      $("#msg_delete_2").on("click", handleMsgBtnPress_2);
      if (score > this.highScore) {
        this.highScore = score;
        this.drawHighScore(score);
      }
    }
  };

  let handleMsgBtnPress_1 = function () {
    $("#popup_1").remove();
    snake.reset();
  };

  let handleMsgBtnPress_2 = function () {
    $("#popup_2").remove();
    snake.reset();
  };

  let handlePauseBtnPress = function () {
    $("#pause_popup").remove();
    snake.pause = false;
  };

  let renderPopup = function (score) {
    $("body").append(`<div id="popup_2" class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-content">
            <article class="message is-success">
              <div class="message-header">
                <p>Game Over!</p>
                <button id="msg_delete_2" class="delete" aria-label="delete"></button>
              </div>
              <div class="message-body">
                <h1>Score: <strong>${score}</strong></h1>
              </div>
            </article>
            </div>
          </div>`);
  };

  this.bumpTail = function () {
    for (let j = 0; j < this.tail.length - 1; j++) {
      if (this.x === this.tail[j].x && this.y === this.tail[j].y) {
        ctx.fillStyle = "#8c8f8e";
        ctx.fillRect(this.tail[j].x, this.tail[j].y, scale, scale);
        return true;
      }
    }
    return false;
  };

  this.drawScore = function () {
    $("#length").html(`Length: ${this.total + 1}`);
  };

  this.drawHighScore = function (score) {
    $("#score").html(`High Score: ${score}`);
  };

  this.reset = function () {
    this.x = 160;
    this.y = 180;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
    this.pause = false;
    fruit.pickLocation();
  };

  let fetchDate = function () {
    let today = new Date();
    return (
      today.getMonth() +
      1 +
      "/" +
      today.getDate() +
      "/" +
      (today.getFullYear() % 2000)
    );
  };

  let fetchTime = function () {
    let today = new Date();
    let dd = "AM";
    let hours = today.getHours();
    let mins = today.getMinutes();
    if (mins < 10) {
      mins = "0" + mins;
    }
    if (today.getHours() >= 12) {
      hours -= 12;
      dd = "PM";
    }
    if (hours == 0) {
      hours = 12;
    }

    return hours + ":" + mins + " " + dd;
  };
}
