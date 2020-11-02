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

  addButton.addEventListener("click", function () {
    popupAddSlide.style.display = "block";

    let doneButton = document.getElementById("done-button-id");
    doneButton.addEventListener("click", function () {
      alert("Added slide to DB");
      popupAddSlide.style.display = "none";
    });

    let cancelButton = document.getElementById("cancel-button-id");
    cancelButton.addEventListener("click", function () {
      popupAddSlide.style.display = "none";
    });
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
          alert("Successfully deleted, refresh the page");
          console.log("Successfully delted");
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

    let slides = firebase.firestore().collection("banner");

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
