(function (window, document, undefined) {
  "use strict";

  let gameCollection = document.getElementById("favorites-collection-id");

  let thereAreNoItems = document.getElementById("there-are-no-items-id");

  function createPost(post) {
    let div = document.createElement("div");
    div.setAttribute("class", "product-home-show");
  
    let divSellerRoundImage = document.createElement("div");
    divSellerRoundImage.setAttribute("class", "seller-round-image");
  
    if (post.sellerPhoto !== null) {
      divSellerRoundImage.setAttribute("style", `background-size: cover; background-image:url(${post.sellerPhoto})`);
    }
  
    // let divSellerRoundImageIsOnline = document.createElement("div");
    // divSellerRoundImageIsOnline.setAttribute("class", "seller-is-online");
  
    let divSellerName = document.createElement("div");
    divSellerName.setAttribute("class", "seller-name");
  
    let divVerified = document.createElement("div");
    divVerified.setAttribute("class", "verified");
  
    let divProductDescription = document.createElement("div");
    divProductDescription.setAttribute("class", "product-description");
  
    let divProductDescriptionMiniSign = document.createElement("div");
  
    //////// icon
    if (post.category === "Accounts") {
      divProductDescriptionMiniSign.setAttribute("class", "category-product-listed-mini-sign category-product-listed-mini-sign");
    } else if (post.category === "Items") {
      divProductDescriptionMiniSign.setAttribute("class", "category-product-listed-mini-sign category-product-listed-mini-sign-2");
    } else if (post.category === "GameCoins") {
      divProductDescriptionMiniSign.setAttribute("class", "category-product-listed-mini-sign category-product-listed-mini-sign-3");
    } else if (post.category === "Boosting") {
      divProductDescriptionMiniSign.setAttribute("class", "category-product-listed-mini-sign category-product-listed-mini-sign-4");
    } else {
      console.log("Problem with catogry icon");
    }
  
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
    divProductPrice.textContent = post.price + " EUR";
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

    gameCollection.appendChild(div);
  
    div.addEventListener("click", function () {
      window.location.href = `post.html?id=${post.postId}`;
    });
  }

  let postsArray = [];

  const getPosts = async () => {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (!user) {
        console.log("Not logged in");
      } else {
        await firebase
          .firestore()
          .doc(`/users/${user.displayName}`)
          .get()
          .then((snapshot) => {
            if (snapshot.data().favorites.length === 0) {
              thereAreNoItems.style.display = "block";
              return;
            }
            postsArray = snapshot.data().favorites;
            console.log(postsArray);
          });

        postsArray.forEach(async (postId) => {
          await firebase
            .firestore()
            .collection("games")
            .doc(postId)
            .get()
            .then((post) => {
              console.log(post.data());
              createPost(post.data());
            });
        });
      }
    });
  };

  getPosts();
})(window, document);
