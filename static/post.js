let postTitle = document.getElementById("title-to-post-id");
let postDescription = document.getElementById("description-to-post-id");
let postPrice = document.getElementById("price-to-post-id");
let postImages = document.getElementById("images-to-post-id");
let postImagesMobile = document.getElementById("images-to-post-mobile-id");
let postQuantity = document.getElementById("quantity-to-post-id");
let postGaranty = document.getElementById("garanty-to-post-id");
let postSellerPhoto = document.getElementById("post-seller-photo-id");
let postSellerNickname = document.getElementById("post-seller-nickname-id");
let favoritesButton1 = document.getElementById("favorites-main-div-id-1");
let favoritesButton2 = document.getElementById("favorites-main-div-id-2");
let likeCount = document.getElementById("number-of-likes-id");
let likeIcon = document.getElementById("like-icon-id");
let likeIconRed = document.getElementById("like-icon-red-id");

let postSellerInfo = document.getElementById("seller-info-id");

let postImagePreview = document.getElementById("post-img-view-id");
let postImageSrcPreview = document.getElementById("post-img-src-id");
let closeImagePreview = document.getElementsByClassName("close-img");

let postLikeCount;

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

        postTitle.innerText = `${postSelected.title}`;
        postDescription.innerText = `${postSelected.description}`;
        postPrice.innerText = `${postSelected.price} EUR`;
        postQuantity.innerText = `${postSelected.quantity}`;
        postGaranty.innerText = `${postSelected.garanty}`;

        let verified = document.createElement("div");
        verified.setAttribute("class", "verified");

        postSellerNickname.innerText = postSelected.seller;
        postSellerNickname.appendChild(verified);

        if (postSelected.sellerPhoto !== null) {
          let image = document.createElement("img");
          image.setAttribute("src", postSelected.sellerPhoto);
  
          postSellerPhoto.appendChild(image);
          //postImages.innerText = `${postSelected.images}`;
        }

        postSellerInfo.addEventListener("click", function () {
          window.location.href = `user.html?id=${postSelected.seller}`;
        });

        // undefined
        //likeCount.textContent = postSelected.likes.size;

        let likesReference = firebase.firestore().doc(`/games/${postId}`);

        favoritesButton2.addEventListener("click", function () {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              toggle(postSelected.likes.length);
            } else {
              window.location.href = "sign-in.html";
            }
          });
        });

        likesReference.get().then((snapshot) => {
          console.log(snapshot.data().likes);
          if (user) {
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
            likeCount.textContent = likeCountNumberUpdate - 1;

            likesReference.update({
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

            likesReference.update({
              likes: firebase.firestore.FieldValue.arrayUnion(user.displayName),
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
          createdAt: postObjectToFetch.createdAt,
          delivery: postObjectToFetch.delivery,
          garanty: postObjectToFetch.garanty,
          quantity: postObjectToFetch.quantity,
          server: postObjectToFetch.server,
          title: postObjectToFetch.title,
          buyer: user.displayName,
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

getPostDetails();
