let sellButton = document.getElementsByClassName("sell-with-us-header-2");
let sellWithUsButton = document.getElementsByClassName("sell-with-us");
let balanceButton = document.getElementsByClassName("balance-button");
let notificationsButton = document.getElementsByClassName(
  "comun-main-user-icons-header bell-icon"
);
let chatButton = document.getElementsByClassName(
  "comun-main-user-icons-header chat-icon"
);
let settingsButton = document.getElementsByClassName("settings-div");
let userAccountButton = document.getElementsByClassName(
  "user-logged-out-header-placeholder"
);
let logoButtonLight = document.getElementsByClassName("logo");
let logoButtonDark = document.getElementsByClassName("logo-dark");
let favoritesButton = document.getElementsByClassName(
  "comun-main-user-icons-header favorites-icon"
);
let supportButton = document.querySelectorAll("support");
let profileImages = document.getElementsByClassName("user-icon-2");

let adminName = document.getElementsByClassName("name-admin");
let adminIcon = document.getElementsByClassName("icon-admin");

let linkButtons = document.getElementsByClassName("link-button");

Array.from(linkButtons).forEach((e) =>
  e.addEventListener("click", function () {
    window.location.href = "learn-more.html";
  })
);

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    console.log("Not logged in");
    // ALSO redirect ???
    // not quite works way expected
    // NEEDED only one redirect that works
    //window.href.location = "index-logged-in.html";
  } else {
    let elementsOfNumberOfNotifications = document.getElementsByClassName(
      "notification-point"
    );
    if (
      elementsOfNumberOfNotifications !== null ||
      elementsOfNumberOfNotifications !== undefined
    ) {
      firebase
        .firestore()
        .collection("notifications")
        .doc(user.displayName)
        .collection("notifications")
        .get()
        .then((snapshot) => {
          console.log(snapshot.size);
          Array.from(elementsOfNumberOfNotifications).forEach(
            (elementOfNotification) => {
              elementOfNotification.innerText = snapshot.size;
            }
          );
        });
    } else {
      console.log("No notifications read");
    }
    Array.from(profileImages).forEach((profileImage) => {
      // !== null !== undefined

      // not all image
      profileImage.setAttribute("style", `background-size: cover; background-image:url(${user.photoURL})`);
      // let image = document.createElement("img");
      // image.setAttribute("src", user.photoURL);
      // p.appendChild(image);
    });
  }

  Array.from(adminIcon).forEach((icon) => {
    if (user.photoURL !== null) {
      icon.setAttribute("style", `background-image:url(${user.photoURL})`);
    }
  });

  Array.from(adminName).forEach((name) => {
    name.textContent = user.displayName;
  });
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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    Array.from(userAccountButton).forEach((e) =>
      e.addEventListener("click", function () {
        window.location.href = `user.html?id=${user.displayName}`;
      })
    );
  } else {
    Array.from(userAccountButton).forEach((e) =>
    e.addEventListener("click", function () {
      window.location.href = "sign-in.html";
    })
  );
  }
});

Array.from(sellWithUsButton).forEach((e) =>
  e.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location.href = "seller-verification.html";
      } else {
        window.location.href = "sign-in.html";
      }
    });
    
  })
);

Array.from(logoButtonLight).forEach((e) =>
  e.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location.href = "homepage.html";
      } else {
        window.location.href = "sign-in.html";
      }
    });
  })
);

Array.from(logoButtonDark).forEach((e) =>
  e.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location.href = "homepage.html";
      } else {
        window.location.href = "sign-in.html";
      }
    });
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

// Always go to settings like wtf not chat
// Array.from(settingsButton).forEach((e) =>
//   e.addEventListener("click", function () {
//     window.location.href = "settings.html";
//   })
// );

// User auth state listener
// REDIRECT users to main page


