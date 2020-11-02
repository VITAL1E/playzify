(function (window, document, undefined) {
  "use strict";

  let divAdmins = document.getElementById("main-admins-list-id");
  let popupAdmins = document.getElementById("popup-main-admins-id");

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
  historyButton.addEventListener("click", function() {
    window.location.href = "admin(history).html";
  });

  let popupUsername = document.getElementById("popup-username-id");

  function createAdmin(admin) {
    let div = document.createElement("div");
    div.setAttribute("class", "admins-admin");

    let divImage = document.createElement("div");
    divImage.setAttribute("class", "admins-admin-1");
    divImage.setAttribute("style", `background-image:url(${admin.userPhoto})`);

    let divUsername = document.createElement("div");
    divUsername.setAttribute("class", "admins-admin-2");
    divUsername.textContent = admin.username;

    div.appendChild(divImage);
    div.appendChild(divUsername);

    div.addEventListener("click", function () {
      popupAdmins.style.display = "block";

      popupUsername.textContent = admin.username;

      let span = document.createElement("span");
      span.textContent = "ADMIN";

      popupUsername.appendChild(span);

      let cancelButton = document.getElementById("popup-cancel-button");
      cancelButton.addEventListener("click", function () {
        popupAdmins.style.display = "none";
      });
    });

    divAdmins.appendChild(div);
  }

  const getAdmins = async () => {
    let adminsArray = [];
    let lastVisible;
    let docs;

    let admins = firebase.firestore().collection("admins");

    await admins.get().then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      // strange behavior
      console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      adminsArray.push(doc.data());
    });

    adminsArray.forEach((admin) => {
      createAdmin(admin);
      console.log(admin);
    });
    adminsArray = [];
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("User signed");
      getAdmins();
    } else {
      // No user is signed in.
      console.log("Not logged in");
    }
  });
})(window, document);
