let settingsChangeButton = document.getElementById("settings-change-button-id");
let rowOfPhotos = document.getElementById("row-of-id-photos-id");
let inputFile = document.getElementById("addImgProfile");
let profilePicture = document.getElementById("user-icon-2-id");

let addItemButton = document.getElementById("create-listing-add-item-id");

let numberOfImages = 0;
let imagesArray = [];
let photoPictureURL;

function addImageToForm(e) {
  let user = firebase.auth().currentUser;

  let files = e.target.files;
  if (numberOfImages + files.length > 1) {
    alert("You can only upload at most 1 files!");
    return;
  }
  numberOfImages += files.length;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        console.log(this);

        let imageFile = e.target;

        const reference = firebase.storage().ref("profile_images/" + file.name);

        let divDocument = document.createElement("div");
        // let divDocumentClose = document.createElement("div");
        let image = document.createElement("img");

        divDocument.setAttribute("class", "id-document");
        image.setAttribute("src", imageFile.result);

        // divDocument.appendChild(divDocumentClose);
        divDocument.appendChild(image);
        rowOfPhotos.appendChild(divDocument);
      });
      const reference = firebase.storage().ref("profile_images/" + file.name);
      reference
        .put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          //console.log(url);
          imagesArray.push(url);

          let profileImg = document.createElement("img");
          // profileImg.setAttribute("style",
          // "width: inherit; height: inherit; border-radius: 20px;"
          // );
          profileImg.setAttribute("src", url);
          profilePicture.appendChild(profileImg);
          photoPictureURL = url;

          // user.updateProfile({
          //   photoURL: url,
          //   profilePicture: url
          // });
          //window.alert(url);
         });
      reader.readAsDataURL(file);
    } else {
      image.style.display = null;
    }
  }
}

console.log(firebase.auth().currentUser);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    let usernameVerification = firebase.auth().currentUser.displayName;
    username = usernameVerification;
    console.log(usernameVerification);
    console.log("signed");
  } else {
    // No user is signed in.
    console.log("Not signed");
  }
});

settingsChangeButton.addEventListener("click", function() {
  let user = firebase.auth().currentUser;
  user.updateProfile({
    photoURL: photoPictureURL,
    //profilePicture: photoPictureURL
  });
  firebase.firestore().doc(`/users/${firebase.auth().currentUser.displayName}`).set({
    profilePicture: photoPictureURL
  }, { merge: true });
  window.location.href = "index-logged-in.html";
});

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
