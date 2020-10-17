let nickname = document.getElementById("user-nickname-id");

let sellingButton = document.getElementById("selling-button-id");
let aboutButton = document.getElementById("about-button-id");
// What user is selling
let textSelling = document.getElementById("selling-text-id")
// Description of user
let textAbout = document.getElementById("about-text-id");

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     nickname.textContent = user.displayName;
//   } else {
//     console.log("Not logged in");
//   }
// });

sellingButton.addEventListener("click", () => {
  console.log("Click selling");
  aboutButton.classList.remove("switch-1-selected");
  sellingButton.classList.add("switch-1-selected");
  textAbout.style.display = "none";
  textSelling.style.display = "block";
});

aboutButton.addEventListener("click", () => {
  console.log("Click selling");
  sellingButton.classList.remove("switch-1-selected");
  aboutButton.classList.add("switch-1-selected");
  textAbout.style.display = "block";
  textSelling.style.display = "none";
});