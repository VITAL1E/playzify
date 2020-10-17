const auth = firebase.auth();
//const db = firebase.firestore();
const signForm = document.querySelector(".content-sign-in");

let everyHeaderUsername = document.getElementsByClassName("user-header-username");


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
// Get data
//    db.collection("games").onSnaphot(snapshot => {
//    setupGames(snapshot.docs);
// });
//   } else {
// Make it be like empty array
//    setupGames([]);
//   }
// });

// signout
// function signout() {
//   var logout = document.querySelector("#some-logout-id");
//   logout.addEventListener('click', (e) => {
//     e.preventDefault();
//     auth.signOut();
//   });
// }

function onSelectChangeSecurityQuestionType() {
  let securityQuestionType = document.getElementById("sign-up-security-question-type");
  let securityQuestionTypeOption =
    securityQuestionType.options[securityQuestionType.selectedIndex].value;
  console.log(securityQuestionTypeOption);
  return securityQuestionTypeOption;
}

function signUp() {
  let usernameValue = document.getElementById("sign-up-username").value;
  let passwordValue = document.getElementById("sign-up-password").value;
  let confirmPasswordValue = document.getElementById("sign-up-confirm-password").value;
  let emailValue = document.getElementById("sign-up-email").value;
  let securityQuestionTypeValue = onSelectChangeSecurityQuestionType();
  let securityQuestionAnswerValue = document.getElementById("sign-up-security-question-answer").value;

  console.log(usernameValue);
  console.log(passwordValue);
  console.log(confirmPasswordValue);
  console.log(emailValue);
  console.log(securityQuestionTypeValue);
  console.log(securityQuestionAnswerValue);

  let errors = {};

  if (isEmpty(emailValue)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(emailValue)) {
    errors.email = "Must be valid";
  }

  if (isEmpty(passwordValue)) errors.password = "Must not be empty";
  if (passwordValue !== confirmPasswordValue)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(usernameValue)) errors.username = "Must not be empty";

  if (Object.keys(errors).length > 0)
    // errors.error = errors;
    console.log(errors);

  let token;
  let userId;
  firebase
    .firestore()
    .doc(`/users/${usernameValue}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // errors.username = "This username is already taken";
        console.log("This username is already taken");
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(emailValue, passwordValue);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.updateProfile({
        displayName: usernameValue,
      });
    })
    // .then((idToken) => {
    //   token = idToken;
    //   const userCredentials = {
    //     username: usernameValue,
    //     email: emailValue,
    //     securityQuestion: securityQuestionTypeValue,
    //     securityAnswer: securityQuestionAnswerValue,
    //     createdAt: new Date().toISOString(),
    //     userId,
    //   };
    //   console.log("reached return of firebase");
    //   return firebase.firestore().doc(`/users/${usernameValue}`).set(userCredentials);
    // })
    .then(() => {
      const userCredentials = {
        username: usernameValue,
        email: emailValue,
        securityQuestion: securityQuestionTypeValue,
        securityAnswer: securityQuestionAnswerValue,
        createdAt: new Date().toISOString(),
        userId,
      };
      console.log("reached return of firebase");
      return firebase
        .firestore()
        .doc(`/users/${usernameValue}`)
        .set(userCredentials);
    })
    .then(() => {
      // Have to WAIT a bit until `user` is added to `users` collection
      setTimeout(() => {
        window.location.href = "index-logged-in.html";
      }, 500);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);

      signForm.querySelector(".register-error").innerHTML = errorMessage;
    });
}

const isEmail = (email) => {
  const regEx = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

function signIn() {
  var usernameValue = document.getElementById("sign-in-username").value;
  var passwordValue = document.getElementById("sign-in-password").value;

  console.log(usernameValue);
  console.log(passwordValue);

  let errors = {};

  if (isEmpty(passwordValue)) errors.password = "Must not be empty";
  if (isEmpty(usernameValue)) errors.password = "Must not be empty";

  if (Object.keys(errors).length > 0) {
    signForm.querySelector(".register-error").innerHTML = json(errors);
    // return res.status(400).json(errors);
  }

  let email;
  let user = firebase.auth().currentUser;
  firebase
    .firestore()
    .doc(`/users/${usernameValue}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        email = doc.data().email;
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, passwordValue)
          .then((userCredentials) => {
            if (userCredentials.user) {
              // WHY reupdate displayName ???
              userCredentials.user
                .updateProfile({
                  displayName: usernameValue,
                })
                .then(() => {
                  console.log(user.displayName);
                })
                .catch((err) => {
                  console.log(err);
                });
              window.location.href = "index-logged-in.html";
            }
          })
          .catch((err) => {
            // Wrong password message
            let errorMessage = err.message;
            signForm.querySelector(".register-error").innerHTML = errorMessage;
            console.log(err);
          })
          .catch((err) => {
            let errorMessage = err.message;
            signForm.querySelector(".register-error").innerHTML = errorMessage;
            console.error(err);
          });
      } else {
        errors.message = "No such user";
        console.log("No such user");
        signForm.querySelector(".register-error").innerHTML = errors.message;
      }
    })
    .catch((err) => {
      console.error(err);
      let errorMessage = err.message;
      signForm.querySelector(".register-error").innerHTML = errorMessage;
    });
}

function onSelectChangeSecurityQuestion() {
  let securityQuestion = document.getElementById(
    "sign-google-security-question"
  );
  let securityQuestionOption =
    securityQuestion.options[securityQuestion.selectedIndex].value;
  console.log(securityQuestionOption);
  return securityQuestionOption;
}

function signUpWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  console.log(provider);
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      console.log("Token " + token);
      // The signed-in user info.
      let user = result.user;
      console.log("USer " + JSON.parse(JSON.stringify(user)));

      let userId = result.user.uid;
      console.log("UserId " + userId);

      let email = result.user.email;
      console.log("Google email is " + email);

      let isUserNew = result.additionalUserInfo.isNewUser;
      console.log("User credential " + isUserNew); // shows true if first time

      if (isUserNew) {
        window.location.href = "sign-up-google.html";

        setTimeout(() => {
          let username = document.getElementById("sign-google-username-id").value;
          let securityQuestion = onSelectChangeSecurityQuestion();
          let securityAnswer = document.getElementById("sign-google-answer-id")
            .value;
          let signGoogleButton = document.getElementById(
            "sign-in-google-button-id"
          );
  
          console.log("Username " + username);
          console.log("Question " + securityQuestion);
          console.log("Security answer " + securityAnswer);
  
          const userCredentials = {
            userId,
            email,
            username,
            securityQuestion,
            securityAnswer,
            verified: false,
            createdAt: new Date().toISOString(),
          };
  
          // ADD EVENT LISTENER GOOGLE BUTTON SIGN IN
          signGoogleButton.addEventListener("click", () => {
            signGoogle(username, userCredentials);
          });
        }, 5000);
      } else {
        console.log("Login ");
        window.location.href = "index-logged-in.html";

        // firebase
        //   .auth()
        //   .signInWithPopup(provider)
        //   .then((result) => {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     let token = result.credential.accessToken;
        //     // The signed-in user info.
        //     let user = result.user;
        //     // ...
        //     window.location.href = "index-logged-in.html";
        //   })
        //   .catch((error) => {
        //     // Handle Errors here.
        //     let errorCode = error.code;
        //     let errorMessage = error.message;
        //     // The email of the user's account used.
        //     let email = error.email;
        //     // The firebase.auth.AuthCredential type that was used.
        //     let credential = error.credential;
        //     // ...
        //   });
      }
      //let signInGoogleButton = document.getElementById("sign-in-google-button-id");

      // signInGoogleButton.addEventListener("click", () => {
      //   window.location.href = "index-logged-in.html";
      // }, false);
      // window.location.href = "index-logged-in.html";
    })
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;

      signForm.querySelector(".register-error").innerHTML =
        errorMessage + "351";
    });
  console.log("Clicked google");
}

function signGoogle(username, userCredentials) {
  console.log("Add event listener button");
  // Check if username is available
  console.log("Im working");
  firebase
    .firestore()
    .doc(`/users/${username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("This username is taken");
        return;
      }
    });
  // Set USERNAME to NAME displayed
  let userCurrent = firebase.auth().currentUser;
  userCurrent.updateProfile({
    displayName: username,
  });
  // .then(() => {
  //   let displayName = userCurrent.displayName;
  //   console.log(displayName);
  // }, (error) => {
  //   console.log(error);
  // });
  firebase.firestore().doc(`/users/${username}`).set(userCredentials);

  window.location.href = "index-logged-in.html";
  console.log("You successfully signed up");
  console.log("Work method");
}


auth.onAuthStateChanged((user) => {
      // ALSO redirect ???
      // LOOP redirect
  //window.location.href = "index-logged-in.html";

  if (user) {
    for (let i = 0; i < everyHeaderUsername.length; ++i) {
      everyHeaderUsername[i].textContent = `${user.displayName}`;
    }
    //auth.signOut();
  } else {
    for (let i = 0; i < everyHeaderUsername.length; ++i) {
      everyHeaderUsername[i].textContent = "Sign in";
    }
    console.log("Not logged in");
  }
});

let user = auth.currentUser;

// if (user) {
//   console.log("Logged");
//   for (let i = 0; i < everyHeaderUsername.length; ++i) {
//     everyHeaderUsername[i].textContent = `${user.displayName}`;
//   }
// } else {
//   console.log("Not logged");
//   for (let i = 0; i < everyHeaderUsername.length; ++i) {
//     everyHeaderUsername[i].textContent = "Sign in";
//   }
//   window.location.href = "index.html";
// }

// if (!user) {
//   window.location.href = "index.html";
// }
