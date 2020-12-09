let sendMessageButton = document.getElementById("send-message-id");
let addFileButton = document.getElementById("add-file-id");
let chatMessageText = document.querySelector(".chat-messenger-input");
let chatUnseenMessagesCount = document.querySelector("new-messages-bar");
let chatSellerProfilePictureHeader = document.querySelector("chat-profile-1");
let chatSellerUsernameHistory = document.querySelector("chat-nickname-list");
let chatSellerConversationHistorySection = document.querySelectorAll(
  "user-section-chat"
);
let chatSellerMessagesConversation = document.getElementById(
  "chat-messages-main-div-id"
);
let chatSellerProfilePictureStartConversation = document.querySelector(
  "profileimgchat"
);
let inputFile = document.getElementById("addImgLabel1");
let searchBar = document.getElementById("search-bar-chat-id");

let noMessages = document.getElementById("no-messages-chat-id");

let chatImageView = document.getElementById("chat-img-view-id");
let chatImageViewSrc = document.getElementById("chat-img-src-id");
let closeImagePreview = document.getElementsByClassName("close-img");

//let chatBottomSendMessage = document.getElementById("chat-bottom-send-message");

let mainDivMessagesLeft = document.getElementById("first-message-div-id");
let divMessagesLeft = document.getElementById("firstmessages--main-div-id");

let div = document.createElement("div");
// div.setAttribute("class", "messagee");
// div.textContent = "Welcome to Zify";

// let secmsg = document.getElementById("first-message-right-id-2");
// let secondmessage = document.getElementById("firstmessages--main-div-id-2");

// let divUser = document.createElement("div");
// divUser.setAttribute("class", "messagee messagee-right");

// mainDivMessagesLeft.appendChild(divMessagesLeft);
// divMessagesLeft.appendChild(div);

// secmsg.appendChild(secondmessage);
// secondmessage.appendChild

// Chat list
let chatHistoryUsersList = document.getElementById("chat-part-1-list-id");
let chatMessagesPart2Header = document.getElementById(
  "chat-part-2-user-lists-id"
);

let chatsArray = [];
let chatWithObject = {};

const url = new URL(window.location.href);
let userId = url.searchParams.get("id");

searchBar.addEventListener("keyup", (e) => {
  console.log("Chatsarray " + JSON.stringify(chatsArray));
  let searchString = e.target.value.toLowerCase();
  let filteredChats = chatsArray.filter((chat) => {
    return chat.username.toLowerCase().includes(searchString);
  });
  console.log("Filtered chats " + filteredChats);
  removeChats();
  filteredChats.forEach((chat) => {
    createChatUser(chat);
  });
});

Array.from(closeImagePreview).forEach((button) => {
  button.addEventListener("click", () => {
    chatImageView.style.display = "none";
  });
});

const removeChats = () => {
  let elements = document.getElementsByClassName("user-section-chat");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeMessages = () => {
  chatSellerMessagesConversation.innerHTML = "";
  // let elementsSent = document.getElementsByClassName("messagee");
  // let elementsReceived = document.getElementsByClassName("messagee messagee-right");

  // while (elementsSent[0] && elementsReceived[0]) {
  //   elementsSent[0].parentNode.removeChild(elementsSent[0]);
  //   elementsReceived[0].parentNode.removeChild(elementsReceived[0]);
  // }
};

function createChatUser(userChats) {
  if (chatsCollectionSize === 0) {
    // DISPALY
    let noMessagesText = document.createElement("div");
    noMessagesText.setAttribute("class", "no-messages-chat");

    chatHistoryUsersList.appendChild(noMessagesText);
  } else {
    let chatEntireSectionUser = document.createElement("div");
    chatEntireSectionUser.setAttribute("class", "user-section-chat");
    chatEntireSectionUser.setAttribute("id", userChats.userchatId);

    let chatProfileImageUserPart1 = document.createElement("div");
    chatProfileImageUserPart1.setAttribute("class", "chat-profile-1");

    if (userChats.userPhoto !== null) {
      chatProfileImageUserPart1.setAttribute(
        "style",
        `background:url(${userChats.userPhoto}); background-size:cover;`
      );
    }

    // let chatSellerOnline = document.createElement("div");
    // chatSellerOnline.setAttribute("class", "seller-is-online-for-chat");

    let chatUsernameMessageUserPart2 = document.createElement("div");
    chatUsernameMessageUserPart2.setAttribute("class", "section-2-2");

    let chatUsernameBold = document.createElement("p");
    chatUsernameBold.setAttribute("class", "chat-nickname-list");
    chatUsernameBold.textContent = `${userChats.username}`;

    let blueDot = document.createElement("span");
    blueDot.setAttribute("class", "blue-dott");

    if (userChats.seen === true) {
      blueDot.setAttribute("style", "display:none;");
    } else {
      blueDot.setAttribute("style", "display:block;");
    }

    let chatMessageLight = document.createElement("p");
    chatMessageLight.setAttribute("class", "chat-message-list");

    chatMessageLight.textContent = `${userChats.lastMessage}`;

    let arrowChat = document.createElement("span");
    arrowChat.setAttribute("class", "arrow-chat");

    // PAY ATTENTION
    let svg = document.createElement("svg");
    svg.setAttributeNS(
      null,
      "class",
      "feather feather-chevron-right chevron-for-chat"
    );

    // chatProfileImageUserPart1.appendChild(chatSellerOnline);
    chatUsernameBold.appendChild(blueDot);
    chatUsernameMessageUserPart2.appendChild(chatUsernameBold);
    chatUsernameMessageUserPart2.appendChild(chatMessageLight);
    arrowChat.appendChild(svg);

    chatEntireSectionUser.appendChild(chatProfileImageUserPart1);
    chatEntireSectionUser.appendChild(chatUsernameMessageUserPart2);
    chatEntireSectionUser.appendChild(arrowChat);

    chatEntireSectionUser.addEventListener("click", function () {
      blueDot.style.display = "none";

      removeMessages();
      loadMessages(userChats.username);
      chatWithObject = userChats;

      let chatMessagesProfilePicturePart2 = document.getElementById(
        "chat-messages-user-photo-id"
      );
      let chatMessagesUsernamePart2 = document.getElementById(
        "nickname-name-header-id"
      );
      chatMessagesUsernamePart2.textContent = `${userChats.username}`;
      chatMessagesUsernamePart2.addEventListener("click", function () {
        location.href = `user.html?id=${userChats.username}`;
      });

      if (userChats.userPhoto !== null) {
        chatMessagesProfilePicturePart2.setAttribute(
          "style",
          `background-size: cover; background-image:url(${userChats.userPhoto})`
        );
      } else {
        chatMessagesProfilePicturePart2.setAttribute(
          "style",
          "background-image:url(./user-photo.png) no-repeat center center;"
        );
      }

      chatMessagesProfilePicturePart2.addEventListener("click", function () {
        location.href = `user.html?id=${userChats.username}`;
      });

      // firebase
      //   .firestore()
      //   .collection("userchats")
      //   .doc(user.displayName)
      //   .collection("userchats")
      //   .doc(userChats.username)
      //   .set({
      //     seen: true
      //   }, { merge: true }
      //   )
      //   .then(() => {
      //     console.log("made seen");
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    });

    chatHistoryUsersList.appendChild(chatEntireSectionUser);
  }
}

function deleteChatUser(userChat) {
  let userchat = document.getElementById(userChat);

  userchat.parentNode.removeChild(userchat);
  return false;
}

function getMainChat() {
  firebase.auth().onAuthStateChanged(function (user) {
    let PROFILE_PHOTO;
    let LAST_CHAT_USERNAME;

    console.log(LAST_CHAT_USERNAME);

    if (userId) {
      LAST_CHAT_USERNAME = userId;
      chatWithObject.username = userId;

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          console.log(snapshot.data());
          PROFILE_PHOTO = snapshot.data().profilePicture;
        })
        .then(() => {
          console.log("Exec");
          console.log("userId " + LAST_CHAT_USERNAME);

          let chatMessagesProfilePicturePart2 = document.getElementById(
            "chat-messages-user-photo-id"
          );

          if (PROFILE_PHOTO !== null) {
            chatMessagesProfilePicturePart2.setAttribute(
              "style",
              `background-image:url(${PROFILE_PHOTO}); background-size: cover;`
            );
          } else {
            chatMessagesProfilePicturePart2.setAttribute(
              "style",
              "background-image:url(./user-photo.png) no-repeat center center;"
            );
          }

          chatMessagesProfilePicturePart2.addEventListener("click", function () {
            location.href = `user.html?id=${LAST_CHAT_USERNAME}`;
          });

          let chatMessagesUsernamePart2 = document.getElementById(
            "nickname-name-header-id"
          );

          chatMessagesUsernamePart2.textContent = LAST_CHAT_USERNAME;
          chatMessagesUsernamePart2.addEventListener("click", function () {
            location.href = `user.html?id=${LAST_CHAT_USERNAME}`;
          });

        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      firebase
        .firestore()
        .collection("chats")
        .where("user1", "==", user.displayName)
        .where("user2", "==", user.displayName)
        .orderBy("lastUpdated", "desc")
        .limit(1)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());

            if (doc.data().user1 !== user.displayName) {
              LAST_CHAT_USERNAME = doc.data().user1;
            } else {
              LAST_CHAT_USERNAME = doc.data().user2;
            }

            console.log("userId " + LAST_CHAT_USERNAME);

            let chatMessagesProfilePicturePart2 = document.getElementById(
              "chat-messages-user-photo-id"
            );
            if (doc.data().user1 !== user.displayName) {
              chatMessagesProfilePicturePart2.setAttribute(
                "style",
                `background-size: cover; background-image:url(${
                  doc.data().user1Photo
                })`
              );
              chatMessagesProfilePicturePart2.addEventListener("click", function () {
                location.href = `user.html?id=${doc.data().user1}`;
              });
              
            } else {
              chatMessagesProfilePicturePart2.setAttribute(
                "style",
                `background-size: cover; background-image:url(${
                  doc.data().user2Photo
                })`
              );
              chatMessagesProfilePicturePart2.addEventListener("click", function () {
                location.href = `user.html?id=${doc.data().user2}`;
              });
            }

            let chatMessagesUsernamePart2 = document.getElementById(
              "nickname-name-header-id"
            );

            if (doc.data().user1 !== user.displayName) {
              chatMessagesUsernamePart2.textContent = doc.data().user1;
              chatMessagesUsernamePart2.addEventListener("click", function () {
                location.href = `user.html?id=${doc.data().user1}`;
              });
            } else {
              chatMessagesUsernamePart2.textContent = doc.data().user2;
              chatMessagesUsernamePart2.addEventListener("click", function () {
                location.href = `user.html?id=${doc.data().user2}`;
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // if (user) {
    //   console.log("user " + LAST_CHAT_USERNAME);

    //   let chatname = generateChatRoomName(LAST_CHAT_USERNAME, user.displayName);

    //   firebase
    //     .firestore()
    //     .collection("chats")
    //     .doc(chatname)
    //     .get()
    //     .then((snapshot) => {
    //       if (snapshot.exists) {
    //         let chatMessagesProfilePicturePart2 = document.getElementById(
    //           "chat-messages-user-photo-id"
    //         );
    //         if (snapshot.data().user1 !== user.displayName) {
    //           chatMessagesProfilePicturePart2.setAttribute(
    //             "style",
    //             `background-size: cover; background-image:url(${
    //               snapshot.data().user1Photo
    //             })`
    //           );
    //         } else {
    //           chatMessagesProfilePicturePart2.setAttribute(
    //             "style",
    //             `background-size: cover; background-image:url(${
    //               snapshot.data().user2Photo
    //             })`
    //           );
    //         }

    //         let chatMessagesUsernamePart2 = document.getElementById(
    //           "nickname-name-header-id"
    //         );

    //         if (snapshot.data().user1 !== user.displayName) {
    //           chatMessagesUsernamePart2.textContent = snapshot.data().user1;
    //         } else {
    //           chatMessagesUsernamePart2.textContent = snapshot.data().user2;
    //         }

    //         firebase
    //           .firestore()
    //           .collection("chats")
    //           .doc(chatname)
    //           .collection("messages")
    //           .get()
    //           .then((snapshot) => {
    //             if (snapshot.exists) {
    //               console.log("There are messages");

    //               // TODO
    //               // Not sure here
    //               // maybe check (user.displayName !== user1/user2)
    //               // then call function

    //               loadMessages(LAST_CHAT_USERNAME);
    //             } else {
    //               console.log("No messages");
    //             }
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       } else {
    //         // INITIALIZED CHAT

    //         console.log(userId);
    //         firebase
    //           .firestore()
    //           .collection("chats")
    //           .doc(chatname)
    //           .set({
    //             lastMessage: "",
    //             lastUpdated: new Date(),
    //             user1Photo: PROFILE_PHOTO,
    //             user2Photo: user.photoURL,
    //             user1: userId,
    //             user2: user.displayName,
    //           })
    //           .then(() => {
    //             console.log("Created successfully");
    //             let chatMessagesProfilePicturePart2 = document.getElementById(
    //               "chat-messages-user-photo-id"
    //             );
    //             chatMessagesProfilePicturePart2.setAttribute(
    //               "style",
    //               `background-size: cover; background-image:url(${PROFILE_PHOTO})`
    //             );

    //             let chatMessagesUsernamePart2 = document.getElementById(
    //               "nickname-name-header-id"
    //             );
    //             chatMessagesUsernamePart2.textContent = userId;
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } else {
    //   console.log("Not logged in");
    // }
  });
}

// LOAD MESSAGES
function loadMessages(userId) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let otherUserProfilePhoto = null;

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          otherUserProfilePhoto = snapshot.data().profilePicture;
        })
        .catch((error) => {
          console.log(error);
        });

      let chatname = generateChatRoomName(userId, user.displayName);

      let messagesReference = firebase
        .firestore()
        .collection("chats")
        .doc(chatname)
        .collection("messages")
        .orderBy("createdAt");

      messagesReference
        .get()
        .then((snapshot) => {
          //let div = document.createElement("div");
          snapshot.docs.forEach((message, index) => {
            // let seenOtherUser = document.createElement("div");
            // seenOtherUser.setAttribute("class", "seen");
            // let seenMe = document.createElement("div");
            // seenMe.setAttribute("class", "seen seen-right");

            let div = document.createElement("div");
            let innerDiv = document.createElement("div");
            let innerInnerDiv = document.createElement("div");

            //// WORKING
            //if other user sent us message
            if (
              message.data().from === userId ||
              message.data().to === user.displayName
            ) {
              console.log("From him");

              // First element in 'first-message-div' class
              let profilePicture = document.createElement("div");
              profilePicture.setAttribute("class", "profileimgchat");

              if (otherUserProfilePhoto !== null) {
                profilePicture.setAttribute(
                  "style",
                  `background:url(${otherUserProfilePhoto}); background-size:cover;`
                );
              }

              // let image = document.createElement("img");
              // image.setAttribute("src", userChats.profilePhoto);

              innerDiv.setAttribute("class", "first-message-div");
              innerInnerDiv.setAttribute("class", "firstmessages--main-div");

              if (message.data().type === "image") {
                div.setAttribute("class", "chat-image-sent");
                div.setAttribute(
                  "style",
                  `background:url(${
                    message.data().message
                  }); background-size:cover;`
                );
                div.addEventListener("click", function () {
                  chatImageView.style.display = "block";
                  chatImageViewSrc.setAttribute("src", message.data().message);
                });
              }

              if (message.data().type === "text") {
                div.setAttribute("class", "messagee");
                div.textContent = message.data().message;
              }
              //profilePicture.appendChild(image);
              innerDiv.appendChild(profilePicture);
              innerInnerDiv.appendChild(div);
              innerDiv.appendChild(innerInnerDiv);
            }

            // if we sent the message
            if (
              message.data().from === user.displayName ||
              message.data().to === userId
            ) {
              console.log("From me");

              innerDiv.setAttribute("class", "first-message-right");
              innerInnerDiv.setAttribute("class", "firstmessages--main-div");

              if (message.data().type === "image") {
                div.setAttribute(
                  "class",
                  "messagee messagee-right chat-image-sent"
                );
                div.setAttribute(
                  "style",
                  `background:url(${
                    message.data().message
                  }); background-size:cover;`
                );
                div.addEventListener("click", function () {
                  chatImageView.style.display = "block";
                  chatImageViewSrc.setAttribute("src", message.data().message);
                });
              }

              if (message.data().type === "text") {
                div.setAttribute("class", "messagee messagee-right");
                div.textContent = message.data().message;
              }
              innerInnerDiv.appendChild(div);
              innerDiv.appendChild(innerInnerDiv);
            }
            // WORKING

            if (
              index > 0 &&
              snapshot.docs[index - 1].data().from == message.data().from
            ) {
              chatSellerMessagesConversation.lastChild.appendChild(
                innerInnerDiv
              );
            } else {
              chatSellerMessagesConversation.appendChild(innerDiv);
            }

            //chatSellerMessagesConversation.appendChild(innerDiv);
          });

          // listen for new chat messages
          messagesReference.onSnapshot((snapshot) => {
            // new message added
            let changes = snapshot.docChanges();
            console.log(changes);

            changes.forEach((change) => {
              if (change.type === "added") {
                console.log(change.doc);
                console.log(change.doc.data());

                let innerDiv = document.createElement("div");
                let innerInnerDiv = document.createElement("div");

                if (change.doc.data().from !== user.displayName) {
                  innerDiv.setAttribute("class", "first-message-div");
                  innerInnerDiv.setAttribute(
                    "class",
                    "firstmessages--main-div"
                  );

                  let div = document.createElement("div");
                  div.setAttribute("class", "messagee");
                  div.textContent = change.doc.data().message;

                  innerInnerDiv.appendChild(div);
                  innerDiv.appendChild(innerInnerDiv);

                  //chatSellerMessagesConversation.appendChild(innerDiv);
                }

                if (
                  (chatSellerMessagesConversation.lastChild
                    .getAttribute("class")
                    .includes("first-message-div") &&
                    change.doc.data().from !== user.displayName) ||
                  (!chatSellerMessagesConversation.lastChild
                    .getAttribute("class")
                    .includes("first-message-div") &&
                    change.doc.data().from === user.displayName)
                ) {
                  chatSellerMessagesConversation.lastChild.appendChild(
                    innerInnerDiv
                  );
                  innerInnerDiv.scrollIntoView();
                } else {
                  chatSellerMessagesConversation.appendChild(innerDiv);
                  innerDiv.scrollIntoView();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });

      // await messagesReference.get().then(function (snapshot) {
      //   console.log(snapshot.docs.data());
      //   docs = snapshot;
      //   lastVisible = snapshot.docs[snapshot.docs.length - 1];
      //   //console.log("last", lastVisible.data().message);

      //   /////// WORKS
      //   // snapshot.forEach(function (doc) {
      //   //   const message = `<div class="messagee messagee-right">${doc.data().message}</div>`;
      //   //   secondmessage.innerHTML += message;
      //   // });
      //   //////

      //   snapshot.forEach(function (doc) {
      //     console.log(doc.data().message);
      //     if (
      //       doc.data().from === userChats.username ||
      //       doc.data().to === user.displayName
      //     ) {
      //       const message = `<div class="messagee">${doc.data().message}</div>`;
      //       divMessagesLeft.innerHTML += message;
      //     } else {
      //       const message = `<div class="messagee messagee-right">${
      //         doc.data().message
      //       }</div>`;
      //       secondmessage.innerHTML += message;
      //     }
      //   });
      // });
    } else {
      console.log("Not logged in");
    }
  });
}

let chatsCollectionSize;
const getChatRooms = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    let docs;
    let lastVisible;
    let chatsReference;

    if (user) {
      chatsReference = firebase
        .firestore()
        .collection("userchats")
        .doc(`${user.displayName}`)
        .collection("userchats")
        .orderBy("lastUpdated", "desc");

      // chatsReference
      //   .get()
      //   .then((snapshot) => {
      //     if (snapshot.size === 0) {
      //       noMessages.style.display = "block";
      //       return;
      //     }
      //     docs = snapshot;
      //     chatsCollectionSize = snapshot.size;
      //     lastVisible = snapshot.docs[snapshot.docs.length - 1];
      //     console.log("last", lastVisible.data());
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      chatsReference.get().then((snapshot) => {
        console.log(snapshot.docs.forEach((doc) => doc.data()));
        if (snapshot.size === 0) {
          noMessages.style.display = "block";
          return;
        }
        docs = snapshot;
        chatsCollectionSize = snapshot.size;
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        console.log("last", lastVisible.data());

        docs["docs"].forEach((doc) => {
          console.log(doc.data());
          chatsArray.push(doc.data());
        });
        chatsArray.forEach((chat) => {
          createChatUser(chat);
        });
        //chatsArray = [];
      });

      chatsReference.onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        let newArray = [];

        console.log(changes);
        console.log(chatsArray);

        changes.forEach((change) => {
          if (change.type === "modified") {
            chatsArray.forEach((chat) => {
              newArray.push(chat);
              //chatsArray.push(chat);

              if (chat.username === change.doc.data().username) {
                delete chatsArray[chatsArray.indexOf(chat)];
              }
              removeChats();
              newArray = [change.doc.data()].concat(chatsArray);
            });

            newArray.forEach((chat) => {
              createChatUser(chat);
            });
            //newArray = [];

            console.log(newArray);
          }
        });
      });
    } else {
      console.log("Not logged in");
    }
  });
};

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
let newLineDelimitor = "";
let enterShiftPressCounter = 0;
let messageTextContentConcatenated = "";
let messageTextContentConcatenatedEdited = "";
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    chatMessageText.addEventListener(
      "keyup",
      function (e) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // let divMessageContent = document.createElement("div");
            // divMessageContent.setAttribute("class", "messagee messagee-right");

            if (e.keyCode === 13 && e.shiftKey) {
              e.preventDefault();

              // enterShiftPressCounter++;

              // let br = document.createElement("br");
              // let span = document.createElement("span");
              // span.textContent = chatMessageText.textContent;

              // divMessageContent.appendChild(span);
              // divMessageContent.appendChild(br);

              // console.log(enterShiftPressCounter);

              // if (e.keyCode === 13 && !e.shiftKey) {
              //   let innerDiv = document.createElement("div");
              //   innerDiv.setAttribute("class", "first-message-right");

              //   let innerInnerDiv = document.createElement("div");
              //   innerInnerDiv.setAttribute("class", "firstmessages--main-div");

              //   //divMessageContent.textContent = chatMessageText.textContent;

              //   innerInnerDiv.appendChild(divMessageContent);
              //   innerDiv.appendChild(innerInnerDiv);
              // }

              //messageTextContentConcatenated += chatMessageText.textContent + "<br>";
              //console.log(messageTextContentConcatenated);

              //LAST LINE WILL ALSO HAVE A <br> ?
              //newLineDelimitor = messageTextContentConcatenated.slice(-4);
              //console.log(newLineDelimitor);
              //messageTextContentConcatenatedEdited = messageTextContentConcatenated.slice(0, -4);
              console.log(chatMessageText.textContent);
            } else {
              //messageTextContentConcatenated += chatMessageText.textContent;
              console.log(chatMessageText.textContent);
            }

            if (e.keyCode === 13 && !e.shiftKey) {
              if (!chatMessageText.textContent.trim()) {
                return;
              }

              console.log(chatWithObject.username);
              console.log(user.displayName);

              let chatname = generateChatRoomName(
                chatWithObject.username,
                user.displayName
              );

              let messageTextContent = chatMessageText.textContent;

              firebase
                .firestore()
                .collection("chats")
                .doc(chatname)
                .collection("messages")
                .add({
                  type: "text",
                  message: messageTextContent,
                  from: user.displayName,
                  to: chatWithObject.username,
                  createdAt: new Date(),
                })
                .then(() => {
                  console.log(messageTextContent);
                  firebase
                    .firestore()
                    .collection("chats")
                    .doc(chatname)
                    .set(
                      {
                        lastMessage: messageTextContent,
                        lastUpdated: new Date(),
                      },
                      { merge: true }
                    )
                    .then(() => {
                      firebase
                        .firestore()
                        .collection("userchats")
                        .doc(user.displayName)
                        .collection("userchats")
                        .doc(chatWithObject.username)
                        .set(
                          {
                            lastMessage: messageTextContent,
                            lastUpdated: new Date(),
                            seen: false,
                          },
                          { merge: true }
                        )
                        .then(() => {
                          firebase
                            .firestore()
                            .collection("userchats")
                            .doc(chatWithObject.username)
                            .collection("userchats")
                            .doc(user.displayName)
                            .set(
                              {
                                lastMessage: messageTextContent,
                                lastUpdated: new Date(),
                                seen: false,
                              },
                              { merge: true }
                            )
                            .then(() => {
                              console.log("Updated to both users");
                            })
                            .catch((error) => {
                              console.log(error);
                            });

                          console.log("Updated chats");
                        })
                        .catch((error) => {
                          console.log(error);
                        });

                      console.log("Updated last message");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });

              // if (enterShiftPressCounter > 0) {
              //   let innerDiv = document.createElement("div");
              //   innerDiv.setAttribute("class", "first-message-right");

              //   let innerInnerDiv = document.createElement("div");
              //   innerInnerDiv.setAttribute("class", "firstmessages--main-div");

              //   innerInnerDiv.appendChild(divMessageContent);
              //   innerDiv.appendChild(innerInnerDiv);

              //   chatSellerMessagesConversation.appendChild(innerDiv);

              //   chatMessageText.textContent = "";

              //   return;
              // }

              let innerDiv = document.createElement("div");
              innerDiv.setAttribute("class", "first-message-right");

              let innerInnerDiv = document.createElement("div");
              innerInnerDiv.setAttribute("class", "firstmessages--main-div");

              let div = document.createElement("div");
              div.setAttribute("class", "messagee messagee-right");
              div.textContent = chatMessageText.textContent;

              innerInnerDiv.appendChild(div);
              innerDiv.appendChild(innerInnerDiv);

              // NEW
              // if (
              //   index > 0 &&
              //   changes.docs[index - 1].data().from == change.doc.data().from
              // ) {
              //   chatSellerMessagesConversation.lastChild.appendChild(
              //     innerInnerDiv
              //   );
              // } else {
              //   chatSellerMessagesConversation.appendChild(innerDiv);
              // }
              //NEW

              chatSellerMessagesConversation.appendChild(innerDiv);
              innerDiv.scrollIntoView();

              chatMessageText.textContent = "";
            }
          } else {
            console.log("Not logged in");
          }
        });
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    location.href = "sign-in.html";
  }
});

// CLICK SEND, SEND MESSAGE
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    sendMessageButton.addEventListener(
      "click",
      function () {
        if (!chatMessageText.textContent.trim()) {
          return;
        }
        console.log(chatWithObject.username);
        console.log(user.displayName);

        let chatname = generateChatRoomName(
          chatWithObject.username,
          user.displayName
        );

        let messageTextContent = chatMessageText.textContent;

        firebase
          .firestore()
          .collection("chats")
          .doc(chatname)
          .collection("messages")
          .add({
            type: "text",
            message: messageTextContent,
            from: user.displayName,
            to: chatWithObject.username,
            createdAt: new Date(),
          })
          .then(() => {
            firebase
              .firestore()
              .collection("chats")
              .doc(chatname)
              .set(
                {
                  lastMessage: messageTextContent,
                  lastUpdated: new Date(),
                },
                { merge: true }
              )
              .then(() => {
                firebase
                  .firestore()
                  .collection("userchats")
                  .doc(user.displayName)
                  .collection("userchats")
                  .doc(chatWithObject.username)
                  .set(
                    {
                      lastMessage: messageTextContent,
                      lastUpdated: new Date(),
                      seen: false,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    firebase
                      .firestore()
                      .collection("userchats")
                      .doc(user.displayName)
                      .collection("userchats")
                      .doc(chatWithObject.username)
                      .set(
                        {
                          lastMessage: messageTextContent,
                          lastUpdated: new Date(),
                          seen: false,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        console.log("Updated to both users");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    console.log("Updated chats");
                  })
                  .catch((error) => {
                    console.log(error);
                  });

                console.log("Updated last message");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        let innerDiv = document.createElement("div");
        innerDiv.setAttribute("class", "first-message-right");

        let innerInnerDiv = document.createElement("div");
        innerInnerDiv.setAttribute("class", "firstmessages--main-div");

        let div = document.createElement("div");
        div.setAttribute("class", "messagee messagee-right");
        div.textContent = messageTextContent;

        innerInnerDiv.appendChild(div);
        innerDiv.appendChild(innerInnerDiv);

        chatSellerMessagesConversation.appendChild(innerDiv);
        innerDiv.scrollIntoView();

        chatMessageText.textContent = "";
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    // No user is signed in.
    location.href = "sign-in.html";
  }
});

// SEND IMAGE MESSAGE
function addImageToForm(e) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let files = e.target.files;
      if (files.length > 1) {
        alert("You can only send at most 1 file!");
        return;
      }

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (file.size > 1500000) {
          alert("File too large!");
          return;
        }

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", function (e) {
            let imageFile = e.target;
            let imageSentURL;

            const reference = firebase
              .storage()
              .ref(`${user.displayName}/chat_images/` + file.name);

            reference
              .put(file)
              .then((snapshot) => {
                return snapshot.ref.getDownloadURL();
              })
              .then((url) => {
                imageSentURL = url;
                console.log(url);
              })
              .then(() => {
                let chatname = generateChatRoomName(
                  user.displayName,
                  chatWithObject.username
                );
                firebase
                  .firestore()
                  .collection(`/chats/${chatname}/messages`)
                  .add({
                    type: "image",
                    message: imageSentURL,
                    from: user.displayName,
                    to: chatWithObject.username,
                    createdAt: new Date(),
                  })
                  .then((reference) => {
                    firebase
                      .firestore()
                      .collection("chats")
                      .doc(chatname)
                      .set(
                        {
                          lastMessage: "image sent",
                          lastUpdated: new Date(),
                        },
                        { merge: true }
                      )
                      .then(() => {
                        firebase
                          .firestore()
                          .collection("userchats")
                          .doc(user.displayName)
                          .collection("userchats")
                          .doc(chatWithObject.username)
                          .set(
                            {
                              lastMessage: "image sent",
                              lastUpdated: new Date(),
                            },
                            { merge: true }
                          )
                          .then(() => {
                            firebase
                              .firestore()
                              .collection("userchats")
                              .doc(chatWithObject.username)
                              .collection("userchats")
                              .doc(user.displayName)
                              .set(
                                {
                                  lastMessage: "image sent",
                                  lastUpdated: new Date(),
                                },
                                { merge: true }
                              )
                              .then(() => {
                                console.log("Updated to both users");
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                          });

                        console.log("Updated last message");
                      })
                      .catch((error) => {
                        console.log(error);
                      });

                    console.log(chatWithObject.username);
                    console.log("Added message " + reference);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .then(() => {
                let div = document.createElement("div");
                div.setAttribute("class", "first-message-right");

                let innerDiv = document.createElement("div");
                innerDiv.setAttribute("class", "firstmessages--main-div");

                let divDocument = document.createElement("div");
                divDocument.setAttribute(
                  "class",
                  "messagee messagee-right chat-image-sent"
                );

                innerDiv.appendChild(divDocument);
                div.appendChild(innerDiv);
                chatSellerMessagesConversation.appendChild(div);

                divDocument.addEventListener("click", function () {
                  chatImageView.style.display = "block";
                  chatImageViewSrc.setAttribute("src", imageSentURL);
                });
                divDocument.setAttribute(
                  "style",
                  `background-image:url(${imageFile.result}); background-size: cover;`
                );
              })
              .catch((error) => {
                console.log(error);
              });
          });

          reader.readAsDataURL(file);
        } else {
          console.log("WTF not file");
        }
      }
    } else {
      console.log("Not logged in");
    }
  });
}

inputFile.addEventListener("change", addImageToForm, false);

window.onload = function () {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
};

function generateChatRoomName(user1, user2) {
  let result = user1.toLowerCase().localeCompare(user2.toLowerCase());

  if (result === 0) {
    return `${user1}+${user2}`;
  }
  if (result === 1) {
    return `${user2}+${user1}`;
  }
  if (result === -1) {
    return `${user1}+${user2}`;
  }
}

if (userId) {
  loadMessages(userId);
} else {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .firestore()
        .collection("chats")
        .where("user1", "==", user.displayName)
        .where("user2", "==", user.displayName)
        .orderBy("lastUpdated", "desc")
        .limit(1)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());

            if (doc.data().user1 !== user.displayName) {
              loadMessages(doc.data().user1);
            } else {
              loadMessages(doc.data().user2);
            }
          });
        });
    }
  });
}

getChatRooms();
getMainChat();
