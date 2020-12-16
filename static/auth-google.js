function onSelectChangeSecurityQuestion() {
  let securityQuestionType = document.getElementById(
    "sign-google-security-question"
  );
  let securityQuestionTypeOption =
    securityQuestionType.options[securityQuestionType.selectedIndex].value;
  console.log(securityQuestionTypeOption);
  return securityQuestionTypeOption;
}

let signGoogleButton = document.getElementById("sign-in-google-button-id");

signGoogleButton.addEventListener("click", () => {
  let usernameValue = document.getElementById("sign-google-username-id").value;
  let securityQuestionValue = onSelectChangeSecurityQuestion();
  let securityAnswerValue = document.getElementById("sign-google-answer-id")
    .value;
  console.log("I fucking clicked gogoel ");
  console.log("Username to save " + usernameValue);
  console.log("Question to save " + securityQuestionValue);
  console.log("Security answer to save " + securityAnswerValue);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user);
      const userCredentials = {
        userId: user.uid,
        email: user.email,
        favorites: [],
        following: [],
        followers: [],
        username: usernameValue,
        securityQuestion: securityQuestionValue,
        securityAnswer: securityAnswerValue,
        profilePicture: null,
        balance: 0,
        balanceOnHold: 0,
        verified: false,
        description: "nothing about this user",
        createdAt: new Date(),
      };

      firebase
        .firestore()
        .collection("users")
        .doc(usernameValue)
        .set(userCredentials)
        .then(() => console.log("Created new user"))
        .then(() => {
          user
            .updateProfile({
              displayName: usernameValue,
            })
            .then(() => {
              console.log("Updated this user");
            })
            .then(() => {
              firebase
                .firestore()
                .collection("users")
                .doc(usernameValue)
                .set({
                  profilePicture: user.photoURL
                }, { merge: true })
                .then(() => {
                  console.log("Updated picture profile");
                })
                .then(() => {
                  location.href = "homepage.html";
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .then(() => {
          console.log("to homeapge");
          //location.href = "homepage.html";
        })
        .catch((error) => console.log(error));
    } else {
      location.href = "homepage.html";
    }
  });
});
