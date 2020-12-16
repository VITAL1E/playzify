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

  function createAdmin(admin) {
    let div = document.createElement("div");
    div.setAttribute("class", "admins-admin");

    let divImage = document.createElement("div");
    divImage.setAttribute("class", "admins-admin-1");

    if (admin.userPhoto !== "" || admin.userPhoto !== undefined || admin.userPhoto !== null) {
      divImage.setAttribute("style", `background-image:url(${admin.userPhoto})`);
    }

    let divUsername = document.createElement("div");
    divUsername.setAttribute("class", "admins-admin-2");
    divUsername.textContent = admin.username;

    div.appendChild(divImage);
    div.appendChild(divUsername);

    div.addEventListener("click", function () {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

          // firebase.firestore().collection("admins").add({
          //   username: "Yoooo",
          //   userPhoto: "photo123"
          // })
          // .then((reference) => {
          //   console.log(reference);
          // })
          // .catch((error) => {
          //   console.log(error);
          // });
          // User is signed in.
          // ADD ADMIN CLAIM

          const adminEmail = user.email;
          const addSuperAdminRole = functions.httpsCallable('addSuperAdminRole');
          addSuperAdminRole({ email: adminEmail }).then(result => {
            console.log(result);
          });
        } else {
          // No user is signed in.
        }
      });


      popupAdmins.style.display = "block";

      let accessAdmins = false;
      let accessCategory = false;
      let accessSlide = false;
      let accessSupport = false;
      let accessUsers = false;
      let accessVerifications = false;
      let accessWithdraws = false;

      let username = document.getElementById("popup-username-id");
      username.textContent = admin.username;

      let photo = document.getElementById("popup-photo-id");

      if (admin.userPhoto !== "" || admin.userPhoto !== undefined || admin.userPhoto !== null) {
        photo.setAttribute("style", `background-image:url(${admin.userPhoto})`);
      }

      // BUTTONS
      let admins = document.getElementById("popup-admins-id");
      if (admin.accessAdmins === true) {
        accessAdmins = true;
        admins.classList.add("type-of-access-admin-active");
      } else {
        accessAdmins = false;
        admins.classList.remove("type-of-access-admin-active");        
      }

      admins.addEventListener("click", function () {
        if (accessAdmins === false) {
          accessAdmins = true;
          admins.classList.add("type-of-access-admin-active");
        } else {
          accessAdmins = false;
          admins.classList.remove("type-of-access-admin-active");
        }
      });

      let support = document.getElementById("popup-support-id");
      if (admin.accessSupport === true) {
        accessSupport = true;
        support.classList.add("type-of-access-admin-active");
      } else {
        accessSupport = false;
        support.classList.remove("type-of-access-admin-active");  
      }

      support.addEventListener("click", function () {
        if (accessSupport === false) {
          accessSupport = true;
          support.classList.add("type-of-access-admin-active");
        } else {
          accessSupport = false;
          support.classList.remove("type-of-access-admin-active");
        }
      });

      let sellerVerifications = document.getElementById(
        "popup-seller-verifications-id"
      );
      if (admin.accessVerifications === true) {
        sellerVerifications.classList.add("type-of-access-admin-active");
        accessVerifications = true;
      } else {
        accessVerifications = false;
        sellerVerifications.classList.remove("type-of-access-admin-active");  
      }

      sellerVerifications.addEventListener("click", function () {
        if (accessVerifications === false) {
          accessVerifications = true;
          sellerVerifications.classList.add("type-of-access-admin-active");
        } else {
          accessVerifications = false;
          sellerVerifications.classList.remove("type-of-access-admin-active");
        }
      });

      let withdraws = document.getElementById("popup-withdraws-id");
      if (admin.accessWithdraws === true) {
        withdraws.classList.add("type-of-access-admin-active");
        accessWithdraws = true;
      } else {
        accessWithdraws = false;
        withdraws.classList.remove("type-of-access-admin-active");  
      }

      withdraws.addEventListener("click", function () {
        if (accessWithdraws === false) {
          accessWithdraws = true;
          withdraws.classList.add("type-of-access-admin-active");
        } else {
          accessWithdraws = false;
          withdraws.classList.remove("type-of-access-admin-active");
        }
      });

      let users = document.getElementById("popup-users-id");
      if (admin.accessUsers === true) {
        users.classList.add("type-of-access-admin-active");
        accessUsers = true;
      } else {
        accessUsers = false;
        users.classList.remove("type-of-access-admin-active");  
      }

      users.addEventListener("click", function () {
        if (accessUsers === false) {
          accessUsers = true;
          users.classList.add("type-of-access-admin-active");
        } else {
          accessUsers = false;
          users.classList.remove("type-of-access-admin-active");
        }
      });

      let addCategory = document.getElementById("popup-add-category-id");
      if (admin.accessCategory === true) {
        addCategory.classList.add("type-of-access-admin-active");
        accessCategory = true;
      } else {
        accessCategory = false;
        addCategory.classList.remove("type-of-access-admin-active");  
      }

      addCategory.addEventListener("click", function () {
        if (accessCategory === false) {
          accessCategory = true;
          addCategory.classList.add("type-of-access-admin-active");
        } else {
          accessCategory = false;
          addCategory.classList.remove("type-of-access-admin-active");
        }
      });

      let addSlide = document.getElementById("popup-add-slide-id");
      if (admin.accessSlide === true) {
        addSlide.classList.add("type-of-access-admin-active");
        accessSlide = true;
      } else {
        accessSlide = false;
        addSlide.classList.remove("type-of-access-admin-active");  
      }

      addSlide.addEventListener("click", function () {
        if (accessSlide === false) {
          accessSlide = true;
          addSlide.classList.add("type-of-access-admin-active");
        } else {
          accessSlide = false;
          addSlide.classList.remove("type-of-access-admin-active");
        }
      });

      // SAVE BUTTON
      let saveChangesButton = document.getElementById("popup-save-button");
      saveChangesButton.addEventListener("click", function () {
        firebase
          .firestore()
          .collection("admins")
          .doc(admin.username)
          .set({
            accessAdmins,
            accessCategory,
            accessSlide,
            accessSupport,
            accessUsers,
            accessVerifications,
            accessWithdraws
          }, { merge: true }
          )
          .then(() => {
            console.log("Successfully added permissions");
          })
          .then(() => {
            popupAdmins.style.display = "none";
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      });

      // CANCEL BUTTON
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
      user.getIdTokenResult().then(idTokenResult => {
        console.log("Admin? " + idTokenResult.claims.admin);
        console.log("Superadmin? " + idTokenResult.claims.superadmin);

        user.admin = idTokenResult.claims.admin;
        user.superadmin = idTokenResult.claims.superadmin;

        console.log("user.admin? " + user.admin);
        console.log("user.superadmin? " + user.superadmin);

        if (idTokenResult.claims.admin !== true) {
          window.location.href = "admin.html";
        } else {
          getAdmins();
        }
      })
      .catch((error) => {
        console.log(error);
      });
      // user.getIdTokenResult().then(idTokenResult => {
      //   console.log(idTokenResult.claims.admin);
      // });
    } else {
      console.log("Not signed");
      window.location.href = "index.html";
    }
  });
})(window, document);
