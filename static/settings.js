let settingsChangeButton = document.getElementById("settings-change-button-id");
let rowOfPhotos = document.getElementById("row-of-id-photos-id");
let inputFile = document.getElementById("addImgProfile");
let profilePicture = document.getElementById("user-icon-2-id");
let storeDescription = document.getElementById("productDescriptionInput");
let addItemButton = document.getElementById("create-listing-add-item-id");

let photoPictureURL;

firebase.auth().onAuthStateChanged(function(user) {
  photoPictureURL = user.photoURL;
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
  }
});

settingsChangeButton.addEventListener("click", function() {
  let user = firebase.auth().currentUser;
  console.log(user);

  user.updateProfile({
    photoURL: photoPictureURL,
  })
  .then(function () {
    console.log("Update successfull");
  })
  .catch(function (error) {
    console.log(error);
  });

  firebase.firestore()
  .doc(`/users/${user.displayName}`)
  .set({
    profilePicture: photoPictureURL,
    description: storeDescription.innerText
  }, { merge: true })
  .then(function () {
    console.log(storeDescription.innerText);
    console.log("Successfully updated profile photo and description to database");
  })
  .catch(function (error) {
    console.log(error);
  });

  // firebase.firestore()
  // .collection("games")
  // .where("seller", "==", user.displayName)
  // .get()
  // .then(function(snapshot) {
  //   snapshot.forEach(function (doc) {
  //     doc.data().sellerPhoto = photoPictureURL
  //   });
  //   console.log("Successfully changed posts seller profie photos");
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

  setTimeout(getToIndexPage, 1000);
});

function getToIndexPage() {
  window.location.href = "homepage.html";
}

function addImageToForm(e) {
  let user = firebase.auth().currentUser;
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

        removeImage();
        divDocument.appendChild(image);
        rowOfPhotos.appendChild(divDocument);
      });
      const reference = firebase.storage().ref(user.displayName + "/profile_images/" + file.name);
      reference
        .put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          let profileImg = document.createElement("img");
          profileImg.setAttribute("src", url);
          profilePicture.appendChild(profileImg);
          photoPictureURL = url;
         });
      reader.readAsDataURL(file);
    } else {
      image.style.display = null;
    }
  }
}

const removeImage = () => {
  let elements = document.getElementsByClassName("id-document");
  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
