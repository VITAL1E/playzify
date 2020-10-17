let sellButton = document.getElementsByClassName("sell-with-us-header-2");
let sellWithUsButton = document.getElementsByClassName("sell-with-us");
let balanceButton = document.getElementsByClassName("balance-button");
//let allCategoriesButton = document.getElementsByClassName("all-categories-main-button padding-in-right-buttons-general-0");
let notificationsButton = document.getElementsByClassName("comun-main-user-icons-header bell-icon");
let chatButton = document.getElementsByClassName("comun-main-user-icons-header chat-icon");
let settingsButton = document.getElementsByClassName("settings-div");
let userAccountButton = document.getElementsByClassName("user-logged-out-header-placeholder");
let logoButtonLight = document.getElementsByClassName("logo");
let logoButtonDark = document.getElementsByClassName("logo-dark");
let favoritesButton = document.getElementsByClassName("comun-main-user-icons-header favorites-icon");
let supportButton = document.querySelectorAll("support");
let profileImages = document.getElementsByClassName("user-icon-2");

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    console.log("Not logged in");
    // ALSO redirect ???
    // not quite works way expected
    // NEEDED only one redirect that works
    //window.href.location = "index-logged-in.html";
  } else {
    Array.from(profileImages).forEach((p) => {
        let image = document.createElement("img");
        image.setAttribute("src", user.photoURL);
        p.appendChild(image);
    });
  }
});

Array.from(supportButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "support.html";
  })
);

Array.from(favoritesButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "favorites.html";
  })
);

Array.from(userAccountButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "user.html";
  })
);

Array.from(sellWithUsButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "seller-verification.html";
  })
);

Array.from(logoButtonLight).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "index-logged-in.html";
  })
);

Array.from(logoButtonDark).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "index-logged-in.html";
  })
);

Array.from(balanceButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "balance.html";
  })
);

Array.from(sellButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "Create-listing.html";
  })
);

Array.from(notificationsButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "orders-notifications.html";
  })
);

Array.from(chatButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "chat.html";
  })
);

// Array.from(allCategoriesButton).forEach(e => e.addEventListener("click", function() {
//   let allCategoriesPopup = document.querySelector(".drop-down-main-category-banner");
//   if (allCategoriesPopup.style.display == "none") {
//     allCategoriesPopup.style.display = "block";
//   } else {
//     allCategoriesPopup.style.display = "none";
//   }
// }));

Array.from(settingsButton).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "settings.html";
  })
);

// User auth state listener
// REDIRECT users to main page
