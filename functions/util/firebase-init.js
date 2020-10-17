// const firebase = require("firebase/app");
// const auth = require("firebase/auth");

// const config = {
//   apiKey: "AIzaSyDe6on4PQWSdDjCydOW67CkQliM_TD0WcY",
//   authDomain: "zifiplay-e212f.firebaseapp.com",
//   databaseURL: "https://zifiplay-e212f.firebaseio.com",
//   projectId: "zifiplay-e212f",
//   storageBucket: "zifiplay-e212f.appspot.com",
//   messagingSenderId: "501773405576",
//   appId: "1:501773405576:web:5779e441f126727987fe3d",
//   measurementId: "G-Q7HLDYW2YV"
// };

// firebase.initializeApp(config);

// module.exports = refreshToken = async (token) => {
//   try {
//     const firebaseToken = await firebase.auth().signInWithCustomToken(token);
//     return firebaseToken.user.getIdToken();
//   } catch (error) {
//     console.log(error);
//   }
// }