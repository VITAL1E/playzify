const auth = firebase.auth();
//const db = firebase.firestore();
const signForm = document.querySelector(".content-sign-in");

let everyHeaderUsername = document.getElementsByClassName(
  "user-header-username"
);

function onSelectChangeSecurityQuestionType() {
  let securityQuestionType = document.getElementById(
    "sign-up-security-question-type"
  );
  let securityQuestionTypeOption =
    securityQuestionType.options[securityQuestionType.selectedIndex].value;
  console.log(securityQuestionTypeOption);
  return securityQuestionTypeOption;
}

let clickCounter = 0;

function signUp() {
  clickCounter++;

  if (clickCounter === 2) {
    location.reload();
  }

  let usernameValue = document.getElementById("sign-up-username").value;
  let passwordValue = document.getElementById("sign-up-password").value;
  let confirmPasswordValue = document.getElementById("sign-up-confirm-password")
    .value;
  let emailValue = document.getElementById("sign-up-email").value;
  let securityQuestionTypeValue = onSelectChangeSecurityQuestionType();
  let securityQuestionAnswerValue = document.getElementById(
    "sign-up-security-question-answer"
  ).value;

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

  if (isEmpty(passwordValue)) {
    errors.password = "Must not be empty";
  }

  if (passwordValue !== confirmPasswordValue) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(usernameValue)) {
    errors.username = "Must not be empty";
  }

  if (Object.keys(errors).length > 0) {
    errors.error = errors;
    console.log(errors);
  }

  let userId;

  firebase
    .firestore()
    .doc(`/users/${usernameValue}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        errors.username = "This username is already taken";
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
    .then(() => {
      const userCredentials = {
        username: usernameValue,
        email: emailValue,
        securityQuestion: securityQuestionTypeValue,
        securityAnswer: securityQuestionAnswerValue,
        createdAt: new Date(),
        favorites: [],
        followers: [],
        following: [],
        balance: 0,
        balanceOnHold: 0,
        description: "nothing about this user",
        profilePicture: null,
        verified: false,
        userId,
      };
      console.log("reached return of firebase");

      return firebase
        .firestore()
        .doc(`/users/${usernameValue}`)
        .set(userCredentials)
        .then(() => {
          signForm.querySelector(".register-verification").innerHTML =
            "Please check your email for verification";
          signForm.querySelector(".register-error").innerHTML = "";
        })
        .then(() => {
          let user = getCurrentUser();

          if (user !== null && user !== undefined) {
            user
              .sendEmailVerification()
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .then(() => {
          let user = getCurrentUser();
          if (user !== null && user !== undefined) {
            if (user.emailVerified) {
              location.href = "homepage.html";
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode);
      console.log(errorMessage);

      signForm.querySelector(".register-verification").innerHTML = "";
      signForm.querySelector(".register-error").innerHTML = errorMessage;
    });
}

function getCurrentUser() {
  let user = firebase.auth().currentUser;
  return user;
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
        console.log(email);
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, passwordValue)
          .then((userCredentials) => {
            if (userCredentials.user) {
              // WHY reupdate displayName ???
              // userCredentials.user
              //   .updateProfile({
              //     displayName: usernameValue,
              //   })
              //   .then(() => {
              //     console.log(user.displayName);
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //   });
              window.location.href = "homepage.html";
            }
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

      let userIdValue = result.user.uid;
      console.log("UserId " + userIdValue);

      let emailValue = result.user.email;
      console.log("Google email is " + emailValue);

      let isUserNew = result.additionalUserInfo.isNewUser;
      console.log("User credential " + isUserNew); // shows true if first time

      if (isUserNew) {
        console.log("First time");
        window.location.href = "sign-up-google.html";
      } else {
        console.log("Login ");
        firebase
          .firestore()
          .collection("users")
          .doc(user.displayName)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              console.log("User exist in collection");
              location.href = "homepage.html";
            } else {
              firebase
              .auth()
              .signOut()
              .then(function () {
                console.log("Not exist just signed out");
                alert("Please sign with Google first");
                location.href = "sign-up.html";
              })
              .catch(function (error) {
                console.log(error);
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;

      // signForm.querySelector(".register-error").innerHTML =
      //   errorMessage + "351";
      signForm.querySelector(".register-error").innerHTML = errorMessage;
    });
  console.log("Clicked google");
}

function checkIfVerfifiedEmail() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (user.emailVerified && user.providerData[0].providerId !== "google.com") {
        location.href = "homepage.html";
      }
      console.log("Logged in as " + JSON.stringify(user));
    } else {
      console.log("Not logged in");
    }
  });
}

setInterval(checkIfVerfifiedEmail, 5000);

