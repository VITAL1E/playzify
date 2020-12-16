let rowOfPhotos = document.getElementById("row-of-product-photos");
let inputFile = document.getElementById("addImg1");

let addItemButton = document.getElementById("create-listing-add-item-id");

function onSelectChangeCategoryType() {
  let categoryType = document.getElementById("create-listing-category-type");
  let categoryTypeOption =
    categoryType.options[categoryType.selectedIndex].value;
  console.log(categoryTypeOption);
  return categoryTypeOption;
}
function onSelectChangeGameType() {
  let gameType = document.getElementById("create-listing-game-type");
  let gameTypeOption = gameType.options[gameType.selectedIndex].value;
  console.log(gameTypeOption);
  return gameTypeOption;
}
function onSelectChangeGameServer() {
  let gameServer = document.getElementById("create-listing-game-server");
  let gameServerOption = gameServer.options[gameServer.selectedIndex].value;
  console.log(gameServerOption);
  return gameServerOption;
}
function onSelectChangeGameGaranty() {
  let gameGaranty = document.getElementById("create-listing-garanty");
  let gameGarantyOption = gameGaranty.options[gameGaranty.selectedIndex].value;
  console.log(gameGarantyOption);
  return gameGarantyOption;
}
function onSelectChangeGameDelivery() {
  let gameDelivery = document.getElementById("create-listing-delivery");
  let gameDeliveryOption =
    gameDelivery.options[gameDelivery.selectedIndex].value;
  console.log(gameDeliveryOption);
  return gameDeliveryOption;
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase
      .firestore()
      .collection("users")
      .doc(user.displayName)
      .get()
      .then((snapshot) => {
        if (!snapshot.data().verified === true) {
          alert("You are not verified yet!");
          location.href = "homepage.html";
        }
        if (!user.emailVerified) {
          alert("Please verify your email address first!");
          location.href = "homepage.html";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("signed");
  } else {
    console.log("Not signed");
  }
});

let numberOfImages = 0;
let imagesArray = [];

function addImageToForm(e) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let files = e.target.files;
      if (numberOfImages + files.length > 4) {
        alert("You can only upload at most 4 files!");
        return;
      }
      numberOfImages += files.length;

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

            //const reference = firebase.storage().ref("game_images/" + file.name);

            let divDocument = document.createElement("div");
            let divDocumentClose = document.createElement("div");
            let image = document.createElement("img");
            //let imagePreview = document.createElement("img");

            divDocument.setAttribute("class", "id-document");
            divDocumentClose.setAttribute("class", "id-document-close");
            divDocumentClose.addEventListener("click", function () {
              divDocument.style.display = "none";
              numberOfImages--;
              // it might not work because of username
              const reference = firebase
                .storage()
                .ref(`${user.displayName}/game_images/` + file.name);
              reference.delete();
              //.then(snapshot => snapshot.ref.getDownloadURL());
            });

            image.setAttribute("class", "image-preview");
            image.setAttribute(
              "style",
              "border-radius: 15px; height: 70px; width: 70px;"
            );
           image.setAttribute("src", imageFile.result);

            // imagePreview.onload = function (e) {
            //   let canvas = document.createElement("canvas");
            //   let MAX_WIDTH = 200;

            //   let scaleSize = MAX_WIDTH / e.target.width;
            //   canvas.width = MAX_WIDTH;
            //   canvas.height = e.target.height * scaleSize;

            //   let ctx = canvas.getContext("2d");
            //   console.log(imageFile);
            //   console.log(e.target);

            //   ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
            //   console.log(e.target);

            //   let srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
            //   image.setAttribute("src", srcEncoded);
            // }
            divDocument.appendChild(divDocumentClose);
            divDocument.appendChild(image);
            rowOfPhotos.appendChild(divDocument);
          });
          const reference = firebase
            .storage()
            .ref(`${user.displayName}/game_images/` + file.name);
          reference
            .put(file)
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((url) => {
              imagesArray.push(url);
            });
          reader.readAsDataURL(file);
        } else {
          image.style.display = null;
        }
      }
    } else {
      console.log("Not logged in");
    }
  });
}

function getImageURLsFromArray(...imagesArray) {
  console.log(...imagesArray);
  return imagesArray;
}

function addItemValidation() {
  addItemButton.removeEventListener("click", addItemValidation, false);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let gameTitle = document.getElementById("create-listing-title").value;
      let gamePrice = document.getElementById("create-listing-price").value;
      let gameDescription = document.getElementById(
        "create-listing-description"
      );
      let gameDescriptionContent = gameDescription.textContent;
      console.log(gameDescriptionContent);

      let categoryTypeOption = onSelectChangeCategoryType();
      let gameTypeOption = onSelectChangeGameType();
      let gameServerOption = onSelectChangeGameServer();
      let gameGarantyOption = onSelectChangeGameGaranty();
      let gameDeliveryOption = onSelectChangeGameDelivery();

      console.log(categoryTypeOption);
      console.log(gameTypeOption);
      console.log(gameTitle);
      console.log(gamePrice);
      console.log(gameDescriptionContent);
      console.log(getImageURLsFromArray(...imagesArray));
      console.log(gameServerOption);
      console.log(gameGarantyOption);
      console.log(gameDeliveryOption);

      if (isValid(categoryTypeOption) &&
          isValid(gameTypeOption) &&
          isValid(gameTitle) &&
          isValid(gamePrice) &&
          !isNaN(parseInt(gamePrice)) &&
          (parseInt(gamePrice) > 0 && parseInt(gamePrice) <= 9999) &&
          isValid(gameDescriptionContent) &&
          isValid(gameServerOption) &&
          isValid(gameGarantyOption) &&
          isValid(gameDeliveryOption)
      ) {
        let gameData = {
          postId: "",
          likes: [],
          seller: user.displayName,
          sellerPhoto: user.photoURL,
          category: categoryTypeOption,
          type: gameTypeOption,
          title: gameTitle,
          price: gamePrice,
          images: getImageURLsFromArray(...imagesArray),
          description: gameDescriptionContent,
          server: gameServerOption,
          garanty: gameGarantyOption,
          delivery: gameDeliveryOption,
          createdAt: new Date(),
        };

        let gamesReference = firebase
          .firestore()
          .collection("games")
          .doc();

        gamesReference
          .set(gameData)
          .then(function () {
            gamesReference.set(
              {
                postId: gamesReference.id,
              },
              { merge: true }
            );
          })
          .then(() => {
            console.log("Success");
            location.href = "homepage.html";
          })
          .catch((error) => {
              let errorMessage = error.message;
              console.log(errorMessage);
              window.alert("Message " + errorMessage);
          });

      } else {
        if (parseInt(gamePrice) === 0) {
          alert("Invalid price");
          return;
        }
        alert("All fields required!");

        console.log(categoryTypeOption);
        console.log(gameTypeOption);
        console.log(gameTitle);
        console.log(gamePrice);
        console.log(gameDescriptionContent);
        console.log(getImageURLsFromArray(...imagesArray));
        console.log(gameServerOption);
        console.log(gameGarantyOption);
        console.log(gameDeliveryOption);

        location.reload();
      }
    } else {
      console.log("fuck off");
    }
  });
}

const isValid = (string) => {
  if (string.trim() === "") {
    return false;
  }
  return true;
};

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
addItemButton.addEventListener("click", addItemValidation, false);
