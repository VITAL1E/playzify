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

  let orderActionButtons = document.getElementsByClassName(
    "verification-main-input-div for-order-buttons-change"
  );
  let orderHistoryButton = document.getElementById("order-history-button-id");
  let orderHistoryPopup = document.getElementById("order-history-popup-id");
  // let orderAcceptButton = document.getElementById("accept-order");
  // let orderRefuseButton = document.getElementById("refuse-order");
  let popupDelivery = document.getElementById("pop-up-delivery");
  let popupOrderHistory = document.getElementById("pop-up-order-history");
  let popupOrderQuestion = document.getElementById("pop-up-order-question");
  let popupOrderDispute = document.getElementById("pop-up-order-dispute");
  let popupOrderReview = document.getElementById("pop-up-order-review");
  let closeModalButton = document.getElementsByClassName("close-modal");

  // ORDER STATUS SECTION
  let divMainOrderStatus = document.getElementById("connect-the-dots-id");
  let orderSoldStatus = document.getElementById("order-sold-id");
  let orderPaidStatus = document.getElementById("order-paid-id");
  let orderAcceptedStatus = document.getElementById("order-accepted-id");
  let orderDeliveredStatus = document.getElementById("order-delivered-id");
  let orderCompletedStatus = document.getElementById("order-completed-id");
  let orderRejectedStatus = document.getElementById("order-rejected-id");
  let orderDisputedStatus = document.getElementById("order-disputed-id");
  let orderRefundedStatus = document.getElementById("order-refunded-id");
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
  let orderHistoryClosePopup = document.getElementById(
    "order-history-close-popup-id"
  );

  // ORDER PRODUCT DATA
  let divOrderMainProductData = document.getElementById(
    "order-product-data-id"
  );

  // DELIVERY POPUP PHOTOS DIV
  let rowOfPhotos = document.getElementById("delivery-popup-row-of-photos-id");

  let historyActionsArray = [];
  let historyActionsSorted = [];
  let divMainHistoryActions;

  if (localStorage.getItem("username")) {
    console.log("We saved user from Local storage");
    console.log(localStorage.getItem("username"));

    getOrderDetails();
  }

  if (orderHistoryButton !== null) {
    orderHistoryButton.addEventListener("click", () => {
      const url = new URL(window.location.href);
      let orderId = url.searchParams.get("id");

      let orderReference = firebase.firestore().doc(`orders/${orderId}`);

      orderReference.get().then((snapshot) => {
        let divMainHistoryValuesMapObject = snapshot.data().history;

        historyActionsSorted = Object.entries(divMainHistoryValuesMapObject)
          .sort(([, a], [, b]) => b.seconds - a.seconds)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        console.log("historyActionsSorted " + historyActionsSorted);

        for (let [key, value] of Object.entries(historyActionsSorted)) {
          console.log(`${key}: ${value.seconds}`);

          divMainHistoryActions = document.createElement("div");
          divMainHistoryActions.setAttribute("class", "allordderaction");

          let divHistoryAction = document.createElement("div");
          divHistoryAction.setAttribute(
            "class",
            "history-order-nickname mn-change"
          );

          divHistoryAction.textContent = key;

          let divHistoryActionSpan = document.createElement("span");
          divHistoryActionSpan.textContent = getTimeSince(
            new Date(value.seconds * 1000)
          );

          divHistoryAction.appendChild(divHistoryActionSpan);

          historyActionsArray.push(divHistoryAction);
        }

        for (let i = 0; i < historyActionsArray.length; i++) {
          divMainHistoryActions.appendChild(historyActionsArray[i]);
        }
        orderHistoryPopup.appendChild(divMainHistoryActions);
      });
      popupOrderHistory.style.display = "block";
    });
  }

  if (orderHistoryClosePopup !== null) {
    orderHistoryClosePopup.addEventListener("click", function () {
      historyActionsArray = [];
      historyActionsSorted = {};
      if (divMainHistoryActions !== "undefined") {
        divMainHistoryActions.remove();
      }
      popupOrderHistory.style.display = "none";
    });
  }
  // Added this event listener
  //firebase.auth().onAuthStateChanged(function (user) {
  function getOrderDetails() {
    const url = new URL(window.location.href);
    let orderId = url.searchParams.get("id");
    let username = localStorage.getItem("username");

    console.log("Reach order");
    console.log("User " + username);
    //if (user) {
    console.log("Order page logged in " + username);
    // NOT sure if reference is better
    firebase
      .firestore()
      .doc(`orders/${orderId}`)
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
          garanty: doc.data().garanty,
          images: doc.data().images,
          status: doc.data().status,
          buyerProfilePhoto: doc.data().buyerProfilePhoto,
          sellerProfilePhoto: doc.data().sellerProfilePhoto,
        };

        if (doc.data().reviewed == true) {
          firebase
            .firestore()
            .collection("reviews")
            .doc(orderSelected.seller)
            .collection("reviews")
            .doc(orderSelected.buyer)
            .get()
            .then((snapshot) => {
              // NO ACTION BUTTONS
              divMainActionButtons.remove();

              createReview(snapshot.data());
            })
            .catch((error) => {
              console.log(error);
            });
        }

        console.log(doc.data().category);
        console.log(doc.data().title);
        console.log(doc.data().description);
        console.log(doc.data().price);
        console.log(doc.data().server);
        console.log(doc.data().type);
        console.log(doc.data().garanty);
        console.log(doc.data().images);

        if (orderSelected.seller === username) {
          orderSellerNickname.textContent = `${orderSelected.buyer}`;
          let sellerNicknameSpan = document.createElement("span");
          sellerNicknameSpan.setAttribute("class", "type-of-order-user");
          sellerNicknameSpan.textContent = "BUYER";
          orderSellerNickname.appendChild(sellerNicknameSpan);

          if (orderSelected.buyerProfilePhoto !== null) {
            orderSellerProfilePhoto.setAttribute(
              "style",
              `background:url(${orderSelected.buyerProfilePhoto}); background-size: cover;`
            );
          }
          orderSellerNickname.addEventListener("click", function () {
            location.href = `user.html?id=${orderSelected.buyer}`;
          });
          orderSellerProfilePhoto.addEventListener("click", function () {
            location.href = `user.html?id=${orderSelected.buyer}`;
          });
        } else if (orderSelected.buyer === username) {
          orderSellerNickname.textContent = `${orderSelected.seller}`;
          let sellerNicknameSpan = document.createElement("span");
          sellerNicknameSpan.setAttribute("class", "type-of-order-user");
          sellerNicknameSpan.textContent = "SELLER";
          orderSellerNickname.appendChild(sellerNicknameSpan);

          if (orderSelected.sellerProfilePhoto !== null) {
            orderSellerProfilePhoto.setAttribute(
              "style",
              `background:url(${orderSelected.sellerProfilePhoto}); background-size: cover;`
            );
          }
          orderSellerNickname.addEventListener("click", function () {
            location.href = `user.html?id=${orderSelected.seller}`;
          });
          orderSellerProfilePhoto.addEventListener("click", function () {
            location.href = `user.html?id=${orderSelected.seller}`;
          });
        }

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
        gameTypeSpan.setAttribute("class", "additional-order-game-info-greyyy");
        gameTypeSpan.textContent = "game:";
        orderGameType.appendChild(gameTypeSpan);
        orderGameType.appendChild(gameTypeTextContent);

        orderGamePrice.textContent = `${orderSelected.price} EU`;
        orderGameId.textContent = `${orderId}`;
        orderPostLink.textContent = `playzify.com/post.html?id=${orderSelected.orderId}`;

        orderPostLink.addEventListener("click", function () {
          location.href = `playzify.com/post.html?id=${orderSelected.orderId}`;
        });

        // SAVE post link in Firestore?
        // WHAT IF INSTEAD of showing previous page, user accesses by link? Cannot display post link ...
        console.log(document.referrer);

        if ("Paid" === orderSelected.status) {
          console.log("Order is paid");

          if (orderSelected.seller === username) {
            // ACTION BUTTONS
            console.log("User is seller");
            let divAcceptButton = document.createElement("div");
            let divRefuseButton = document.createElement("div");

            divAcceptButton.setAttribute("class", "all-order-action-buttons");
            divRefuseButton.setAttribute("class", "all-order-action-buttons");

            divAcceptButton.textContent = "ACCEPT";
            divRefuseButton.textContent = "REFUSE";

            actionButtons.appendChild(divAcceptButton);
            actionButtons.appendChild(divRefuseButton);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "You have 1 day to Accept or Refuse the order. If you ignore this order, it will be automatically refunded.";

            // ORDER STATUS
            // maybe not just yet, after payment confirmed
            let status = "Sold";
            getOrderStatus(status);

            //orderSoldStatus.style.display = "block";

            // ACCEPT CLICK
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
                firebase
                  .firestore()
                  .doc(`orders/${orderId}`)
                  .set(
                    {
                      status: "Accepted",
                      history: {
                        "seller accepted the order": new Date(),
                      },
                      //orderStatusButtons: "Sold-Accepted"
                    },
                    { merge: true }
                  )
                  .then(() => {
                    status = "Sold-Accepted";
                    getOrderStatus(status);
                    alert("You accepted the order");
                    removeActionButtons();

                    let divDeliverButton = document.createElement("div");
                    divDeliverButton.setAttribute(
                      "class",
                      "all-order-action-buttons"
                    );
                    divDeliverButton.textContent = "DELIVER";
                    actionButtons.appendChild(divDeliverButton);

                    // ORDER INFROMATION
                    divMainOrderInformationText.textContent =
                      "You have 1 day to Deliver the order. If you ignore this order, it will be automatically refunded.";

                    popupOrderQuestion.style.display = "none";
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });

              areYouSureAcceptNo.addEventListener("click", function () {
                popupOrderQuestion.style.display = "none";
              });
            });

            // REFUSE CLICK
            divRefuseButton.addEventListener("click", function () {
              // MAKE REFUND
              // call endpoint for refund
              firebase
                .firestore()
                .doc(`orders/${orderId}`)
                .set(
                  {
                    status: "Refused",
                    history: {
                      "seller refused the order": new Date(),
                    },
                  },
                  { merge: true }
                )
                .then(() => {
                  let status = "Refused";
                  getOrderStatus(status);
                  alert("You refused the order");

                  divMainActionButtons.innerHTML = "";
                  removeActionButtons();

                  divMainOrderInformationText.textContent = "Order is Refused";
                })
                .catch((error) => {
                  console.log(error);
                });
            });

            // append child STUFF
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            divMainActionButtons.style.display = "none";

            // // ACTION BUTTONS
            // let divDisputeButton = document.createElement("div");
            // divDisputeButton.setAttribute(
            //   "class",
            //   "all-order-action-buttons"
            // );
            // divDisputeButton.textContent = "DISPUTE";

            // actionButtons.appendChild(divDisputeButton);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "Seller has 1 day to Accept or Refuse the order. If he ignores this order, it will be automatically refunded.";

            // ORDER STATUS
            let status = "Paid";
            getOrderStatus(status);
            //orderPaidStatus.style.display = "block";

            // // DISPUTE CLICK
            // divDisputeButton.addEventListener("click", function () {
            //   popupOrderDispute.style.display = "block";

            //   let disputeButton = document.getElementById(
            //     "sure-dispute-order-yes"
            //   );
            //   let cancelButton = document.getElementById(
            //     "sure-dispute-order-no"
            //   );

            //   let explanation = document.getElementById(
            //     "dispute-content-explanation-id"
            //   ).innerText;
            //   // let explanationValue = explanation.textContent;
            //   // console.log(explanationValue);

            //   //let innerText = explanation.innerText;
            //   if (explanation[explanation.length - 1] === "\n") {
            //     explanation = explanation.slice(0, -1);
            //     console.log(explanation);
            //   }

            // //   disputeButton.addEventListener("click", function () {
            // //     if (explanation.length === 0) {
            // //       alert("You have to write an explanation ");
            // //       return;
            // //     } else {
            // //       console.log(("explanation " + explanation));

            // //       firebase
            // //         .firestore()
            // //         .doc(`orders/${orderId}`)
            // //         .set(
            // //           {
            // //             status: "Disputed",
            // //             history: {
            // //               "buyer disputed the order": new Date(),
            // //             },
            // //           },
            // //           { merge: true }
            // //         )

            // //         .then(() => {
            // //           let status = "Disputed";
            // //           getOrderStatus(status);
            // //         })
            // //         .then(() => {
            // //           alert("You disputed the order");
            // //         })
            // //         .catch((error) => {
            // //           console.log(error);
            // //         });
            // //     }
            // //   });

            // //   cancelButton.addEventListener("click", function () {
            // //     popupOrderDispute.style.display = "none";
            // //   });

            // });
          } else {
            console.log("GET THE FUCK OUTTA HERE");
          }
        } else if ("Accepted" === orderSelected.status) {
          console.log("Order is accepted");

          if (orderSelected.seller === username) {
            console.log("User is seller");

            // ACTION BUTTONS
            let divDeliverButton = document.createElement("div");
            divDeliverButton.setAttribute("class", "all-order-action-buttons");
            divDeliverButton.textContent = "DELIVER";

            actionButtons.appendChild(divDeliverButton);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "You have 1 day to Deliver the order. If you ignore this order, it will be automatically refunded.";

            // DELIVER CLICK
            if (divDeliverButton !== null) {
              divDeliverButton.addEventListener(
                "click",
                addItemDelivery,
                false
              );
            }
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            let divDisputeButton = document.createElement("div");

            divDisputeButton.setAttribute("class", "all-order-action-buttons");
            // SURE DISPUTE?
            divDisputeButton.textContent = "DISPUTE";

            actionButtons.appendChild(divDisputeButton);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "Seller has 1 day to Deliver the order. If he ignores this order, it will be automatically refunded.";

            // ORDER STATUS
            let status = "Paid-Accepted";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";

            // DISPUTE CLICK
            divDisputeButton.addEventListener("click", function () {
              popupOrderDispute.style.display = "block";

              let disputeButton = document.getElementById(
                "sure-dispute-order-yes"
              );
              let cancelButton = document.getElementById(
                "sure-dispute-order-no"
              );

              // let explanationValue = explanation.textContent;
              // console.log(explanationValue);

              //let innerText = explanation.innerText;
              // if (explanation[explanation.length - 1] === "\n") {
              //   explanation = explanation.slice(0, -1);
              //   console.log(explanation);
              // }

              disputeButton.addEventListener("click", function () {
                let explanation = document.getElementById(
                  "dispute-content-explanation-id"
                ).innerText;

                console.log(explanation);
                if (explanation.length === 0) {
                  alert("You have to write an explanation ");
                } else {
                  //alert("explanation " + explanation);

                  firebase
                    .firestore()
                    .doc(`orders/${orderId}`)
                    .set(
                      {
                        status: "Disputed",
                        history: {
                          "buyer disputed the order": new Date(),
                        },
                      },
                      { merge: true }
                    )
                    .then(() => {
                      let USER_PHOTO = null;
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(username)
                        .get()
                        .then((snapshot) => {
                          USER_PHOTO = snapshot.data().profilePicture;

                          firebase
                            .firestore()
                            .doc(`disputes/${orderId}`)
                            .set({
                              createdAt: new Date(),
                              from: username,
                              message: explanation,
                              status: "Unresolved",
                              orderId: orderId,
                              userPhoto: USER_PHOTO,
                            })
                            .then(() => {
                              let status = "Disputed";
                              getOrderStatus(status);

                              alert("You disputed the order");

                              // NO ACTION BUTTONS
                              divMainActionButtons.remove();

                              // ORDER INFROMATION
                              divMainOrderInformationText.textContent =
                                "Order is disputed.";
                              popupOrderDispute.style.display = "none";
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });

              cancelButton.addEventListener("click", function () {
                popupOrderDispute.style.display = "none";
              });
            });
          } else {
            console.log("GET THE FUCK OUTTA HERE");
          }
        } else if ("Delivered" === orderSelected.status) {
          console.log("Order is delivered");
          console.log("USer " + username);

          if (orderSelected.seller === username) {
            console.log("User is seller");

            // NO ACTION BUTTONS
            divMainActionButtons.remove();

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "You have Delivered the order. Waiting for buyer to confirm the order.";

            // ORDER STATUS
            let status = "Sold-Accepted-Delivered";
            getOrderStatus(status);
            // orderSoldStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";

            // ORDER PRODUCT DATA
            createDeliveredItem(
              orderSelected.productData,
              orderSelected.productData.photos
            );
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            let divConfirmButton = document.createElement("div");

            divConfirmButton.setAttribute("class", "all-order-action-buttons");

            divConfirmButton.textContent = "CONFIRM";

            actionButtons.appendChild(divConfirmButton);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent =
              "The order was Delivered to you. You have to confirm it.";

            // ORDER STATUS
            let status = "Paid-Accepted-Delivered";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";

            // ORDER PRODUCT DATA
            createDeliveredItem(
              orderSelected.productData,
              orderSelected.productData.photos
            );

            divConfirmButton.addEventListener("click", function () {
              firebase
                .firestore()
                .doc(`orders/${orderId}`)
                .set(
                  {
                    status: "Completed",
                    history: {
                      "buyer confirmed the order": new Date(),
                    },
                  },
                  { merge: true }
                )
                .then(() => {
                  let status = "Paid-Accepted-Delivered-Completed";
                  getOrderStatus(status);

                  // NO ACTION BUTTONS
                  divMainActionButtons.remove();
                })
                .then(() => {
                  alert("You confirmed the order");
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          } else {
            console.log("GET THE FUCK OUTTA HERE");
          }
        } else if ("Completed" === orderSelected.status) {
          console.log("Should have deleted the button");

          if (orderSelected.seller === username) {
            console.log("User is seller");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // actionButtons.remove();

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Complete.";

            // ORDER STATUS
            let status = "Sold-Accepted-Delivered-Completed";
            getOrderStatus(status);
            // orderSoldStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";
            // orderCompletedStatus.style.display = "block";

            // ORDER PRODUCT DATA
            createDeliveredItem(
              orderSelected.productData,
              orderSelected.productData.photos
            );
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            let divReviewButton = document.createElement("div");

            divReviewButton.setAttribute("class", "all-order-action-buttons");
            divReviewButton.textContent = "ADD REVIEW";

            actionButtons.appendChild(divReviewButton);

            divReviewButton.addEventListener("click", function () {
              popupOrderReview.style.display = "block";

              let likeButton = document.getElementById(
                "sure-review-order-like"
              );
              let dislikeButton = document.getElementById(
                "sure-review-order-dislike"
              );

              likeButton.addEventListener("click", function () {
                let explanation = document.getElementById(
                  "review-content-explanation-id"
                ).innerText;

                if (explanation.length === 0) {
                  console.log("lol");
                  alert("You have to write review");
                } else {
                  let review = {};

                  firebase
                    .firestore()
                    .doc(`orders/${orderId}`)
                    .set(
                      {
                        reviewed: true,
                        history: {
                          "buyer added review for the order": new Date(),
                        },
                      },
                      { merge: true }
                    )
                    .then(() => {
                      review = {
                        createdAt: new Date(),
                        username: username,
                        description: explanation,
                        status: "Positive",
                      };

                      firebase
                        .firestore()
                        .collection("reviews")
                        .doc(orderSelected.seller)
                        .collection("reviews")
                        .doc(username)
                        .set(review)
                        .then(() => {
                          alert("You reviewed the order");
                          createReview(review);
                          // ACTION BUTTONS
                          divMainActionButtons.remove();

                          popupOrderReview.style.display = "none";
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });

              dislikeButton.addEventListener("click", function () {
                let explanation = document.getElementById(
                  "review-content-explanation-id"
                ).innerText;

                if (explanation.length === 0) {
                  alert("You have to write review");
                } else {
                  firebase
                    .firestore()
                    .doc(`orders/${orderId}`)
                    .set(
                      {
                        reviewed: true,
                        history: {
                          "buyer added review for the order": new Date(),
                        },
                      },
                      { merge: true }
                    )
                    .then(() => {
                      let review = {
                        createdAt: new Date(),
                        username: username,
                        description: explanation,
                        status: "Negative",
                      };

                      firebase
                        .firestore()
                        .collection("reviews")
                        .doc(orderSelected.seller)
                        .collection("reviews")
                        .doc(username)
                        .set(review)
                        .then(() => {
                          alert("You reviewed the order");
                          createReview(review);
                          // ACTION BUTTONS
                          divMainActionButtons.remove();

                          popupOrderReview.style.display = "none";
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });
            });

            // textActionButtons.remove();
            // while (orderActionButtons[0]) {
            //   orderActionButtons[0].parentNode.removeChild(orderActionButtons[0]);
            // }
            //actionButtons.parentNode.removeChild(actionButtons);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Complete.";

            // ORDER STATUS
            let status = "Paid-Accepted-Delivered-Completed";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "inline-block";
            // orderAcceptedStatus.style.display = "inline-block";
            // orderDeliveredStatus.style.display = "inline-block";
            // orderCompletedStatus.style.display = "inline-block";

            // ORDER PRODUCT DATA
            createDeliveredItem(
              orderSelected.productData,
              orderSelected.productData.photos
            );

            console.log(JSON.stringify(orderSelected.productData));
            console.log(orderSelected.productData.accountId);
            console.log(orderSelected.productData.password);
          } else {
            console.log("GET THE FUCK OUTTA HERE");
            console.log("Order buyer " + orderSelected.buyer);
            console.log("Order seller " + orderSelected.seller);
          }
        } else if ("Disputed" === orderSelected.status) {
          console.log("Should have deleted the button");

          if (orderSelected.seller === username) {
            console.log("User is seller");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // actionButtons.remove();

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Disputed.";

            // ORDER STATUS
            let status = "Disputed";
            getOrderStatus(status);
            // orderSoldStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";
            // orderCompletedStatus.style.display = "block";

            // // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // while (orderActionButtons[0]) {
            //   orderActionButtons[0].parentNode.removeChild(orderActionButtons[0]);
            // }
            //actionButtons.parentNode.removeChild(actionButtons);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Disputed.";

            // ORDER STATUS
            let status = "Disputed";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "inline-block";
            // orderAcceptedStatus.style.display = "inline-block";
            // orderDeliveredStatus.style.display = "inline-block";
            // orderCompletedStatus.style.display = "inline-block";

            // // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );

            console.log(JSON.stringify(orderSelected.productData));
            console.log(orderSelected.productData.accountId);
            console.log(orderSelected.productData.password);
          } else {
            console.log("GET THE FUCK OUTTA HERE");
            console.log("Order buyer " + orderSelected.buyer);
            console.log("Order seller " + orderSelected.seller);
          }
        } else if ("Refused" === orderSelected.status) {
          console.log("Should have deleted the button");

          if (orderSelected.seller === username) {
            console.log("User is seller");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // actionButtons.remove();

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Refused.";

            // ORDER STATUS
            let status = "Refused";
            getOrderStatus(status);
            // orderSoldStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";
            // orderCompletedStatus.style.display = "block";

            // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // while (orderActionButtons[0]) {
            //   orderActionButtons[0].parentNode.removeChild(orderActionButtons[0]);
            // }
            //actionButtons.parentNode.removeChild(actionButtons);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Refused.";

            // ORDER STATUS
            let status = "Refused";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "inline-block";
            // orderAcceptedStatus.style.display = "inline-block";
            // orderDeliveredStatus.style.display = "inline-block";
            // orderCompletedStatus.style.display = "inline-block";

            // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );

            console.log(JSON.stringify(orderSelected.productData));
            console.log(orderSelected.productData.accountId);
            console.log(orderSelected.productData.password);
          } else {
            console.log("GET THE FUCK OUTTA HERE");
            console.log("Order buyer " + orderSelected.buyer);
            console.log("Order seller " + orderSelected.seller);
          }
        } else if ("Refunded" === orderSelected.status) {
          if (orderSelected.seller === username) {
            console.log("User is seller");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // actionButtons.remove();

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Refunded.";

            // ORDER STATUS
            let status = "Refunded";
            getOrderStatus(status);
            // orderSoldStatus.style.display = "block";
            // orderAcceptedStatus.style.display = "block";
            // orderDeliveredStatus.style.display = "block";
            // orderCompletedStatus.style.display = "block";

            // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );
          } else if (orderSelected.buyer === username) {
            console.log("User is buyer");

            // ACTION BUTTONS
            divMainActionButtons.remove();
            // textActionButtons.remove();
            // while (orderActionButtons[0]) {
            //   orderActionButtons[0].parentNode.removeChild(orderActionButtons[0]);
            // }
            //actionButtons.parentNode.removeChild(actionButtons);

            // ORDER INFROMATION
            divMainOrderInformationText.textContent = "Order is Refunded.";

            // ORDER STATUS
            let status = "Refused";
            getOrderStatus(status);
            // orderPaidStatus.style.display = "inline-block";
            // orderAcceptedStatus.style.display = "inline-block";
            // orderDeliveredStatus.style.display = "inline-block";
            // orderCompletedStatus.style.display = "inline-block";

            // ORDER PRODUCT DATA
            // createDeliveredItem(
            //   orderSelected.productData,
            //   orderSelected.productData.photos
            // );

            console.log(JSON.stringify(orderSelected.productData));
            console.log(orderSelected.productData.accountId);
            console.log(orderSelected.productData.password);
          } else {
            console.log("GET THE FUCK OUTTA HERE");
            console.log("Order buyer " + orderSelected.buyer);
            console.log("Order seller " + orderSelected.seller);
          }
        } else {
          console.log("Lol nothing at all neither buyer / seller");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // } else {
    //   console.log("Not logged in " + user);
    //   console.log("User not logged in, no information available");
    // }

    // work with this
    function addItemDelivery() {
      popupDelivery.style.display = "block";

      let addPhoto = document.getElementById("addImgLabel1");

      // check addImageToForm classes if concatenated properly
      addPhoto.addEventListener("change", addImageToForm, false);

      // DELIVER BUTTON
      deliveryButton.addEventListener("click", () => {
        // DELIVERY POPUP
        let deliverPopupAccountId = document.getElementById(
          "delivery-account-id"
        ).value;
        let deliverPopupPassword = document.getElementById("delivery-password")
          .value;
        let deliverPopupFirstName = document.getElementById(
          "delivery-first-name"
        ).value;
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
        let textDeliverPopupAdditionalNote =
          deliverPopupAdditionalNote.textContent;

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

        if (
          !isEmpty(deliverPopupAccountId) &&
          !isEmpty(deliverPopupPassword) &&
          !isEmpty(deliverPopupFirstName) &&
          !isEmpty(deliverPopupLastName) &&
          !isEmpty(deliverPopupAccountCountry) &&
          !isEmpty(deliverPopupDateOfBirth) &&
          !isEmpty(deliverPopupAccountRecoveryEmail) &&
          !isEmpty(deliverPopupRecoveryEmailPassword) &&
          !isEmpty(deliverPopupSecretQuestion) &&
          !isEmpty(deliverPopupSecretAnswer)
        ) {
          let productData = {
            accountCountry: deliverPopupAccountCountry,
            accountId: deliverPopupAccountId,
            accountRecoveryEmail: deliverPopupAccountRecoveryEmail,
            additionalNote: textDeliverPopupAdditionalNote,
            dateOfBirth: deliverPopupDateOfBirth,
            firstName: deliverPopupFirstName,
            lastName: deliverPopupLastName,
            password: deliverPopupPassword,
            photos: getImageURLsFromArray(...imagesArray),
            recoveryEmailPassword: deliverPopupRecoveryEmailPassword,
            secretAnswer: deliverPopupSecretAnswer,
            secretQuestion: deliverPopupSecretQuestion,
          };

          firebase
            .firestore()
            .doc(`orders/${orderId}`)
            .set(
              {
                productData: productData,
                status: "Delivered",
                history: {
                  "seller delivered the product": new Date(),
                },
              },
              { merge: true }
            )
            .then(() => {
              // NO ACTION BUTTONS
              divMainActionButtons.remove();

              // ORDER STATUS
              let status = "Sold-Accepted";
              getOrderStatus(status);
              createDeliveredItem(productData, productData.photos);
              alert("Item successfully submitted");
              popupDelivery.style.display = "none";

              location.reload();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert("Please fill in required fields");
        }
      });

      // DELIVER BUTTON
      if (cancelDeliveyButton !== null) {
        cancelDeliveyButton.addEventListener("click", () => {
          popupDelivery.style.display = "none";
        });
      }
    }
  }

  function createDeliveredItem(item, photos) {
    console.log("reached delivered item method");
    let divMainDeliveredItem = document.createElement("div");
    divMainDeliveredItem.setAttribute("class", "verification-main-input-div");

    let pDeliveredItemText = document.createElement("p");
    pDeliveredItemText.setAttribute("class", "verification-main-text");
    pDeliveredItemText.textContent = "Delivered item";

    let divDeliveredItem = document.createElement("div");
    divDeliveredItem.setAttribute("class", "main-delivered-item");

    let pDeliveredItemGameInfoText = document.createElement("p");
    pDeliveredItemGameInfoText.setAttribute("class", "verification-main-text");
    pDeliveredItemGameInfoText.style.textAlign = "center";
    pDeliveredItemGameInfoText.textContent = "Game Account Information:";

    let divDeliveredItemAccountIdText = document.createElement("div");
    divDeliveredItemAccountIdText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemAccountIdText.textContent = "Account ID";

    let divDeliveredItemAccountIdValue = document.createElement("div");
    divDeliveredItemAccountIdValue.setAttribute("class", "all-text-info-order");
    divDeliveredItemAccountIdValue.textContent = item.accountId; // account id

    let divDeliveredItemPasswordText = document.createElement("div");
    divDeliveredItemPasswordText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemPasswordText.textContent = "Password";

    let divDeliveredItemPasswordValue = document.createElement("div");
    divDeliveredItemPasswordValue.setAttribute("class", "all-text-info-order");
    divDeliveredItemPasswordValue.textContent = item.password;

    let divDeliveredItemFirstNameText = document.createElement("div");
    divDeliveredItemFirstNameText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemFirstNameText.textContent = "First name";

    let divDeliveredItemFirstNameValue = document.createElement("div");
    divDeliveredItemFirstNameValue.setAttribute("class", "all-text-info-order");
    divDeliveredItemFirstNameValue.textContent = item.firstName;

    let divDeliveredItemLastNameText = document.createElement("div");
    divDeliveredItemLastNameText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemLastNameText.textContent = "Last name";

    let divDeliveredItemLastNameValue = document.createElement("div");
    divDeliveredItemLastNameValue.setAttribute("class", "all-text-info-order");
    divDeliveredItemLastNameValue.textContent = item.lastName;

    let divDeliveredItemAccountCountryText = document.createElement("div");
    divDeliveredItemAccountCountryText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemAccountCountryText.textContent = "Account country";

    let divDeliveredItemAccountCountryValue = document.createElement("div");
    divDeliveredItemAccountCountryValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemAccountCountryValue.textContent = item.accountCountry;

    let divDeliveredItemDateOfBirthText = document.createElement("div");
    divDeliveredItemDateOfBirthText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemDateOfBirthText.textContent = "Date of birth";

    let divDeliveredItemDateOfBirthValue = document.createElement("div");
    divDeliveredItemDateOfBirthValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemDateOfBirthValue.textContent = item.dateOfBirth;

    let divDeliveredItemAccountRecoveryEmailText = document.createElement(
      "div"
    );
    divDeliveredItemAccountRecoveryEmailText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemAccountRecoveryEmailText.textContent =
      "Account recovery email";

    let divDeliveredItemAccountRecoveryEmailValue = document.createElement(
      "div"
    );
    divDeliveredItemAccountRecoveryEmailValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemAccountRecoveryEmailValue.textContent =
      item.accountRecoveryEmail;

    let divDeliveredItemAccountRecoveryEmaiPasswordText = document.createElement(
      "div"
    );
    divDeliveredItemAccountRecoveryEmaiPasswordText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemAccountRecoveryEmaiPasswordText.textContent =
      "Recovery email password";

    let divDeliveredItemAccountRecoveryEmaiPasswordValue = document.createElement(
      "div"
    );
    divDeliveredItemAccountRecoveryEmaiPasswordValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemAccountRecoveryEmaiPasswordValue.textContent =
      item.recoveryEmailPassword;

    // p
    let pSecretQuestionAnswer = document.createElement("p");
    pSecretQuestionAnswer.setAttribute("class", "verification-main-text");
    pSecretQuestionAnswer.style.textAlign = "center";
    pSecretQuestionAnswer.textContent = "Secret question & answer:";

    let divDeliveredItemSecretQuestionText = document.createElement("div");
    divDeliveredItemSecretQuestionText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemSecretQuestionText.textContent = "Secret question";

    let divDeliveredItemSecretQuestionValue = document.createElement("div");
    divDeliveredItemSecretQuestionValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemSecretQuestionValue.textContent = item.secretQuestion;

    let divDeliveredItemSecretAnswerText = document.createElement("div");
    divDeliveredItemSecretAnswerText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemSecretAnswerText.textContent = "Secret answer";

    let divDeliveredItemSecretAnswerValue = document.createElement("div");
    divDeliveredItemSecretAnswerValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemSecretAnswerValue.textContent = item.secretAnswer;

    // p
    let pAdditionalInformation = document.createElement("p");
    pAdditionalInformation.setAttribute("class", "verification-main-text");
    pAdditionalInformation.style.textAlign = "center";
    pAdditionalInformation.textContent = "Additional information:";

    let divDeliveredItemAdditionalNoteText = document.createElement("div");
    divDeliveredItemAdditionalNoteText.setAttribute(
      "class",
      "intro-to-delivered-info"
    );
    divDeliveredItemAdditionalNoteText.textContent = "Additional note";

    let divDeliveredItemAdditionalNoteValue = document.createElement("div");
    divDeliveredItemAdditionalNoteValue.setAttribute(
      "class",
      "all-text-info-order"
    );
    divDeliveredItemAdditionalNoteValue.textContent = item.additionalNote;

    let divDeliveredItemPhotosText = document.createElement("div");
    divDeliveredItemPhotosText.setAttribute("class", "intro-to-delivered-info");
    divDeliveredItemPhotosText.textContent = "Photos";

    let divDeliveredItemPhotosRow = document.createElement("div");
    divDeliveredItemPhotosRow.setAttribute("class", "delivered-photos-row");
    //divDeliveredItemPhotosRow.textContent = item;

    // better send array of photos as parameter to this method
    for (let i = 0; i < photos.length; i++) {
      // forEach photo, create id-document html class div
      let divDeliveredItemPhoto = document.createElement("div");
      divDeliveredItemPhoto.setAttribute("class", "id-document id-document-2");

      let photo = document.createElement("img");
      photo.setAttribute("src", photos[i]);

      divDeliveredItemPhoto.appendChild(photo);
      divDeliveredItemPhotosRow.appendChild(divDeliveredItemPhoto);
    }

    // append children
    divDeliveredItem.appendChild(pDeliveredItemGameInfoText);
    divDeliveredItem.appendChild(divDeliveredItemAccountIdText);
    divDeliveredItem.appendChild(divDeliveredItemAccountIdValue);
    divDeliveredItem.appendChild(divDeliveredItemPasswordText);
    divDeliveredItem.appendChild(divDeliveredItemPasswordValue);
    divDeliveredItem.appendChild(divDeliveredItemFirstNameText);
    divDeliveredItem.appendChild(divDeliveredItemFirstNameValue);
    divDeliveredItem.appendChild(divDeliveredItemLastNameText);
    divDeliveredItem.appendChild(divDeliveredItemLastNameValue);
    divDeliveredItem.appendChild(divDeliveredItemAccountCountryText);
    divDeliveredItem.appendChild(divDeliveredItemAccountCountryValue);
    divDeliveredItem.appendChild(divDeliveredItemDateOfBirthText);
    divDeliveredItem.appendChild(divDeliveredItemDateOfBirthValue);
    divDeliveredItem.appendChild(divDeliveredItemAccountRecoveryEmailText);
    divDeliveredItem.appendChild(divDeliveredItemAccountRecoveryEmailValue);
    divDeliveredItem.appendChild(
      divDeliveredItemAccountRecoveryEmaiPasswordText
    );
    divDeliveredItem.appendChild(
      divDeliveredItemAccountRecoveryEmaiPasswordValue
    );
    divDeliveredItem.appendChild(pSecretQuestionAnswer);
    divDeliveredItem.appendChild(divDeliveredItemSecretQuestionText);
    divDeliveredItem.appendChild(divDeliveredItemSecretQuestionValue);
    divDeliveredItem.appendChild(divDeliveredItemSecretAnswerText);
    divDeliveredItem.appendChild(divDeliveredItemSecretAnswerValue);
    divDeliveredItem.appendChild(pAdditionalInformation);
    divDeliveredItem.appendChild(divDeliveredItemAdditionalNoteText);

    if (!isEmpty(item.additionalNote)) {
      divDeliveredItem.appendChild(divDeliveredItemAdditionalNoteValue);
    }

    divDeliveredItem.appendChild(divDeliveredItemPhotosText);

    // photo row
    divDeliveredItem.appendChild(divDeliveredItemPhotosRow);

    divMainDeliveredItem.appendChild(pDeliveredItemText);
    divMainDeliveredItem.appendChild(divDeliveredItem);

    divOrderMainProductData.appendChild(divMainDeliveredItem);
  }

  function createReview(review) {
    document.getElementById("review-section-id").style.display = "block";
    document.getElementById("order-review-text-id").textContent =
      review.description;

    if (review.status === "Positive") {
      document.getElementById("positive-review-id").style.display = "block";
    } else if (review.status === "Negative") {
      document.getElementById("negative-review-id").style.display = "block";
    }
  }

  function getOrderStatus(status) {
    switch (status) {
      case "Paid":
        orderPaidStatus.style.display = "block";
        orderSoldStatus.style.display = "none";
        orderAcceptedStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Sold":
        orderSoldStatus.style.display = "block";
        orderAcceptedStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Paid-Accepted":
        orderPaidStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderSoldStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Sold-Accepted":
        orderSoldStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Paid-Accepted-Delivered":
        orderPaidStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderDeliveredStatus.style.display = "inline-block";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Sold-Accepted-Delivered":
        orderSoldStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderDeliveredStatus.style.display = "inline-block";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Paid-Accepted-Delivered-Completed":
        orderPaidStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderDeliveredStatus.style.display = "inline-block";
        orderCompletedStatus.style.display = "inline-block";
        orderSoldStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Sold-Accepted-Delivered-Completed":
        orderSoldStatus.style.display = "inline-block";
        orderAcceptedStatus.style.display = "inline-block";
        orderDeliveredStatus.style.display = "inline-block";
        orderCompletedStatus.style.display = "inline-block";
        orderPaidStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Refused":
        orderRejectedStatus.style.display = "inline-block";
        orderSoldStatus.style.display = "none";
        orderAcceptedStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Disputed":
        orderDisputedStatus.style.display = "inline-block";
        orderPaidStatus.style.display = "none";
        orderSoldStatus.style.display = "none";
        orderAcceptedStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderRefundedStatus.style.display = "none";
        break;
      case "Refunded":
        orderRefundedStatus.style.display = "inline-block";
        orderSoldStatus.style.display = "none";
        orderAcceptedStatus.style.display = "none";
        orderDeliveredStatus.style.display = "none";
        orderCompletedStatus.style.display = "none";
        orderRejectedStatus.style.display = "none";
        orderDisputedStatus.style.display = "none";
        break;
      default:
        alert("Action buttons method not working");
    }
  }

  let numberOfImages = 0;
  let imagesArray = [];

  Array.from(closeModalButton).forEach((e) => {
    e.addEventListener("click", function () {
      popupOrderHistory.style.display = "none";
      popupOrderQuestion.style.display = "none";
      popupOrderDispute.style.display = "none";
      popupOrderReview.style.display = "none";
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

  // firebase.auth().onAuthStateChanged(function (user) {
  //   if (user) {
  //     console.log(username);
  //     console.log(user);

  //     // User PAYS and order is CREATED in firestore
  //     // from that order select it and change it HERE

  //     firebase
  //       .firestore()
  //       .doc(`/users/${username}`)
  //       .get()
  //       .then((doc) => {
  // FOR PRODUCTION ONLY. TESTING W/O VERIFICATION
  // if (doc.data().verified === true) {
  //   console.log("User verified");
  //   orderAcceptButton.addEventListener("click", () => {
  //     // POPUP
  //     // get ORDER by ID
  //     // add to ORDER HISTORY collection Accepted status
  //     // display Accepted

  //     // firebase
  //     // .firestore()
  //     // .doc(`orders/${orderId}`)
  //     // .collection("history")
  //     // .add({ createdAt: new Date().toISOString(), status: "Accepted" });

  //     // ARE you sure ? POPUP
  //     popupOrderQuestion.style.display = "block";

  //     // ARE YOU SURE ACCEPT ORDER POPUP?
  //     let areYouSureAcceptYes = document.getElementById(
  //       "sure-accept-order-yes"
  //     );
  //     let areYouSureAcceptNo = document.getElementById(
  //       "sure-accept-order-no"
  //     );

  //     areYouSureAcceptYes.addEventListener("click", () => {
  //       popupOrderQuestion.style.display = "none";

  //       // ADD ORDER POPUP
  //       popupDelivery.style.display = "block";

  //       deliveryButton.addEventListener(
  //         "click",
  //         deliveryAddItem,
  //         false
  //       ); // NOT SURE WHY BUT MAYBE
  //       // deliveryButton.addEventListener("click", () => {
  //       //   firebase.firestore().collection("orders").doc("order-first-example").set({

  //       //   })
  //       // })
  //     });

  //     // ORDER ACCEPTED
  //     //orderAcceptedStatus.style.display = "inline-block";
  //   });
  //   orderRefuseButton.addEventListener("click", () => {
  //     // DELETE order and REFUND money
  //   });
  // } else {
  //   console.log("Not verified");
  // }
  // })
  // .catch((err) => {
  //   console.log("Error " + err);
  // });

  // let everyHeaderUsername = document.getElementsByClassName("user-header-username");
  // for (let i = 0; i < everyHeaderUsername.length; ++i) {
  //   everyHeaderUsername[i].textContent = `${username}`;
  // }

  // USER PAGE USERNAME
  // let everyUserPageUsername = document.getElementsByClassName("nickname")[0];
  // everyUserPageUsername.textContent = `${username}`;

  //auth.signOut();
  //console.log(user);
  //   } else {
  //     console.log("Not logged in");
  //   }
  // });

  // function createActionButton(buttonName) {
  //   let divButton = document.createElement("div");
  //   divButton.setAttribute("class", "all-order-action-buttons");
  //   divButton.textContent = buttonName;
  //   actionButtons.appendChild(divButton);
  // }

  function removeCategorySectionElements() {
    let elements = document.getElementsByClassName(
      "additional-order-game-info"
    );

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function removeActionButtons() {
    let elements = document.getElementsByClassName("all-order-action-buttons");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function addImageToForm(e) {
    let files = e.target.files;
    if (numberOfImages + files.length > 4) {
      alert("You can only upload at most 4 files!");
      return;
    }
    numberOfImages += files.length;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function (e) {
          console.log(this);

          let imageFile = e.target;

          const reference = firebase
            .storage()
            .ref("product_images/" + file.name);

          let divDocument = document.createElement("div");
          let divDocumentClose = document.createElement("div");
          let image = document.createElement("img");

          divDocument.setAttribute("class", "id-document");
          divDocumentClose.setAttribute("class", "id-document-close");
          divDocumentClose.addEventListener("click", function () {
            divDocument.style.display = "none";
            numberOfImages--;
            const reference = firebase
              .storage()
              .ref("product_images/" + file.name);
            reference.delete();
            //.then(snapshot => snapshot.ref.getDownloadURL());
          });
          image.setAttribute("class", "image-preview");
          image.setAttribute(
            "style",
            "width: inherit; height: inherit; border-radius: 20px;"
          );
          image.setAttribute("src", imageFile.result);

          divDocument.appendChild(divDocumentClose);
          divDocument.appendChild(image);
          rowOfPhotos.appendChild(divDocument);
        });
        const reference = firebase.storage().ref("product_images/" + file.name);
        reference
          .put(file)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
            imagesArray.push(url);
            //window.alert(url);
          });
        reader.readAsDataURL(file);
      } else {
        image.style.display = null;
      }
    }
  }

  function getImageURLsFromArray(...imagesArray) {
    console.log(...imagesArray);
    return imagesArray;
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

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.displayName);
    } else {
      console.log("not logged");
    }
  });

  const isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
  };

  // checks if one day has passed.
  function hasOneDayPassed() {
    // get today's date. eg: "7/17/2007"
    var date = new Date().toLocaleDateString();

    // if there's a date in localstorage and it's equal to the above:
    // inferring a day has yet to pass since both dates are equal.
    if (localStorage.getItem("orderRefundCountdown") == date) {
      return false;
    }

    // this portion of logic occurs when a day has passed
    localStorage.getItem("orderRefundCountdown") = date;
    return true;
  }

  // some function which should run once a day
  function runOncePerDay() {
    if (!hasOneDayPassed()) {
      return false;
    }

    // your code below
    // when order is Paid, save date to localStorage
    // when order is Paid, save date to localStorage
    let orderReference = firebase.firestore().collection("orders").doc(orderId);

    orderReference
      .get()
      .then((snapshot) => {
        let status = snapshot.data().status;

        if (status === "Paid") {
          orderReference
            .set(
              {
                status: "Refunded",
              },
              { merge: true }
            )
            .then(() => {
              console.log("Refunded to order");
            })
            .catch((error) => {
              console.log(error);
            });

        } else if (status === "Accepted") {
          orderReference
            .set(
              {
                status: "Refunded",
              },
              { merge: true }
            )
            .then(() => {
              console.log("Refunded to order");
            })
            .catch((error) => {
              console.log(error);
            });

        } else {
          console.log("Cannot refund order");
        }
      })
      .set({});
  }

  runOncePerDay(); // run the code

  //getOrderDetails();
  //});
})(window, document);
