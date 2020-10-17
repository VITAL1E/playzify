let sendMessageButton = document.getElementById("send-message-id");
let addFileButton = document.getElementById("add-file-id");
let chatMessageText = document.querySelector(".chat-messenger-input");
let chatUnseenMessagesCount = document.querySelector("new-messages-bar");
let chatSellerProfilePictureHeader = document.querySelector("chat-profile-1");
//let chatSellerUsernameHeader = document.querySelector("nickname-name-header");
let chatSellerUsernameHistory = document.querySelector("chat-nickname-list");
let chatSellerConversationHistorySection = document.querySelectorAll("user-section-chat");
let chatSellerMessagesConversation = document.getElementById("chat-messages-main-div-id");
let chatSellerProfilePictureStartConversation = document.querySelector("profileimgchat");
let inputFile = document.getElementById("addImgLabel1");
let searchBar = document.getElementById("search-bar-chat-id");

let mainDivMessagesLeft = document.getElementById("first-message-div-id");
let divMessagesLeft = document.getElementById("firstmessages--main-div-id");

let div = document.createElement("div");
div.setAttribute("class", "messagee");
div.textContent = "Welcome to Zify";

let secmsg = document.getElementById("first-message-right-id-2");
let secondmessage = document.getElementById("firstmessages--main-div-id-2");

let divUser = document.createElement("div");
divUser.setAttribute("class", "messagee messagee-right");

mainDivMessagesLeft.appendChild(divMessagesLeft);
divMessagesLeft.appendChild(div);

// secmsg.appendChild(secondmessage);
// secondmessage.appendChild

// Chat list
let chatHistoryUsersList = document.getElementById("chat-part-1-list-id");
let chatMessagesPart2Header = document.getElementById("chat-part-2-user-lists-id");

let chatsArray = [];
let chatWithObject = {};

searchBar.addEventListener("keyup", (e) => {
  let searchString = e.target.value.toLowerCase();
  let filteredChats = chatsArray.filter(chat => {
    return chat.username.toLowerCase().includes(searchString);
  });
  console.log("Filtered chats " + filteredChats);
  removePosts();
  filteredChats.forEach((chat) => {
    createChatUser(chat);
  });
});

const removePosts = () => {
  let elements = document.getElementsByClassName("main-list-chat");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function createChatUser(userChats) {
  let chatMainListSectionUser = document.createElement("div");
  chatMainListSectionUser.setAttribute("class", "main-list-chat");

  if (chatsCollectionSize === 0) {
    // DISPALY
    let noMessagesText = document.createElement("div");
    noMessagesText.setAttribute("class", "no-messages-chat");
  } else {
    let chatEntireSectionUser = document.createElement("div");
    chatEntireSectionUser.setAttribute("class", "user-section-chat");

    let chatProfileImageUserPart1 = document.createElement("div");
    chatProfileImageUserPart1.setAttribute("class", "chat-profile-1");

    // Find in Storage URL for his profile picture
    let chatProfileImage = document.createElement("img");
    chatProfileImage.setAttribute("src", userChats.profilePhoto); 

    chatProfileImageUserPart1.appendChild(chatProfileImage);

    let chatSellerOnline = document.createElement("div");
    chatSellerOnline.setAttribute("class", "seller-is-online-for-chat");

    let chatUsernameMessageUserPart2 = document.createElement("div");
    chatUsernameMessageUserPart2.setAttribute("class", "section-2-2");

    let chatUsernameBold = document.createElement("p");
    chatUsernameBold.setAttribute("class", "chat-nickname-list");
    chatUsernameBold.textContent = `${userChats.username}`;

    let chatMessageLight = document.createElement("p");
    chatMessageLight.setAttribute("class", "chat-message-list");

    chatMessageLight.textContent = `${userChats.lastMessage}`;

    let arrowChat = document.createElement("span");
    arrowChat.setAttribute("class", "arrow-chat");

    // PAY ATTENTION
    let svg = document.createElement("svg");
    svg.setAttributeNS(null, "class", "feather feather-chevron-right chevron-for-chat");

    chatProfileImageUserPart1.appendChild(chatSellerOnline);
    chatUsernameMessageUserPart2.appendChild(chatUsernameBold);
    chatUsernameMessageUserPart2.appendChild(chatMessageLight);
    arrowChat.appendChild(svg);

    chatEntireSectionUser.appendChild(chatProfileImageUserPart1);
    chatEntireSectionUser.appendChild(chatUsernameMessageUserPart2);
    chatEntireSectionUser.appendChild(arrowChat);

    chatMainListSectionUser.appendChild(chatEntireSectionUser);
    chatHistoryUsersList.appendChild(chatMainListSectionUser);

    // console.log(userChats.username);
    // console.log(userChats.lastMessage);
    // console.log(userChats.lastUpdated);
    // console.log(userChats.profilePhoto);

    chatEntireSectionUser.addEventListener("click", function() {
      let chatMessagesProfilePicturePart2 = document.getElementById("chat-messages-user-photo-id");
      let chatMessagesUsernamePart2 = document.getElementById("nickname-name-header-id");
      let chatProfileImagePart2 = document.getElementById("profileimgchat-id");

      chatMessagesUsernamePart2.textContent = `${userChats.username}`;

      let chatProfilePicturePart2Img1 = document.createElement("img");
      chatProfilePicturePart2Img1.setAttribute("src", userChats.profilePhoto);
      chatMessagesProfilePicturePart2.appendChild(chatProfilePicturePart2Img1);

      let chatProfilePicturePart2Img2 = document.createElement("img");
      chatProfilePicturePart2Img2.setAttribute("src", userChats.profilePhoto);     
      chatProfileImagePart2.appendChild(chatProfilePicturePart2Img2);

      chatWithObject = {};
      chatWithObject.username = userChats.username;

      // LOAD MESSAGES
      async function loadMessages() {
        firebase.auth().onAuthStateChanged(async function (user) {
          if (user) {
              let messagesReference = firebase
              .firestore()
              .doc(`/chats/${user.displayName}`)
              .collection(`/chats/${userChats.username}/messages`)
              .orderBy("createdAt");
        
            let docs;
            let lastVisible;
              
            await messagesReference
              .get()
              .then(function (snapshot) {
                docs = snapshot;
                lastVisible = snapshot.docs[snapshot.docs.length - 1];
                //console.log("last", lastVisible.data().message);
        
                /////// WORKS
                // snapshot.forEach(function (doc) {
                //   const message = `<div class="messagee messagee-right">${doc.data().message}</div>`;
                //   secondmessage.innerHTML += message;
                // });
                //////

                snapshot.forEach(function (doc) {
                  console.log(doc.data().message);
                  if (doc.data().from === userChats.username || doc.data().to === user.displayName) {
                    const message = `<div class="messagee">${doc.data().message}</div>`;
                    divMessagesLeft.innerHTML += message;
                    // let divReceived = document.createElement("div");
                    //   divReceived.setAttribute("class", "messagee");
                    //   divReceived.textContent = `${doc.data().message}`;
                    //   console.log("Messages from other");
                  } else {
                    const message = `<div class="messagee messagee-right">${doc.data().message}</div>`;
                    secondmessage.innerHTML += message;
                    // console.log("Messages from me");
                    // console.log("Me " + user.displayName);
                    // console.log("Other " + userChats.username);
                  }
                });
              });
          } else {
            console.log("Not logged in");
          }
        });
      }
      loadMessages();

      // Messages only appended
      //chatMessagesPart2Header.appendChild();
    });
  }
}


// LOAD CHAT ROOMS
// let chatsCollectionSize;
// firebase.auth().onAuthStateChanged(function (user) {
//   let docs;
//   if (user) {
//     console.log("Username " + user.displayName);
//     firebase
//     .firestore()
//     .doc(`/chats/${user.displayName}`)
//     .collection("chats")
//     .get()
//     .then(function(querySnapshot) {
//       docs = querySnapshot;
//       chatsCollectionSize = querySnapshot.size;
//       console.log("Size " + chatsCollectionSize);
//       querySnapshot.forEach(function(doc) {
//         createChatUser(doc.data());
//     });
//     docs["docs"].forEach((doc) => {
//       console.log("Docs " + JSON.stringify(doc.data()));
//       //chatsArray.push(doc.data());
//     });
//   });
//   } else {
//     console.log("Not logged in chat");
//   }
// });



let chatsCollectionSize;

const getChatRooms = async () => {
  firebase.auth().onAuthStateChanged(async function (user) {
    let lastVisible;
    // Commented postsArray and put it above global
    // let chatsArray = [];
    let docs;
    let chatsReference;

    if (user) {
      chatsReference = firebase
        .firestore()
        .doc(`/chats/${user.displayName}`)
        .collection("chats")
        //.orderBy("lastUpdated");

        await chatsReference
        .get()
        .then((snapshot) => {
          docs = snapshot;
          chatsCollectionSize = snapshot.size;
          lastVisible = snapshot.docs[snapshot.docs.length - 1];
          // strange behavior
          console.log("last", lastVisible.data());
      });
      docs["docs"].forEach((doc) => {
        chatsArray.push(doc.data());
      });
      chatsArray.forEach((chat) => {
        createChatUser(chat);
      });
    } else {
      console.log("Not logged in");
    }
  });
}





//window.onload = toBottom;
function toBottom() {
  console.log("Scroll");
  chatSellerMessagesConversation.scroll(
    0,
    chatSellerMessagesConversation.scrollHeight
  );
  // const isScrolledToBottom =
  // chatSellerMessagesConversation.scrollHeight - chatSellerMessagesConversation.clientHeight <= chatSellerMessagesConversation.scrollTop + 1;
  // if (isScrolledToBottom) {
  //   chatSellerMessagesConversation.scrollTop = chatSellerMessagesConversation.scrollHeight - chatSellerMessagesConversation.clientHeight;
  // }
  //var xH = chatSellerMessagesConversation.scrollHeight;
  //chatSellerMessagesConversation.scrollTo(0, xH);
  //chatSellerMessagesConversation.scrollTop = chatSellerMessagesConversation.scrollHeight; //Set the scroll offset position to the height of the chat div
}

// PRESS ENTER SEND MESSAGE
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    chatMessageText.addEventListener(
      "keyup",
      async function (e) {
        if (e.keyCode === 13) {
          if (!chatMessageText.textContent.trim()) {
            window.alert("type message");
            return;
          }
          const chatReference = await firebase
            .firestore()
            .collection(`/chats/${user.displayName}/chats/${chatWithObject.username}/messages`)
            .add({
              message: chatMessageText.textContent,
              from: user.displayName,
              to: chatWithObject.username,
              createdAt: new Date().toISOString(),
            });

          firebase
            .firestore()
            .doc(`/chats/${user.displayName}/chats/${chatWithObject.username}`)
            .set({
              lastMessage: chatMessageText.textContent,
            }, { merge: true });

          // reference child_added on call updateMessage
          // collectionMessagesReference.onSnapshot(function (querySnapshot) {
          //   querySnapshot.docChanges().forEach(function (change) {
          //     console.log(change);
    
          //     const message = `<div class="messagee messagee-right">${change.doc.data().content}</div>`;
          //     secondmessage.innerHTML += message;
          //     if (change.type === "added") {
          //       console.log("new message " + change.doc.data());
          //       console.log(change.doc.data().content, change.doc.data().from);
          //     }
          //   })
          // }, function (error) {
          //   console.log(error);
          // });

          chatReference.onSnapshot(function (change) {
            console.log(change.data());
            const message = `<div class="messagee messagee-right">${
              change.data().message
            }</div>`;
            secondmessage.innerHTML += message;
    
            if (change.type === "added") {
              console.log("new message " + change.doc.data());
              console.log(change.doc.data().message, change.doc.data().from);
            }
          });
          chatMessageText.textContent = "";
        }
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    console.log("Not logged in");
  }
});

// CLICK SEND, SEND MESSAGE 
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    sendMessageButton.addEventListener(
      "click",
      async function () {
        if (!chatMessageText.textContent.trim()) {
          window.alert("type message");
          return;
        }
        const chatReference = await firebase
          .firestore()
          .collection(`/chats/${user.displayName}/chats/${chatWithObject.username}/messages`)
          .add({
            message: chatMessageText.textContent,
            to: chatWithObject.username,
            from: user.displayName,
            createdAt: new Date().toISOString(),
          });

          firebase
            .firestore()
            .doc(`/chats/${user.displayName}/chats/${chatWithObject.username}`)
            .set({
              lastMessage: chatMessageText.textContent,
            }, { merge: true });

        // reference child_added on call updateMessage
        // collectionMessagesReference.onSnapshot(function (querySnapshot) {
        //   querySnapshot.docChanges().forEach(function (change) {
        //     console.log(change);
    
        //     const message = `<div class="messagee messagee-right">${change.doc.data().content}</div>`;
        //     secondmessage.innerHTML += message;
        //     if (change.type === "added") {
        //       console.log("new message " + change.doc.data());
        //       console.log(change.doc.data().content, change.doc.data().from);
        //     }
        //   })
        // }, function (error) {
        //   console.log(error);
        // });

        chatReference.onSnapshot(function (change) {
          console.log(change.data());
          const message = `<div class="messagee messagee-right">${
            change.data().message
          }</div>`;
          secondmessage.innerHTML += message;
    
          if (change.type === "added") {
            console.log("new message " + change.doc.data());
            console.log(change.doc.data().message, change.doc.data().from);
          }
        });
        chatMessageText.textContent = "";
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    console.log("Not logged in");
  }
});

let numberOfImages = 0;
let imagesArray = [];

// SEND IMAGE MESSAGE
function addImageToForm(e) {
  let files = e.target.files;
  if (files.length > 1) {
    alert("You can only upload at most 1 files!");
    return;
  }
  numberOfImages += files.length;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", function (e) {
        console.log(this);

        let imageFile = e.target;

        const reference = firebase.storage().ref("chat_images/" + file.name);

        let divDocument = document.createElement("div");
        // let divDocumentClose = document.createElement("div");
        let image = document.createElement("img");

        divDocument.setAttribute("class", "messagee messagee-right chat-image-sent");
        // divDocumentClose.setAttribute("class", "id-document-close");
        divDocument.addEventListener("click", function () {
          divDocument.style.display = "none";
          numberOfImages--;
          const reference = firebase.storage().ref("chat_images/" + file.name);
          reference.delete();
          //.then(snapshot => snapshot.ref.getDownloadURL());
        });
        image.setAttribute("class", "image-preview");
        image.setAttribute("style", "width: inherit; height: inherit; border-radius: 20px;");
        image.setAttribute("src", imageFile.result);

        // divDocument.appendChild(divDocumentClose);
        divDocument.appendChild(image);
        secondmessage.appendChild(divDocument);
      });
      const reference = firebase.storage().ref("chat_images/" + file.name);
      reference
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          //console.log(url);
          imagesArray.push(url);
          //window.alert(url);
        });
      reader.readAsDataURL(file);
    } else {
      image.style.display = null;
    }
  }
}

inputFile.addEventListener("change", addImageToForm, false);

getChatRooms();