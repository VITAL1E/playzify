let searchBarIndex = document.getElementById("search-bar-index-id");
let countOfItems = document.getElementById("count-of-items-index-id");
let filterButtonIndex = document.getElementsByClassName("filter-icon");
let filterPopupIndex = document.getElementById("filter-index-id");
let showMoreButtonIndex = document.querySelector(".show-more"); // ???
let cancelButtonIndex = document.getElementById("cancel-index-id");
let applyButtonIndex = document.getElementById("apply-index-id");
let removeFilterIndex = document.getElementById("remove-filter-id");
let postsArrayIndex = [];

if (searchBarIndex) {
  searchBarIndex.addEventListener("keyup", (e) => {
    let searchString = e.target.value.toLowerCase();
    let filteredGames = postsArrayIndex.filter((game) => {
      return (
        game.title.toLowerCase().includes(searchString) ||
        game.description.toLowerCase().includes(searchString)
      );
    });
    console.log(filteredGames);
    removePostsIndex();
    countOfItems.textContent = "Items: " + filteredGames.length;
    console.log(filteredGames.length);
    filteredGames.forEach((post) => {
      createPostIndex(post);
    });
  });
}

Array.from(filterButtonIndex).forEach((e) =>
  e.addEventListener("click", function () {
    filterPopupIndex.style.display = "block";
  })
);

let gameCollectionIndex = document.getElementById("product-list-home-index-id");

function createPostIndex(post) {
  let div = document.createElement("div");
  div.setAttribute("class", "product-home-show");

  let divSellerRoundImage = document.createElement("div");
  divSellerRoundImage.setAttribute("class", "seller-round-image");
  divSellerRoundImage.setAttribute("style", "background-size: cover;");

  // let image = document.createElement("img");
  // image.setAttribute("src", post.sellerPhoto);
  //divSellerRoundImage.appendChild(image);

  if (post.sellerPhoto !== null) {
    divSellerRoundImage.setAttribute("style", `background:url(${post.sellerPhoto}); background-size:cover;`);
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

  divSellerName.appendChild(divVerified);
  divProductDescription.appendChild(divProductDescriptionMiniSign);

  divProductPriceSVG.appendChild(divProductPricePolyline);
  divProductPriceArrow.appendChild(divProductPriceSVG);
  divProductPrice.appendChild(divProductPriceArrow);

  div.appendChild(divSellerRoundImage);
  div.appendChild(divSellerName);
  div.appendChild(divProductDescription);
  div.appendChild(divProductName);
  div.appendChild(divProductPrice);

  gameCollectionIndex.appendChild(div);

  div.addEventListener("click", function () {
    window.location.href = `post.html?id=${post.postId}`;
  });
}

const getPostsIndex = async () => {
  let docs;
  let lastVisible;
  let postsReference = firebase
    .firestore()
    .collection("games")
    .orderBy("createdAt", "desc");

  await postsReference.get().then((snapshot) => {
    docs = snapshot;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    postsArrayIndex.push(doc.data());
  });

  postsArrayIndex.forEach((post) => {
    createPostIndex(post);
  });
};

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

const removePostsIndex = () => {
  let elements = document.getElementsByClassName("product-home-show");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

applyButtonIndex.addEventListener("click", async () => {
  removePostsIndex();
  let docs;
  let postsSize;
  let lastVisible;
  let gameTypeOption = onSelectChangeGameTypeFilter();
  let gameServerOption = onSelectChangeGameServerFilter();
  let gamePriceOption = onSelectChangeGamePriceFilter();

  let filterQuery = firebase
    .firestore()
    .collection("games")
    .orderBy("createdAt")
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
    let filteredPostsArrayIndex = [];
    docs = querySnapshot;
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    console.log("last", lastVisible);

    querySnapshot.forEach(function (doc) {
      console.log(doc.id, " => ", doc.data());
    });

    docs["docs"].forEach((doc) => {
      filteredPostsArrayIndex.push(doc.data());
    });

    filteredPostsArrayIndex.forEach((post) => {
      createPostIndex(post);
    });
  });

  const paginateIndex = async () => {
    let docs;
    let postsReferencePagination = filterQuery.startAfter(lastVisible).limit(8);
    console.log(filterQuery);

    await postsReferencePagination.get().then((querySnapshot) => {
      docs = querySnapshot;
      console.log(docs);
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    });

    docs["docs"].forEach((doc) => {
      createPostIndex(doc.data());
      postsSize++;
    });

    if (postsSize >= size) {
      showMoreButtonIndex.style.display = "none";
    }
  };

  if (showMoreButtonIndex != null) {
    showMoreButtonIndex.addEventListener("click", () => {
      paginateIndex();
    });
  }

  filterPopupIndex.style.display = "none";
});

cancelButtonIndex.addEventListener("click", function () {
  filterPopupIndex.style.display = "none";
});

function getPostsCountIndex() {
  firebase
    .firestore()
    .collection("games")
    .get()
    .then((snap) => {
      let size = snap.size;

      console.log(snap.size);

      countOfItems.innerHTML += size;
    });
}

getPostsIndex();
getPostsCountIndex();
