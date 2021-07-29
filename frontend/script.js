window.onload = function () {
  $("#rules").on("click", handleRulesBtnPress);
  $("#leaders").on("click", handleLeadersBtnPress);
  $("#author").on("click", handleAuthorBtnPress);

  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      // fetch logged-in user's high score
      const db = firebase.firestore();
      const users = db.collection("users");
      const currUser = users.doc(firebaseUser.uid);
      currUser.get().then(function (snapshot) {
        const highScore = snapshot.data().highScore;
        drawHighScore(highScore);
      });

      $("#userEmail").append(`<p>${firebaseUser.email}</p>`);
      $("#redirect").html("Logout");
      $("#redirect").attr("id", "logout");
      $("#logout").on("click", handleLogoutBtnPress);

      $("#userEmail").append(
        `<div class="navbar-item">
          <button id="scores" class="button is-link is-normal">View My Scores</button>
        </div>`
      );
      $("#scores").on("click", handleScoresBtnPress);
    } else {
      $("#logout").html("Login or Sign Up");
      $("#logout").attr("id", "redirect");
      $("#redirect").on("click", handleRedirectBtnPress);
      console.log("not logged in");
      drawHighScore(0);
    }
  });
};

let handleAuthorBtnPress = function () {
  window.open("https://personal-website-d0c2d.web.app/", "_blank");
};

let handleLogoutBtnPress = function () {
  firebase.auth().signOut();
  $("#userEmail").empty();
};

let handleRedirectBtnPress = function () {
  location.href = "login.html";
};

let handleRulesBtnPress = function () {
  $("#rules").remove();
};

let handleLeadersBtnPress = function () {
  $("body").append(`<div id="leaderboard" class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
  <article class="message is-link">
    <div class="message-header">
      <p>Leaderboard</p>
      <button id="leaders_delete" class="delete" aria-label="delete"></button>
    </div>
    <div id="msg_body" class="message-body">
    <table class="table is-fullwidth is-striped">
    <thead>
      <tr>
        <th>Rank</th>
        <th>User</th>
        <th>Score</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody id="tbody">
    </tbody>
    </table>
      <br>
      <div id="btn_container" class="container has-text-centered">
        <button id="load" class="button is-link is-normal">Load all scores</button>
      </div>
    </div>
  </article>
  </div>
</div>`);
  $("#leaders_delete").on("click", handleLeadersDelBtnPress);
  $("#load").on("click", handleLoadBtnPress);
  fetchLeaderboard(0, 5);
};

let handleLeadersDelBtnPress = function () {
  $("#leaderboard").remove();
};

let handleLoadBtnPress = function () {
  $("#load").remove();
  const db = firebase.firestore();
  db.collection("leaderboard")
    .get()
    .then(function (snapshot) {
      let size = snapshot.size; // will return the collection size
      fetchLeaderboard(5, size);
      $("#btn_container").append(
        `<button id="hide" class="button is-link is-normal">Hide scores</button>`
      );
      $("#hide").on("click", { param: size - 1 }, handleHideBtnPress);
    });
};

let handleHideBtnPress = function (event) {
  $("#hide").remove();
  let length = event.data.param;

  // remove scores 6 through length
  for (let i = length; i > 4; i--) {
    $("#" + i).remove();
  }
  $("#btn_container").append(
    `<button id="load" class="button is-link is-normal">Load all scores</button>`
  );
  $("#load").on("click", handleLoadBtnPress);
};

let handleScoresBtnPress = function () {
  $("body").append(`<div id="scoreboard" class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
  <article class="message is-link">
    <div class="message-header">
      <p>My Scores</p>
      <button id="scores_delete" class="delete" aria-label="delete"></button>
    </div>
    <div id="msg_body" class="message-body">
    <table class="table is-fullwidth is-striped">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Score</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody id="sbody">
    </tbody>
    </table>
      <br>
    </div>
  </article>
  </div>
</div>`);
  $("#scores_delete").on("click", handleScoresDelBtnPress);
  fetchScores();
};

let handleScoresDelBtnPress = function () {
  $("#scoreboard").remove();
};

/**
 * TODO: 
 * instead of fetching top 5 scores eacg game, keep local list of top 5 scores and then update list accordingly with new score
 * updateLeaderboard
 */
let fetchLeaderboard = function (start, end) {
  const db = firebase.firestore();

  // append top 5 scores to leaderboard
  for (let i = start; i < end; i++) {
    db.collection("leaderboard")
      .orderBy("score", "desc")
      .limit(end + 1)
      .get()
      .then(function (snapshot) {
        let user = snapshot.docs[i].data().user;
        let score = snapshot.docs[i].data().score;
        let date = snapshot.docs[i].data().date;
        let time = snapshot.docs[i].data().time;
        $("#tbody").append(`<tr id=${i}>
                              <th>${i + 1}</th>
                              <td>${user}</td>
                              <td>${score}</td>
                              <td>${date}</td>
                              <td>${time}</td>
                            </tr>`);
      });
  }
};

let fetchScores = function () {
  var user = firebase.auth().currentUser;
  const currUser = firebase.firestore().collection("users").doc(user.uid);
  currUser.get().then(function (snapshot) {
    let scores = snapshot.data().scores;
    scores.sort((a, b) => b.score - a.score);
    let i = 1;
    scores.forEach(function (x) {
      $("#sbody").append(`<tr>
                              <th>${i}</th>
                              <td>${x.score}</td>
                              <td>${x.date}</td>
                              <td>${x.time}</td>
                            </tr>`);
      i++;
    });
  });
};

let renderPopup = function () {
  $("body").append(`<div id="scoreboard" class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">
  <article class="message is-link">
    <div class="message-header">
      <p>My Scores</p>
      <button id="scores_delete" class="delete" aria-label="delete"></button>
    </div>
    <div id="msg_body" class="message-body">
      <ol id="my_board">
      </ol>
      <br>
    </div>
  </article>
  </div>
</div>`);
};

let drawHighScore = function (score) {
  $("#score").html(`High Score: ${score}`);
};
