(function (window, document, undefined) {

  "use strict";

let generalButton = document.getElementById("general-button")
let adminsButton = document.getElementById("admins-button");
let supportButton = document.getElementById("support-button");
let sellerVerificationButton = document.getElementById("seller-verifications-button");
let withdrawsButton = document.getElementById("withdraws-button");
let usersButton = document.getElementById("users-button");
let addCategoryButton = document.getElementById("add-category-button");
let addSlideButton = document.getElementById("add-slide-button");

let username;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    let usernameVerification = firebase.auth().currentUser.displayName;
    username = usernameVerification;
    console.log(usernameVerification);
    console.log("signed");
  } else {
    // No user is signed in.
    console.log("Not signed");
  }
});

generalButton.addEventListener("click", function() {
  window.location.href = "admin.html";
});

adminsButton.addEventListener("click", function() {
  window.location.href = "admin(admins).html";
});
supportButton.addEventListener("click", function() {
  window.location.href = "admin(support).html";
});
sellerVerificationButton.addEventListener("click", function() {
  window.location.href = "admin(seller-verification).html";
});
withdrawsButton.addEventListener("click", function() {
  window.location.href = "admin(withdraw).html";
});
usersButton.addEventListener("click", function() {
  window.location.href = "admin(user).html";
});
addCategoryButton.addEventListener("click", function() {
  window.location.href = "admin(add-category).html";
});
addSlideButton.addEventListener("click", function() {
  window.location.href = "admin(add-slide).html";
});

let verificationRequestsDivs = document.getElementsByClassName("transaction cc-cursor");
let verificationRequestsDivsPopup = document.getElementById("modal-general-popup-id");
let rowOfIdDocuments = document.getElementById("row-of-documents-id");
let postalCode = document.getElementById("postal-code-id");
let street = document.getElementById("street-id");
let city = document.getElementById("city-id");
let country = document.getElementById("country-id");
let monthBirthday = document.getElementById("month-birthday-id");
let dayBirthday = document.getElementById("day-birthday-id");
let yearBirthday = document.getElementById("year-birthday-id");
let nameSurname = document.getElementById("name-surname-id");
let sellerUsername = document.getElementById("seller-name-id");
let sellerPicture = document.getElementById("seller-picture-id");

let verifyButton = document.getElementById("verify-button-id");
let refuseButton = document.getElementById("refuse-button-id");
let cancelButton = document.getElementById("cancel-button-id");

function createVerificationRequest(verification) {
  let divVerifications = document.getElementById("verifications-array-id");

  let div = document.createElement("div");
  div.setAttribute("class", "transaction cc-cursor");

  let transactionSign = document.createElement("div");

  let transactionInfo = document.createElement("div");
  transactionInfo.setAttribute("class", "transaction-info-all admin-verification-change");
  transactionInfo.setAttribute("style", "padding-left: 0; border: 0;");

  let transactionStatus = document.createElement("div");
  transactionStatus.setAttribute("class", "transaction-info-all-2");

  transactionStatus.textContent = "status: ";

  let transactionProgress = document.createElement("span");
  transactionProgress.setAttribute("class", "transaction-info-all-span");

  //transactionProgress.textContent = verification.status;

  switch (verification.status) {
    case "Pending":
      transactionSign.setAttribute("class", "transaction-sign");
      transactionProgress.textContent = verification.status;
      break;
    case "Refused":
      transactionSign.setAttribute("class", "transaction-sign transaction-sign-minus");
      transactionProgress.textContent = verification.status;
      break;
    case "Accepted":
      transactionSign.setAttribute("class", "transaction-sign transaction-sign-check");
      transactionProgress.textContent = verification.status;
      break;
  }

  let transactionInfoFrom = document.createElement("div");
  transactionInfoFrom.setAttribute("class", "transaction-info-all admin-verification-change");

  let transactionInfoFormUsername = document.createElement("div");
  transactionInfoFormUsername.setAttribute("class", "transaction-info-all-2");

  transactionInfoFormUsername.textContent = "from: ";

  let transactionInfoFormUsernameSpan = document.createElement("span");
  transactionInfoFormUsernameSpan.setAttribute("class", "transaction-info-all-span");

  // Change FIRST NAME to USERNAME IMPORTANT
  transactionInfoFormUsernameSpan.textContent = verification.username;

  let transactionInfoTime = document.createElement("div");
  transactionInfoTime.setAttribute("class","transaction-info-all admin-verification-change");

  let transactionInfoTimeDate = document.createElement("div");
  transactionInfoTimeDate.setAttribute("class", "transaction-info-all-2");

  transactionInfoTimeDate.textContent = "time: ";

  let transactionInfoTimeSpan = document.createElement("span");
  transactionInfoTimeSpan.setAttribute("class", "transaction-info-all-span");

  transactionInfoTimeSpan.textContent = getTimeSince(verification.createdAt.toDate());

  transactionStatus.appendChild(transactionProgress);
  transactionInfo.appendChild(transactionStatus);
  div.appendChild(transactionSign);
  div.appendChild(transactionInfo);

  transactionInfoFormUsername.appendChild(transactionInfoFormUsernameSpan);
  transactionInfoFrom.appendChild(transactionInfoFormUsername);
  div.appendChild(transactionInfoFrom);

  transactionInfoTimeDate.appendChild(transactionInfoTimeSpan);
  transactionInfoTime.appendChild(transactionInfoTimeDate);
  div.appendChild(transactionInfoTime);

  divVerifications.appendChild(div);

  div.addEventListener("click", function() {
    verificationRequestsDivsPopup.style.display = "block";

    sellerUsername.textContent = verification.username;
    nameSurname.textContent = verification.name + " " + verification.surname;
    monthBirthday.textContent = verification.month;
    dayBirthday.textContent = verification.day;
    yearBirthday.textContent = verification.year;
    country.textContent = verification.country;
    city.textContent = verification.city;
    street.textContent = verification.address;
    postalCode.textContent = verification.postalCode;
    // sellerPicture - maybe select class and chenge its background from CSS ???
    // rowOfIdDocuments
    
    //////////////
    if (verification.images) {
      for (let i = 0; i < verification.images.length; i++) {
        let divDocument = document.createElement("div");
        let image = document.createElement("img");
    
        divDocument.setAttribute("class", "id-document id-document-2");
    
        image.setAttribute("class", "image-preview");
        image.setAttribute("style","width: inherit; height: inherit; border-radius: 20px;");
        image.setAttribute("src", verification.images[i]);
    
        divDocument.appendChild(image);
        rowOfIdDocuments.appendChild(divDocument);
      }
    }
    ////////////

    cancelButton.addEventListener("click", function() {
      verificationRequestsDivsPopup.style.display = "none";   
    });

    // TEST this at last requests maybe alterts to every item from collection
    refuseButton.addEventListener("click", function() {
      window.alert("Request refused");
      let userReference = firebase
      .firestore()
      .doc(`verifications/${verification.username}`);

      userReference.set({
        status: "Refused",
        isVerified: false
      }, { merge: true });

      transactionSign.setAttribute("class", "transaction-sign transaction-sign-minus");

      // send message to that user 
      // add to notifications collection 
      verificationRequestsDivsPopup.style.display = "none";  
    })

    verifyButton.addEventListener("click", function() {
      window.alert(verification.username);
      let userReference = firebase
      .firestore()
      .doc(`verifications/${verification.username}`);

      userReference.set({
        status: "Accepted",
        isVerified: true
      }, { merge: true });

      transactionSign.setAttribute("class", "transaction-sign transaction-sign-check");
      // isVerified: true
      verificationRequestsDivsPopup.style.display = "none";   
    })
  });
}

let verificationsArray = [];

let timeOfVerificationFromPrototype;
let timeOfVerification;

const getVerifications = async () => {
  let lastVisible;
  let docs;

  let verificationsReference = firebase
    .firestore()
    .collection("verifications")
    .orderBy("createdAt");

  await verificationsReference.get().then((snapshot) => {
    docs = snapshot;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    // strange behavior
    console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    verificationsArray.push(doc.data());
  });

  verificationsArray.forEach((verification) => {
    createVerificationRequest(verification);
    console.log(verification);
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

getVerifications();

})(window, document);

