(function (window, document, undefined) {
  "use strict";

  let divWithdraws = document.getElementById("div-withdraws-list-id");

  let popupWithdraw = document.getElementById("popup-withdraw-id");

  let divSelectWithdraws = document.getElementById("select-withdraws-id");

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
  historyButton.addEventListener("click", function() {
    window.location.href = "admin(history).html";
  });

  function createWithdrawRequest(withdraw) {
    let div = document.createElement("div");
    div.setAttribute("class", "transaction cc-cursor");

    let transactionSign = document.createElement("div");

    if (withdraw.status === "Pending") {
      transactionSign.setAttribute("class", "transaction-sign");
    } else if (withdraw.status === "Done") {
      transactionSign.setAttribute(
        "class",
        "transaction-sign transaction-sign-check"
      );
    } else {
      console.log("Error for status of withdraw");
    }

    let transactionInfo = document.createElement("div");
    transactionInfo.setAttribute("class", "transaction-info-all");
    transactionInfo.setAttribute("style", "padding-left: 0; border: 0;");

    let transactionStatus = document.createElement("div");
    transactionStatus.setAttribute("class", "transaction-info-all-2");
    transactionStatus.textContent = "status: ";

    let transactionProgressSpan = document.createElement("span");
    transactionProgressSpan.setAttribute("class", "transaction-info-all-span");
    transactionProgressSpan.textContent = withdraw.status;

    let transactionInfoFrom = document.createElement("div");
    transactionInfoFrom.setAttribute("class", "transaction-info-all");

    let transactionInfoFormUsername = document.createElement("div");
    transactionInfoFormUsername.setAttribute("class", "transaction-info-all-2");
    transactionInfoFormUsername.textContent = "from: ";

    let transactionInfoFormUsernameSpan = document.createElement("span");
    transactionInfoFormUsernameSpan.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    transactionInfoFormUsernameSpan.textContent = withdraw.user;

    let transactionAmount = document.createElement("div");
    transactionAmount.setAttribute("class", "transaction-info-all");

    let transactionAmountText = document.createElement("div");
    transactionAmountText.setAttribute("class", "transaction-info-all-2");
    transactionAmountText.textContent = "amount: ";

    let transactionAmountSpan = document.createElement("span");
    transactionAmountSpan.setAttribute("class", "transaction-info-all-span");
    transactionAmountSpan.textContent = `${withdraw.amount} EU`;

    let transactionInfoTime = document.createElement("div");
    transactionInfoTime.setAttribute("class", "transaction-info-all");

    let transactionInfoTimeDate = document.createElement("div");
    transactionInfoTimeDate.setAttribute("class", "transaction-info-all-2");
    transactionInfoTimeDate.textContent = "time: ";

    let transactionInfoTimeSpan = document.createElement("span");
    transactionInfoTimeSpan.setAttribute("class", "transaction-info-all-span");
    transactionInfoTimeSpan.textContent = getTimeSince(
      withdraw.createdAt.toDate()
    );

    transactionStatus.appendChild(transactionProgressSpan);
    transactionInfo.appendChild(transactionStatus);

    transactionInfoFormUsername.appendChild(transactionInfoFormUsernameSpan);
    transactionInfoFrom.appendChild(transactionInfoFormUsername);

    transactionAmountText.appendChild(transactionAmountSpan);
    transactionAmount.appendChild(transactionAmountText);

    transactionInfoTimeDate.appendChild(transactionInfoTimeSpan);
    transactionInfoTime.appendChild(transactionInfoTimeDate);

    div.appendChild(transactionSign);
    div.appendChild(transactionInfo);
    div.appendChild(transactionInfoFrom);
    div.appendChild(transactionAmount);
    div.appendChild(transactionInfoTime);

    div.addEventListener("click", function () {
      popupWithdraw.style.display = "block";

      let popupImage = document.getElementById("popup-image-id");
      popupImage.setAttribute(
        "style",
        `background-image:url(${withdraw.userPhoto})`
      );

      let popupUsername = document.getElementById("popup-username-id");
      popupUsername.textContent = withdraw.user;

      let popupAmount = document.getElementById("popup-amount-id");
      popupAmount.textContent = `Amount: ${withdraw.amount} EU`;

      let doneButton = document.getElementById("popup-done-button-id");
      doneButton.addEventListener("click", function () {
        firebase.firestore().doc(`/withdraws/${withdraw.withdrawId}`).set(
          {
            status: "Done",
          },
          { merge: true }
        );
        popupWithdraw.style.display = "none";
      });

      let cancelButton = document.getElementById("popup-cancel-button-id");
      cancelButton.addEventListener("click", function () {
        popupWithdraw.style.display = "none";
      });
    });

    divWithdraws.appendChild(div);
  }

  let withdrawsArray = [];

  const getWithdraws = async (status) => {
    let docs;
    let lastVisible;
    let withdrawsReference = firebase
      .firestore()
      .collection("withdraws")
      .where("status", "==", status)
      .orderBy("createdAt", "desc");

    withdrawsArray = [];

    await withdrawsReference.get().then((snapshot) => {
        docs = snapshot;
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        console.log("last", lastVisible.data());

        docs["docs"].forEach((doc) => {
          withdrawsArray.push(doc.data());
        });
        removeWithdraws();

        withdrawsArray.forEach((withdraw) => {
          createWithdrawRequest(withdraw);
        });

        withdrawsArray = [];
    });
  };

  divSelectWithdraws.addEventListener("change", function () {
    let selectFilter = `${divSelectWithdraws.value}`;
    if (typeof selectFilter === "string" || selectFilter instanceof String) {
      console.log("String");
    } else {
      console.log("Not string");
    }
    getWithdraws(selectFilter);
  });

  const removeWithdraws = () => {
    let elements = document.getElementsByClassName("transaction cc-cursor");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User signed");
      getWithdraws("Pending");
    } else {
      console.log("Not logged in");
    }
  });

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
})(window, document);
