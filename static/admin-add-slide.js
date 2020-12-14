(function (window, document, undefined) {
  "use strict";

  let generalButton = document.getElementById("general-button");
  let adminsButton = document.getElementById("admins-button");
  let supportButton = document.getElementById("support-button");
  let sellerVerificationButton = document.getElementById(
    "seller-verifications-button"
  );
  let reportsButton = document.getElementById("reports-button");
  let withdrawsButton = document.getElementById("withdraws-button");
  let usersButton = document.getElementById("users-button");
  let addCategoryButton = document.getElementById("add-category-button");
  let addSlideButton = document.getElementById("add-slide-button");
  let historyButton = document.getElementById("history");
  let disputesButton = document.getElementById("disputes-button");

  let homepageBanner = document.getElementById("homepage-slider");
  console.log(homepageBanner);

  let indexBanner = document.getElementById("index-slider");

  let homepageOptions = document.getElementById("homepage-options-id");
  console.log(homepageOptions);

  let indexOptions = document.getElementById("index-options-id");

  let homepageBackground = document.getElementById("homepage-background");
  console.log(homepageBackground);

  let indexBackground = document.getElementById("index-background");

  

  if (generalButton) {
    generalButton.addEventListener("click", function () {
      window.location.href = "admin.html";
    });
  }

  if (disputesButton) {
    disputesButton.addEventListener("click", function () {
      window.location.href = "admin(disputes).html";
    });
  }

  if (adminsButton) {
    adminsButton.addEventListener("click", function () {
      window.location.href = "admin(admins).html";
    });
  }

  if (supportButton) {
    supportButton.addEventListener("click", function () {
      window.location.href = "admin(support).html";
    });
  }

  if (sellerVerificationButton) {
    sellerVerificationButton.addEventListener("click", function () {
      window.location.href = "admin(seller-verification).html";
    });
  }

  if (withdrawsButton) {
    withdrawsButton.addEventListener("click", function () {
      window.location.href = "admin(withdraw).html";
    });
  }

  if (usersButton) {
    usersButton.addEventListener("click", function () {
      window.location.href = "admin(user).html";
    });
  }

  if (addCategoryButton) {
    addCategoryButton.addEventListener("click", function () {
      window.location.href = "admin(add-category).html";
    });
  }

  if (addSlideButton) {
    addSlideButton.addEventListener("click", function () {
      window.location.href = "admin(add-slide).html";
    });
  }

  if (historyButton) {
    historyButton.addEventListener("click", function () {
      window.location.href = "admin(history).html";
    });
  }

  if (reportsButton) {
    reportsButton.addEventListener("click", function () {
      window.location.href = "admin(reports).html";
    });
  }

  let inputFile = document.getElementById("addImg1");
  let rowOfPhotos = document.getElementById("row-of-photos-id");

  let addButton = document.getElementById("add-button-id");
  let popupAddSlide = document.getElementById("popup-add-slide-id");
  let divSlides = document.getElementById("slides-main-list-id");

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
                reference
                .delete()
                .then(() => {
                  location.reload();
                });
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

  if (addButton) {
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
            if (snapshot.size === 0) {
              imageIndex = 1;
            } else {
              imageIndex = snapshot.size + 1;
            }
            console.log(snapshot.size);
            console.log(imageIndex);
          })
          .then(() => {
            updateBannerHomepage();
          })
          .then(() => {
            let newSlideAdded = slideReference.doc();
            newSlideAdded
              .set({
                slideId: newSlideAdded.id,
                link: popupText.textContent,
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
  }

  function createSlide(slide, index) {
    let div = document.createElement("div");
    div.setAttribute("class", "sllidess-admin");
    div.setAttribute("style", `background-image:url(${slide.image})`);

    let divBannerSlide = document.createElement("div");
    divBannerSlide.setAttribute("class", "sllidess-admin-1");

    let divBannerSlideIndex = document.createElement("div");
    divBannerSlideIndex.setAttribute("class", "sllidess-admin-2");
    divBannerSlideIndex.textContent = index;

    firebase
      .firestore()
      .collection("banner")
      .doc(slide.slideId)
      .set(
        {
          index: index,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Updated the index");
      })
      .catch((error) => {
        console.log(error);
      });

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

    if (divSlides) {
      divSlides.appendChild(div);
    }
  }

  const getSlides = async () => {
    let slidesArray = [];
    let lastVisible;
    let docs;

    let slides = firebase.firestore().collection("banner").orderBy("index");

    await slides.get().then((snapshot) => {
      docs = snapshot;
      // lastVisible = snapshot.docs[snapshot.docs.length - 1];
      // console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      slidesArray.push(doc.data());
    });

    slidesArray.forEach((slide, index) => {
      createSlide(slide, index + 1);
      console.log(slide);
      console.log(index + 1);
    });
    slidesArray = [];
  };

  let bannerArray = [];
  let firstArray = [];
  let lastArray = [];
  function updateBannerHomepage() {
    let firstElement;
    let lastElement;
    let bannerReference = firebase.firestore().collection("banner");

    bannerReference
      .orderBy("index", "desc")
      .limit(1)
      .get()
      .then((querySpanshot) => {
        querySpanshot.docs.forEach((e) => {
          lastElement = e.data();
        });
        console.log(lastElement);
      })
      .then(() => {
        bannerReference
          .orderBy("index")
          .limit(1)
          .get()
          .then((querySpanshot) => {
            querySpanshot.docs.forEach((e) => {
              firstElement = e.data();
            });
            console.log(firstElement);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then(() => {
        bannerReference
          .orderBy("index")
          .get()
          .then((snapshot) => {
            console.log(firstElement);
            console.log(lastElement);

            firstArray.push(firstElement);
            lastArray.push(lastElement);

            snapshot.docs.forEach((image) => {
              console.log("Adding from docs");
              bannerArray.push(image.data());
            });

            let mainBannerArray = lastArray.concat(bannerArray, firstArray);

            console.log(mainBannerArray);
            // console.log(firstAndLastArray.slice(0, 1));
            // console.log(firstAndLastArray.slice(1, 2));

            mainBannerArray.forEach((image, index) => {
              let divImage = document.createElement("div");
              divImage.setAttribute("class", "img-slider");

              if (index === 0) {
                console.log("First " + image.image);
                divImage.setAttribute("id", "first");
                console.log(image);
              }

              if (index === mainBannerArray.length - 1) {
                console.log("Last " + image.image);
                divImage.setAttribute("id", "last");
                console.log(image);
              }

              let img = document.createElement("img");
              img.setAttribute("src", image.image);

              divImage.appendChild(img);

              // divImage.addEventListener("click", function () {
              //   location.href = image.data().link
              // });

              if (homepageBanner) {
                homepageBanner.appendChild(divImage);
              }

              if (indexBanner) {
                indexBanner.appendChild(divImage);
              }
            });

            console.log(mainBannerArray);
          })
          .catch((error) => {
            console.log(error);
          });

        bannerArray = [];
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateOptionsHomepage() {
    firebase
      .firestore()
      .collection("banner")
      .orderBy("index")
      .get()
      .then((snapshot) => {
        let array = snapshot.docs;
        let link = document.createElement("a");

        if (homepageBackground) {
          homepageBackground.appendChild(link);
        }

        if (indexBackground) {
          indexBackground.appendChild(link);
        }

          for (let i = 0; i < array.length; i++) {
            console.log("i before " + i);

            let imgBackground = document.createElement("img");
            imgBackground.setAttribute("class", "bg");
            imgBackground.setAttribute("src", array[i].data().image);
            imgBackground.setAttribute("data-href", array[i].data().link);

            console.log("i during " + i);

            // imgBackground.addEventListener("click", function (e) {
            //   console.log("i with click " + i);
            //   const alertText = e.target.getAttribute("data-index");
            //   alert(alertText);
            // });

            link.appendChild(imgBackground);
          }

          // homepageBackground.addEventListener("click", redirectToLink, false);

          // function redirectToLink(e) {
          //   if (e.target !== e.currentTarget) {
          //     let clickedImage = e.target.src;
          //     alert("Hello " + clickedImage);
          //   }
          // }

          for (let i = 0; i < snapshot.size; i++) {
            let li = document.createElement("li");
            li.setAttribute("class", "option");
            li.setAttribute("op-index", i);
  
            if (homepageOptions) {
              homepageOptions.appendChild(li);
            }

            if (indexOptions) {
              indexOptions.appendChild(li);
            }
          }

        

        //snapshot.docs.forEach((image, index) => {
          // let imgBackground = document.createElement("img");
          // imgBackground.setAttribute("class", "bg");
          // imgBackground .setAttribute("src", image.data().image);

          // imgBackground.addEventListener("click", function () {
          //   alert(index); // image.data().link
          // });
        //});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // document.addEventListener(
  //   "load", function () {
  //     setTimeout(updateBannerHomepage, 5000);
  //   }
  // );

  updateBannerHomepage();
  updateOptionsHomepage();
  getSlides();

})(window, document);
