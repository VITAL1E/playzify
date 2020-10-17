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

let searchBar = document.getElementById("search-bar-id");

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




let cancelButton = document.getElementById("cancel-button");
let adminPopup = document.getElementById("admin-main-popup-id"); 

cancelButton.addEventListener("click", function() {
  adminPopup.style.display = "none";
});


function createUser(user) {
  let mainUsersDiv = document.getElementById("main-users-id");

  let div = document.createElement("div");
  div.setAttribute("class", "admins-admin");

  let userImage = document.createElement("div");
  userImage.setAttribute("class", "admins-admin-1");

  let userUsername = document.createElement("div");
  userUsername.setAttribute("class", "admins-admin-2");

  userUsername.textContent = user.username;

  let userVerified = document.createElement("div");
  userVerified.setAttribute("class", "admin-absolute-user-seller");

  div.appendChild(userImage);
  div.appendChild(userUsername);
  div.appendChild(userVerified);

  mainUsersDiv.appendChild(div);
}

let usersArray = [];

const getUsers = async () => {
  let lastVisible;
  let docs;

  let usersReference = firebase
    .firestore()
    .collection("users")

  await usersReference.get().then((snapshot) => {
    docs = snapshot;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    // strange behavior
    console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    usersArray.push(doc.data());
  });

  usersArray.forEach((user) => {
    createUser(user);
    console.log(user);
  });  
}

searchBar.addEventListener("keyup", (e) => {
  let searchString = e.target.value.toLowerCase();
  let filteredUsers = usersArray.filter(user => {
    return (
      user.username.toLowerCase().includes(searchString)
    );
  });
  console.log(filteredUsers);
  removeUsers();
  filteredUsers.forEach((user) => {
    createUser(user);
  });
});

const removeUsers = () => {
  let elements = document.getElementsByClassName("admins-admin");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

getUsers();

})(window, document);
