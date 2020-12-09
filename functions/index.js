// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config({ path: 'functions/.env' });
// }
const { createMollieClient } = require("@mollie/api-client");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const firebase = require("firebase");
require("@firebase/firestore");
const cors = require("cors");
//admin.initializeApp();
firebase.initializeApp({
  apiKey: "AIzaSyDe6on4PQWSdDjCydOW67CkQliM_TD0WcY",
  authDomain: "zifiplay-e212f.firebaseapp.com",
  projectId: "zifiplay-e212f",
});

let database = firebase.firestore();
//admin.firestore().settings({ ignoreUndefinedProperties: true });
//const mollieSecretKey = process.env.MOLLIE_SECRET_KEY;
const mollieClient = createMollieClient({
  apiKey: "test_NDqEURQSdMmFQpQBn2dDGeJvSanM2u",
});
console.log(mollieClient);
const express = require("express");
const app = express();
app.use(cors());
//app.use(cors({ credentials: true, origin: true }));
// COMMENT
//app.options("*", cors({ origin: true }));
//app.set('view engine', 'html');
// app.use(express.static(__dirname + "/"));
app.use(express.static("../../project"));
app.use(express.json());
//app.use(express.static('../static'));
app.listen(3001);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://www.mollie.com/payscreen");
//   //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   // res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   // res.header("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
//   // res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Origin");
//    next();
// });
app.post("/payment", function (req, res) {
  const orderId = new Date().getTime();
  console.log("req.body" + req.body);
  console.log("req.method" + req.method);
  console.log("req.headers" + req.headers);

  mollieClient.payments
    .create({
      amount: {
        value: req.body.amount.amount,
        currency: req.body.amount.currency,
      },
      description: req.body.description,
      redirectUrl: `http://localhost:5500/project/order.html?id=${orderId}`,
      // redirectUrl: `https://zifiplay-e212f.web.app/order.html?id=${orderId}`
      webhookUrl:
        "https://us-central1-zifiplay-e212f.cloudfunctions.net/webhooks/",
      metadata: {
        orderId,
      },
    })
    .then((payment) => {
      // Forward the customer to the payment.getCheckoutUrl()
      console.log("checkout = " + payment.getCheckoutUrl());
      //res.redirect(payment.getCheckoutUrl());
      console.log("payment.getCheckoutUrl()" + payment.getCheckoutUrl());
      console.log("payment.getPaymentUrl()" + payment.getPaymentUrl());
      // undefined
      console.log("payment.customerId" + payment.customerId);
      // real ID we need
      console.log("payment.id" + payment.id);
      // set expired
      console.log("payment.isExpired " + payment.isExpired);
      console.log("payment.status " + payment.status);
      console.log("Order Id " + payment.metadata.orderId);
      //let orderIdString = orderId.toString();
      database.collection("orders").doc(orderId.toString()).set(
        {
          orderId,
          garanty: req.body.garanty,
          delivery: req.body.delivery,
          createdAt: new Date(),
          category: req.body.category,
          seller: req.body.seller,
          postId: req.body.postId,
          buyer: req.body.buyer,
          paymentId: payment.id,
          server: req.body.server,
          description: req.body.description,
          price: req.body.price,
          type: req.body.type,
          sellerProfilePhoto: req.body.sellerProfilePhoto,
          buyerProfilePhoto: req.body.buyerProfilePhoto,
          //status: "Paid",
        },
        { merge: true }
      );
      //return payment.getCheckoutUrl();
      //res.send(payment.getCheckoutUrl());
      // console.log(mollieClient.getCheckoutUrl);
      // console.log(mollieClient.redirect);
      // console.log(mollieClient.redirectUrl);
      res.send({
        redirectUrl: `${payment.getCheckoutUrl()}`,
      });
      // Comment this bullshit
      return payment.getCheckoutUrl();
    })
    .catch((error) => {
      // Handle the error
      console.log(error);
    });
});

// ADD ADMIN
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();
// exports.addSuperAdminRole = functions.https.onCall((data, context) => {
//   // get user and add custom claim (admin)
//   return admin.auth().getUserByEmail(data.email).then(user => {
//     return admin.auth().setCustomUserClaims(user.uid, {
//       superadmin: true,
//     });
//   }).then(() => {
//     return {
//       message: `Success ${data.email} has been made an super admin`
//     }
//   }).catch(err => {
//     return err;
//   });
// });

exports.webhooks = functions.https.onRequest(function (req, res) {
  mollieClient.payments
    .get(req.body.id)
    .then((payment) => {
      // if (payment.isPaid()) {
      //   console.log("Payment is Paid");
      //   // Hooray, you've received a payment! You can start shipping to the consumer.
      // } else if (payment.isExpired()) {
      //   console.log("Payment is expired");
      // } else if (payment.isPending()) {
      //   console.log("Payment is pending");
      // } else if (payment.isFailed()) {
      //   console.log("Payment is failed");
      // } else if (payment.isCanceled()) {
      //   console.log("Payment is canceled");
      // } else if (!payment.isOpen()) {
      //   console.log("Payment is aborted");
      //   // The payment isn't paid and has expired. We can assume it was aborted.
      // } else {
      console.log("Payment status " + payment.status);
      //}

      if (payment.isPaid()) {

        updateOrderStatus(req.body.id);

        //res.send(payment.status);
        return null;
      }
      return null;
    })
    .catch((error) => {
      res.send(error);
    });
  console.log("req.body " + req.body);
});

function updateOrderStatus(orderId) {
  firebase
  .firestore()
  .collection("orders")
  .where("paymentId", "==", orderId)
  .update({
    status: payment.status,
    history: {
      "seller accepted the order": new Date(),
    }
  })
  .then(function () {
    console.log("Success");
    return null;
  })
  .catch(function (error) {
    console.log("Error " + error);
  });
}

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const serviceAccount = require("./admin.json");
// const cors = require("cors");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://zifiplay-e212f.firebaseio.com",
// });
const isEmail = (email) => {
  const regEx = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  if (email.match(regEx)) return true;
  else return false;
};
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};
// baseurl.com/api/... functions.region("europe-west3").......
//exports.api = functions.region("europe-west3").https.onRequest(app);
