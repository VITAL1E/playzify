(function (window, document, undefined) {
  "use strict";

  let generalButton = document.getElementById("general-button");
  let adminsButton = document.getElementById("admins-button");
  let supportButton = document.getElementById("support-button");
  let sellerVerificationButton = document.getElementById(
    "seller-verifications-button"
  );
  let withdrawsButton = document.getElementById("withdraws-button");
  let usersButton = document.getElementById("users-button");
  let addCategoryButton = document.getElementById("add-category-button");
  let addSlideButton = document.getElementById("add-slide-button");
  let historyButton = document.getElementById("history");

  generalButton.addEventListener("click", function () {
    window.location.href = "admin.html";
  });

  adminsButton.addEventListener("click", function () {
    window.location.href = "admin(admins).html";
  });
  supportButton.addEventListener("click", function () {
    window.location.href = "admin(support).html";
  });
  sellerVerificationButton.addEventListener("click", function () {
    window.location.href = "admin(seller-verification).html";
  });
  withdrawsButton.addEventListener("click", function () {
    window.location.href = "admin(withdraw).html";
  });
  usersButton.addEventListener("click", function () {
    window.location.href = "admin(user).html";
  });
  addCategoryButton.addEventListener("click", function () {
    window.location.href = "admin(add-category).html";
  });
  addSlideButton.addEventListener("click", function () {
    window.location.href = "admin(add-slide).html";
  });
  historyButton.addEventListener("click", function () {
    window.location.href = "admin(history).html";
  });

  let addButton = document.getElementById("add-button-id");

  let popupAddSlide = document.getElementById("popup-add-slide-id");

  let divSlides = document.getElementById("slides-main-list-id");

  let rowOfPhotos = document.getElementById("row-of-photos-id");

  let inputFile = document.getElementById("addImg1");

  let imageSlideURL;
  function addImageToForm(e) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let files = e.target.files;

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
                const reference = firebase
                  .storage()
                  .ref(`${user.displayName}/slide_images/` + file.name);
                reference.delete();
                //.then(snapshot => snapshot.ref.getDownloadURL());
              });
              image.setAttribute("class", "image-preview");
              image.setAttribute(
                "style",
                "width: 87px; height: 75px; border-radius: 20px;"
              );
              image.setAttribute("src", imageFile.result);

              divDocument.appendChild(divDocumentClose);
              divDocument.appendChild(image);
              rowOfPhotos.appendChild(divDocument);
            });
            const reference = firebase
              .storage()
              .ref(`${user.displayName}/slide_images/` + file.name);
            reference
              .put(file)
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .then((url) => {
                imageSlideURL = url;
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

  addButton.addEventListener("click", function () {
    popupAddSlide.style.display = "block";

    let popupText = document.getElementById("productDescriptionInput");

    let doneButton = document.getElementById("done-button-id");
    doneButton.addEventListener("click", function () {
      let imageIndex = 0;
      let slideReference = firebase.firestore().collection("banner");

      slideReference
        .get()
        .then((snapshot) => {
          imageIndex = snapshot.size + 1;
          console.log(snapshot.size);
          console.log(imageIndex);
        })
        .then(() => {
          let newSlideAdded = slideReference.doc();
          newSlideAdded
            .set({
              slideId: newSlideAdded.id,
              text: popupText.textContent,
              image: imageSlideURL,
              index: imageIndex,
            })
            .then(() => {
              let user = firebase.auth().currentUser;
              console.log(user);
              console.log(user.displayName);

              firebase
                .firestore()
                .collection("history")
                .doc(user.displayName)
                .collection("actions")
                .add({
                  username: user.displayName,
                  action: `added slide ${imageIndex}`,
                  createdAt: new Date(),
                })
                .then(() => {
                  console.log("Successfully added action");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .then(() => {
              popupAddSlide.style.display = "none";
              location.reload();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    let cancelButton = document.getElementById("cancel-button-id");
    cancelButton.addEventListener("click", function () {
      popupAddSlide.style.display = "none";
    });

    inputFile.addEventListener("change", addImageToForm, false); // false, inner div first then outter handled
  });

  function createSlide(slide) {
    let div = document.createElement("div");
    div.setAttribute("class", "sllidess-admin");
    div.setAttribute("style", `background-image:url(${slide.image})`);

    let divBannerSlide = document.createElement("div");
    divBannerSlide.setAttribute("class", "sllidess-admin-1");

    let divBannerSlideIndex = document.createElement("div");
    divBannerSlideIndex.setAttribute("class", "sllidess-admin-2");
    divBannerSlideIndex.textContent = slide.index;

    let divBannerSlideClose = document.createElement("div");
    divBannerSlideClose.setAttribute("class", "sllidess-admin-3");

    divBannerSlideClose.addEventListener("click", function () {
      firebase
        .firestore()
        .collection("banner")
        .doc(slide.slideId)
        .delete()
        .then(() => {
          console.log("Successfully deleted");
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    });

    divBannerSlide.appendChild(divBannerSlideIndex);
    divBannerSlide.appendChild(divBannerSlideClose);

    div.appendChild(divBannerSlide);

    divSlides.appendChild(div);
  }

  const getSlides = async () => {
    let slidesArray = [];
    let lastVisible;
    let docs;

    let slides = firebase.firestore().collection("banner").orderBy("index");

    await slides.get().then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      slidesArray.push(doc.data());
    });

    slidesArray.forEach((slide) => {
      createSlide(slide);
      console.log(slide);
    });
    slidesArray = [];
  };

  getSlides();
})(window, document);
