  // let form = document.getElementById("form-checkout-id");

  // // send profile id from backend

  // // form.addEventListener("click", function() {
  // //   console.log("yo");
  // // });

  // // form.addEventListener("submit", function() {
  // //   console.log("yo2");
  // // });
  
  // let mollie = Mollie("pfl_5Pu7dVgqfA", { locale: "en_EN", testmode: true });

  // let cardHolder = mollie.createComponent("cardHolder");
  // cardHolder.mount("#card-holder");

  // let cardNumber = mollie.createComponent("cardNumber");
  // cardNumber.mount("#card-number");

  // let expiryDate = mollie.createComponent("expiryDate");
  // expiryDate.mount("#expiry-date");

  // let verificationCode = mollie.createComponent("verificationCode");
  // verificationCode.mount("#verification-code");

  // var cardNumberError = document.querySelector("#card-number-error");

  // cardNumber.addEventListener("change", (event) => {
  //   if (event.error && event.touched) {
  //     cardNumberError.textContent = event.error;
  //   } else {
  //     cardNumberError.textContent = "";
  //   }
  // });

  // form.addEventListener("submit", async (e) => {
  //   console.log("pay click");
  //   e.preventDefault();

  //   const { token, error } = await mollie.createToken();

  //   if (error) {
  //     // Something wrong happened while creating the token. Handle this situation gracefully.
  //     return;
  //   }

  //   // Add token to the form
  //   const tokenInput = document.createElement("input");
  //   tokenInput.setAttribute("type", "hidden");
  //   tokenInput.setAttribute("name", "cardToken");
  //   tokenInput.setAttribute("value", token);

  //   console.log("TOken " + token);
  //   console.log("Token input " + tokenInput);

  //   form.appendChild(tokenInput);

  //   mollie.payments.create({
  //     amount: {
  //       value: '10.00',
  //       currency: 'EUR'
  //     },
  //     description: 'My first API payment',
  //     redirectUrl: 'https://yourwebshop.example.org/order/123456',
  //     webhookUrl:  'https://yourwebshop.example.org/webhook'
  //   })
  //     .then(payment => {
  //       // Forward the customer to the payment.getCheckoutUrl()
  //     })
  //     .catch(error => {
  //       // Handle the error
  //     });

  //   // fetch("/payments", {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //     "Accept": "application/json"
  //   //   },
  //   //   body: JSON.stringify({
  //   //     tokenId: token.id,
  //   //     // IDK send item to server?
  //   //     item: item
  //   //   })
  //   // });

  //   // Submit form to the server
  //   form.submit();
  // });
