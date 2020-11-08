let settingsChangeButton = document.getElementById("settings-change-button-id");
let rowOfPhotos = document.getElementById("row-of-id-photos-id");
let inputFile = document.getElementById("addImgProfile");
//let profilePicture = document.getElementById("user-icon-2-id");
let addItemButton = document.getElementById("create-listing-add-item-id");
let logoutButton = document.getElementById("logout-button-id");
let storeDescription = document.getElementById("productDescriptionInput");

let passwordError = document.getElementById("settings-password-error-id");

let newPhotoPictureURL = null;

let FILE_PROFILE_PICTURE;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
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
    window.location.href = "index.hmtl";
  }
});

logoutButton.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("Logged out");
      window.location.href = "index.html";
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

  if (isEmpty(oldPasswordValue) || isEmpty(newPasswordValue)) {
    return;
  } else {
    if (oldPasswordValue === newPasswordValue) {
      alert("New password cannot be old password");
      // return;
    } else {
      let user = getCurrentUser();

      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, oldPasswordValue)
        .then((userCredentials) => {
          console.log(userCredentials);
          if (!userCredentials) {
            alert("Invalid old password");
            return;
          }
        })
        .then(() => {
          user
            .updatePassword(newPasswordValue)
            .then(() => {
              console.log("Successfuly updated the password");
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

function changeUserSettings() {
  let user = getCurrentUser();
  let userReference = getCurrentUserReference();
  userReference
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
        let userReference = getCurrentUserReference();
        console.log(userReference);
        userReference
          .set(
            {
              profilePicture: newPhotoPictureURL,
            },
            { merge: true }
          )
          .then(() => {
            console.log(
              "Succesfully changed profile picture of user in collection"
            );
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then(() => {
        firebase
          .firestore()
          .collection("games")
          .where("seller", "==", user.displayName)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc
                .set(
                  {
                    sellerPhoto: newPhotoPictureURL,
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log("Successfully updated all pictures of user");
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  })
    .then(() => {
      changePassword();
    })
    .then(() => {
      //getToIndexPage();
    })
    .catch((error) => {
      console.log(error);
    });
}

function getUserSettings() {
  let userReference = getCurrentUserReference();
  userReference.get().then((snapshot) => {
    storeDescription.innerText = snapshot.data().description;
    console.log(snapshot.data().description);
  });
}

settingsChangeButton.addEventListener("click", function () {
  let user = getCurrentUser();
  console.log(user.displayName);

  changeUserSettings();

  // changePassword();
  // changeDescription(user);

  //console.log(newPhotoPictureURL);

//   user
//     .updateProfile({
//       photoURL: newPhotoPictureURL,
//     })
//     .then(() => {
//       saveImage(user, FILE_PROFILE_PICTURE);
//       console.log("Update successfull");
//     })
//     .then(() => {
//       let userReference = getCurrentUserReference();
//       userReference
//         .set(
//           {
//             profilePicture: newPhotoPictureURL,
//           },
//           { merge: true }
//         )
//         .then(() => {
//           console.log(
//             "Succesfully changed profile picture of user in collection"
//           );
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     })
//     .then(() => {
//       firebase
//         .firestore()
//         .collection("games")
//         .where("seller", "==", user.displayName)
//         .get()
//         .then((querySnapshot) => {
//           querySnapshot.forEach((doc) => {
//             doc
//               .set(
//                 {
//                   sellerPhoto: newPhotoPictureURL,
//                 },
//                 { merge: true }
//               )
//               .then(() => {
//                 console.log("Successfully updated all pictures of user");
//               })
//               .catch((error) => {
//                 console.log(error);
//               });
//           });
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
});

function getToIndexPage() {
  window.location.href = "homepage.html";
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
    window.location.href = "index.html";
  }
});

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
