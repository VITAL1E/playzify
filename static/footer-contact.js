firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("contact-logged-in-header-id").style.display = "block";
    document.getElementById("contact-not-logged-in-header-id").style.display = "none";
  } else {
    document.getElementById("contact-not-logged-in-header-id").style.display = "block";
    document.getElementById("contact-logged-in-header-id").style.display = "none";
  }
});