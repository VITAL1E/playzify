(function (window, document, undefined) {
  "use strict";

  // POPUP
  let imageViewPopup = document.getElementById(
    "admin-verification-img-view-id"
  );
  let imageSrcPopup = document.getElementById("admin-verification-img-src-id");
  let closeImagePreview = document.getElementsByClassName("close-img");

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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.displayName);
      // User is signed in.
      // nameAdmin.textContent = user.displayName;
      // iconAdmin.setAttribute("style", `background-image:url(${user.photoURL})`);
    } else {
      // No user is signed in.
      console.log("Not signed");
    }
  });

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

  let rowOfIdDocuments = document.getElementById(
    "row-of-documents-verification-id"
  );
  let postalCode = document.getElementById("postal-code-id");
  let street = document.getElementById("street-id");
  let city = document.getElementById("city-id");
  let country = document.getElementById("country-id");
  let monthBirthday = document.getElementById("month-birthday-id");
  let dayBirthday = document.getElementById("day-birthday-id");
  let yearBirthday = document.getElementById("year-birthday-id");
  let nameSurname = document.getElementById("name-surname-id");
  let sellerUsername = document.getElementById("seller-name-id");
  let sellerPicture = document.getElementById("seller-picture-id");

  let divSelectVerifications = document.getElementById(
    "select-verifications-id"
  );

  let divVerifications = document.getElementById("verifications-array-id");

  function createVerificationRequest(verification) {
    let userNotificationsReference = firebase
      .firestore()
      .collection("notifications")
      .doc(verification.username)
      .collection("notifications");

    let verificationRequestsDivsPopup = document.getElementById(
      "modal-general-popup-id"
    );

    let div = document.createElement("div");
    div.setAttribute("class", "transaction cc-cursor");

    let transactionSign = document.createElement("div");
    if (verification.status === "Pending") {
      transactionSign.setAttribute("class", "transaction-sign");
    } else if (verification.status === "Refused") {
      transactionSign.setAttribute(
        "class",
        "transaction-sign transaction-sign-minus"
      );
    } else if (verification.status === "Verified") {
      transactionSign.setAttribute(
        "class",
        "transaction-sign transaction-sign-check"
      );
    }

    let transactionInfo = document.createElement("div");
    transactionInfo.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );
    transactionInfo.setAttribute("style", "padding-left: 0; border: 0;");

    let transactionStatus = document.createElement("div");
    transactionStatus.setAttribute("class", "transaction-info-all-2");
    transactionStatus.textContent = "status: ";

    let transactionProgressSpan = document.createElement("span");
    transactionProgressSpan.setAttribute("class", "transaction-info-all-span");
    transactionProgressSpan.textContent = verification.status;

    let transactionInfoFrom = document.createElement("div");
    transactionInfoFrom.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );

    let transactionInfoFormUsername = document.createElement("div");
    transactionInfoFormUsername.setAttribute("class", "transaction-info-all-2");
    transactionInfoFormUsername.textContent = "from: ";

    let transactionInfoFormUsernameSpan = document.createElement("span");
    transactionInfoFormUsernameSpan.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    transactionInfoFormUsernameSpan.textContent = verification.username;

    let transactionInfoTime = document.createElement("div");
    transactionInfoTime.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );

    let transactionInfoTimeDate = document.createElement("div");
    transactionInfoTimeDate.setAttribute("class", "transaction-info-all-2");
    transactionInfoTimeDate.textContent = "time: ";

    let transactionInfoTimeSpan = document.createElement("span");
    transactionInfoTimeSpan.setAttribute("class", "transaction-info-all-span");
    transactionInfoTimeSpan.textContent = getTimeSince(
      verification.createdAt.seconds * 1000
    );

    transactionStatus.appendChild(transactionProgressSpan);
    transactionInfo.appendChild(transactionStatus);

    transactionInfoFormUsername.appendChild(transactionInfoFormUsernameSpan);
    transactionInfoFrom.appendChild(transactionInfoFormUsername);

    transactionInfoTimeDate.appendChild(transactionInfoTimeSpan);
    transactionInfoTime.appendChild(transactionInfoTimeDate);

    div.appendChild(transactionSign);
    div.appendChild(transactionInfo);
    div.appendChild(transactionInfoFrom);
    div.appendChild(transactionInfoTime);

    div.addEventListener("click", function () {
      verificationRequestsDivsPopup.style.display = "block";

      sellerUsername.textContent = verification.username;
      nameSurname.textContent = verification.name + " " + verification.surname;
      monthBirthday.textContent = verification.month;
      dayBirthday.textContent = verification.day;
      yearBirthday.textContent = verification.year;
      country.textContent = verification.country;
      city.textContent = verification.city;
      street.textContent = verification.address;
      postalCode.textContent = verification.postalCode;

      sellerPicture.setAttribute(
        "style",
        `background-image:url(${verification.userPhoto})`
      );

      if (verification.images) {
        removeDocuments();
        for (let i = 0; i < verification.images.length; i++) {
          let divDocument = document.createElement("div");
          divDocument.setAttribute("class", "id-document id-document-2");

          let image = document.createElement("img");
          image.setAttribute("class", "image-preview");
          image.setAttribute(
            "style",
            "width: inherit; height: inherit; border-radius: 20px;"
          );
          image.setAttribute("src", verification.images[i]);

          divDocument.appendChild(image);

          divDocument.addEventListener("click", function () {
            imageViewPopup.style.display = "block";
            imageSrcPopup.setAttribute("src", verification.images[i]);
          });

          rowOfIdDocuments.appendChild(divDocument);
        }
      }
      let cancelButton = document.getElementById("cancel-button-id");
      cancelButton.addEventListener("click", function () {
        verificationRequestsDivsPopup.style.display = "none";
        removeDocuments();
      });

      let refuseButton = document.getElementById("refuse-button-id");

      if (verification.status === "Verified") {
        refuseButton.style.display = "none";
      } 
      refuseButton.addEventListener("click", refuseVerificationRequest, false);

      let verifyButton = document.getElementById("verify-button-id");

      if (verification.status === "Verified") {
        verifyButton.style.display = "none";
      }
      verifyButton.addEventListener("click", acceptVerificationRequest, false);
    });
    divVerifications.appendChild(div);

    function acceptVerificationRequest() {
      firebase
        .firestore()
        .doc(`/verifications/${verification.verificationId}`)
        .set(
          {
            status: "Verified",
            verified: true,
          },
          { merge: true }
        )
        .then(() => {
          userNotificationsReference.add({
            typeOfNotification: "Verified",
            action:
              "Congratulation, your seller account is verified, now you can post items to sell.",
            createdAt: new Date(),
            seen: false
          });
        })
        .then(() => {
          verificationRequestsDivsPopup.style.display = "none";
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function refuseVerificationRequest() {
      firebase
        .firestore()
        .doc(`/verifications/${verification.username}`)
        .set(
          {
            status: "Refused",
            verified: false,
          },
          { merge: true }
        )
        .then(() => {
          userNotificationsReference.add({
            typeOfNotification: "Verified",
            action:
              "Unfortunately, your seller account is refused, contact support for more information.",
            createdAt: new Date(),
            seen: false
          });
        })
        .then(() => {
          verificationRequestsDivsPopup.style.display = "none";
          location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  let verificationsArray = [];
  const getVerifications = async (status) => {
    let docs;
    let lastVisible;
    let verificationsReference = firebase
      .firestore()
      .collection("verifications")
      .where("status", "==", status)
      .orderBy("createdAt", "desc");

    verificationsArray = [];
    await verificationsReference.get().then((snapshot) => {
      if (!snapshot.exists) {
        removeVerifications();
      }
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());

      docs["docs"].forEach((doc) => {
        verificationsArray.push(doc.data());
      });
      removeVerifications();

      verificationsArray.forEach((verification) => {
        createVerificationRequest(verification);
      });
      verificationsArray = [];
    });
  };

  divSelectVerifications.addEventListener("change", function () {
    let selectFilter = `${divSelectVerifications.value}`;
    getVerifications(selectFilter);
  });

  Array.from(closeImagePreview).forEach((button) => {
    button.addEventListener("click", () => {
      imageViewPopup.style.display = "none";
    });
  });

  const removeDocuments = () => {
    let elements = document.getElementsByClassName("id-document id-document-2");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  const removeVerifications = () => {
    let elements = document.getElementsByClassName("transaction cc-cursor");

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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User signed");
      getVerifications("Pending");
    } else {
      console.log("Not logged in");
    }
  });
})(window, document);
