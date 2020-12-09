firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("privacy-logged-in-header-id").style.display = "block";
    document.getElementById("privacy-not-logged-in-header-id").style.display = "none";
  } else {
    document.getElementById("privacy-not-logged-in-header-id").style.display = "block";
    document.getElementById("privacy-logged-in-header-id").style.display = "none";
  }
});