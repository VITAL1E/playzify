let nickname = document.getElementById("user-nickname-id");
let verified = document.getElementById("verified-span-id");
let followers = document.getElementById("followers-id");

let sellingButton = document.getElementById("selling-button-id");
let aboutButton = document.getElementById("about-button-id");
// What user is selling
let textSelling = document.getElementById("selling-text-id");
let divMainSelling = document.getElementById("product-list-selling-id");
// Description of user
let textAbout = document.getElementById("about-text-id");

let followButton = document.getElementById("follow-button-id");
let unfollowButton = document.getElementById("unfollow-button-id");
let settings = document.getElementById("settings-div-id");
let message = document.getElementById("message-div-id");

// FOLLOWERS
let popupFollowers = document.getElementById("popup-followers-id");
let closeModalFollowers = document.getElementById("close-followers-modal-id");

// REVIEWS
let reviews = document.getElementById("user-reviews-id");
let popupReviews = document.getElementById("popup-reviews-id");
let closeModalReviews = document.getElementById("close-reviews-modal-id");
let divReviews = document.getElementById("reviews-list-id");

let divMainFollowersList = document.getElementById("followers-list-id");
let profilePicture = document.getElementById("main-seller-image-id");

const url = new URL(window.location.href);
let userId = url.searchParams.get("id");

async function getUserDetails() {
  firebase.auth().onAuthStateChanged(async function (user) {
    console.log(user);

    let postsReference = firebase
      .firestore()
      .collection("games")
      .where("seller", "==", userId)
      .orderBy("createdAt", "desc");

    let userFollowers = [];
    let numberOfFollowers;

    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((snapshot) => {
        console.log(snapshot.data().description);
        userFollowers = snapshot.data().followers;
        numberOfFollowers = snapshot.data().followers.length;
      });

    let userReference = await firebase
      .firestore()
      .collection("users")
      .doc(userId);

    // userReference
    //   .get()
    //   .then(function (snapshot) {
    //     textAbout.textContent = snapshot.data().description;
    //   })
    //   .catch(function () {
    //     console.log("Could not read description of the store");
    //   });

    //reviews.style.display = "block";


    reviews.addEventListener("click", function () {
      popupReviews.style.display = "block";

      firebase
        .firestore()
        .collection("reviews")
        .doc(userId)
        .collection("reviews")
        .get()
        .then((snapshot) => {
          if (snapshot.size > 0) {
            snapshot.forEach((doc) => {
              let review = doc.data();

              let divMainReview = document.createElement("div");
              divMainReview.setAttribute(
                "class",
                "allordderaction reviews-changes"
              );

              let divUsername = document.createElement("div");
              divUsername.setAttribute("class", "history-order-nickname");
              divUsername.textContent = review.username;

              let divDescription = document.createElement("div");
              divDescription.setAttribute(
                "class",
                "history-order-nickname mn-change"
              );
              divDescription.textContent = review.description;

              let timeagoSpan = document.createElement("span");
              timeagoSpan.textContent = getTimeSince(
                review.createdAt.seconds * 1000
              );

              let divReviewIcon = document.createElement("div");
              if (review.status === "Positive") {
                divReviewIcon.setAttribute("class", "positive-review");
              } else {
                divReviewIcon.setAttribute("class", "negative-review");
              }

              divDescription.appendChild(timeagoSpan);
              divMainReview.appendChild(divUsername);
              divMainReview.appendChild(divDescription);
              divMainReview.appendChild(divReviewIcon);

              divReviews.appendChild(divMainReview);
            });
          } else {
            let div = document.createElement("div");
            div.setAttribute("class", "no-something");
            div.textContent = "there are no reviews";

            divReviews.appendChild(div);
          }
        })
        .then(() => {
          console.log("Successfully displayed reviewers");
        })
        .catch((error) => {
          console.log(error);
        });

      closeModalReviews.addEventListener("click", function () {
        popupReviews.style.display = "none";
        removeEmptySpace();
        removeReviews();
      });
    });

    if (user) {
      console.log(user);
      if (userId === user.displayName) {
        // If same user and logged
        settings.style.display = "block";
        message.style.display = "none";
        console.log("Same user");

        settings.addEventListener("click", function () {
          window.location.href = "settings.html";
        });
      } else {
        // If different user and logged
        if (userFollowers.includes(user.displayName)) {
          // If follower and logged
          console.log("yes");

          settings.style.display = "none";
          message.style.display = "block";
          message.addEventListener("click", function () {
            if (!user) {
              window.location.href = "sign-in.html";
            }

            let PROFILE_PHOTO;
            firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .get()
              .then((snapshot) => {
                PROFILE_PHOTO = snapshot.data().profilePicture;
              })
              .catch((error) => {
                console.log(error);
              });

            let userChatReference = firebase
              .firestore()
              .collection("chats")
              .doc(user.displayName)
              .collection("chats")
              .doc(userId);

            userChatReference.get().then((doc) => {
              if (doc.exists) {
                console.log("Doc exists");
                userChatReference.set(
                  {
                    lastUpdated: new Date(),
                  },
                  { merge: true }
                );
              } else {
                console.log("Doc not exists");
                userChatReference.set({
                  lastUpdated: new Date(),
                  lastMessage: "",
                  profilePhoto: PROFILE_PHOTO,
                  username: userId,
                });
              }
            })
            .then(() => {
              location.href = `chat.html?id=${userId}`;
            })
          });

          unfollowButton.style.display = "inline-block";
          followButton.style.display = "none";

          unfollowButton.addEventListener("click", function () {
            if (!user) {
              location.href = "sign-in.html";
            }
            console.log("You stopped following " + userId);
            userReference
              .update({
                followers: firebase.firestore.FieldValue.arrayRemove(
                  user.displayName
                ),
              })
              .then(() => {
                setTimeout(getUserDetails, 10);
              })
              .then(() => {
                removeFollowers();
              })
              .catch((error) => {
                console.log(error);
              });
          });
        } else {
          // If not follower and logged
          console.log("no");

          settings.style.display = "none";
          message.style.display = "block";
          message.addEventListener("click", function () {
            let PROFILE_PHOTO;

            firebase
              .firestore()
              .collection("users")
              .doc(userId)
              .get()
              .then((snapshot) => {
                console.log(snapshot.data());
                PROFILE_PHOTO = snapshot.data().profilePicture;
              })
              .catch((error) => {
                console.log(error);
              });

            userChatReference = firebase
              .firestore()
              .collection("chats")
              .doc(user.displayName)
              .collection("chats")
              ////////////
              .doc(userId);

            userChatReference.get().then((doc) => {
              if (doc.exists) {
                console.log("Doc exists");
                userChatReference.set(
                  {
                    lastUpdated: new Date(),
                  },
                  { merge: true }
                );
              } else {
                console.log("Doc not exists");
                userChatReference.set({
                  lastUpdated: new Date(),
                  lastMessage: "",
                  profilePhoto: PROFILE_PHOTO,
                  username: userId,
                });
              }
            });
            window.location.href = `chat.html?id=${userId}`;
          });

          followButton.style.display = "inline-block";
          unfollowButton.style.display = "none";

          followButton.addEventListener("click", function () {
            if (!user) {
              window.location.href = "sign-in.html";
            }
            console.log("You started following " + userId);
            userReference
              .update({
                followers: firebase.firestore.FieldValue.arrayUnion(
                  user.displayName
                ),
              })
              .then(() => {
                //setTimeout(getUserDetails, 10);
              })
              .then(() => {
                removeFollowers();
              })
              .catch((error) => {
                console.log(error);
              });

            firebase
              .firestore()
              .collection("notifications")
              .doc(userId)
              .collection("notifications")
              .add({
                typeOfNotification: "General",
                action: "followed you",
                userPhoto: user.photoURL,
                from: user.displayName,
                createdAt: new Date(),
              });
          });
        }
      }
      //nickname.textContent = user.displayName;
      await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then(function (snapshot) {
          console.log(snapshot.data());
          let image = document.createElement("img");
          image.setAttribute("src", `${snapshot.data().profilePicture}`);
          profilePicture.appendChild(image);
          //console.log(snapshot.data().profilePicture);

          followers.textContent = `${numberOfFollowers} followers`;

          followers.addEventListener("click", function () {
            popupFollowers.style.display = "block";

            closeModalFollowers.addEventListener("click", function () {
              popupFollowers.style.display = "none";
              removeFollowers();
            });

            let followersOfUser = [];
            let followersOfFollower = [];
            let followerImage;
            let followerUsername;
            let followerFollowers = [];

            // Probably problem with name consistency
            let userReference = firebase.firestore().collection("users");

            followersOfUser = snapshot.data().followers;
            console.log(followersOfUser);

            if (followersOfUser.length === 0) {
              removeFollowers();
              let div = document.createElement("div");
              div.setAttribute("class", "no-something");
              div.textContent = "there are no followers";
              divMainFollowersList.appendChild(div);
              return;
            }

            followersOfUser.forEach((follower) => {
              removeThereIsNothing();
              let following = false;

              console.log(follower);
              userReference
                .doc(follower)
                .get()
                .then((snapshot) => {
                  followersOfFollower = snapshot.data();
                  console.log(followersOfFollower);
                  console.log("Username " + followersOfFollower.username);
                  console.log("Image " + followersOfFollower.profilePicture);
                  console.log("followers " + followersOfFollower.followers);

                  let divMainFollower = document.createElement("div");
                  divMainFollower.setAttribute(
                    "class",
                    "main-followers-list-2"
                  );

                  let divFollower = document.createElement("div");
                  divFollower.setAttribute("class", "main-followers-list-3");

                  let image = document.createElement("div");
                  image.setAttribute("class", "main-followers-img");

                  if (followersOfFollower.profilePicture !== null) {
                    image.setAttribute(
                      "style",
                      `background-size: cover; background-image:url(${followersOfFollower.profilePicture})`
                    );
                  }

                  image.addEventListener("click", function () {
                    window.location.href = `user.html?id=${followersOfFollower.username}`;
                  });

                  let username = document.createElement("div");
                  username.setAttribute("class", "main-followers-text");
                  username.textContent = followersOfFollower.username;

                  console.log(followersOfFollower.username);

                  let follow = document.createElement("div");
                  if (followersOfFollower.username !== user.displayName) {
                    if (
                      followersOfFollower.followers.includes(user.displayName)
                    ) {
                      following = true;
                      console.log("User is in followers");
                      follow.setAttribute("class", "unfollow-for-modal-btn");
                      follow.textContent = "unfollow";
                    } else {
                      following = false;
                      console.log("User is not in followers");
                      follow.setAttribute("class", "follow-for-modal-btn");
                      follow.textContent = "follow";
                    }
                  }

                  follow.addEventListener("click", function () {
                    if (!user) {
                      window.location.href = "sign-in.html";
                    }
                    if (following === false) {
                      following = true;
                      follow.textContent = "unfollow";
                      follow.setAttribute("class", "unfollow-for-modal-btn");

                      userReference.doc(followersOfFollower.username).update({
                        followers: firebase.firestore.FieldValue.arrayUnion(
                          user.displayName
                        ),
                      });
                    } else {
                      following = false;
                      follow.textContent = "follow";
                      follow.setAttribute("class", "follow-for-modal-btn");

                      userReference.doc(followersOfFollower.username).update({
                        followers: firebase.firestore.FieldValue.arrayRemove(
                          user.displayName
                        ),
                      });
                    }
                  });
                  divFollower.appendChild(image);
                  divFollower.appendChild(username);
                  divMainFollower.appendChild(divFollower);
                  divMainFollower.appendChild(follow);
                  divMainFollowersList.appendChild(divMainFollower);
                });
            });
          });

          nickname.textContent = snapshot.data().username;

          if (snapshot.data().verified === true) {
            let div = document.createElement("span");
            div.setAttribute("class", "verified-user");

            nickname.appendChild(div);
          }
        });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          console.log("Getting the picture");
          profilePicture.setAttribute(
            "style",
            `background-size: cover; background-image:url(${
              snapshot.data().profilePicture
            });`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

const removeFollowers = () => {
  let elements = document.getElementsByClassName("main-followers-list-2");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeReviews = () => {
  let elements = document.getElementsByClassName(
    "allordderaction reviews-changes"
  );

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeEmptySpace = () => {
  let elements = document.getElementsByClassName("no-something");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeThereIsNothing = () => {
  let elements = document.getElementsByClassName("no-something");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

getUserDetails();

let postsArray = [];
const getPosts = async () => {
  removePosts();
  let docs;
  let postsSize;
  let lastVisible;
  let postsReference = firebase
    .firestore()
    .collection("games")
    .where("seller", "==", userId)
    .orderBy("createdAt");

  await postsReference.get().then((snapshot) => {
    docs = snapshot;
    postsSize = snapshot.size;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    //console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    postsArray.push(doc.data());
  });

  if (postsSize > 0) {
    textSelling.style.display = "none";
    postsArray.forEach((post) => {
      createPost(post);
    });
    postsArray = [];
  } else {
    textSelling.style.display = "block";
  }
};

function createPost(post) {
  let div = document.createElement("div");
  div.setAttribute("class", "product-home-show");
  div.setAttribute("style", "margin-top: 34px");

  let divSellerRoundImage = document.createElement("div");
  divSellerRoundImage.setAttribute("class", "seller-round-image");
  divSellerRoundImage.setAttribute("style", "background-size: cover;");

  if (post.sellerPhoto !== null) {
    divSellerRoundImage.setAttribute(
      "style",
      `background:url(${post.sellerPhoto}); background-size: cover;`
    );
  }

  // let image = document.createElement("img");
  // image.setAttribute("src", post.sellerPhoto);

  // divSellerRoundImage.appendChild(image);

  // let divSellerRoundImageIsOnline = document.createElement("div");
  // divSellerRoundImageIsOnline.setAttribute("class", "seller-is-online");

  let divSellerName = document.createElement("div");
  divSellerName.setAttribute("class", "seller-name");

  let divVerified = document.createElement("div");
  divVerified.setAttribute("class", "verified");

  let divProductDescription = document.createElement("div");
  divProductDescription.setAttribute("class", "product-description");

  //////// icon
  let divProductDescriptionMiniSign = document.createElement("div");

  if (post.category === "Accounts") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign"
    );
  } else if (post.category === "Items") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-2"
    );
  } else if (post.category === "GameCoins") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-3"
    );
  } else if (post.category === "Boosting") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-4"
    );
  } else {
    console.log("Problem with catogry icon");
  }

  // let divProductDescriptionMiniSignAccounts = document.createElement("div");
  // divProductDescriptionMiniSignAccounts.setAttribute(
  //   "class",
  //   "category-product-listed-mini-sign category-product-listed-mini-sign"
  // );

  // let divProductDescriptionMiniSignItems = document.createElement("div");
  // divProductDescriptionMiniSignItems.setAttribute(
  //   "class",
  //   "category-product-listed-mini-sign category-product-listed-mini-sign-2"
  // );

  // let divProductDescriptionMiniSignGameCoins = document.createElement("div");
  // divProductDescriptionMiniSignGameCoins.setAttribute(
  //   "class",
  //   "category-product-listed-mini-sign category-product-listed-mini-sign-3"
  // );

  // let divProductDescriptionMiniSignBoosting = document.createElement("div");
  // divProductDescriptionMiniSignBoosting.setAttribute(
  //   "class",
  //   "category-product-listed-mini-sign category-product-listed-mini-sign-4"
  // );
  /////////

  let divProductName = document.createElement("div");
  divProductName.setAttribute("class", "listed-game-name");

  let divProductPrice = document.createElement("div");
  divProductPrice.setAttribute("class", "price-game-listed");

  let divProductPriceArrow = document.createElement("span");
  divProductPriceArrow.setAttribute("class", "arrow-right-price");

  let divProductPriceSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  divProductPriceSVG.setAttribute(
    "class",
    "feather feather-chevron-right chevron-for-payment"
  );
  divProductPriceSVG.setAttributeNS(null, "viewBox", "0 0 " + 24 + " " + 24);
  divProductPriceSVG.setAttributeNS(null, "width", 24);
  divProductPriceSVG.setAttributeNS(null, "height", 24);
  divProductPriceSVG.setAttributeNS(null, "fill", "none");
  divProductPriceSVG.setAttributeNS(null, "stroke-width", 2);
  divProductPriceSVG.setAttributeNS(null, "stroke", "currentColor");
  divProductPriceSVG.setAttributeNS(null, "stroke-linecap", "round");
  divProductPriceSVG.setAttributeNS(null, "stroke-linejoin", "round");

  let divProductPricePolyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  divProductPricePolyline.setAttributeNS(null, "points", "9 18 15 12 9 6");

  divSellerName.textContent = post.seller;
  divProductDescription.textContent = post.description;
  divProductName.textContent = post.title;
  divProductPrice.textContent = `${post.price} EUR`;
  // divSellerRoundImageIsOnline.textContent = "on";

  // divSellerRoundImage.appendChild(divSellerRoundImageIsOnline);

  divSellerName.appendChild(divVerified);

  ////// Get specific Icon
  divProductDescription.appendChild(divProductDescriptionMiniSign);

  divProductPriceSVG.appendChild(divProductPricePolyline);
  divProductPriceArrow.appendChild(divProductPriceSVG);
  divProductPrice.appendChild(divProductPriceArrow);

  div.appendChild(divSellerRoundImage);
  div.appendChild(divSellerName);
  div.appendChild(divProductDescription);
  div.appendChild(divProductName);
  div.appendChild(divProductPrice);

  divMainSelling.appendChild(div);

  div.addEventListener("click", function () {
    window.location.href = `post.html?id=${post.postId}`;
  });
}

const removePosts = () => {
  let elements = document.getElementsByClassName("product-home-show");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

sellingButton.addEventListener("click", () => {
  console.log("Click selling");
  aboutButton.classList.remove("switch-1-selected");
  sellingButton.classList.add("switch-1-selected");
  textAbout.style.display = "none";
  getPosts();
});

aboutButton.addEventListener("click", () => {
  console.log("Click about");
  sellingButton.classList.remove("switch-1-selected");
  aboutButton.classList.add("switch-1-selected");
  textAbout.style.display = "block";
  textSelling.style.display = "none";

  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then(function (snapshot) {
      console.log(snapshot.data());
      if (
        snapshot.data().description !== undefined ||
        snapshot.data().description !== ""
      ) {
        textAbout.innerText = snapshot.data().description;
      } else {
        textAbout.innerText = "There is not description";
      }
    })
    .catch(function () {
      console.log("Could not read description of the store");
    });

  removePosts();
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

getPosts();
