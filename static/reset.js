(function (window, document, undefined) {

  "use strict";

const resetPassword = document.getElementById("reset-password-submit-button");
const mailField = document.getElementById("reset-password-email");
const signForm = document.querySelector(".content-sign-in");

auth.useDeviceLanguage();

const resetPasswordFunction = () => {
  const email = mailField.value;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      document.getElementById("reset-password-sent-id").style.display = "block";
    })
    .catch(error => {
      signForm.querySelector(".register-error").innerHTML = error.message;
      document.getElementById("reset-password-sent-id").style.display = "none";
    });
};

resetPassword.addEventListener('click', resetPasswordFunction);

})(window, document);
