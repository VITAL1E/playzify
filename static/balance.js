  // NOT SURE IF GOOD IDEA TO BE GLOBAL
  let divMainTransactions = document.getElementById("transactions-main-div-id");

  let divSelectTransactions = document.getElementById("select-transactions-id");

  let optionAllTransactionsFilter = document.getElementById("options-all-transactions-id");
  let optionWithdrawFilter = document.getElementById("options-withdraw-id");
  let optionSoldFilter = document.getElementById("options-sold-id");
  let optionRefundFilter = document.getElementById("options-refund-id");
  let optionPaidFilter = document.getElementById("options-paid-id");

  let thereIsNothing = document.getElementById("there-is-nothing-id");

  let requestWithdrawPopup = document.getElementById(
    "request-withdraw-popup-id"
  );
  let requestWithdrawButton = document.getElementById(
    "request-withdraw-button-id"
  );

  function getOnSelectTransactionsChange() {
    let divSelectTransactionsOption = divSelectTransactions.options[divSelectTransactions.selectedIndex].value;
    console.log(divSelectTransactionsOption);
    return divSelectTransactionsOption;
  }

  const removeTransactions = () => {
    let elements = document.getElementsByClassName("transaction");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }  
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      requestWithdrawButton.addEventListener("click", function () {
        requestWithdrawPopup.style.display = "block";

        let withdrawButton = document.getElementById("withdraw-button-id");
        let cancelButton = document.getElementById("cancel-button-id");

        withdrawButton.addEventListener("click", function () {
          let amountValue = document.getElementById("withdraw-amount-id").value;
          let emailValue = document.getElementById("withdraw-email-id").value;

          let amountRegex = /^[0-9]+$/;
          let emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

          if (amountValue.match(amountRegex) && emailValue.match(emailRegex)) {
            firebase.firestore().collection("withdraws").add({
              user: user.displayName,
              amount: amountValue,
              email: emailValue,
            });
          }
          if (!amountValue.match(amountRegex)) {
            alert("Invalid amount value");
            return false;
          }
          if (!emailValue.match(emailRegex)) {
            alert("Invalid email value");
            return false;
          }
          requestWithdrawPopup.style.display = "none";
          alert("Withdraw submitted");
        });

        cancelButton.addEventListener("click", function () {
          requestWithdrawPopup.style.display = "none";
        });
      });

      let transactionsArray = [];
      const getTransactions = async (type) => {
        let docs;
        let lastVisible;
        let transactionsReference;

        if (type === undefined || type === "" || type === "All") {
          transactionsReference = firebase
          .firestore()
          .collection("transactions")
          .where("user", "==", user.displayName)
          .orderBy("createdAt", "desc");
        } else {
          transactionsReference = firebase
          .firestore()
          .collection("transactions")
          .where("user", "==", user.displayName)
          .where("type", "==", type)
          .orderBy("createdAt", "desc");       
        }

        transactionsArray = [];
        await transactionsReference.get().then((snapshot) => {
          docs = snapshot;
          lastVisible = snapshot.docs[snapshot.docs.length - 1];
          console.log("last", lastVisible.data());

          if (snapshot.docs.length === 0) {
            thereIsNothing.style.display = "block";
            return;
          }
        });
        docs["docs"].forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        transactionsArray.forEach((transaction) => {
          createTransaction(transaction);
        });
      };
      divSelectTransactions.addEventListener("change", function () {
        removeTransactions();
        let selectFilter = getOnSelectTransactionsChange();
        getTransactions(selectFilter);
      });
      getTransactions();

    } else {
      console.log("Not logged in");
    }
  });

  function createTransaction(transaction) {
    let div = document.createElement("div");
    div.setAttribute("class", "transaction");

    let divTransactionSign = document.createElement("div");

    if (transaction.type === "Sold") {
      divTransactionSign.setAttribute("class", "transaction-sign");
    }
    if (transaction.type === "Paid") {
      divTransactionSign.setAttribute(
        "class",
        "transaction-sign transaction-sign-check"
      );
    }
    if (transaction.type === "Refund" || transaction.type === "Withdraw") {
      divTransactionSign.setAttribute(
        "class",
        "transaction-sign transaction-sign-minus"
      );
    }

    let divTransactionTypeMain = document.createElement("div");
    divTransactionTypeMain.setAttribute("class", "transaction-info-all");
    divTransactionTypeMain.setAttribute("style", "padding-left: 0; border: 0;");

    let divTransactionType = document.createElement("div");
    divTransactionType.setAttribute("class", "transaction-info-all-2");
    divTransactionType.textContent = "transaction type:";

    let divTransactionTypeStatus = document.createElement("span");
    divTransactionTypeStatus.setAttribute("class", "transaction-info-all-span");
    divTransactionTypeStatus.textContent = transaction.type;

    let divTransactionFromMain = document.createElement("div");
    divTransactionFromMain.setAttribute("class", "transaction-info-all");

    let divTransactionFrom = document.createElement("div");
    divTransactionFrom.setAttribute("class", "transaction-info-all-2");

    if (transaction.type === "Sold") {
      divTransactionFrom.textContent = "from:";
    } else {
      divTransactionFrom.textContent = "to:";
    }

    let divTransactionFromUser = document.createElement("span");
    divTransactionFromUser.setAttribute("class", "transaction-info-all-span");
    divTransactionFromUser.textContent = transaction.otherUser;

    let divTransactionAmountMain = document.createElement("div");
    divTransactionAmountMain.setAttribute("class", "transaction-info-all");

    let divTransactionAmount = document.createElement("div");
    divTransactionAmount.setAttribute("class", "transaction-info-all-2");
    divTransactionAmount.textContent = "amount:";

    let divTransactionAmountValue = document.createElement("span");
    divTransactionAmountValue.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    divTransactionAmountValue.textContent = `${transaction.amount} EU`;

    let divTransactionCreatedAtMain = document.createElement("div");
    divTransactionCreatedAtMain.setAttribute("class", "transaction-info-all");

    let divTransactionCreatedAt = document.createElement("div");
    divTransactionCreatedAt.setAttribute("class", "transaction-info-all-2");
    divTransactionCreatedAt.textContent = "time:";

    let divTransactionCreatedAtTimeago = document.createElement("span");
    divTransactionCreatedAtTimeago.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    divTransactionCreatedAtTimeago.textContent = getTimeSince(
      new Date(transaction.createdAt.seconds * 1000)
    );

    divTransactionType.appendChild(divTransactionTypeStatus);
    divTransactionTypeMain.appendChild(divTransactionType);

    divTransactionFrom.appendChild(divTransactionFromUser);
    divTransactionFromMain.appendChild(divTransactionFrom);

    divTransactionAmount.appendChild(divTransactionAmountValue);
    divTransactionAmountMain.appendChild(divTransactionAmount);

    divTransactionCreatedAt.appendChild(divTransactionCreatedAtTimeago);
    divTransactionCreatedAtMain.appendChild(divTransactionCreatedAt);

    div.appendChild(divTransactionSign);
    div.appendChild(divTransactionTypeMain);
    div.appendChild(divTransactionFromMain);
    div.appendChild(divTransactionAmountMain);
    div.appendChild(divTransactionCreatedAtMain);

    divMainTransactions.appendChild(div);
  }

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