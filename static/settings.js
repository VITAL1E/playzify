let settingsChangeButton = document.getElementById("settings-change-button-id");
let rowOfPhotos = document.getElementById("row-of-id-photos-id");
let inputFile = document.getElementById("addImgProfile");
//let profilePicture = document.getElementById("user-icon-2-id");
let addItemButton = document.getElementById("create-listing-add-item-id");
let logoutButton = document.getElementById("logout-button-id");
let storeDescription = document.getElementById("productDescriptionInput");
let userEmail = document.getElementById("emailInput");

let passwordError = document.getElementById("settings-password-error-id");

let newPhotoPictureURL = null;

let FILE_PROFILE_PICTURE;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user);
    let oldPasswordDiv = document.getElementById("old-password-div-id");
    let newPasswordDiv = document.getElementById("new-password-div-id");

    if (user.providerData[0].providerId !== "google.com") {
      oldPasswordDiv.style.display = "block";
      newPasswordDiv.style.display = "block";
    }

    let usernameVerification = firebase.auth().currentUser.displayName;
    username = usernameVerification;
    console.log(usernameVerification);

    if (user.photoURL !== null) {
      let divDocument = document.createElement("div");
      divDocument.setAttribute("class", "id-document");

      let image = document.createElement("img");
      image.setAttribute("style", "width: 100px; border-radius: 17px;");
      image.setAttribute("src", user.photoURL);

      divDocument.appendChild(image);
      rowOfPhotos.appendChild(divDocument);
    }
  } else {
    console.log("Not signed");
    location.href = "index.html";
  }
});

logoutButton.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("Logged out");
      location.href = "index.html";
    })
    .catch(function (error) {
      console.log(error);
    });
});

// const isEmpty = (string) => {
//   if (string.trim() === "") return true;
//   else return false;
// };

function changePassword() {
  let oldPasswordValue = document.getElementById("old-password-id").value;
  let newPasswordValue = document.getElementById("new-password-id").value;

  if (document.getElementById("old-password-id").style.display === "block") {
    console.log(true);
  } else {
    console.log(false);
  }

  if (isEmpty(oldPasswordValue) || isEmpty(newPasswordValue)) {
    return;
  } else {
    if (oldPasswordValue === newPasswordValue) {
      alert("New password cannot be old password");
      //return;
    } else {
      let user = getCurrentUser();
      let credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPasswordValue
      );

      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          console.log("User reauthenticated");
        })
        .then(() => {
          user
            .updatePassword(newPasswordValue)
            .then(() => {
              console.log("Successfuly updated the password");
            })
            .then(() => {
              alert("Saved changes");
              getToIndexPage();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          passwordError.innerHTML = error.message;
        });
    }
  }
  console.log(oldPasswordValue);
  console.log(newPasswordValue);
}

let gamesOfCurrentUser = [];
function changeUserSettings() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.displayName)
        .set(
          {
            description: storeDescription.innerText,
          },
          { merge: true }
        )
        .then(() => {
          console.log("Changed description");

          if (newPhotoPictureURL !== null) {
            user
              .updateProfile({
                photoURL: newPhotoPictureURL,
              })
              .then(() => {
                // saveImage(user, FILE_PROFILE_PICTURE);
                console.log("Update successfull");
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(user.displayName)
                  .set(
                    {
                      profilePicture: user.photoURL,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    console.log(user.photoURL);
                    console.log(newPhotoPictureURL);
                    console.log(
                      "Succesfully changed profile picture of user in collection"
                    );
                  })
                  .then(() => {
                    firebase
                      .firestore()
                      .collection("games")
                      .where("seller", "==", user.displayName)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.docs.forEach((doc) => {
                          gamesOfCurrentUser.push(doc.data());
                        });
                      })
                      .then(() => {
                        changeGameSellerPhotos(
                          gamesOfCurrentUser,
                          user.photoURL
                        );
                        console.log(gamesOfCurrentUser);
                      })
                      .then(() => {
                        let oldPasswordValue = document.getElementById(
                          "old-password-id"
                        ).value;
                        let newPasswordValue = document.getElementById(
                          "new-password-id"
                        ).value;

                        if (
                          !isEmpty(oldPasswordValue) &&
                          !isEmpty(newPasswordValue)
                        ) {
                          changePassword();
                        }
                      })
                      .then(() => {
                        firebase
                          .firestore()
                          .collection("notifications")
                          .doc(user.displayName)
                          .collection("notifications")
                          .add({
                            typeOfNotification: "Verified",
                            action:
                              "Great, new account settings successfully saved",
                            createdAt: new Date(),
                            seen: false,
                          })
                          .then((reference) => {
                            console.log("Added " + reference);
                          })
                          .then(() => {
                            alert("Saved changes");
                            //getToIndexPage();
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            let oldPasswordValue = document.getElementById("old-password-id")
              .value;
            let newPasswordValue = document.getElementById("new-password-id")
              .value;

            if (!isEmpty(oldPasswordValue) && !isEmpty(newPasswordValue)) {
              changePassword();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  });
}

function changeGameSellerPhotos(games, photo) {
  let gamesReference = firebase.firestore().collection("games");

  games.forEach((game) => {
    gamesReference
      .doc(game.postId)
      .set(
        {
          sellerPhoto: photo,
        },
        { merge: true }
      )
      .then(() => console.log("Changed pic"))
      .catch((error) => console.log(error));
  });
}

function getUserSettings() {
  let user = getCurrentUser();
  let userReference = getCurrentUserReference();
  userReference.get().then((snapshot) => {
    if (user.providerData[0].providerId === "google.com") {
      console.log("not editable");
      userEmail.setAttribute("contenteditable", false);
    }
    console.log("editable");

    userEmail.textContent = snapshot.data().email;
    storeDescription.innerText = snapshot.data().description;
    console.log(snapshot.data().description);
  });
}

settingsChangeButton.addEventListener("click", function () {
  let user = getCurrentUser();
  console.log(user.displayName);

  console.log(user);

  if (
    userEmail.innerText !== user.email &&
    user.providerData[0].providerId !== "google.com"
  ) {
    console.log("Email changed");
    console.log("old " + user.email);
    console.log("new " + userEmail.innerText);

    changeEmail();
  }

  changeUserSettings();
});

function changeEmail() {
  let emailValue = document.getElementById("emailInput").innerText;
  let oldPasswordValue = document.getElementById("old-password-id").value;
  let newPasswordValue = document.getElementById("new-password-id").value;

  let user = getCurrentUser();

  console.log(user);
  console.log(emailValue);

  if (!isEmpty(oldPasswordValue) && !isEmpty(newPasswordValue)) {
    if (!isEmail(emailValue)) {
      alert("New email invalid");
      return;
    }
    
    let userCredentials = null;

    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, oldPasswordValue)
      .then((userCredential) => {
        userCredentials = userCredential;

        userCredential.user
          .updateEmail(emailValue)
          .then(() => {
            console.log("updated email");
            userCredentials.user
              .updatePassword(newPasswordValue)
              .then(() => {
                firebase
                .firestore()
                .collection("users")
                .doc(user.displayName)
                .set(
                  {
                    email: emailValue,
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log("Users collection updated");
                })
                .catch((error) => {
                  console.log(error);
                });
                console.log("updated pass as well");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("change email and password");
  }

  if (isEmpty(oldPasswordValue)) {
    alert("You have to provide old password to change email");
    return;
  }

  if (!isEmpty(oldPasswordValue)) {
    if (!isEmail(emailValue)) {
      alert("New email invalid");
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, oldPasswordValue)
      .then((userCredential) => {
        userCredential.user
          .updateEmail(emailValue)
          .then(() => {
            firebase
            .firestore()
            .collection("users")
            .doc(user.displayName)
            .set(
              {
                email: emailValue,
              },
              { merge: true }
            )
            .then(() => {
              console.log("Users collection updated");
            })
            .catch((error) => {
              console.log(error);
            });
            console.log("Success update email " + emailValue);
            console.log("updated email");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  }
}

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

function getToIndexPage() {
  location.href = "homepage.html";
}

function getCurrentUser() {
  let user = firebase.auth().currentUser;
  return user;
}

function getCurrentUserReference() {
  let user = firebase.auth().currentUser;
  return firebase.firestore().collection("users").doc(user.displayName);
}

function addImageToForm(e) {
  let user = getCurrentUser();
  let files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file.size > 1500000) {
      alert("File too large!");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        console.log(this);

        let imageFile = e.target;

        let divDocument = document.createElement("div");
        let image = document.createElement("img");

        divDocument.setAttribute("class", "id-document");
        image.setAttribute("src", imageFile.result);

        console.log(imageFile.result);

        FILE_PROFILE_PICTURE = file;

        removeImage();
        divDocument.appendChild(image);
        rowOfPhotos.appendChild(divDocument);
      });
      const reference = firebase
        .storage()
        .ref(user.displayName + "/profile_images/" + file.name);

      reference
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          // let profileImg = document.createElement("img");
          // profileImg.setAttribute("src", url);
          // profilePicture.appendChild(profileImg);
          newPhotoPictureURL = url;
        })
        .catch((error) => {
          console.log(error);
        });

      reader.readAsDataURL(file);
    } else {
      image.style.display = null;
    }
  }
}

// function saveImage(user, file) {
//   const reference = firebase
//     .storage()
//     .ref(user.displayName + "/profile_images/" + file.name);

//   reference
//     .put(file)
//     .then((snapshot) => snapshot.ref.getDownloadURL())
//     .then((url) => {
//       let profileImg = document.createElement("img");
//       profileImg.setAttribute("src", url);
//       profilePicture.appendChild(profileImg);
//       newPhotoPictureURL = url;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

const removeImage = () => {
  let elements = document.getElementsByClassName("id-document");
  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    getUserSettings();
  } else {
    console.log("Not signed");
    location.href = "index.html";
  }
});

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) {
    return true;
  } else {
    return false;
  }
};

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
