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

  let searchBar = document.getElementById("search-bar-id");

  let mainUsersDiv = document.getElementById("transactions-main-id");

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

  let adminPopup = document.getElementById("admin-main-popup-id");
  let saveButton = document.getElementById("save-button");
  let cancelButton = document.getElementById("cancel-button");
  // let blockUserButton = document.getElementById("block-user-button");

  searchBar.addEventListener("keyup", (e) => {
    console.log(e.target.value);
    let searchString = e.target.value.toLowerCase();
    console.log(usersArray);
    let filteredUsers = usersArray.filter((user) => {
      return user.username.toLowerCase().includes(searchString);
    });
    console.log(filteredUsers);
    removeUsers();
    filteredUsers.forEach((user) => {
      createUser(user);
    });
  });

  function createUser(user) {
    let div = document.createElement("div");
    div.setAttribute("class", "admins-admin");

    let userImage = document.createElement("div");
    userImage.setAttribute("class", "admins-admin-1");

    if (user.profilePicture !== null) {
      userImage.setAttribute(
        "style",
        `background-image:url(${user.profilePicture})`
      );
    }

    let userUsername = document.createElement("div");
    userUsername.setAttribute("class", "admins-admin-2");

    userUsername.textContent = user.username;

    let userVerified = document.createElement("div");
    if (user.verified === true) {
      userVerified.setAttribute("class", "admin-absolute-user-seller");
    }

    div.appendChild(userImage);
    div.appendChild(userUsername);
    div.appendChild(userVerified);

    div.addEventListener("click", function () {
      adminPopup.style.display = "block";

      let userPostsReference = firebase.firestore().collection("games");

      let popupPhoto = document.getElementById("admin-main-popup-photo-id");
      
      if (popupPhoto !== null) {
        popupPhoto.setAttribute(
          "style",
          `background-image:url(${user.profilePicture}); background-size: cover; `
        );
      }

      let popupUsername = document.getElementById(
        "admin-main-popup-username-id"
      );
      popupUsername.textContent = user.username;

      let popupSold = document.getElementById("popup-sold-id");
      userPostsReference
        .where("seller", "==", user.username)
        .where("status", "==", "Completed")
        .get()
        .then((snapshot) => {
          if (snapshot.size > 0 || snapshot.exists) {
            popupSold.textContent = `sold: ${snapshot.size}`;
          } else {
            popupSold.textContent = `sold: 0`;
          }
        });

      let popupActive = document.getElementById("popup-active-id");
      userPostsReference
        .where("seller", "==", user.username)
        .where("status", "==", "Pending")
        .get()
        .then((snapshot) => {
          if (snapshot.size > 0 || snapshot.exists) {
            popupActive.textContent = `${snapshot.size}`;
          } else {
            popupActive.textContent = `active: 0`;
          }
        });

      let popupDispute = document.getElementById("popup-dispute-id");
      userPostsReference
        .where("seller", "==", user.username)
        .where("status", "==", "Disputed")
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            popupDispute.textContent = `${snapshot.size}`;
          } else {
            popupDispute.textContent = `dispute: 0`;
          }
        });

      saveButton.addEventListener("click", function () {
        let feeValue = document.getElementById("transfer-fee-id").innerText;
        let transferValue = document.getElementById("transfer-money-id").value;

        let balanceValueOfUser = 0;

        console.log(feeValue);
        console.log(transferValue);

        let userReference = firebase
          .firestore()
          .collection("users")
          .doc(user.username);

          userReference
          .get()
          .then((snapshot) => {
            balanceValueOfUser = snapshot.data().balance
          })
          .then(() => {
            userReference
            .set(
              {
                balance: balanceValueOfUser + parseInt(transferValue),
              },
              { merge: true }
            )
            .then(() => {
              firebase
              .firestore()
              .collection("notifications")
              .doc(user.username)
              .collection("notifications")
              .add({
                action:
                  `Nice, your account was supplied with ${transferValue} EU.`,
                seen: false,
                typeOfNotification: "Submitted",
                createdAt: new Date(),
              })
              .then(() => {
                alert("Successfully submited money to user");
                location.href = "homepage.html";
              })
              .catch((error) => {
                console.log(error);
              });
            })
            .then(() => {
              console.log("Successfully transferred money money");
              adminPopup.style.display = "none";
            })
            .catch((error) => {
              console.log(error);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });

      cancelButton.addEventListener("click", function () {
        adminPopup.style.display = "none";
      });

      // blockUserButton.addEventListener("click", function () {
      //   alert("TODO: confirm to delete user account?");
      //   // firebase
      //   //   .firestore()
      //   //   .collection("users")
      //   //   .doc(user.username)
      //   //   .delete()
      //   //   .then(() => {
      //   //     alert("Deleted user from collection, also delete from DB entirely");
      //   //     console.log("User successfully deleted from collection");
      //   //   })
      //   //   .then(() => {
      //   //     alert("Delete user from Firebase Auth");
      //   //   })
      //   //   .catch((error) => {
      //   //     console.log(error);
      //   //   });
      //   adminPopup.style.display = "none";
      // });
    });

    mainUsersDiv.appendChild(div);
  }

  let usersArray = [];
  const getUsers = async () => {
    let docs;
    let lastVisible;
    let usersReference = firebase.firestore().collection("users");

    await usersReference.get().then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      usersArray.push(doc.data());
    });

    usersArray.forEach((user) => {
      createUser(user);
      console.log(user);
    });
  };

  const removeUsers = () => {
    let elements = document.getElementsByClassName("admins-admin");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  getUsers();
})(window, document);
