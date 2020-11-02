let productsCount = document.getElementById("products-count-home-id");
let filterButton = document.getElementsByClassName("filter-icon");
let filterPopup = document.getElementById("filter-modal-id");
let showMoreButton = document.querySelector(".show-more"); // ???
let cancelButton = document.getElementById("cancel-id");
let applyButton = document.getElementById("apply-id");
let removeFilter = document.getElementById("remove-filter-id");
let searchBar = document.getElementById("search-bar-id");

// Array containing all displayed games
let postsArray = [];

removeFilter.addEventListener("click", function () {
  removePosts();
  getPostsCount();
  getPosts();
});

if (searchBar) {
  searchBar.addEventListener("keyup", (e) => {
    let searchString = e.target.value.toLowerCase();
    let filteredGames = postsArray.filter(game => {
      return (
        game.title.toLowerCase().includes(searchString) || 
        game.description.toLowerCase().includes(searchString)
      );
    });
    console.log(filteredGames);
    removePosts();
    productsCount.textContent = "Items: " + filteredGames.length;
    filteredGames.forEach((post) => {
      createPost(post);
    });
  });
}

Array.from(filterButton).forEach((e) =>
  e.addEventListener("click", function () {
    filterPopup.style.display = "block";
  })
);

// filterButton.addEventListener("click", function() {
//   if (filterPopup.style.display == "none") {
//     filterPopup.style.display = "block";
//   } else {
//     filterPopup.style.display = "none";
//   }
// });

// Filter button
// filterButton.onclick = function() {
//   filterPopup.style.display = "block";
// }

// window.onclick = function(event) {
//   if (event.target == filterPopup) {
//     filterPopup.style.display = "none";
//   }
// }

let gameCollection = document.querySelector(".product-list-home");

function createPost(post) {
  let div = document.createElement("div");
  div.setAttribute("class", "product-home-show");

  let divSellerRoundImage = document.createElement("div");
  divSellerRoundImage.setAttribute("class", "seller-round-image");

  let image = document.createElement("img");
  image.setAttribute("src", post.sellerPhoto);

  divSellerRoundImage.appendChild(image);

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

// Posts from index
// let posts;
// let lastVisible;
// let postsArray = [];
// let size, postsSize;
//function getPosts() { -- uncomment as well
// ---------- WORKING PROTOTYPE ----------------
// firebase
//   .firestore()
//   .collection("games")
//   .get()
//   .then((snapshot) => {
//     //let games = [];
//     snapshot.docs.forEach((doc) => {
//       //games.push(doc.data());
//       //console.log(localStorage.getItem(`${docs}`));
//       createPost(doc.data());
//       //localStorage.setItem(`${doc.data().postId}`, JSON.stringify(doc.data()));
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// ---------- WORKING PROTOTYPE ----------------

const getPosts = async () => {
  let lastVisible;
  // Commented postsArray and put it above global
  // let postsArray = [];
  let docs;
  // pagination
  let postsReference = firebase
    .firestore()
    .collection("games")
    .orderBy("createdAt");
    // .limit(8);

  await postsReference
    .get()
    .then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      // strange behavior
      console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    postsArray.push(doc.data());
  });

  postsArray.forEach((post) => {
    createPost(post);
  });

  // const paginate = async () => {
  //   let docs;
  //   //let postsReference = firebase.firestore().collection("games").orderBy("createdAt").startAfter(lastVisible).limit(8);
  //   let postsReferencePagination = postsReference
  //     .startAfter(lastVisible)
  //     .limit(8);
  //   console.log(postsReference);

  //   await postsReferencePagination.get().then((snapshot) => {
  //     docs = snapshot;
  //     console.log(docs);
  //     lastVisible = snapshot.docs[snapshot.docs.length - 1];
  //   });

  //   docs["docs"].forEach((doc) => {
  //     createPost(doc.data());
  //   });
  // };

  // if (showMoreButton != null) {
  //   showMoreButton.addEventListener("click", () => {
  //     paginate();
  //   });
  // }
};

function onSelectChangeProductTypeFilter() {
  let productType = document.getElementById("select-by-product-type");
  let productTypeOption = productType.options[productType.selectedIndex].value;
  console.log(productTypeOption);
  return productTypeOption;
}

function onSelectChangeGameTypeFilter() {
  let gameType = document.getElementById("select-by-game-type");
  let gameTypeOption = gameType.options[gameType.selectedIndex].value;
  console.log(gameTypeOption);
  return gameTypeOption;
}

function onSelectChangeGameServerFilter() {
  let gameServer = document.getElementById("select-by-game-server");
  let gameServerOption = gameServer.options[gameServer.selectedIndex].value;
  console.log(gameServerOption);
  return gameServerOption;
}

function onSelectChangeGamePriceFilter() {
  let gamePrice = document.getElementById("select-by-price");
  let gamePriceOption = gamePrice.options[gamePrice.selectedIndex].value;
  console.log(gamePriceOption);
  return gamePriceOption;
}

const removePosts = () => {
  let elements = document.getElementsByClassName("product-home-show");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}


applyButton.addEventListener("click", async () => {
  removePosts();
  let docs;
  let postsSize;
  let lastVisible;
  let productTypeOption = onSelectChangeProductTypeFilter();
  let gameTypeOption = onSelectChangeGameTypeFilter();
  let gameServerOption = onSelectChangeGameServerFilter();
  let gamePriceOption = onSelectChangeGamePriceFilter();

  let filterQuery = firebase
    .firestore()
    .collection("games")
    .orderBy("createdAt")
    .where("category", "==", productTypeOption)
    .where("type", "==", gameTypeOption)
    .where("server", "==", gameServerOption)
    .limit(8);
  if (gamePriceOption == "high") {
    filterQuery = filterQuery.orderBy("price", "desc");
  } else {
    filterQuery = filterQuery.orderBy("price");
  }

  await filterQuery.get().then(function (querySnapshot) {
    console.log(querySnapshot.docs);
    /////////// assign docs to snapshot ???
    let filteredPostsArray = [];
    docs = querySnapshot;
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    console.log("last", lastVisible);
    ///////////

    productsCount.textContent = "Items: " + querySnapshot.docs.length;
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

    docs["docs"].forEach((doc) => {
      filteredPostsArray.push(doc.data());
    });

    filteredPostsArray.forEach((post) => {
      createPost(post);
    });
  });

  const paginate = async () => {
    let docs;
    let postsReferencePagination = filterQuery.startAfter(lastVisible).limit(8);
    console.log(filterQuery);

    await postsReferencePagination.get().then((querySnapshot) => {
      docs = querySnapshot;
      console.log(docs);
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    });

    docs["docs"].forEach((doc) => {
      createPost(doc.data());
      // create post dynamically
      postsSize++;
    });

    if (postsSize >= size) {
      showMoreButton.style.display = "none";
    }
  };

  if (showMoreButton != null) {
    showMoreButton.addEventListener("click", () => {
      paginate();
    });
  }

  filterPopup.style.display = "none";
});


cancelButton.addEventListener("click", function () {
  filterPopup.style.display = "none";
});

// UGLY
// change to not read so much data !!!
// Combine with get posts to read once
function getPostsCount() {
  firebase
    .firestore()
    .collection("games")
    .get()
    .then((snap) => {
      let size = snap.size;

      productsCount.textContent = "Items: " + size;
    });
}

// function arePostsFiltered(filtered) {
//   if (filtered) {
//     getPostsFiltered();
//   } else {
//     getPosts();
//   }
// }

// async function getPostsFiltered() {
//   let productTypeOption = onSelectChangeProductTypeFilter();
//   let gameTypeOption = onSelectChangeGameTypeFilter();
//   let gameServerOption = onSelectChangeGameServerFilter();
//   let gamePriceOption = onSelectChangeGamePriceFilter();

//   let filterQuery = firebase
//     .firestore()
//     .collection("games")
//     .where("category", "==", productTypeOption)
//     .where("type", "==", gameTypeOption)
//     .where("server", "==", gameServerOption);
//   if (gamePriceOption == "high") {
//     filterQuery = filterQuery.orderBy("price", "desc");
//   } else {
//     filterQuery = filterQuery.orderBy("price");
//   }

//   await filterQuery.get().then(function (querySnapshot) {
//     console.log(querySnapshot.docs); 
    
    
    /////////// assign docs to snapshot ???
    //let filteredPostsArray = [];
    //docs = querySnapshot;
    // lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    // console.log("last", lastVisible.data());
    ///////////

    ////// Uncomment
    // querySnapshot.forEach(function (doc) {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    //   querySnapshot["docs"].forEach((doc) => {
    //     filteredPostsArray.push(doc.data());
    //   });

    //   filteredPostsArray.forEach((post) => {
    //     createPost(post);
    //   });
    //////

      // const paginate = async () => {
      //   let docs;
      //   let postsReferencePagination = filterQuery.startAfter(lastVisible).limit(8);
      //   console.log(filterQuery);

      //   await postsReferencePagination.get().then((querySnapshot) => {
      //     docs = querySnapshot;
      //     console.log(docs);
      //     lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      //   });

      //   docs["docs"].forEach((doc) => {
      //     createPost(doc.data());
      //     // create post dynamically
      //     postsSize++;
      //   });

      //   if (postsSize >= size) {
      //     showMoreButton.style.display = "none";
      //   }
      // };

      // if (showMoreButton != null) {
      //   showMoreButton.addEventListener("click", () => {
      //     paginate();
      //   });
      // }
    //});
//   });
// }


// const getPostsFiltered = async () => {
//   let productTypeOption = onSelectChangeProductTypeFilter();
//   let gameTypeOption = onSelectChangeGameTypeFilter();
//   let gameServerOption = onSelectChangeGameServerFilter();
//   let gamePriceOption = onSelectChangeGamePriceFilter();
//   let docs;
//   let filteredPostsArray = [];
//   firebase
//     .firestore()
//     .collection("products")
//     .where("category", "==", productTypeOption)
//     .where("type", "==", gameTypeOption)
//     .where("server", "==", gameServerOption)
//     .get()
//     .then((querySnapshot) => {
//     docs = querySnapshot;
//     console.log(docs.data());
    
//     docs["docs"].forEach((doc) => {
//       console.log(doc.data());
      
//       filteredPostsArray.push(doc.data());
//     });

//     filteredPostsArray.forEach((post) => {
//       createPost(post);
//     });
//   filterPopup.style.display = "none";
// });
// }


let i = 0;
let images = [];

images[0] = "./static/71577e1cf59d802.jpg";
images[1] = "./static/0ba3d60362c7e6d256cfc1f37156bad9.jpg";
images[2] = "./static/Blue-Pixel-Call-To-Action-Banner-Background.jpg";

let image1 = document.getElementById("image-1");
let image2 = document.getElementById("image-2");
let image3 = document.getElementById("image-3");

// firebase
// .firestore()
// .collection("banner")
// .get()
// .then((snapshot) => {
//   snapshot.docs.forEach((doc) => {
//     console.log(doc.data().image);
//     images.push(doc.data().image);
//   });
//   console.log(images);
// });

function changeBannerImages() {
  if (images[i] !== undefined) {
    let banner = document.getElementById("banner-id");
    if (banner) {
      if (images[i] === 0) {
        image1.classList.add("selected-banner");
        image2.classList.remove("selected-banner");
        image3.classList.remove("selected-banner");
      } else if (images[i] === 1) {
        image2.classList.add("selected-banner");
        image1.classList.remove("selected-banner");
        image3.classList.remove("selected-banner");
      } else if (images[i] === 2) {
        image3.classList.add("selected-banner");
        image1.classList.remove("selected-banner");
        image2.classList.remove("selected-banner");
      }
      banner.setAttribute("style", `background-image:url(${images[i]})`);
    }
  }

  if (i < images.length - 1) {
    i++;
  } else {
    i = 0;
  }
  setTimeout("changeBannerImages();", 3000);
}
window.addEventListener("load", changeBannerImages);

getPosts();
getPostsCount();
