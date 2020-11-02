let rowOfNotification = document.getElementById("row-second-notification-id");

let notificationGeneral = document.getElementById("general-selectors-top-notification-bar-id");
let notificationPurchased = document.getElementById("purchased-selectors-top-notification-bar-id");
let notificationSold = document.getElementById("sold-selectors-top-notification-bar-id");

notificationGeneral.addEventListener("click", () => {
  notificationPurchased.classList.remove("switch-1-selected");
  notificationSold.classList.remove("switch-1-selected");
  notificationGeneral.classList.add("switch-1-selected");
  // Filter
  getNotifications("General");
});

notificationPurchased.addEventListener("click", () => {
  notificationPurchased.classList.add("switch-1-selected");
  notificationSold.classList.remove("switch-1-selected");
  notificationGeneral.classList.remove("switch-1-selected");
  // Filter
  removeNotifications();
  // Change
  //getNotifications("");
});

notificationSold.addEventListener("click", () => {
  notificationSold.classList.add("switch-1-selected");
  notificationGeneral.classList.remove("switch-1-selected");
  notificationPurchased.classList.remove("switch-1-selected");
  // Filter
  removeNotifications();
  // Change
  //getNotifications("");
});

const removeNotifications = () => {
  let elements = document.getElementsByClassName("real-notification-main-div");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}


function createNotification(notification) {
  if (notification.typeOfNotification === "General") {
    let div = document.createElement("div");
    div.setAttribute("class", "real-notification-main-div");

    let divImage = document.createElement("div");
    divImage.setAttribute("class", "seller-round-image seller-round-image-for-mini");
    divImage.setAttribute("style", `margin: 0; background-size: cover; background-image:url(${notification.userPhoto});`);

    let divMainAction = document.createElement("div");
    divMainAction.setAttribute("class", "main-div-name-price-notification main-div-name-price-notification-mini");

    let divAction = document.createElement("div");
    divAction.setAttribute("class", "main-div-name-price-notification-real main-div-name-price-notification-real-mini");

    let action = document.createElement("div");
    action.setAttribute("class", "name-notttfication name-notttfication-mini");

    let usernameSpan = document.createElement("span");
    usernameSpan.setAttribute("class", "mini-user-name");
    usernameSpan.textContent = `${notification.from} ${notification.action}`; 

    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "mini-time");
    timeSpan.textContent = " " + getTimeSince(notification.createdAt.seconds * 1000);

    action.appendChild(usernameSpan);
    action.appendChild(timeSpan);
    divAction.appendChild(action);
    divMainAction.appendChild(divAction);
    div.appendChild(divImage);
    div.appendChild(divMainAction);

    rowOfNotification.appendChild(div);

    // div.addEventListener("click", function () {
    //   window.location.href = `order.html?id=${notification.orderId}`;
    // });
  } else if (notification.typeOfNotification === "Verified") {
    let div = document.createElement("div");
    div.setAttribute("class", "real-notification-main-div");
  
    let sellerImage = document.createElement("div");
    sellerImage.setAttribute("class", "seller-round-image seller-round-image-for-mini seller-round-image-for-mini-zify");
    sellerImage.setAttribute("style", "margin: 0;");
  
    let sellerIsOnline = document.createElement("div");
    sellerIsOnline.setAttribute("class", "main-div-name-price-notification main-div-name-price-notification-mini");
  
    let divNamePriceNotification = document.createElement("div");
    divNamePriceNotification.setAttribute(
      "class",
      "main-div-name-price-notification-real main-div-name-price-notification-real-mini"
    );
  
    let divNamePriceNotificationReal = document.createElement("div");
    divNamePriceNotificationReal.setAttribute(
      "class",
      "name-notttfication name-notttfication-mini"
    );
    divNamePriceNotificationReal.textContent = notification.action;

    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "mini-time");
    timeSpan.textContent = " " + getTimeSince(notification.createdAt.seconds * 1000);

    divNamePriceNotificationReal.appendChild(timeSpan);
    divNamePriceNotification.appendChild(divNamePriceNotificationReal);
    sellerIsOnline.appendChild(divNamePriceNotification);

    div.appendChild(sellerImage);
    div.appendChild(sellerIsOnline);


    rowOfNotification.appendChild(div);



    // ORDER NOTIFICATION
    // dateNotification.innerText = `${notification.createdAt.toDate().toDateString()}`;
    // console.log(notification.createdAt.toDate().toDateString());
  
    // let divOrderStatusNotification = document.createElement("div");
    // divOrderStatusNotification.setAttribute(
    //   "class",
    //   "main-div-order-status-notification-real"
    // );
  
    // let orderStatus = document.createElement("div");
    // orderStatus.setAttribute("class", "order-statuss");
  
    // let orderStatusReal = document.createElement("div");
    // orderStatusReal.setAttribute("class", "order-status-real");
  
    // orderStatusReal.innerText = `${notification.orderStatus}`;
    // console.log(notification.orderStatus);
  
    // let divOrderStatusNotificationReal = document.createElement("div");
    // divOrderStatusNotificationReal.setAttribute(
    //   "class",
    //   "main-div-order-status-notification-real category-mini-change"
    // );
  
    // let categoryProductListedMiniSign = document.createElement("div");
    // categoryProductListedMiniSign.setAttribute(
    //   "class",
    //   "category-product-listed-mini-sign mini-sign-notification"
    // );
  
    // sellerImage.appendChild(sellerIsOnline);
    // divNamePriceNotificationReal.appendChild(nameNotification);
    // divNamePriceNotificationReal.appendChild(priceNotification);
    // divNamePriceNotificationReal.appendChild(dateNotification);
    // orderStatus.appendChild(orderStatusReal);
    // divOrderStatusNotificationReal.appendChild(categoryProductListedMiniSign);
    // divOrderStatusNotification.appendChild(orderStatus);
    // divNamePriceNotification.appendChild(divNamePriceNotificationReal);
    // divNamePriceNotification.appendChild(divOrderStatusNotification);
    // divNamePriceNotification.appendChild(divOrderStatusNotificationReal);
    // div.appendChild(sellerImage);
    // div.appendChild(divNamePriceNotification);
  
    // rowOfNotification.appendChild(div);
  
    // div.addEventListener("click", function () {
    //   window.location.href = `order.html?id=${notification.orderId}`;
    // });

  } else if (notification.typeOfNotification === "Review") {

    let div = document.createElement("div");
    div.setAttribute("class", "real-notification-main-div");

    let divImage = document.createElement("div");
    divImage.setAttribute("class", "seller-round-image seller-round-image-for-mini");
    divImage.setAttribute("style", `margin: 0; background-size: cover; background-image:url(${notification.userPhoto});`);

    let divMainAction = document.createElement("div");
    divMainAction.setAttribute("class", "main-div-name-price-notification main-div-name-price-notification-mini");

    let divAction = document.createElement("div");
    divAction.setAttribute("class", "main-div-name-price-notification-real main-div-name-price-notification-real-mini");

    let action = document.createElement("div");
    action.setAttribute("class", "name-notttfication name-notttfication-mini");

    let usernameSpan = document.createElement("span");
    usernameSpan.setAttribute("class", "mini-user-name");
    usernameSpan.textContent = `${notification.from} ${notification.action} "${notification.review}"`; 

    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "mini-time");
    timeSpan.textContent = " " + getTimeSince(notification.createdAt.seconds * 1000);

    action.appendChild(usernameSpan);
    action.appendChild(timeSpan);
    divAction.appendChild(action);
    divMainAction.appendChild(divAction);
    div.appendChild(divImage);
    div.appendChild(divMainAction);

    rowOfNotification.appendChild(div);

  }
}

const getNotifications = async (orderStatus) => {
  firebase.auth().onAuthStateChanged(function(user) {
    let notificationsReference;
    if (user) {
      if (orderStatus === undefined || orderStatus === "" || orderStatus === "General") {
        notificationsReference = firebase
        .firestore()
        .collection("notifications")
        .doc(user.displayName)
        .collection("notifications")  
        .orderBy("createdAt", "desc");
      } else if (orderStatus === "Purchased") {
        notificationsReference = firebase
        .firestore()
        .collection("notifications")
        .doc(user.displayName)
        .collection("notifications")
        .where("buyer", "==", user.displayName)
        .where("orderStatus", "==", orderStatus)
        .orderBy("createdAt", "desc");        
      } else if (orderStatus === "Sold") {
        notificationsReference = firebase
        .firestore()
        .collection("notifications")
        .where("seller", "==", user.displayName)
        .doc(user.displayName)
        .collection("notifications")    
        .orderBy("createdAt", "desc");            
      } else {
        console.log("Fuck off");
      }
      notificationsReference
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
          createNotification(doc.data());
          console.log(doc.id, " => ", doc.data());
        })
      })
      .catch(error => {
        console.log(error);
      })
    } else {
      console.log("Not logged in");
    }
  });
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

getNotifications();
