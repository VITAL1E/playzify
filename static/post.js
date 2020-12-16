let postTitle = document.getElementById("title-to-post-id");
let postDescription = document.getElementById("description-to-post-id");
let postPrice = document.getElementById("price-to-post-id");
let postImages = document.getElementById("images-to-post-id");
let postImagesMobile = document.getElementById("images-to-post-mobile-id");
let postQuantity = document.getElementById("quantity-to-post-id");
let postGaranty = document.getElementById("garanty-to-post-id");
let postSellerPhoto = document.getElementById("post-seller-photo-id");
let postSellerNickname = document.getElementById("post-seller-nickname-id");
let postReviewsSatisfied = document.getElementById(
  "reviews-percentage-satisfied-id"
);
let favoritesButton1 = document.getElementById("favorites-main-div-id-1");
let favoritesButton2 = document.getElementById("favorites-main-div-id-2");
let likeCount = document.getElementById("number-of-likes-id");
let likeIcon = document.getElementById("like-icon-id");
let likeIconRed = document.getElementById("like-icon-red-id");

let postReviews = document.getElementById("reviews-post-id");
let postReviewsPopup = document.getElementById("popup-post-reviews-id");
let closePostModalReviews = document.getElementById(
  "close-reviews-post-modal-id"
);

let postSellerInfo = document.getElementById("seller-info-id");

let divPostReviews = document.getElementById("reviews-post-list-id");

let postImagePreview = document.getElementById("post-img-view-id");
let postImageSrcPreview = document.getElementById("post-img-src-id");
let closeImagePreview = document.getElementsByClassName("close-img");

let postReportDeleteText = document.getElementById("are-you-sure-post-text-id");
let postReportDeletePopup = document.getElementById("pop-up-report-post");
let postReportText = document.getElementById(
  "report-post-content-explanation-id"
);

let deleteButton = document.getElementById("sure-report-post-yes");
let closeButton = document.getElementById("sure-report-post-no");
let closeModalButton = document.getElementsByClassName("close-modal");

let userId = null;
let postLikeCount = 0;

let postObjectToFetch = {};

function getPostDetails() {
  const url = new URL(window.location.href);
  let postId = url.searchParams.get("id");
  firebase.auth().onAuthStateChanged(function (user) {
    firebase
      .firestore()
      .doc(`/games/${postId}`)
      .get()
      .then((doc) => {
        let postSelected = {
          postId: doc.data().postId,
          title: doc.data().title,
          category: doc.data().category,
          delivery: doc.data().delivery,
          description: doc.data().description,
          price: doc.data().price,
          server: doc.data().server,
          type: doc.data().type,
          quantity: doc.data().quantity,
          garanty: doc.data().garanty,
          images: doc.data().images,
          likes: doc.data().likes,
          seller: doc.data().seller,
          sellerPhoto: doc.data().sellerPhoto,
        };

        postObjectToFetch = postSelected;

        if (postSelected.images) {
          for (let i = 0; i < postSelected.images.length; i++) {
            let imagePreview = document.createElement("div");
            let imageBackground = document.createElement("img");
            imagePreview.setAttribute("class", "post-images");
            let width = window.outerWidth;
            let height = window.outerHeight;
            imageBackground.setAttribute("src", `${postSelected.images[i]}`);

            imagePreview.addEventListener("click", function () {
              postImagePreview.style.display = "block";
              postImageSrcPreview.setAttribute("src", postSelected.images[i]);
            });

            imagePreview.appendChild(imageBackground);
            postImages.appendChild(imagePreview);
            //postImagesMobile.appendChild(imagePreview);
          }
        }
        postLikeCount = postSelected.likes;

        let descriptionSpan = document.createElement("div");
        descriptionSpan.textContent = `${postSelected.description}`;

        let reportDelete = document.createElement("div");
        reportDelete.setAttribute("style", "color: red;");

        if (postSelected.seller === user.displayName) {
          reportDelete.textContent = "Delete";
          reportDelete.addEventListener("click", function () {
            postReportDeletePopup.style.display = "block";
            postReportDeleteText.innerText =
              "Are you sure you want to delete this post?";
            document.getElementById("report-post-pop-div-id").remove();

            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", function () {
              firebase
                .firestore()
                .collection("games")
                .doc(postId)
                .delete()
                .then(() => {
                  console.log("deleted document");
                  postReportDeletePopup.style.display = "none";
                  location.href = `user.html?id=${user.displayName}`;
                })
                .catch((error) => {
                  console.log(error);
                });
            });

            closeButton.addEventListener("click", function () {
              postReportDeletePopup.style.display = "none";
            });
          });
        } else {
          reportDelete.textContent = "Report";
          reportDelete.addEventListener("click", function () {
            postReportDeletePopup.style.display = "block";
            postReportDeleteText.innerText =
              "Are you sure you want to report this post?";

            deleteButton.addEventListener("click", function () {
              if (isEmpty(postReportText.innerText)) {
                alert("You have to write explanation");
                console.log("empty");
                return;
              }

              firebase
                .firestore()
                .collection("reports")
                .add({
                  postId: postId,
                  from: user.displayName,
                  userPhoto: user.photoURL,
                  message: postReportText.innerText,
                  status: "Unresolved",
                  createdAt: new Date(),
                })
                .then((reference) => {
                  console.log("added new report " + reference);
                  postReportDeletePopup.style.display = "none";
                  location.href = "homepage.html";
                })
                .catch((error) => {
                  console.log(error);
                });
            });

            closeButton.addEventListener("click", function () {
              postReportDeletePopup.style.display = "none";
            });
          });
        }

        postDescription.appendChild(descriptionSpan);
        postDescription.appendChild(reportDelete);

        postTitle.innerText = `${postSelected.title}`;
        postPrice.innerText = `${postSelected.price} EUR`;
        postQuantity.innerText = `${postSelected.quantity}`;
        postGaranty.innerText = `${postSelected.garanty}`;

        let verified = document.createElement("div");
        verified.setAttribute("class", "verified");

        userId = postSelected.seller;
        postSellerNickname.innerText = postSelected.seller;
        postSellerNickname.appendChild(verified);

        postSellerNickname.addEventListener("click", function () {
          window.location.href = `user.html?id=${postSelected.seller}`;
        });

        let reviewsCount = 0;

        firebase
          .firestore()
          .collection("reviews")
          .doc(postSelected.seller)
          .collection("reviews")
          .get()
          .then((snapshot) => {
            reviewsCount = snapshot.size;
            console.log(snapshot);
          })
          .then(() => {
            firebase
              .firestore()
              .collection("reviews")
              .doc(postSelected.seller)
              .collection("reviews")
              .where("status", "==", "Positive")
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  postReviews.style.display = "none";
                  //postReviewsSatisfied.textContent = "0 %";
                } else {
                  let percentage = (querySnapshot.size * 100) / reviewsCount;
                  postReviewsSatisfied.textContent = `${percentage.toFixed(
                    0
                  )}%`;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        if (postSelected.sellerPhoto !== null) {
          let image = document.createElement("img");
          image.setAttribute("src", postSelected.sellerPhoto);

          postSellerPhoto.appendChild(image);
          //postImages.innerText = `${postSelected.images}`;
        }

        postSellerPhoto.addEventListener("click", function () {
          window.location.href = `user.html?id=${postSelected.seller}`;
        });

        // undefined
        //likeCount.textContent = postSelected.likes.size;

        let likesReference = firebase.firestore().doc(`/games/${postId}`);

        favoritesButton2.addEventListener("click", favoriteItemEvent);
        // firebase.auth().onAuthStateChanged(function (user) {
        //   if (user) {
        //     toggle(postSelected.likes.length);
        //   } else {
        //     window.location.href = "sign-in.html";
        //   }
        // });
        //});

        function favoriteItemEvent() {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              toggle(postSelected.likes.length);
            } else {
              window.location.href = "sign-in.html";
            }
          });
          favoritesButton2.removeEventListener("click", favoriteItemEvent);
        }

        likesReference.get().then((snapshot) => {
          console.log(snapshot.data().likes);
          if (user) {
            localStorage.setItem("username", user.displayName);
            if (snapshot.data().likes.includes(user.displayName)) {
              likeIcon.style.display = "none";
              likeIconRed.style.display = "block";
            } else {
              likeIcon.style.display = "block";
              likeIconRed.style.display = "none";
            }
          }
          likeCount.textContent = snapshot.data().likes.length;
        });

        function toggle(likeCountNumberUpdate) {
          userReference = firebase
            .firestore()
            .collection("users")
            .doc(user.displayName);

          if (likeIcon.style.display === "none") {
            likeIcon.style.display = "block";
            likeIconRed.style.display = "none";
            //likeCount.textContent = postSelected.likes.length - 1;
            likeCount.textContent = likeCountNumberUpdate;

            likesReference
              .update({
                likes: firebase.firestore.FieldValue.arrayRemove(
                  user.displayName
                ),
              })
              .then(() => {
                userReference.update({
                  favorites: firebase.firestore.FieldValue.arrayRemove(postId),
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            likeIcon.style.display = "none";
            likeIconRed.style.display = "block";
            likeCount.textContent = likeCountNumberUpdate + 1;

            likesReference
              .update({
                likes: firebase.firestore.FieldValue.arrayUnion(
                  user.displayName
                ),
              })
              .then(() => {
                userReference.update({
                  favorites: firebase.firestore.FieldValue.arrayUnion(postId),
                });
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("notifications")
                  .doc(postSelected.seller)
                  .collection("notifications")
                  .add({
                    typeOfNotification: "General",
                    action: "favorite your item",
                    userPhoto: user.photoURL,
                    from: user.displayName,
                    createdAt: new Date(),
                    seen: false,
                  })
                  .then((reference) => {
                    console.log("Successfully updated " + reference);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (user) {
      console.log("logged in");
    } else {
      console.log("Not logged in");
    }
  });
}

Array.from(closeImagePreview).forEach((button) => {
  button.addEventListener("click", () => {
    postImagePreview.style.display = "none";
  });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("post-not-logged-in-header-id").style.display =
      "none";
    document.getElementById("post-logged-in-header-id").style.display = "block";
  } else {
    document.getElementById("post-not-logged-in-header-id").style.display =
      "block";
    document.getElementById("post-logged-in-header-id").style.display = "none";
  }
});

postPrice.addEventListener("click", function () {
  // const url = new URL(window.location.href);
  // let postId = url.searchParams.get("id");

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      document.body.addEventListener("click", function (e) {
        window.location.href = "sign-in.html";
      });
    } else {
      console.log("Logged in");
      fetch("http://localhost:3001/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: {
            currency: "EUR",
            amount: `${postObjectToFetch.price}.00`,
          },
          description: postObjectToFetch.description,
          postId: postObjectToFetch.postId,
          seller: postObjectToFetch.seller,
          category: postObjectToFetch.category,
          delivery: postObjectToFetch.delivery,
          garanty: postObjectToFetch.garanty,
          quantity: postObjectToFetch.quantity,
          server: postObjectToFetch.server,
          title: postObjectToFetch.title,
          buyer: user.displayName,
          type: postObjectToFetch.type,
          price: postObjectToFetch.price,
          sellerProfilePhoto: postObjectToFetch.sellerPhoto,
          buyerProfilePhoto: user.photoURL,
        }),
      })
        .then(function (data) {
          console.log(data);
          data.json().then(function (data) {
            window.open(data.redirectUrl);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("Clicked pay");
    }
  });
});

postReviewsSatisfied.addEventListener("click", function () {
  postReviewsPopup.style.display = "block";

  firebase
    .firestore()
    .collection("reviews")
    .doc(userId)
    .collection("reviews")
    .get()
    .then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.docs.forEach((doc) => {
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

          divPostReviews.appendChild(divMainReview);
        });
      } else {
        let div = document.createElement("div");
        div.setAttribute("class", "no-something");
        div.textContent = "there are no reviews";

        divPostReviews.appendChild(div);
      }
    })
    .then(() => {
      console.log("Successfully displayed reviewers");
    })
    .catch((error) => {
      console.log(error);
    });

  closePostModalReviews.addEventListener("click", function () {
    postReviewsPopup.style.display = "none";
    removeEmptySpace();
    removeReviews();
  });
});

Array.from(closeModalButton).forEach((e) => {
  e.addEventListener("click", function () {
    document.getElementById("pop-up-report-post").style.display = "none";
  });
});

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

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
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

getPostDetails();
