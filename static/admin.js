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

  generalButton.addEventListener("click", function () {
    window.location.href = "admin.html";
  });

  disputesButton.addEventListener("click", function () {
    window.location.href = "admin(disputes).html";
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
  reportsButton.addEventListener("click", function () {
    window.location.href = "admin(reports).html";
  });

  let totalUsers = document.getElementById("admin-info-total-users");
  let totalSellers = document.getElementById("admin-info-total-sellers");
  let totalSales = document.getElementById("admin-info-total-sales");

  let withdrawsInformation = document.getElementById("admin-info-withdraws");
  let sellerVerificationsInformation = document.getElementById("admin-info-verifications");
  let supportInformation = document.getElementById("admin-info-support");
  let anotherSpotInformation = document.getElementById("admin-info-another-spot");

  firebase
    .firestore()
    .collection("users")
    .get()
    .then((snapshot) => {
      totalUsers.innerHTML = snapshot.size;
    });

    firebase
    .firestore()
    .collection("users")
    .where("verified", "==", true)
    .get()
    .then((snapshot) => {
      totalSellers.innerHTML = snapshot.size;
    });
    
    firebase
    .firestore()
    .collection("orders")
    .where("status", "==", "Completed")
    .get()
    .then((snapshot) => {
      totalSales.innerHTML = snapshot.size;
    });  

    firebase
    .firestore()
    .collection("withdraws")
    .get()
    .then((snapshot) => {
      withdrawsInformation.innerHTML = snapshot.size;
    }); 

    firebase
    .firestore()
    .collection("verifications")
    .get()
    .then((snapshot) => {
      sellerVerificationsInformation.innerHTML = snapshot.size;
    }); 

    firebase
    .firestore()
    .collection("problems")
    .get()
    .then((snapshot) => {
      supportInformation.innerHTML = snapshot.size;
    }); 

    anotherSpotInformation.textContent = 10;

})(window, document);
