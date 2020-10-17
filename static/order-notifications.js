let rowOfNotification = document.getElementById("row-second-notification-id");

let notificationGeneral = document.getElementById("general-selectors-top-notification-bar-id");
let notificationPurchased = document.getElementById("purchased-selectors-top-notification-bar-id");
let notificationSold = document.getElementById("sold-selectors-top-notification-bar-id");

let notificationDelivered = document.getElementById("delivered-real-notifications-filters");
let notificationPaid = document.getElementById("paid-real-notifications-filters");
let notificationPending = document.getElementById("pending-real-notifications-filters");

notificationGeneral.addEventListener("click", () => {
  notificationPurchased.classList.remove("switch-1-selected");
  notificationSold.classList.remove("switch-1-selected");
  notificationGeneral.classList.add("switch-1-selected");
  // Filter
});

notificationPurchased.addEventListener("click", () => {
  notificationPurchased.classList.add("switch-1-selected");
  notificationSold.classList.remove("switch-1-selected");
  notificationGeneral.classList.remove("switch-1-selected");
  // Filter
});

notificationSold.addEventListener("click", () => {
  notificationPurchased.classList.remove("switch-1-selected");
  notificationSold.classList.add("switch-1-selected");
  notificationGeneral.classList.remove("switch-1-selected");
  // Filter
});

notificationDelivered.addEventListener("click", () => {
  notificationPaid.classList.remove("switch-1-selected");
  notificationDelivered.classList.add("switch-1-selected");
  notificationPending.classList.remove("switch-1-selected");
  // Filter
});

notificationPaid.addEventListener("click", () => {
  notificationDelivered.classList.remove("switch-1-selected");
  notificationPaid.classList.add("switch-1-selected");
  notificationPending.classList.remove("switch-1-selected");
  // Filter
});

notificationPending.addEventListener("click", () => {
  notificationDelivered.classList.remove("switch-1-selected");
  notificationPending.classList.add("switch-1-selected");
  notificationPaid.classList.remove("switch-1-selected");
  // Filter
});


function createNotification(notification) {
  let div = document.createElement("div");
  div.setAttribute("class", "real-notification-main-div");

  let sellerImage = document.createElement("div");
  sellerImage.setAttribute("class", "seller-round-image");
  sellerImage.setAttribute("style", "margin: 0;");

  let sellerIsOnline = document.createElement("div");
  sellerIsOnline.setAttribute("class", "seller-is-online");

  let divNamePriceNotification = document.createElement("div");
  divNamePriceNotification.setAttribute(
    "class",
    "main-div-name-price-notification"
  );

  let divNamePriceNotificationReal = document.createElement("div");
  divNamePriceNotificationReal.setAttribute(
    "class",
    "main-div-name-price-notification-real"
  );

  let nameNotification = document.createElement("div");
  nameNotification.setAttribute("class", "name-notttfication");

  nameNotification.innerText = `${notification.orderTitle}`;
  console.log(notification.orderTitle);

  let priceNotification = document.createElement("div");
  priceNotification.setAttribute("class", "price-notttfication");

  priceNotification.innerText = `Price: ${notification.orderPrice} EUR`;
  console.log(notification.orderPrice);

  let dateNotification = document.createElement("div");
  dateNotification.setAttribute(
    "class",
    "price-notttfication nope-marg-yep-color"
  );

  dateNotification.innerText = `${notification.createdAt.toDate().toDateString()}`;
  console.log(notification.createdAt.toDate().toDateString());

  let divOrderStatusNotification = document.createElement("div");
  divOrderStatusNotification.setAttribute(
    "class",
    "main-div-order-status-notification-real"
  );

  let orderStatus = document.createElement("div");
  orderStatus.setAttribute("class", "order-statuss");

  let orderStatusReal = document.createElement("div"); // CHANGE THIS TO -> SPAN
  orderStatusReal.setAttribute("class", "order-status-real");

  orderStatusReal.innerText = `${notification.orderStatus}`;
  console.log(notification.orderStatus);

  let divOrderStatusNotificationReal = document.createElement("div");
  divOrderStatusNotificationReal.setAttribute(
    "class",
    "main-div-order-status-notification-real category-mini-change"
  );

  let categoryProductListedMiniSign = document.createElement("div");
  categoryProductListedMiniSign.setAttribute(
    "class",
    "category-product-listed-mini-sign mini-sign-notification"
  );

  sellerImage.appendChild(sellerIsOnline);
  divNamePriceNotificationReal.appendChild(nameNotification);
  divNamePriceNotificationReal.appendChild(priceNotification);
  divNamePriceNotificationReal.appendChild(dateNotification);
  orderStatus.appendChild(orderStatusReal);
  divOrderStatusNotificationReal.appendChild(categoryProductListedMiniSign);
  divOrderStatusNotification.appendChild(orderStatus);
  divNamePriceNotification.appendChild(divNamePriceNotificationReal);
  divNamePriceNotification.appendChild(divOrderStatusNotification);
  divNamePriceNotification.appendChild(divOrderStatusNotificationReal);
  div.appendChild(sellerImage);
  div.appendChild(divNamePriceNotification);

  rowOfNotification.appendChild(div);
}

const getNotifications = async () => {
  let lastVisible;
  // Commented postsArray and put it above global
  // let postsArray = [];
  let docs;
  // pagination
  // let notificationsReference = firebase
  //   .firestore()
  //   .collection("notifications")
  //   .document("aBF73P69hyBToXpANOaF")
  //   .get()
  //   .orderBy("createdAt");
  //   // .limit(8);


  firebase
    .firestore()
    .collection("notifications")
    .doc("userIddd")
    .collection("notifications")
    // .doc("aBF73P69hyBToXpANOaF")
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
          createNotification(doc.data());
          console.log(doc.id, " => ", doc.data());
        })
        // .catch(function (error) {
        //   console.log("Error getting document:", error);
        // });
    });

  // await notificationsReference.get().then((snapshot) => {
  //   docs = snapshot;
  //   lastVisible = snapshot.docs[snapshot.docs.length - 1];
  //   // strange behavior
  //   console.log("last", lastVisible.data());
  // });
  // docs["docs"].forEach((doc) => {
  //   notificationsArray.push(doc.data());
  // });

  // notificationsArray.forEach((notification) => {
  //   createNotification(notification);
  // });
};

getNotifications();
