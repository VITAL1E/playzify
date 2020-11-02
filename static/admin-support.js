(function (window, document, undefined) {
  "use strict";

  let divMainSupportList = document.getElementById(
    "admin-support-problems-main-div-id"
  );

  let divSelectSupportStatus = document.getElementById("select-support-id");

  function getOnSelectSupportStatusChange() {
    let divSelectSupportStatusOption = divSelectSupportStatus.options[divSelectSupportStatus.selectedIndex].value;
    console.log(divSelectSupportStatusOption);
    return divSelectSupportStatusOption;
  }

  // POPUP
  let problemInformationPopup = document.getElementById(
    "admin-support-popup-id"
  );
  // POPUP INFORMATION
  let userPhotoPopup = document.getElementById("popup-user-photo-id");
  let usernamePopup = document.getElementById("popup-username-id");
  let emailPopup = document.getElementById("popup-email-id");
  let timeagoPopup = document.getElementById("popup-timeago-id");
  let descriptionPopup = document.getElementById("popup-description-id");
  // POPUP BUTTONS
  let acceptButton = document.getElementById("popup-solved-button");
  let cancelButton = document.getElementById("popup-cancel-button");

  let generalButton = document.getElementById("general-button");
  let adminsButton = document.getElementById("admins-button");
  let supportButton = document.getElementById("support-button");
  let sellerVerificationButton = document.getElementById(
    "seller-verifications-button"
  );
  let withdrawsButton = document.getElementById("withdraws-button");
  let usersButton = document.getElementById("users-button");
  let addCategoryButton = document.getElementById("add-category-button");
  let addSlideButton = document.getElementById("add-slide-button");
  let historyButton = document.getElementById("history");

  generalButton.addEventListener("click", function () {
    window.location.href = "admin.html";
  });

  adminsButton.addEventListener("click", function () {
    window.location.href = "admin(admins).html";
  });
  supportButton.addEventListener("click", function () {
    window.location.href = "admin(support).html";
  });
  sellerVerificationButton.addEventListener("click", function () {
    window.location.href = "admin(seller-verification).html";
  });
  withdrawsButton.addEventListener("click", function () {
    window.location.href = "admin(withdraw).html";
  });
  usersButton.addEventListener("click", function () {
    window.location.href = "admin(user).html";
  });
  addCategoryButton.addEventListener("click", function () {
    window.location.href = "admin(add-category).html";
  });
  addSlideButton.addEventListener("click", function () {
    window.location.href = "admin(add-slide).html";
  });
  historyButton.addEventListener("click", function() {
    window.location.href = "admin(history).html";
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //getProblems();
    } else {
      console.log("Not logged in and not admin");
    }
  });

  let problemsArray = [];
  const getProblems = async (status) => {
    let docs;
    let lastVisible;
    let problemsReference;

    if (status === "Unresolved" || status === "" || status === undefined) {
      problemsReference = firebase
      .firestore()
      .collection("problems")
      .where("status", "==", "Unresolved")
      .orderBy("createdAt");
    } else {
      problemsReference = firebase
      .firestore()
      .collection("problems")
      .where("status", "==", "Resolved")
      .orderBy("createdAt");
    }

    problemsArray = [];
    await problemsReference.get().then((snapshot) => {
      docs = snapshot;
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      console.log("last", lastVisible.data());
    });
    docs["docs"].forEach((doc) => {
      problemsArray.push(doc.data());
    });
    problemsArray.forEach((post) => {
      createProblem(post);
    });
    divSelectSupportStatus.addEventListener("change", function () {
      removeProblems();
      let selectFilter = getOnSelectSupportStatusChange();
      getProblems(selectFilter);
    });
  };

  function createProblem(problem) {
    let div = document.createElement("div");
    div.setAttribute("class", "request-support-admin-main-div");

    let divMainUserPhoto = document.createElement("div");
    divMainUserPhoto.setAttribute(
      "class",
      "request-support-user-photo-name-main-div"
    );

    let divUserPhoto = document.createElement("div");
    divUserPhoto.setAttribute(
      "class",
      "request-support-user-photo-name-main-div-1"
    );

    if (problem.userPhoto !== undefined || problem.userPhoto !== null) {
      let image = document.createElement("img");
      image.setAttribute(
        "style",
        "width: 29px; height: 29px; border-radius: 7px;"
      );
      image.setAttribute("src", problem.userPhoto);

      divUserPhoto.appendChild(image);
    }

    let divUserPhotoUsername = document.createElement("div");
    divUserPhotoUsername.setAttribute(
      "class",
      "request-support-user-photo-name-main-div-2"
    );
    divUserPhotoUsername.textContent = problem.user;

    let divMainProblem = document.createElement("div");
    divMainProblem.setAttribute("class", "support-content-problem-main-div");

    let divMainProblemTitle = document.createElement("div");
    divMainProblemTitle.setAttribute(
      "class",
      "support-content-problem-main-div-1"
    );
    divMainProblemTitle.textContent = problem.name;

    let divMainInformation = document.createElement("div");
    divMainInformation.setAttribute(
      "class",
      "general-support-request-information"
    );

    let divInformation = document.createElement("div");
    divInformation.setAttribute(
      "class",
      "general-support-request-information-1"
    );

    let divStatus = document.createElement("div");
    divStatus.setAttribute("class", "transaction-info-all-2");
    divStatus.textContent = "status:";

    let divStatusSpan = document.createElement("span");
    if (problem.status === "Resolved") {
      divStatusSpan.setAttribute("class", "transaction-info-all-span greeen-support-admin-status");
    } else {
      divStatusSpan.setAttribute(
        "class",
        "transaction-info-all-span rred-support-admin-status"
      );
    }
    divStatusSpan.textContent = problem.status;

    let divMainTime = document.createElement("div");
    divMainTime.setAttribute("class", "general-support-request-information-1");

    let divTime = document.createElement("div");
    divTime.setAttribute("class", "transaction-info-all-2");
    divTime.textContent = "time:";

    let divTimeSpan = document.createElement("span");
    divTimeSpan.setAttribute("class", "transaction-info-all-span");
    divTimeSpan.textContent = getTimeSince(problem.createdAt.seconds * 1000);

    divMainUserPhoto.appendChild(divUserPhoto);
    divMainUserPhoto.appendChild(divUserPhotoUsername);

    divMainProblem.appendChild(divMainProblemTitle);

    divStatus.appendChild(divStatusSpan);
    divInformation.appendChild(divStatus);

    divTime.appendChild(divTimeSpan);
    divMainTime.appendChild(divTime);

    divMainInformation.appendChild(divInformation);
    divMainInformation.appendChild(divMainTime);

    div.appendChild(divMainUserPhoto);
    div.appendChild(divMainProblem);
    div.appendChild(divMainInformation);

    div.addEventListener("click", function () {
      problemInformationPopup.style.display = "block";

      let image = document.createElement("img");
      image.setAttribute(
        "style",
        "width: 29px; height: 29px; border-radius: 7px;"
      );
      image.setAttribute("src", problem.userPhoto);
      userPhotoPopup.appendChild(image);

      usernamePopup.textContent = problem.user;
      emailPopup.textContent = problem.userEmail;
      descriptionPopup.textContent = problem.description;
      timeagoPopup.textContent = getTimeSince(problem.createdAt.seconds * 1000);

      acceptButton.addEventListener("click", function () {
        let problemReference = firebase
          .firestore()
          .collection("problems")
          .doc(problem.problemId)

          problemReference.set({
            status: "Resolved"
          }, { merge: true });

          problemInformationPopup.style.display = "none";  
      });

      cancelButton.addEventListener("click", function () {
        problemInformationPopup.style.display = "block";
      });
    });

    divMainSupportList.appendChild(div);
  }

  const removeProblems = () => {
    let elements = document.getElementsByClassName("request-support-admin-main-div");

    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }  
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

  getProblems();
})(window, document);
