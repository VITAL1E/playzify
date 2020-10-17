(function (window, document, undefined) {
  "use strict";

  let categorySection = document.getElementById("category-order-section-id");

  // ORDER BASIC INFO
  let orderSellerProfilePhoto = document.getElementById(
    "order-seller-profile-photo-id"
  );
  let orderSellerNickname = document.getElementById("nickname-order-seller-id");
  let orderGameCategory = document.getElementById("game-category-order-id");
  let orderGameType = document.getElementById("game-type-order-id");
  let orderGameServer = document.getElementById("game-server-order-id");

  let orderGamePrice = document.getElementById("game-price-order-id");
  let orderGameQuantity = document.getElementById("game-quantity-order-id");
  let orderGameId = document.getElementById("game-id-order-id");
  let orderPostLink = document.getElementById("game-post-link-order-id");

  let orderHistoryButton = document.getElementById("order-history-button-id");
  let orderHistoryPopup = document.getElementById("order-history-popup-id");
  // let orderAcceptButton = document.getElementById("accept-order");
  // let orderRefuseButton = document.getElementById("refuse-order");
  let popupDelivery = document.getElementById("pop-up-delivery");
  let popupOrderHistory = document.getElementById("pop-up-order-history");
  let popupOrderQuestion = document.getElementById("pop-up-order-question");
  let closeModalButton = document.getElementsByClassName("close-modal");

  // ORDER STATUS SECTION
  let divMainOrderStatus = document.getElementById("connect-the-dots-id");
  let orderSoldStatus = document.getElementById("order-sold-id");
  let orderPaidStatus = document.getElementById("order-paid-id");
  let orderAcceptedStatus = document.getElementById("order-accepted-id");
  let orderDeliveredStatus = document.getElementById("order-delivered-id");
  let orderCompletedStatus = document.getElementById("order-completed-id");
  let orderRejectedStatus = document.getElementById("order-rejected-id");
  // ORDER STATUS
  //let divMainOrderStatus = document.getElementById("order-status-id");

  let deliveryButton = document.getElementById("deliver-item-button");
  let cancelDeliveyButton = document.getElementById("cancel-delivery");

  // ACTION BUTTONS SECTION
  let divMainActionButtons = document.getElementById("action-buttons-main-div");
  let textActionButtons = document.getElementById("action-buttons-text");
  let actionButtons = document.getElementById("accept-buttons-id");

  // ORDER INFROMATION
  let divMainOrderInformationText = document.getElementById(
    "order-information-text-id"
  );

  // ORDER HISTORY

  if (orderHistoryButton !== null) {
    orderHistoryButton.addEventListener("click", () => {
      let orderMainHistoryEvent = document.createElement("div");
      orderMainHistoryEvent.setAttribute("class", "allordderaction");

      let orderHistoryUsername = document.createElement("div");
      orderHistoryUsername.setAttribute("class", "history-order-nickname");

      let orderUsernameSpan = document.createElement("span");

      let orderHistoryAction = document.createElement("div");
      orderHistoryAction.setAttribute(
        "class",
        "history-order-nickname mn-change"
      );

      let orderActionSpan = document.createElement("span");

      const url = new URL(window.location.href);
      let orderId = url.searchParams.get("id");

      firebase
        .firestore()
        .doc(`orders/${orderId}`)
        .get()
        .then((snapshot) => {
          let divMainHistoryValuesMapObject = snapshot.data().history;
          let divMainHistoryActions;

          for (const [key, value] of Object.entries(divMainHistoryValuesMapObject)) {
            console.log(`${key}: ${value.seconds}`);

            divMainHistoryActions = document.createElement("div");
            divMainHistoryActions.setAttribute("class", "allordderaction");

            let divHistoryAction = document.createElement("div");
            divHistoryAction.setAttribute("class", "history-order-nickname mn-change");

            let divHistoryActionTextContent = document.createElement("span");
            divHistoryActionTextContent.textContent = key;

            let divHistoryActionSpan = document.createElement("span")
            console.log(value);
            divHistoryActionSpan.textContent = new Date(value.seconds * 1000);

            divHistoryAction.appendChild(divHistoryActionTextContent);
            divHistoryAction.appendChild(divHistoryActionSpan);

            divMainHistoryActions.appendChild(divHistoryAction);
          }
          orderHistoryPopup.appendChild(divMainHistoryActions);


          // we will have array here, therefore an forEach or smth.
          orderHistoryUsername.textContent = `${snapshot.data().buyer}`;
          orderHistoryAction.textContent = `${snapshot.data().action}`;
        });
      // MOVE up ?
      popupOrderHistory.style.display = "block";
    });
  }

  function getOrderDetails() {
    const url = new URL(window.location.href);
    let orderId = url.searchParams.get("id");

    console.log("Reach order");

    // Added this event listener
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // NOT sure if reference is better
        firebase
          .firestore()
          .doc(`/orders/${orderId}`)
          .get()
          .then((doc) => {
            let orderSelected = {
              buyer: doc.data().buyer,
              seller: doc.data().seller,
              category: doc.data().category,
              createdAt: doc.data().createdAt,
              delivery: doc.data().delivery,
              description: doc.data().description,
              price: doc.data().price,
              server: doc.data().server,
              title: doc.data().title,
              type: doc.data().type,
              orderId: doc.data().orderId,
              orderLink: doc.data().orderLink,
              productData: doc.data().productData,
              quantity: doc.data().quantity,
              garanty: doc.data().garanty,
              images: doc.data().images,
              status: doc.data().status,
              sellerProfilePhoto: doc.data().sellerProfilePhoto,
            };

            console.log(doc.data().category);
            console.log(doc.data().title);
            console.log(doc.data().description);
            console.log(doc.data().price);
            console.log(doc.data().server);
            console.log(doc.data().type);
            console.log(doc.data().quantity);
            console.log(doc.data().garanty);
            console.log(doc.data().images);

            if (
              "Paid" in orderSelected.status &&
              !("Accepted" in orderSelected.status) &&
              !("Delivered" in orderSelected.status) &&
              !("Completed" in orderSelected.status)
            ) {
              console.log("Order is paid");
              if (orderSelected.seller === user.displayName) {
                // ACTION BUTTONS
                let divAcceptButton = document.createElement("div");
                let divRefuseButton = document.createElement("div");

                divAcceptButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );
                divRefuseButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );

                divAcceptButton.textContent = "ACCEPT";
                divRefuseButton.textContent = "REFUSE";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "You have X days to Accept or Refuse the order. If you ignore this order, it will be automatically refunded.";

                // ORDER STATUS
                // maybe not just yet, after payment confirmed
                orderSoldStatus.style.display = "block";

                divAcceptButton.addEventListener("click", function () {
                  popupOrderQuestion.style.display = "block";

                  // ARE YOU SURE ACCEPT ORDER POPUP?
                  let areYouSureAcceptYes = document.getElementById(
                    "sure-accept-order-yes"
                  );
                  let areYouSureAcceptNo = document.getElementById(
                    "sure-accept-order-no"
                  );

                  areYouSureAcceptYes.addEventListener("click", function () {
                    window.alert("You accepted the orrder");

                    popupOrderQuestion.style.display = "none";

                    firebase
                      .firestore()
                      .doc(`/orders/${orderId}`)
                      .set(
                        {
                          status: {
                            Accepted: new Date().toISOString(),
                          },
                        },
                        { merge: true }
                      );
                  });

                  areYouSureAcceptNo.addEventListener("click", function () {
                    popupOrderQuestion.style.display = "none";
                  });
                });

                divRefuseButton.addEventListener("click", function () {
                  // MAKE REFUND
                  // call endpoint for refund
                });

                // append child STUFF
              } else if (orderSelected.buyer === user.displayName) {
                // ACTION BUTTONS
                let divDisputeButton = document.createElement("div");

                divDisputeButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );
                // SURE DISPUTE?
                divDisputeButton.textContent = "DISPUTE";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "Seller has X days to Accept or Refuse the order. If he ignores this order, it will be automatically refunded.";

                // ORDER STATUS
                orderPaidStatus.style.display = "block";
              } else {
                console.log("GET THE FUCK OUTTA HERE");
              }
            } else if (
              "Paid" in orderSelected.status &&
              "Accepted" in orderSelected.status &&
              !("Delivered" in orderSelected.status) &&
              !("Completed" in orderSelected.status)
            ) {
              console.log("Order is accepted");
              if (orderSelected.seller === user.displayName) {
                // ACTION BUTTONS
                let divDeliverButton = document.createElement("div");
                let divCancelButton = document.createElement("div");

                divDeliverButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );
                divCancelButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );

                divDeliverButton.textContent = "DELIVER";
                divCancelButton.textContent = "CANCEL";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "You have X day to Deliver the order. If you ignore this order, it will be automatically refunded.";

                // ORDER STATUS
                orderSoldStatus.style.display = "block";
                orderAcceptedStatus.style.display = "block";
              } else if (orderSelected.buyer === user.displayName) {
                // ACTION BUTTONS
                let divDisputeButton = document.createElement("div");

                divDisputeButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );
                // SURE DISPUTE?
                divDisputeButton.textContent = "DISPUTE";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "Seller has X day to Deliver the order. If he ignores this order, it will be automatically refunded.";

                // ORDER STATUS
                orderPaidStatus.style.display = "block";
                orderAcceptedStatus.style.display = "block";
              } else {
                console.log("GET THE FUCK OUTTA HERE");
              }
            } else if (
              "Paid" in orderSelected.status &&
              "Accepted" in orderSelected.status &&
              "Delivered" in orderSelected.status &&
              !("Completed" in orderSelected.status)
            ) {
              console.log("Order is delivered");
              console.log("USer " + user);

              if (orderSelected.seller === user.displayName) {
                // ACTION BUTTONS
                let divConfirmButton = document.createElement("div");

                divConfirmButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );

                divConfirmButton.textContent = "CONFIRM";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "You have Delivered the order. Waiting for buyer to confirm the order.";

                // ORDER STATUS
                orderSoldStatus.style.display = "block";
                orderAcceptedStatus.style.display = "block";
                orderDeliveredStatus.style.display = "block";
              } else if (orderSelected.buyer === user.displayName) {
                // ACTION BUTTONS
                let divConfirmButton = document.createElement("div");

                divConfirmButton.setAttribute(
                  "class",
                  "all-order-action-buttons"
                );

                divConfirmButton.textContent = "CONFIRM";

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "The order was Delivered to you. You have to confirm it.";

                // ORDER STATUS
                orderPaidStatus.style.display = "block";
                orderAcceptedStatus.style.display = "block";
                orderDeliveredStatus.style.display = "block";
              } else {
                console.log("GET THE FUCK OUTTA HERE");
              }
            } else if (
              "Paid" in orderSelected.status &&
              "Accepted" in orderSelected.status &&
              "Delivered" in orderSelected.status &&
              "Completed" in orderSelected.status
            ) {
              // ACTION BUTTONS
              divMainActionButtons.remove();
              textActionButtons.remove();
              actionButtons.remove();

              if (orderSelected.seller === user.displayName) {
                // ACTION BUTTONS

                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "The order is Complete.";

                // ORDER STATUS
                orderSoldStatus.style.display = "block";
                orderAcceptedStatus.style.display = "block";
                orderDeliveredStatus.style.display = "block";
                orderCompletedStatus.style.display = "block";
              } else if (orderSelected.buyer === user.displayName) {
                // ORDER INFROMATION
                divMainOrderInformationText.textContent =
                  "The order is Complete.";

                // ORDER STATUS
                orderPaidStatus.style.display = "inline-block";
                orderAcceptedStatus.style.display = "inline-block";
                orderDeliveredStatus.style.display = "inline-block";
                orderCompletedStatus.style.display = "inline-block";
              } else {
                console.log("GET THE FUCK OUTTA HERE");
                console.log("Order buyer " + orderSelected.buyer);
                console.log("Order seller " + orderSelected.seller);
              }
            } else {
              console.log("Lol nothing at all neither buyer / seller");
            }

            // if (orderSelected.images) {
            //   for (let i = 0; i < orderSelected.images.length; i++) {
            //     let imagePreview = document.createElement("div");
            //     let imageBackground = document.createElement("img");
            //     imagePreview.setAttribute("class", "post-images");
            //     imageBackground.setAttribute(
            //       "style",
            //       "width: inherit; height: inherit; border-radius: 20px;"
            //     );
            //     imageBackground.setAttribute("src", `${orderSelected.images[i]}`);
            //     imagePreview.appendChild(imageBackground);
            //     postImages.appendChild(imagePreview);
            //   }
            // }

            // ORDER - SELLER CATEGORY SERVER GAME

            let divSellerProfilePhoto = document.createElement("img");
            divSellerProfilePhoto.setAttribute(
              "src",
              orderSelected.sellerProfilePhoto
            );
            orderSellerProfilePhoto.appendChild(divSellerProfilePhoto);

            orderSellerNickname.textContent = `${orderSelected.seller}`;
            let sellerNicknameSpan = document.createElement("span");
            sellerNicknameSpan.setAttribute("class", "type-of-order-user");
            sellerNicknameSpan.textContent = "SELLER";
            orderSellerNickname.appendChild(sellerNicknameSpan);

            let gameCategoryTextContent = document.createElement("span");
            gameCategoryTextContent.textContent = orderSelected.category;
            let gameCategorySpan = document.createElement("span");
            gameCategorySpan.setAttribute(
              "class",
              "additional-order-game-info-greyyy"
            );
            gameCategorySpan.textContent = "category:";
            orderGameCategory.appendChild(gameCategorySpan);
            orderGameCategory.appendChild(gameCategoryTextContent);

            let gameServerTextContent = document.createElement("span");
            gameServerTextContent.textContent = orderSelected.server;
            let gameServerSpan = document.createElement("span");
            gameServerSpan.setAttribute(
              "class",
              "additional-order-game-info-greyyy"
            );
            gameServerSpan.textContent = "server:";
            orderGameCategory.appendChild(gameServerSpan);
            orderGameCategory.appendChild(gameServerTextContent);

            let gameTypeTextContent = document.createElement("span");
            gameTypeTextContent.textContent = orderSelected.type;
            let gameTypeSpan = document.createElement("span");
            gameTypeSpan.setAttribute(
              "class",
              "additional-order-game-info-greyyy"
            );
            gameTypeSpan.textContent = "game:";
            orderGameType.appendChild(gameTypeSpan);
            orderGameType.appendChild(gameTypeTextContent);

            orderGamePrice.textContent = `${orderSelected.price} EU`;
            orderGameQuantity.textContent = `${orderSelected.quantity}`;
            orderGameId.textContent = `${orderId}`;
            orderPostLink.textContent = `playzify.com/post.html?id=${orderSelected.orderId}`;

            // orderGameCategory.appendChild(gameCategorySpan);
            // categorySection.appendChild(orderGameCategory);

            // orderGameServer.appendChild(gameCategorySpan);
            // categorySection.appendChild(orderGameServer);

            // orderGameType.appendChild(gameCategorySpan);
            // categorySection.appendChild(orderGameType);

            // SAVE post link in Firestore?
            // WHAT IF INSTEAD of showing previous page, user accesses by link? Cannot display post link ...
            console.log(document.referrer);
            // orderPostLink.innerText = document.referrer;
            // postTitle.innerText = `${orderSelected.title}`;
            // postDescription.innerText = `${orderSelected.description}`;
            // postPrice.innerText = `${orderSelected.price} EUR`;
            // postQuantity.innerText = `${orderSelected.quantity}`;
            // postGaranty.innerText = `${orderSelected.garanty}`;
            //postImages.innerText = `${orderSelected.images}`;
          })
          .catch((err) => {
            console.log(err);
          });
        // here add braket
      } else {
        console.log("User not logged in, no information available");
      }
    });
  }

  function deliveryAddItem() {
    // DELIVERY POPUP
    let deliverPopupAccountId = document.getElementById("delivery-account-id")
      .value;
    let deliverPopupPassword = document.getElementById("delivery-password")
      .value;
    let deliverPopupFirstName = document.getElementById("delivery-first-name")
      .value;
    let deliverPopupLastName = document.getElementById("delivery-last-name")
      .value;
    let deliverPopupAccountCountry = document.getElementById(
      "delivery-account-country"
    ).value;
    let deliverPopupDateOfBirth = document.getElementById(
      "delivery-date-of-birth"
    ).value;
    let deliverPopupAccountRecoveryEmail = document.getElementById(
      "delivery-account-recovery-email"
    ).value;
    let deliverPopupRecoveryEmailPassword = document.getElementById(
      "delivery-recovery-email-password"
    ).value;
    let deliverPopupSecretQuestion = document.getElementById(
      "delivery-secret-question"
    ).value;
    let deliverPopupSecretAnswer = document.getElementById(
      "delivery-secret-answer"
    ).value;
    let deliverPopupAdditionalNote = document.getElementById(
      "delivery-additional-note"
    );
    let textDeliverPopupAdditionalNote = deliverPopupAdditionalNote.textContent;

    console.log(deliverPopupAccountId);
    console.log(deliverPopupPassword);
    console.log(deliverPopupFirstName);
    console.log(deliverPopupLastName);
    console.log(deliverPopupAccountCountry);
    console.log(deliverPopupDateOfBirth);
    console.log(deliverPopupAccountRecoveryEmail);
    console.log(deliverPopupRecoveryEmailPassword);
    console.log(deliverPopupSecretQuestion);
    console.log(deliverPopupSecretAnswer);
    console.log(textDeliverPopupAdditionalNote);

    firebase.firestore().collection("orders").doc("order-first-example").set({
      buyer: BUYER, // set buyer here
      category: deliverPopupAccountCountry, // CHANGE
    });
  }

  cancelDeliveyButton.addEventListener("click", () => {
    popupDelivery.style.display = "none";
  });

  Array.from(closeModalButton).forEach((e) => {
    e.addEventListener("click", function () {
      popupOrderHistory.style.display = "none";
      popupOrderQuestion.style.display = "none";
    });
  });

  // CHANGE TO ORDER / ORDER_BUYER
  // orderHistoryButton.addEventListener("click", function () {
  //   popupOrderHistory.style.display = "block";
  // });

  // orderAcceptButton.addEventListener("click", function () {
  //   popupOrderQuestion.style.display = "block";
  // });

  // orderRefuseButton.addEventListener("click", function () {

  // });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.displayName);
      console.log(user);

      // User PAYS and order is CREATED in firestore
      // from that order select it and change it HERE

      firebase
        .firestore()
        .doc(`/users/${user.displayName}`)
        .get()
        .then((doc) => {
          // FOR PRODUCTION ONLY. TESTING W/O VERIFICATION
          if (doc.data().verified === true) {
            console.log("User verified");
            orderAcceptButton.addEventListener("click", () => {
              // POPUP
              // get ORDER by ID
              // add to ORDER HISTORY collection Accepted status
              // display Accepted

              // firebase
              // .firestore()
              // .doc(`orders/${orderId}`)
              // .collection("history")
              // .add({ createdAt: new Date().toISOString(), status: "Accepted" });

              // ARE you sure ? POPUP
              popupOrderQuestion.style.display = "block";

              // ARE YOU SURE ACCEPT ORDER POPUP?
              let areYouSureAcceptYes = document.getElementById(
                "sure-accept-order-yes"
              );
              let areYouSureAcceptNo = document.getElementById(
                "sure-accept-order-no"
              );

              areYouSureAcceptYes.addEventListener("click", () => {
                popupOrderQuestion.style.display = "none";

                // ADD ORDER POPUP
                popupDelivery.style.display = "block";

                deliveryButton.addEventListener(
                  "click",
                  deliveryAddItem,
                  false
                ); // NOT SURE WHY BUT MAYBE
                // deliveryButton.addEventListener("click", () => {
                //   firebase.firestore().collection("orders").doc("order-first-example").set({

                //   })
                // })
              });

              // ORDER ACCEPTED
              //orderAcceptedStatus.style.display = "inline-block";
            });
            orderRefuseButton.addEventListener("click", () => {
              // DELETE order and REFUND money
            });
          } else {
            console.log("Not verified");
          }
        })
        .catch((err) => {
          console.log("Error " + err);
        });

      // let everyHeaderUsername = document.getElementsByClassName("user-header-username");
      // for (let i = 0; i < everyHeaderUsername.length; ++i) {
      //   everyHeaderUsername[i].textContent = `${user.displayName}`;
      // }

      // USER PAGE USERNAME
      // let everyUserPageUsername = document.getElementsByClassName("nickname")[0];
      // everyUserPageUsername.textContent = `${user.displayName}`;

      //auth.signOut();
      //console.log(user);
    } else {
      console.log("Not logged in");
    }
  });

  function guidGenerator() {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  let id = guidGenerator();
  console.log(id);

  getOrderDetails();
})(window, document);
