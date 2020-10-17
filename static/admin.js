(function (window, document, undefined) {

"use strict";

let generalButton = document.getElementById("general-button")
let adminsButton = document.getElementById("admins-button");
let supportButton = document.getElementById("support-button");
let sellerVerificationButton = document.getElementById("seller-verifications-button");
let withdrawsButton = document.getElementById("withdraws-button");
let usersButton = document.getElementById("users-button");
let addCategoryButton = document.getElementById("add-category-button");
let addSlideButton = document.getElementById("add-slide-button");

generalButton.addEventListener("click", function() {
  window.location.href = "admin.html";
});

adminsButton.addEventListener("click", function() {
  window.location.href = "admin(admins).html";
});
supportButton.addEventListener("click", function() {
  window.location.href = "admin(support).html";
});
sellerVerificationButton.addEventListener("click", function() {
  window.location.href = "admin(seller-verification).html";
});
withdrawsButton.addEventListener("click", function() {
  window.location.href = "admin(withdraw).html";
});
usersButton.addEventListener("click", function() {
  window.location.href = "admin(user).html";
});
addCategoryButton.addEventListener("click", function() {
  window.location.href = "admin(add-category).html";
});
addSlideButton.addEventListener("click", function() {
  window.location.href = "admin(add-slide).html";
});

let totalUsers = document.getElementById("admin-info-total-users");

let size = firebase.firestore().collection("users").get().then((snap) => {
  //size = snap.size;
  totalUsers.innerHTML = snap.size;
});



// function getPostsCount() {
//   firebase
//     .firestore()
//     .collection("games")
//     .get()
//     .then((snap) => {
//       size = snap.size;

//       productsCount.innerHTML += size;
//     });
// }



})(window, document);
