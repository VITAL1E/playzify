(function (window, document, undefined) {
  "use strict";

  let verificationButton = document.getElementById("seller-verify-button");
  let rowOfPhotos = document.getElementById(
    "seller-verification-row-photos-id"
  );
  let inputFile = document.getElementById("addImg2");

  let username;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.displayName)
        .get()
        .then((snapshot) => {
          if (snapshot.data().verified === true) {
            console.log("verified");
            location.href = "Create-listing.html";
          } else {
            firebase
            .firestore()
            .collection("verifications")
            .doc(user.displayName)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                if (snapshot.data().status === "Pending") {
                  alert("Your request is already sent");
                  window.location.href = "homepage.html";
                }
                if (snapshot.data().status === "Refused") {
                  alert("Your request is refused");
                  window.location.href = "homepage.html";
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
          }
        });
      let usernameVerification = firebase.auth().currentUser.displayName;
      username = usernameVerification;
      console.log(usernameVerification);
    } else {
      location.href = "sign-in.html";
    }
  });

  let numberOfImages = 0;
  let imagesArray = [];
  function addImageToForm(e) {
    let files = e.target.files;
    if (numberOfImages + files.length > 3) {
      alert("You can only upload at most 3 files!");
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

          //const reference = firebase.storage().ref(`${username}/document_images/` + file.name);

          let divDocument = document.createElement("div");
          let divDocumentClose = document.createElement("div");
          let image = document.createElement("img");

          divDocument.setAttribute("class", "id-document");
          divDocumentClose.setAttribute("class", "id-document-close");
          divDocumentClose.addEventListener("click", function () {
            divDocument.style.display = "none";
            numberOfImages--;
            const reference = firebase
              .storage()
              .ref(`${username}/document_images/` + file.name);
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
        const reference = firebase
          .storage()
          .ref(`${username}/document_images/` + file.name);
        reference
          .put(file)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
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

  function submitVerificationForm() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let sellerVerificationName = document.getElementById(
          "seller-verification-name-id"
        ).value;
        let sellerVerificationSurname = document.getElementById(
          "seller-verification-surname-id"
        ).value;
        let sellerVerificationMonth = document.getElementById(
          "seller-verification-month-id"
        ).value;
        let sellerVerificationDay = document.getElementById(
          "seller-verification-day-id"
        ).value;
        let sellerVerificationYear = document.getElementById(
          "seller-verification-year-id"
        ).value;
        let sellerVerificationCountry = document.getElementById(
          "seller-verification-country-id"
        ).value;
        let sellerVerificationCity = document.getElementById(
          "seller-verification-city-id"
        ).value;
        let sellerVerificationAddress = document.getElementById(
          "seller-verification-address-id"
        ).value;
        let sellerVerificationPostalCode = document.getElementById(
          "seller-verification-postal-code-id"
        ).value;

        if (
          (sellerVerificationDay >= 1 || sellerVerificationDay <= 31) &&
          (sellerVerificationMonth >= 1 || sellerVerificationMonth <= 12)
        ) {
          console.log(sellerVerificationName);
          console.log(sellerVerificationSurname);
          console.log(sellerVerificationMonth);
          console.log(sellerVerificationDay);
          console.log(sellerVerificationYear);
          console.log(sellerVerificationCountry);
          console.log(sellerVerificationCity);
          console.log(sellerVerificationAddress);
          console.log(sellerVerificationPostalCode);

          const verification = {
            status: "Pending",
            username: user.displayName,
            name: sellerVerificationName,
            surname: sellerVerificationSurname,
            userPhoto: user.photoURL,
            month: sellerVerificationMonth,
            day: sellerVerificationDay,
            year: sellerVerificationYear,
            country: sellerVerificationCountry,
            city: sellerVerificationCity,
            address: sellerVerificationAddress,
            postalCode: sellerVerificationPostalCode,
            images: getImageURLsFromArray(...imagesArray),
            createdAt: new Date(),
          };

          // PARSE INT IMPORTANT
          console.log(parseInt(sellerVerificationMonth, 10) + 1);
          console.log(parseInt(sellerVerificationDay) <= 31);
          console.log(parseInt(sellerVerificationMonth) <= 12);

          firebase
            .firestore()
            .doc(`verifications/${user.displayName}`)
            .set(verification)
            .then(() => {
              firebase
                .firestore()
                .collection("notifications")
                .doc(user.displayName)
                .collection("notifications")
                .add({
                  action:
                    "Congratulation, your request for verification has been successfully submitted.",
                  seen: false,
                  typeOfNotification: "Submitted",
                  createdAt: new Date(),
                })
                .then(() => {
                  alert("Successfully submited verification");
                  location.href = "homepage.html";
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Unsuccess");
          return;
        }
      } else {
        console.log("Not signed");
      }
    });
  }

  verificationButton.addEventListener("click", function () {
    submitVerificationForm();

    console.log("Send to admins");
  });

  inputFile.addEventListener("change", addImageToForm, false);
})(window, document);
