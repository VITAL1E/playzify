// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config({ path: 'functions/.env' });
// }

const { createMollieClient } = require("@mollie/api-client");
const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors");

let ID_OF_PAYMENT;

//const mollieSecretKey = process.env.MOLLIE_SECRET_KEY;

const mollieClient = createMollieClient({
  apiKey: "test_NDqEURQSdMmFQpQBn2dDGeJvSanM2u",
});

console.log(mollieClient);
// console.log(mollieClient.getCheckoutUrl);
// console.log(mollieClient.redirect);
// console.log(mollieClient.redirectUrl);
// console.log(mollieClient.payments.PaymentsResource.httpClient.request);
// console.log(mollieClient.payments.PaymentsResource.httpClient.getUri);
// console.log(mollieClient.payments.PaymentsResource.httpClient.defaults);
// console.log(mollieClient.payments.PaymentsResource.httpClient.interceptors);

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

app.listen(3000);

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
  console.log(req.body);
  console.log(req.method);
  console.log(req.headers);

  mollieClient.payments
    .create({
      amount: {
        value: req.body.amount.amount,
        currency: req.body.amount.currency,
      },
      description: req.body.description,
      // redirectUrl: 'https://yourwebshop.example.org/order/123456', // notification page
      redirectUrl: "https://google.com", // give some random ID // notification page
      webhookUrl:
        "https://us-central1-zifiplay-e212f.cloudfunctions.net/webhook",
    })
    .then((payment) => {
      // Forward the customer to the payment.getCheckoutUrl()
      console.log("checkout = " + payment.getCheckoutUrl());
      //res.redirect(payment.getCheckoutUrl());
      console.log(payment.getCheckoutUrl());
      console.log(payment.getPaymentUrl());
      // undefined
      console.log(payment.customerId);
      // real ID we need
      ID_OF_PAYMENT = payment.id;
      console.log(payment.id);
      // set expired
      console.log(payment.isExpired);
      console.log(payment);

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

app.get(`payments/${ID_OF_PAYMENT}`, function (req, res) {
  mollieClient.payments
    .get(payment.id)
    .then((payment) => {
      // E.g. check if the payment.isPaid()
      console.log(payment);
      return payment;
    })
    .catch((error) => {
      console.log(error);
    });
});

// mollieClient.payments.get(payment.id)
//   .then(payment => {
//     // E.g. check if the payment.isPaid()
//   })
//   .catch(error => {
//     // Handle the error
//   });

// app.post("payments/webhook", function(req, res) {
//   console.log(req.params);
//   console.log(req.params.id);
//console.log(req.params.id.status);

// switch (req.params.id) {
//   case "paid":

//     break;
//   case "expired":
//     break;
//   case "failed":
//     break;
//   case "canceled":
//     break;
//}
//});

exports.webhook = functions.https.onRequest(function (req, res) {
  // let url = 'https://api.mollie.com/v2/payments/tr_V86jsf3a9f';

  // axios({
  //   method: "GET",
  //   url
  // })
  // .then(function (response) {
  //   console.log(response);
  //   console.log("axios callback");

  //   res.send(JSON.stringify(response));
  //   return response;
  // })
  // .catch(function (error) {
  //   console.log("Error webhook");
  //   console.error(error);
  // });

  // console.log(req.params);
  // console.log(req.params.id);
  // res.send("Hello from Webhook");

  (async () => {
    try {
      const payment = await mollieClient.payments.get("tr_V86jsf3a9f");

      // Check if payment is paid
      const isPaid = payment.isPaid();

      if (isPaid) {
        console.log("Payment is paid");
      } else {
        console.log(
          `Payment is not paid, but instead it is: ${payment.status}`
        );
      }
    } catch (error) {
      console.warn(error);
    }
  })();
});

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const serviceAccount = require("./admin.json");
// const cors = require("cors");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://zifiplay-e212f.firebaseio.com",
// });
// const app = require("express")();

// COMMENT
// const FBAuth = require('./util/fbAuth');
// const { db } = require('./util/admin');
// COMMENT

//app.use(cors({ origin: true }));
// COMMENT
//app.options("*", cors({ origin: true }));
// COMMENT

// const config = {
//   apiKey: "AIzaSyDe6on4PQWSdDjCydOW67CkQliM_TD0WcY",
//   authDomain: "zifiplay-e212f.firebaseapp.com",
//   databaseURL: "https://zifiplay-e212f.firebaseio.com",
//   projectId: "zifiplay-e212f",
//   storageBucket: "zifiplay-e212f.appspot.com",
//   messagingSenderId: "501773405576",
//   appId: "1:501773405576:web:5779e441f126727987fe3d",
//   measurementId: "G-Q7HLDYW2YV",
// };

// const firebase = require("firebase");
// firebase.initializeApp(config);

// const db = firebase.firestore();
//const db = admin.firestore();

// app.get("/games", (req, res) => {
//   db.collection("games")
//     .get()
//     .then((data) => {
//       let games = [];
//       data.forEach((doc) => {
//         games.push(doc.data());
//       });
//       return res.json(games);
//     })
//     .catch((err) => console.error(err));
// });

// app.post("/game", (req, res) => {
//   const newGame = {
//     category: req.body.category,
//     delivery: req.body.delivery,
//     description: req.body.description,
//     garanty: req.body.garanty,
//     price: req.body.price,
//     server: req.body.server,
//     title: req.body.title,
//     type: req.body.type,
//     createdAt: admin.firestore.Timestamp.fromDate(new Date()),
//   };
//   db.collection("games")
//     .add(newGame)
//     .then((doc) => {
//       return res.json({ message: `game ${doc.id} created successfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Something went wrong" });
//       console.error(err);
//     });
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

// app.post("/signup", (req, res) => {
//   const newUser = {
//     username: req.body.username,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword,
//     email: req.body.email,
//     securityQuestion: req.body.securityQuestion,
//     securityAnswer: req.body.securityAnswer,
//   };

//   let errors = {};

//   if (isEmpty(newUser.email)) {
//     errors.email = "Must not be empty";
//   } else if (!isEmail(newUser.email)) {
//     errors.email = "Must be valid";
//   }

//   if (isEmpty(newUser.password)) errors.password = "Must not be empty";
//   if (newUser.password !== newUser.confirmPassword)
//     errors.confirmPassword = "Passwords must match";
//   if (isEmpty(newUser.username)) errors.username = "Must not be empty";

//   if (Object.keys(errors).length > 0) return res.status(400).json(errors);

//   let token;
//   let userId;
//   db.doc(`/users/${newUser.username}`)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         return res
//           .status(400)
//           .json({ username: "This username is already taken" });
//       } else {
//         return firebase
//           .auth()
//           .createUserWithEmailAndPassword(newUser.email, newUser.password);
//       }
//     })
//     .then((data) => {
//       userId = data.user.uid;
//       return data.user.getIdToken();
//     })
//     .then((idToken) => {
//       token = idToken;
//       const userCredentials = {
//         username: newUser.username,
//         email: newUser.email,
//         securityQuestion: newUser.securityQuestion,
//         securityAnswer: newUser.securityAnswer,
//         createdAt: new Date().toISOString(),
//         userId,
//       };
//       return db.doc(`/users/${newUser.username}`).set(userCredentials);
//     })
//     .then(() => {
//       return res.status(201).json({ token });
//     })
//     .catch((err) => {
//       if (err.code === "auth/email-already-in-use") {
//         res
//           .status(400)
//           .json({
//             email: "The email address is already in use by another account",
//           });
//       } else {
//         console.log(err);
//         return res.status(500).json({ error: err.code });
//       }
//     });

// --- COMMENT ---
// TOKEN
// const uid = "email";
// async setupHeaders () {
//   const auth = admin.auth();
//   const custom = await auth.createCustomToken(uid);
//   const token = await refreshedToken(custom);
// }

// admin
//   .auth()
//   .createCustomToken(uid)
//   .then((customToken) => console.log(customToken))
//   .catch((error) => console.log("Error: ", error));

// firebase
//   .auth()
//   .signInWithCustomToken(customToken)
//   .catch(function (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ...
//   });
// --- COMMENT ---
//});

// UNCOMMENT
// app.post("/login", (req, res) => {
//   const user = {
//     username: req.body.username,
//     password: req.body.password,
//   };
//   let errors = {};

//   if (isEmpty(user.password)) errors.password = "Must not be empty";
//   if (isEmpty(user.username)) errors.password = "Must not be empty";

//   if (Object.keys(errors).length > 0) return res.status(400).json(errors);

//   let email;
//   db.doc(`/users/${user.username}`)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         email = doc.data().email;
//         return firebase
//           .auth()
//           .signInWithEmailAndPassword(email, user.password)
//           .then((data) => {
//             return data.user.getIdToken();
//           })
//           .then((token) => {
//             return res.json({ token });
//           })
//           .catch((err) => {
//             console.error(err);
//             if (err.code === "auth/wrong-password") {
//               return res
//                 .status(403)
//                 .json({ general: "Wrong credentials, please try again" });
//             } else {
//               return res.status(500).json({ error: err.code });
//             }
//           });
//       } else {
//         return res
//           .status(403)
//           .json({ general: "Wrong credentials, please try again" });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

// baseurl.com/api/... functions.region("europe-west3").......
//exports.api = functions.region("europe-west3").https.onRequest(app);
