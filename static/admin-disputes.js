(function (window, document, undefined) {
  "use strict";

  let divMainSupportList = document.getElementById(
    "admin-disputes-problems-main-div-id"
  );

  let divSelectSupportStatus = document.getElementById("select-disputes-id");

  // POPUP
  let problemInformationPopup = document.getElementById(
    "admin-disputes-popup-id"
  );

  // POPUP INFORMATION
  let userPhotoPopup = document.getElementById("popup-user-photo-id");
  let usernamePopup = document.getElementById("popup-username-id");
  let emailPopup = document.getElementById("popup-email-id");
  let timeagoPopup = document.getElementById("popup-timeago-id");
  let descriptionPopup = document.getElementById("popup-description-id");

  // POPUP BUTTONS
  let acceptButton = document.getElementById("popup-solved-button");
  let cancelButton = document.getElementById("popup-cancel-button");

  let generalButton = document.getElementById("general-button");
  let adminsButton = document.getElementById("admins-button");
  let supportButton = document.getElementById("support-button");
  let disputesButton = document.getElementById("disputes-button");
  let sellerVerificationButton = document.getElementById(
    "seller-verifications-button"
  );
  let reportsButton = document.getElementById("reports-button");
  let withdrawsButton = document.getElementById("withdraws-button");
  let usersButton = document.getElementById("users-button");
  let addCategoryButton = document.getElementById("add-category-button");
  let addSlideButton = document.getElementById("add-slide-button");
  let historyButton = document.getElementById("history");

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
  historyButton.addEventListener("click", function () {
    window.location.href = "admin(history).html";
  });
  reportsButton.addEventListener("click", function () {
    window.location.href = "admin(reports).html";
  });

  let disputesArray = [];
  const getDisputes = async (status) => {
    let docs;
    let lastVisible;
    let disputesReference;

    removeDisputes();


    if (status === "Unresolved" || status === "" || status === undefined) {
      disputesReference = firebase
        .firestore()
        .collection("disputes")
        .where("status", "==", "Unresolved")
        .orderBy("createdAt", "desc");
    } else {
      disputesReference = firebase
        .firestore()
        .collection("disputes")
        .where("status", "==", "Resolved")
        .orderBy("createdAt", "desc");
    }

    disputesArray = [];
    await disputesReference.get().then((snapshot) => {
      if (snapshot.docs.length === 0) {
        return;
      }
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());

      docs["docs"].forEach((doc) => {
        disputesArray.push(doc.data());
      });
      removeDisputes();

      disputesArray.forEach((post) => {
        createDispute(post);
      });

      disputesArray = [];
    });
  };

  divSelectSupportStatus.addEventListener("change", function () {
    let selectFilter = `${divSelectSupportStatus.value}`;
    console.log(divSelectSupportStatus.value);
    getDisputes(selectFilter);
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      getDisputes("Unresolved");
    } else {
      console.log("Not logged in and not admin");
    }
  });

  function createDispute(dispute) {
    let div = document.createElement("div");
    div.setAttribute("class", "request-support-admin-main-div");

    let divMainUserPhoto = document.createElement("div");
    divMainUserPhoto.setAttribute(
      "class",
      "request-support-user-photo-name-main-div"
    );

    let divUserPhoto = document.createElement("div");
    divUserPhoto.setAttribute(
      "class",
      "request-support-user-photo-name-main-div-1"
    );
    if (dispute.userPhoto !== null) {
      divUserPhoto.setAttribute("style", `background-image:url(${dispute.userPhoto}); background-size: cover;`);
    }

    let divUserPhotoUsername = document.createElement("div");
    divUserPhotoUsername.setAttribute(
      "class",
      "request-support-user-photo-name-main-div-2"
    );
    divUserPhotoUsername.textContent = dispute.from;

    let divMainProblem = document.createElement("div");
    divMainProblem.setAttribute("class", "support-content-problem-main-div");

    let divMainProblemTitle = document.createElement("div");
    divMainProblemTitle.setAttribute(
      "class",
      "support-content-problem-main-div-1"
    );
    divMainProblemTitle.textContent = dispute.message;

    let divMainInformation = document.createElement("div");
    divMainInformation.setAttribute(
      "class",
      "general-support-request-information"
    );

    let divInformation = document.createElement("div");
    divInformation.setAttribute(
      "class",
      "general-support-request-information-1"
    );

    let divStatus = document.createElement("div");
    divStatus.setAttribute("class", "transaction-info-all-2");
    divStatus.textContent = "status:";

    let divStatusSpan = document.createElement("span");
    if (dispute.status === "Resolved") {
      divStatusSpan.setAttribute(
        "class",
        "transaction-info-all-span greeen-support-admin-status"
      );
    } else {
      divStatusSpan.setAttribute(
        "class",
        "transaction-info-all-span rred-support-admin-status"
      );
    }
    divStatusSpan.textContent = dispute.status;

    let divMainTime = document.createElement("div");
    divMainTime.setAttribute("class", "general-support-request-information-1");

    let divTime = document.createElement("div");
    divTime.setAttribute("class", "transaction-info-all-2");
    divTime.textContent = "time:";

    let divTimeSpan = document.createElement("span");
    divTimeSpan.setAttribute("class", "transaction-info-all-span");
    divTimeSpan.textContent = getTimeSince(dispute.createdAt.seconds * 1000);

    divMainUserPhoto.appendChild(divUserPhoto);
    divMainUserPhoto.appendChild(divUserPhotoUsername);

    divMainProblem.appendChild(divMainProblemTitle);

    divStatus.appendChild(divStatusSpan);
    divInformation.appendChild(divStatus);

    divTime.appendChild(divTimeSpan);
    divMainTime.appendChild(divTime);

    divMainInformation.appendChild(divInformation);
    divMainInformation.appendChild(divMainTime);

    div.appendChild(divMainUserPhoto);
    div.appendChild(divMainProblem);
    div.appendChild(divMainInformation);

    div.addEventListener("click", function () {
      problemInformationPopup.style.display = "block";

      if (dispute.userPhoto !== null) {
        userPhotoPopup.setAttribute("style", `background-image:url(${dispute.userPhoto}); background-size: cover;`)
      }
      usernamePopup.textContent = dispute.from;
      emailPopup.textContent = `https://zifiplay-e212f.web.app/order.html?id=${dispute.orderId}`;
      descriptionPopup.textContent = dispute.message;
      timeagoPopup.textContent = getTimeSince(dispute.createdAt.seconds * 1000);

      if (dispute.status === "Resolved") {
        acceptButton.style.display = "none";
      }

      emailPopup.addEventListener("click", function () {
        location.href = `https://zifiplay-e212f.web.app/order.html?id=${dispute.orderId}`;
      });

      acceptButton.addEventListener("click", function () {
        let problemReference = firebase
          .firestore()
          .collection("disputes")
          .doc(dispute.orderId);

        problemReference.set(
          {
            status: "Resolved",
          },
          { merge: true }
        )
        .then(() => {
          let user = firebase.auth().currentUser;
          console.log(user);
          console.log(user.displayName);

          firebase
          .firestore()
          .collection("history")
          .doc(user.displayName)
          .collection("actions")
          .add({
            username: user.displayName,
            action: `solved a support case at ${dispute.orderId}`,
            createdAt: new Date()
          })
          .then(() => {
            console.log("Successfully added action");
          })
          .catch((error) => {
            console.log(error);
          });
        })
        .then(() => {
          problemInformationPopup.style.display = "none";
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
      });

      cancelButton.addEventListener("click", function () {
        problemInformationPopup.style.display = "none";
      });
    });
    divMainSupportList.appendChild(div);
  }

  const removeDisputes = () => {
    let elements = document.getElementsByClassName(
      "request-support-admin-main-div"
    );

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  function getTimeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  //getDisputes();
})(window, document);
