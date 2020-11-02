let rowOfPhotos = document.getElementById("row-of-product-photos");
let inputFile = document.getElementById("addImg1");

let addItemButton = document.getElementById("create-listing-add-item-id");

let userCreateListing = {};

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
    // User is signed in.
    let usernameVerification = firebase.auth().currentUser.displayName;
    firebase
      .firestore()
      .collection("users")
      .doc(usernameVerification)
      .get()
      .then((snapshot) => {
        console.log(snapshot.data());
        userCreateListing = snapshot.data();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(usernameVerification);
    console.log("signed");
  } else {
    // No user is signed in.
    console.log("Not signed");
  }
});

let numberOfImages = 0;
let imagesArray = [];

function addImageToForm(e) {
  let files = e.target.files;
  if (numberOfImages + files.length > 4) {
    alert("You can only upload at most 4 files!");
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

        //const reference = firebase.storage().ref("game_images/" + file.name);

        let divDocument = document.createElement("div");
        let divDocumentClose = document.createElement("div");
        let image = document.createElement("img");

        divDocument.setAttribute("class", "id-document");
        divDocumentClose.setAttribute("class", "id-document-close");
        divDocumentClose.addEventListener("click", function () {
          divDocument.style.display = "none";
          numberOfImages--;
          // it might not work because of username
          const reference = firebase
            .storage()
            .ref(`${username}/game_images/` + file.name);
          reference.delete();
          //.then(snapshot => snapshot.ref.getDownloadURL());
        });
        image.setAttribute("class", "image-preview");
        image.setAttribute(
          "style",
          "width: inherit; height: inherit; border-radius: 20px;"
        );
        image.setAttribute("src", imageFile.result);

        divDocument.appendChild(divDocumentClose);
        divDocument.appendChild(image);
        rowOfPhotos.appendChild(divDocument);
      });
      const reference = firebase.storage().ref("game_images/" + file.name);
      reference
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          //console.log(url);
          imagesArray.push(url);
          //window.alert(url);
        });
      reader.readAsDataURL(file);
    } else {
      image.style.display = null;
    }
  }
}

function getImageURLsFromArray(...imagesArray) {
  console.log(...imagesArray);
  return imagesArray;
}

function addItemValidation() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let gameTitle = document.getElementById("create-listing-title").value;
      let gamePrice = document.getElementById("create-listing-price").value;
      let gameQuantity = document.getElementById("create-listing-quantity")
        .value;
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

      if (
        (categoryTypeOption != "" ||
          gameServerOption != "" ||
          gameGarantyOption != "" ||
          gameDeliveryOption != "" ||
          gameTypeOption != "" ||
          gameTitle != "" ||
          !isNaN(gamePrice) ||
          gamePrice > 0 ||
          gamePrice < 10000 ||
          !isNaN(gameQuantity) ||
          gameQuantity > 0 ||
          gameQuantity < 100 ||
          gameDescriptionContent != "") &&
        userCreateListing.verified !== true
      ) {
        let gameData = {
          postId: "",
          seller: user.displayName,
          sellerPhoto: user.photoURL,
          category: categoryTypeOption,
          type: gameTypeOption,
          title: gameTitle,
          price: gamePrice,
          images: getImageURLsFromArray(...imagesArray),
          quantity: gameQuantity,
          description: gameDescriptionContent,
          server: gameServerOption,
          garanty: gameGarantyOption,
          delivery: gameDeliveryOption,
          createdAt: new Date().toISOString(),
        };

        let gamesReference = firebase.firestore().collection("games").doc();

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
          // CHANGED .then -> .catch
          .catch(function (error) {
            if (error) {
              let errorMessage = error.message;
              console.log(errorMessage);
              window.alert("Message " + errorMessage);
            } else {
              console.log("Success");
              window.location.href = "homepage.html";
            }
          });
      } else {
        window.alert("All fields required");
        window.location.reload(false);
      }
    } else {
      console.log("fuck off");
    }
  });
}

inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
addItemButton.addEventListener("click", addItemValidation, false);
