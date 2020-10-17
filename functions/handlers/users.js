// const { admin, db } = require('../util/admin');

// const config = require('../util/config');

// const firebase = require('firebase');
 
// firebase.initializeApp(config);

// const { validateSignupData, validateLoginData } = require('../util/validators');

// // sign user in
// exports.signup = (req, res) => {
//   const newUser = {
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword,
//     securityQuestion: req.body.securityQuestion,
//     securityAnswer: req.body.securityAnswer,
//   }; 

//   const { valid, errors } = validateSignupData(newUser);

//   if (!valid) 
//     return res.status(400).json(errors);

//   const noImage = 'no-image.png';

//   // validate data
//   let token;
//   let userId;
//   db.doc(`/users/${newUser.handle}`).get()
//     .then(doc => {
//       if (doc.exists) {
//         return res.status(400).json({ handle: 'this handle is taken' });
//       } else {
//         return firebase
//         .auth()
//         // chagne email with username
//         .createUserWithEmailAndPassword(newUser.email, newUser.password);        
//       }
//     })
//     .then(data => {
//       userId = data.user.uid;
//       return data.user.getIdToken();
//     })
//     .then(idToken => {
//       token = idToken;
//       const userCredentials = {
//         username: newUser.username,
//         email: newUser.email,
//         createdAt: new Date().toISOString(),
//         imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
//         userId
//       };
//       return db.doc(`/users/${newUser.username}`).set(userCredentials);
//     })
//     .then(data => {
//       return res.status(201).json({ token });
//     })
//     .catch(err => {
//       console.error(err);
//       if (err.code === 'auth/email-already-in-use') {
//         return res.status(400).json({ email: 'Email already in use' })
//       } else {
//         return res.status(500).json({ general: 'Something went wrong, try again' });
//       }
//     });
// };

// // log user in
// exports.login = (req, res) => {
//   const user = {
//     username: req.body.username,
//     password: req.body.password
//   };

//   const { valid, errors } = validateLoginData(user);

//   if (!valid) 
//     return res.status(400).json(errors);

//   // change email with username  
//   firebase.auth().signInWithEmailAndPassword(user.email, user.password)
//     .then(data => {
//       return data.user.getIdToken();
//     })
//     .then(token => {
//       return res.json({ token });
//     }) 
//     .catch(err => {
//       console.error(err);
//       // auth/wrong-password
//       // wrong credentials
//       return res.status(403).json({ general: 'wrong credentials' }); 
//     });
// };
