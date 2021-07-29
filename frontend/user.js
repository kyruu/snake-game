window.onload = function () {
  $("#login").on("click", handleLoginBtnPress);
  $("#signup").on("click", handleSignupBtnPress);

  // Add a realtime listener
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      const db = firebase.firestore();
      const users = db.collection("users");
      users
        .doc(firebaseUser.uid)
        .get()
        .then(function (doc) {
          if (!doc.exists) {
            users
              .doc(firebaseUser.uid)
              .set({ email: firebaseUser.email, scores: [], highScore: 0 })
              .then(function () {
                location.href = "index.html";
              });
          } else {
            location.href = "index.html";
          }
        });
    }
  });
};

let handleLoginBtnPress = function () {
  $("#error").remove();
  let email = $("#txtEmail").val();
  let pass = $("#txtPassword").val();
  const auth = firebase.auth();
  // Sign In
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch((e) =>
    $("#passField").append(`<p id="error" style="color:red;">${e.message}</p>`)
  );
  console.log("login");
};

let handleSignupBtnPress = function () {
  $("#error").remove();
  let email = $("#txtEmail").val();
  let pass = $("#txtPassword").val();
  const auth = firebase.auth();
  // Sign In
  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise.catch((e) =>
    $("#passField").append(`<p id="error" style="color:red;">${e.message}</p>`)
  );
};
