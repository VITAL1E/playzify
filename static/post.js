let postTitle = document.getElementById("title-to-post-id");
let postDescription = document.getElementById("description-to-post-id");
let postPrice = document.getElementById("price-to-post-id");
let postImages = document.getElementById("images-to-post-id");
let postImagesMobile = document.getElementById("images-to-post-mobile-id");
let postQuantity = document.getElementById("quantity-to-post-id");
let postGaranty = document.getElementById("garanty-to-post-id");
let favoritesButton1 = document.getElementById("favorites-main-div-id-1");
let favoritesButton2 = document.getElementById("favorites-main-div-id-2");
let likeCount = document.getElementById("number-of-likes-id");
let likeIcon = document.getElementById("like-icon-id");
let likeIconRed = document.getElementById("like-icon-red-id");

likeCount.textContent = "";
let likeCountGlobal = likeCount;

let postLikeCount;
// NO NEED URL ID PARAMETER
let postIdParameter;

// PAYMENT DATA
let priceToMolliePayment;
let descriptionMolliePayment;

// function getPostPrice(postId) {
//   const priceToMolliePayment = firebase
//   .firestore()
//   .doc(`/games/${postId}`)
//   .get()
//   .then((doc) => {
//     return doc.data().price
//   })

//   return parseFloat(priceToMolliePayment);
// }

function getPostDetails() {
  const url = new URL(window.location.href);
  let postId = url.searchParams.get("id");

  postIdParameter = postId;

  firebase
    .firestore()
    .doc(`/games/${postId}`)
    .get()
    .then((doc) => {
      let postSelected = {
        title: doc.data().title,
        description: doc.data().description,
        price: doc.data().price,
        quantity: doc.data().quantity,
        garanty: doc.data().garanty,
        images: doc.data().images,
      };

      if (postSelected.images) {
        for (let i = 0; i < postSelected.images.length; i++) {
          let imagePreview = document.createElement("div");
          let imageBackground = document.createElement("img");
          imagePreview.setAttribute("class", "post-images");
          imageBackground.setAttribute("style", "width: inherit; height: inherit; border-radius: 20px;");
          let width = window.outerWidth;
          let height = window.outerHeight;
          imageBackground.setAttribute("src", `${postSelected.images[i]}`);
          imagePreview.appendChild(imageBackground);
          postImages.appendChild(imagePreview);
          //postImagesMobile.appendChild(imagePreview);
        }
      }
      postLikeCount = postSelected.likes;

      postTitle.innerText = `${postSelected.title}`;
      postDescription.innerText = `${postSelected.description}`;
      postPrice.innerText = `${postSelected.price} EUR`;
      priceToMolliePayment = `${postSelected.price}.00`;
      descriptionMolliePayment = postSelected.description;
      postQuantity.innerText = `${postSelected.quantity}`;
      postGaranty.innerText = `${postSelected.garanty}`;
      //postImages.innerText = `${postSelected.images}`;
    })
    .catch((err) => {
      console.log(err);
    });
}

getPostDetails();

// favoritesButton1.addEventListener("click", function () {
//   //document.getElementById("like-icon-id").style
//   // toggle
//   // likeCount.textContent = postLikeCount + 1;
//   //likeCount.classList.add("heart-liked-red-1");
//   likeIcon.style.display = "none";
//   likeIconRed.style.display = "block";
//   likeCountGlobal = likeCount.textContent + "1";
//   console.log(likeCountGlobal);
// });

favoritesButton2.addEventListener("click", function () {
  toggle();
  // likeIcon.style.display = "none";
  // likeIconRed.style.display = "block";
  // likeCount.textContent = "1";
  // likeIcon.style.display = "block";
  // likeIconRed.style.display = "none";
  // likeCount.textContent = "";

  //document.getElementById("like-icon-id").style
  // toggle
  // likeCount.textContent = postLikeCount + 1;
  //likeCount.classList.add("heart-liked-red-1");

  // likeCountGlobal = likeCount.textContent + "1";
  console.log(likeCountGlobal);
});

function toggle() {
  if (likeIcon.style.display === "none") {
    likeIcon.style.display = "block";
    likeIconRed.style.display = "none";
    likeCount.textContent = "";
  } else {
    likeIcon.style.display = "none";
    likeIconRed.style.display = "block";
    likeCount.textContent = "1";
  }
}

// GET USER to order page
// postPrice.addEventListener("click", function () {
//   window.location.href = `order-buyer.html?id=${postIdParameter}`;
// })

postPrice.addEventListener("click", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      document.body.addEventListener("click", function (e) {
        window.location.href = "sign-in.html";
      });
    } else {
      console.log("Logged in");
      fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: {
            currency: "EUR",
            amount: priceToMolliePayment,
          },
          description: descriptionMolliePayment,
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

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const { token, error } = await mollie.createToken();

//   if (error) {
//     // Something wrong happened while creating the token. Handle this situation gracefully.
//     return;
//   }

// Add token to the form
// const tokenInput = document.createElement("input");
// tokenInput.setAttribute("type", "hidden");
// tokenInput.setAttribute("name", "cardToken");
// tokenInput.setAttribute("value", token);

// console.log("TOken " + token);
// console.log("Token input " + tokenInput);

// form.appendChild(tokenInput);

// mollie.payments.create({
//   amount: {
//     value: '10.00',
//     currency: 'EUR'
//   },
//   description: 'My first API payment',
//   redirectUrl: 'https://yourwebshop.example.org/order/123456',
//   webhookUrl:  'https://yourwebshop.example.org/webhook'
// })
//   .then(payment => {
//     // Forward the customer to the payment.getCheckoutUrl()
//   })
//   .catch(error => {
//     // Handle the error
//   });

// fetch("/payments", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json"
//   },
//   body: JSON.stringify({
//     tokenId: token.id,
//     // IDK send item to server?
//     item: item
//   })
// });

// Submit form to the server
// form.submit();
//   });
