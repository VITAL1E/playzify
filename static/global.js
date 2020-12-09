let sellButton = document.getElementsByClassName("sell-with-us-header-2");
let sellWithUsButton = document.getElementsByClassName("sell-with-us");
let balanceButton = document.getElementsByClassName("balance-button");
let balanceAmount = document.getElementsByClassName("balance-amount");
let notificationsButton = document.getElementsByClassName(
  "comun-main-user-icons-header bell-icon"
);
let newChatNotificationsIcon = document.getElementsByClassName(
  "chat-notification"
);

let newNotificationsIcon = document.getElementsByClassName(
  "notification-point"
);

let chatsButton = document.getElementsByClassName(
  "chat-icon"
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
      // firebase
      //   .firestore()
      //   .collection("notifications")
      //   .doc(user.displayName)
      //   .collection("notifications")
      //   .where("status", "==", false)
      //   .get()
      //   .then((snapshot) => {
      //     if (snapshot.size === 0) {
      //       elementsOfNumberOfNotifications.forEach((elementOfNotification) => {
      //         elementOfNotification.style.display = "none";
      //       });
      //       return;
      //     }
      //     console.log(snapshot.size);
      //     Array.from(elementsOfNumberOfNotifications).forEach(
      //       (elementOfNotification) => {
      //         elementOfNotification.innerText = snapshot.size;
      //       }
      //     );
      //   });
    } else {
      console.log("No notifications read");
    }
    Array.from(profileImages).forEach((profileImage) => {
      if (user.photoURL !== null) {
        profileImage.setAttribute(
          "style",
          `background-image:url(${user.photoURL}); background-size: cover;`
        );
      }
      // !== null !== undefined

      // not all image
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
    let currentUserReference = firebase
      .firestore()
      .collection("users")
      .doc(user.displayName);

    let notificationsReference = firebase
      .firestore()
      .collection("notifications")
      .doc(user.displayName)
      .collection("notifications")
      .where("seen", "==", false);

    let chatReference = firebase
      .firestore()
      .collection("userchats")
      .doc(user.displayName)
      .collection("userchats")
      .where("seen", "==", false);

    Array.from(userAccountButton).forEach((e) =>
      e.addEventListener("click", function () {
        window.location.href = `user.html?id=${user.displayName}`;
      })
    );

    Array.from(sellButton).forEach((e) => {
      e.addEventListener("click", function () {
        currentUserReference
          .get()
          .then((snapshot) => {
            if (snapshot.data().verified) {
              location.href = "Create-listing.html";
            } else {
              location.href = "seller-verification.html";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });

    chatReference.get().then((snapshot) => {
      if (snapshot.size > 0) {
        Array.from(newChatNotificationsIcon).forEach((n) => {
          n.style.display = "block";
          n.textContent = snapshot.size;
        });
      } else {
        Array.from(newChatNotificationsIcon).forEach((n) => {
          n.style.display = "none";
        });
      }
    });

    notificationsReference.get().then((snapshot) => {
      if (snapshot.size > 0) {
        Array.from(newNotificationsIcon).forEach((n) => {
          n.style.display = "block";
          n.textContent = snapshot.size;
        });
      } else {
        Array.from(newNotificationsIcon).forEach((n) => {
          n.style.display = "none";
        });
        console.log("no notifications");
      }
    });
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
    firebase.auth().onAuthStateChanged(function (user) {
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
    firebase.auth().onAuthStateChanged(function (user) {
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
    firebase.auth().onAuthStateChanged(function (user) {
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

Array.from(balanceAmount).forEach((e) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.displayName)
        .get()
        .then((snapshot) => {
          e.textContent = `${snapshot.data().balance} EU`;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Fuck you");
    }
  });
});

Array.from(notificationsButton).forEach((e) =>
  e.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .firestore()
          .collection("notifications")
          .doc(user.displayName)
          .collection("notifications")
          .get()
          .then((snapshot) => {
            if (!snapshot.exists) {
              // If user no notifications -> still can go to this page
              console.log("No notifications");
              console.log("Sasati no notifications but still go to page");
              window.location.href = "orders-notifications.html";
            }
            snapshot.forEach((doc) => {
              console.log(doc.data());
              console.log(doc);
              doc.ref
                .update({
                  seen: true,
                })
                .then(() => {
                  window.location.href = "orders-notifications.html";
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  })
);

Array.from(chatsButton).forEach((e) =>
  e.addEventListener("click", function () {
    Array.from(newChatNotificationsIcon).forEach((n) => {
      n.style.display = "none";
    });
    firebase.auth().onAuthStateChanged(function (user) {
      //let unseenMessagesArray = [];
      if (user) {
        firebase
          .firestore()
          .collection("userchats")
          .doc(user.displayName)
          .collection("userchats")
          // .where("seen", "==", false)
          .get()
          .then((snapshot) => {
            if (!snapshot.exists) {
              // If user no notifications -> still can go to this page
              console.log("No chats");
              console.log("Sasati no notifications but still go to page");
              //location.href = "chat.html";
            }

            let chatReference = firebase
            .firestore()
            .collection("userchats")
            .doc(user.displayName)
            .collection("userchats");

            snapshot
              .forEach((doc) => {
                //unseenMessagesArray.push(doc.data());

                console.log(doc.data());
                console.log(doc);

                  chatReference
                  .doc(doc.data().username)
                  .set({
                    seen: true
                  }, { merge: true })
                  .then(() => {
                    location.href = "chat.html";
                    console.log("success kzdms");
                  })
                  .catch((error) => {
                    console.log(error);
                  });

                // doc.ref
                //   .update({
                //     seen: true,
                //   })
                //   .then(() => {
                //     location.href = "chat.html";
                //   })
                //   .catch((error) => {
                //     console.log(error);
                //   });
              })
          })
          .then(() => {
            //changeMessagesToSeen(user.displayName, unseenMessagesArray);
          })
          .then(() => {
            console.log("Success");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  })
);

// function changeMessagesToSeen(user, unseenMessages) {
//   let userChatsReference = firebase
//     .firestore()
//     .collection("userchats")
//     .doc(user)
//     .collection("userchats");

//     console.log(unseenMessages);

//   unseenMessages
//     .forEach((message) => {
//       userChatsReference
//         .doc(message.username)
//         .set(
//           { 
//             seen: true
//           }, { merge: true }
//         )
//         .then(() => {
//           console.log("Success updated to seen all");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
// }

// Array.from(chatButton).forEach((e) => {
//   e.addEventListener("click", function () {
//     location.href = "chat.html";
//   });
// });

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
