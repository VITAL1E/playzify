firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("terms-logged-in-header-id").style.display = "block";
    document.getElementById("terms-not-logged-in-header-id").style.display = "none";
  } else {
    document.getElementById("terms-not-logged-in-header-id").style.display = "block";
    document.getElementById("terms-logged-in-header-id").style.display = "none";
  }
});