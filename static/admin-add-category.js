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

  let indexProductType = document.getElementById("select-by-product-type");
  let indexGameType = document.getElementById("select-by-game-type");
  let indexGameServer = document.getElementById("select-by-game-server");

  if (generalButton) {
    generalButton.addEventListener("click", function () {
      window.location.href = "admin.html";
    });
  }

  if (adminsButton) {
    adminsButton.addEventListener("click", function () {
      window.location.href = "admin(admins).html";
    });
  }

  if (supportButton) {
    supportButton.addEventListener("click", function () {
      window.location.href = "admin(support).html";
    });
  }

  if (sellerVerificationButton) {
    sellerVerificationButton.addEventListener("click", function () {
      window.location.href = "admin(seller-verification).html";
    });
  }

  if (withdrawsButton) {
    withdrawsButton.addEventListener("click", function () {
      window.location.href = "admin(withdraw).html";
    });
  }

  if (usersButton) {
    usersButton.addEventListener("click", function () {
      window.location.href = "admin(user).html";
    });
  }

  if (addCategoryButton) {
    addCategoryButton.addEventListener("click", function () {
      window.location.href = "admin(add-category).html";
    });
  }

  if (addSlideButton) {
    addSlideButton.addEventListener("click", function () {
      window.location.href = "admin(add-slide).html";
    });
  }

  if (historyButton) {
    historyButton.addEventListener("click", function () {
      window.location.href = "admin(history).html";
    });
  }

  let onSelectCategory = document.getElementById("select-category-id");

  let divCategories = document.getElementById("main-list-category-id");

  function getOnSelectCategoryAdminChange() {
    let divSelectCategoryOption =
      onSelectCategory.options[onSelectCategory.selectedIndex].value;
    console.log(divSelectCategoryOption);
    return divSelectCategoryOption;
  }

  let popupCategoryAddGameServer = document.getElementById(
    "popup-add-category-id"
  );
  let addCategoryServerButton = document.getElementById(
    "add-category-button-id"
  );

  if (addCategoryServerButton) {
    addCategoryServerButton.addEventListener("click", function () {
      popupCategoryAddGameServer.style.display = "block";

      let addButton = document.getElementById("popup-add-button-id");

      addButton.addEventListener("click", function () {
        let category = getOnSelectCategoryAdminChange();
        let inputGameType = document.getElementById("game-type").value;
        let inputServerType = document.getElementById("server-type").value;

        let optionGame = document.createElement("option");
        optionGame.value = inputGameType;
        //indexGameType.add(optionGame);

        let optionServer = document.createElement("option");
        optionServer.value = inputServerType;
        //indexGameServer.add(optionServer);

        firebase.firestore().collection("categories").add({
          category: getOnSelectCategoryAdminChange(),
          game: inputGameType,
          server: inputServerType,
        });

        popupCategoryAddGameServer.style.display = "none";
      });

      let cancelButton = document.getElementById("popup-cancel-button-id");
      cancelButton.addEventListener("click", function () {
        popupCategoryAddGameServer.style.display = "none";
      });
    });
  }

  function createCategory(category) {
    let div = document.createElement("div");
    div.setAttribute("class", "transaction cc-cursor");
    div.setAttribute("style", "cursor: inherit;");

    let transactionInfo = document.createElement("div");
    transactionInfo.setAttribute(
      "class",
      "transaction-sign transaction-admin-category"
    );

    let transactionInfoStatusCategory = document.createElement("div");
    transactionInfoStatusCategory.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );
    transactionInfoStatusCategory.setAttribute(
      "style",
      "padding-left: 0; border: 0;"
    );

    let transactionInfoFrom = document.createElement("div");
    transactionInfoFrom.setAttribute("class", "transaction-info-all-2");
    transactionInfoFrom.textContent = "category:";

    let transactionInfoFormCategorySpan = document.createElement("span");
    transactionInfoFormCategorySpan.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    transactionInfoFormCategorySpan.textContent = category.category;

    let transactionInfoGame = document.createElement("div");
    transactionInfoGame.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );

    let transactionInfoStatusGame = document.createElement("div");
    transactionInfoStatusGame.setAttribute("class", "transaction-info-all-2");
    transactionInfoStatusGame.textContent = "game:";

    let transactionInfoGameSpan = document.createElement("span");
    transactionInfoGameSpan.setAttribute("class", "transaction-info-all-span");
    transactionInfoGameSpan.textContent = category.game;

    let transactionInfoStatusServer = document.createElement("div");
    transactionInfoStatusServer.setAttribute(
      "class",
      "transaction-info-all admin-verification-change"
    );

    let transactionInfoServer = document.createElement("div");
    transactionInfoServer.setAttribute("class", "transaction-info-all-2");
    transactionInfoServer.textContent = "server:";

    let transactionInfoFormServerSpan = document.createElement("span");
    transactionInfoFormServerSpan.setAttribute(
      "class",
      "transaction-info-all-span"
    );
    transactionInfoFormServerSpan.textContent = category.server;

    transactionInfo.addEventListener("click", function () {
      firebase
        .firestore()
        .collection("categories")
        .doc(category.categoryId)
        .delete()
        .then(() => {
          alert("Successfully deleted, refresh the page");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    transactionInfoStatusCategory.appendChild(transactionInfoFrom);
    transactionInfoFrom.appendChild(transactionInfoFormCategorySpan);

    transactionInfoStatusGame.appendChild(transactionInfoGameSpan);
    transactionInfoGame.appendChild(transactionInfoStatusGame);

    transactionInfoServer.appendChild(transactionInfoFormServerSpan);
    transactionInfoStatusServer.appendChild(transactionInfoServer);

    div.appendChild(transactionInfo);
    div.appendChild(transactionInfoStatusCategory);
    div.appendChild(transactionInfoGame);
    div.appendChild(transactionInfoStatusServer);

    if (divCategories) {
      divCategories.appendChild(div);
    }
  }

  const getCategories = async () => {
    let slidesArray = [];
    let lastVisible;
    let docs;

    let slides = firebase.firestore().collection("categories");

    await slides.get().then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      slidesArray.push(doc.data());
    });

    slidesArray.forEach((slide) => {
      createCategory(slide);
      console.log(slide);
    });
    slidesArray = [];
  };

  getCategories();
})(window, document);
