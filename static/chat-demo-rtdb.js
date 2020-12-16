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

// Chat list
let chatHistoryUsersList = document.getElementById("chat-part-1-list-id");
let chatMessagesPart2Header = document.getElementById(
  "chat-part-2-user-lists-id"
);

let chatsArray = [];
let chatWithObject = {};
let CURRENT_CHATROOM_NAME;
let CURRENT_CHOSEN_USER;

const url = new URL(window.location.href);
let userId = url.searchParams.get("id");

searchBar.addEventListener("keyup", (e) => {
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
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (chatsCollectionSize === 0) {
        let noMessagesText = document.createElement("div");
        noMessagesText.setAttribute("class", "no-messages-chat");

        chatHistoryUsersList.appendChild(noMessagesText);
      } else {
        let chatEntireSectionUser = document.createElement("div");
        chatEntireSectionUser.setAttribute("class", "user-section-chat");

        let chatProfileImageUserPart1 = document.createElement("div");
        chatProfileImageUserPart1.setAttribute("class", "chat-profile-1");

        let profilePicture;

        firebase
          .firestore()
          .collection("users")
          .doc(userChats.username)
          .get()
          .then((snapshot) => {
            profilePicture = snapshot.data().profilePicture;
          })
          .then(() => {
            if (profilePicture !== null) {
              chatProfileImageUserPart1.setAttribute(
                "style",
                `background:url(${profilePicture}); background-size:cover;`
              );
            }

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
            svg.setAttributeNS(
              null,
              "class",
              "feather feather-chevron-right chevron-for-chat"
            );

            chatUsernameMessageUserPart2.appendChild(chatUsernameBold);
            chatUsernameMessageUserPart2.appendChild(chatMessageLight);
            arrowChat.appendChild(svg);

            chatEntireSectionUser.appendChild(chatProfileImageUserPart1);
            chatEntireSectionUser.appendChild(chatUsernameMessageUserPart2);
            chatEntireSectionUser.appendChild(arrowChat);

            chatEntireSectionUser.addEventListener("click", function () {
              removeMessages();

              let chatname = generateChatRoomName(
                userChats.username,
                user.displayName
              );
              console.log(chatname);

              firebase
                .database()
                .ref("chats")
                .on("value", (snapshot) => {
                  if (snapshot.hasChild(chatname)) {
                    let chatname = Object.keys(snapshot.val())[0];

                    console.log(userChats.username, chatname);

                    // loadMessages(userChats.username, chatname);
                    loadMessages(userChats.username);
                  }
                });
              //chatWithObject = userChats;
              let chatMessagesProfilePicturePart2 = document.getElementById(
                "chat-messages-user-photo-id"
              );
              let chatMessagesUsernamePart2 = document.getElementById(
                "nickname-name-header-id"
              );

              chatMessagesUsernamePart2.textContent = `${userChats.username}`;

              if (userChats.userPhoto !== null || userChats.userPhoto !== "") {
                chatMessagesProfilePicturePart2.setAttribute(
                  "style",
                  `background:url(${userChats.userPhoto}); background-size: cover;`
                );
              }
            });
            chatHistoryUsersList.appendChild(chatEntireSectionUser);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      console.log("Not logged in");
    }
  });
}

function getMainChat() {
  firebase.auth().onAuthStateChanged(function (user) {
    let PROFILE_PHOTO;
    let LAST_CHAT_USERNAME;

    if (userId) {
      LAST_CHAT_USERNAME = userId;
      CURRENT_CHOSEN_USER = userId;
      chatWithObject.username = userId;

      console.log("userId " + LAST_CHAT_USERNAME);

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          console.log(snapshot.data());
          PROFILE_PHOTO = snapshot.data().profilePicture;
        })
        .catch((error) => {
          console.log(error);
        });

      if (user) {
        console.log("last chat with user " + LAST_CHAT_USERNAME);

        let chatname = generateChatRoomName(userId, user.displayName);

        firebase
          .database()
          .ref("chats")
          .on("value", (snapshot) => {
            if (snapshot.hasChild(chatname)) {
              console.log(chatname);
              //let chatname = Object.keys(snapshot.val())[0];
              console.log(snapshot);
              let chatMessagesProfilePicturePart2 = document.getElementById(
                "chat-messages-user-photo-id"
              );

              if (user.displayName !== snapshot.val().user1) {
                if (
                  snapshot.val().user1Photo !== undefined ||
                  snapshot.val().user1Photo !== ""
                ) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${PROFILE_PHOTO}); background-size: cover;`
                  );
                }
                // else {
                //   chatMessagesProfilePicturePart2.setAttribute(
                //     "style",
                //     "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                //   );
                // }
              } else {
                console.log(snapshot.val().user2Photo);
                if (
                  snapshot.val().user2Photo !== undefined ||
                  snapshot.val().user1Photo !== ""
                ) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${
                      snapshot.val().user2Photo
                    }); background-size: cover;`
                  );
                } else {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                  );
                }
              }

              let chatMessagesUsernamePart2 = document.getElementById(
                "nickname-name-header-id"
              );

              if (user.displayName !== snapshot.val().user1) {
                console.log(snapshot.val().user1);
                chatMessagesUsernamePart2.textContent = snapshot.val().user1;
              } else {
                console.log(snapshot.val().user2);
                chatMessagesUsernamePart2.textContent = snapshot.val().user2;
              }

              console.log("There are messages or chat");

              if (user.displayName !== snapshot.val().user1) {
                loadMessages(snapshot.val().user1);
              } else {
                loadMessages(snapshot.val().user2);
              }
            } else {
              console.log(user.displayName);
              console.log(LAST_CHAT_USERNAME);
              let chatname = generateChatRoomName(
                user.displayName,
                LAST_CHAT_USERNAME
              );
              firebase
                .database()
                .ref("chats/" + chatname)
                .set(
                  {
                    lastUpdated: new Date().getTime(),
                    createdAt: new Date().getTime(),
                    lastMessage: "",
                    user1: user.displayName,
                    user2: LAST_CHAT_USERNAME,
                    user1Photo: user.photoURL,
                    user2Photo: PROFILE_PHOTO,
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          });
      } else {
        console.log("Not logged in");
      }
    } else {
      if (user) {
        firebase
          .database()
          .ref(`userchats/${user.displayName}`)
          .orderByChild("lastUpdated")
          .limitToFirst(1)
          .once("value")
          .then((snapshot) => {
            console.log(snapshot.val());
            snapshot.forEach(function (child) {
              console.log(child.val());
              console.log(child.val().lastUpdated);
              console.log(child.val().user1);
              console.log(child.val().user2);

              if (child.val().user1 !== user.displayName) {
                LAST_CHAT_USERNAME = child.val().user1;
              } else {
                LAST_CHAT_USERNAME = child.val().user2;
              }

              console.log("userId " + LAST_CHAT_USERNAME);

              let chatMessagesProfilePicturePart2 = document.getElementById(
                "chat-messages-user-photo-id"
              );

              if (child.val().user1 !== user.displayName) {
                if (
                  snapshot.val().user1Photo !== undefined ||
                  snapshot.val().user1Photo !== ""
                ) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${
                      snapshot.val().user1Photo
                    }); background-size: cover;`
                  );
                } else {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                  );
                }
              } else {
                if (
                  snapshot.val().user2Photo !== undefined ||
                  snapshot.val().user1Photo !== ""
                ) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${
                      snapshot.val().user2Photo
                    }); background-size: cover;`
                  );
                } else {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                  );
                }
              }

              let chatMessagesUsernamePart2 = document.getElementById(
                "nickname-name-header-id"
              );

              if (child.val().user1 !== user.displayName) {
                chatMessagesUsernamePart2.textContent = child.val().user1;
              } else {
                chatMessagesUsernamePart2.textContent = child.val().user2;
              }
            });
          });

        console.log("user " + LAST_CHAT_USERNAME);

        firebase
          .database()
          .ref("chats")
          .on("value", (snapshot) => {
            if (
              snapshot.hasChild(`${userId}+${user.displayName}`) ||
              snapshot.hasChild(`${user.displayName}+${userId}`)
            ) {
              let chatname = Object.keys(snapshot.val())[0];
              console.log(snapshot);
              let chatMessagesProfilePicturePart2 = document.getElementById(
                "chat-messages-user-photo-id"
              );

              if (user.displayName !== snapshot.val().user1) {
                if (snapshot.val().user1Photo !== undefined) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${
                      snapshot.val().user1Photo
                    }); background-size: cover;`
                  );
                } else {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                  );
                }
              } else {
                console.log(snapshot.val().user2Photo);
                if (snapshot.val().user2Photo !== undefined) {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    `background:url(${
                      snapshot.val().user2Photo
                    }); background-size: cover;`
                  );
                } else {
                  chatMessagesProfilePicturePart2.setAttribute(
                    "style",
                    "background: url('./user-photo.png') no-repeat center center); background-size: cover;"
                  );
                }
              }

              let chatMessagesUsernamePart2 = document.getElementById(
                "nickname-name-header-id"
              );

              if (user.displayName !== snapshot.val().user1) {
                chatMessagesUsernamePart2.textContent = snapshot.val().user1;
              } else {
                chatMessagesUsernamePart2.textContent = snapshot.val().user2;
              }

              console.log("There are messages or chat");

              // if (user.displayName !== snapshot.val().user1) {
              //   loadMessages(snapshot.val().user1);
              // } else {
              //   loadMessages(snapshot.val().user2);
              // }
            } else {
              console.log(user.displayName);
              console.log(LAST_CHAT_USERNAME);
              let chatname = generateChatRoomName(
                user.displayName,
                LAST_CHAT_USERNAME
              );
              firebase
                .database()
                .ref("chats/" + chatname)
                .set(
                  {
                    lastUpdated: new Date().getTime(),
                    createdAt: new Date().getTime(),
                    lastMessage: "",
                    user1: user.displayName,
                    user2: LAST_CHAT_USERNAME,
                    user1Photo: user.photoURL,
                    user2Photo: PROFILE_PHOTO,
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          });
      }
    }
  });
}

// LOAD MESSAGES
function loadMessages(userId) {
  console.log(userId);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let otherUserProfilePhoto = null;

      console.log(userId);
      console.log();

      let chatroom = generateChatRoomName(userId, user.displayName);

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          otherUserProfilePhoto = snapshot.data().profilePicture;
        })
        .then(() => {
          firebase
            .database()
            .ref("chats/" + chatroom + "/messages")
            //.orderByChild("createdAt")
            .on("value", (snapshot) => {
              console.log(snapshot.val());

              snapshot.forEach((message, index) => {
                let div = document.createElement("div");
                let innerDiv = document.createElement("div");
                let innerInnerDiv = document.createElement("div");

                if (
                  message.val().from === userId //||
                  //message.val().to === user.displayName
                ) {
                  console.log("From him");

                  // First element in 'first-message-div' class
                  let profilePicture = document.createElement("div");
                  profilePicture.setAttribute("class", "profileimgchat");
                  console.log(otherUserProfilePhoto);

                  if (otherUserProfilePhoto !== null) {
                    profilePicture.setAttribute(
                      "style",
                      `background:url(${otherUserProfilePhoto}); background-size:cover;`
                    );
                  }
                  // let image = document.createElement("img");
                  // image.setAttribute("src", userChats.profilePhoto);

                  innerDiv.setAttribute("class", "first-message-div");
                  innerInnerDiv.setAttribute(
                    "class",
                    "firstmessages--main-div"
                  );

                  if (message.val().type === "image") {
                    div.setAttribute("class", "chat-image-sent");
                    div.setAttribute(
                      "style",
                      `background:url(${
                        message.val().message
                      }); background-size:cover;`
                    );
                    div.addEventListener("click", function () {
                      chatImageView.style.display = "block";
                      chatImageViewSrc.setAttribute(
                        "src",
                        message.val().message
                      );
                    });
                  }

                  if (message.val().type === "text") {
                    div.setAttribute("class", "messagee");
                    div.textContent = message.val().message;
                  }
                  //profilePicture.appendChild(image);
                  innerDiv.appendChild(profilePicture);
                  innerInnerDiv.appendChild(div);
                  innerDiv.appendChild(innerInnerDiv);
                }

                // if we sent the message
                if (
                  message.val().from === user.displayName //||
                  //message.data().to === userId
                ) {
                  console.log("From me");

                  innerDiv.setAttribute("class", "first-message-right");
                  innerInnerDiv.setAttribute(
                    "class",
                    "firstmessages--main-div"
                  );

                  if (message.val().type === "image") {
                    div.setAttribute(
                      "class",
                      "messagee messagee-right chat-image-sent"
                    );
                    div.setAttribute(
                      "style",
                      `background:url(${
                        message.val().message
                      }); background-size:cover;`
                    );
                    div.addEventListener("click", function () {
                      chatImageView.style.display = "block";
                      chatImageViewSrc.setAttribute(
                        "src",
                        message.val().message
                      );
                    });
                  }

                  if (message.val().type === "text") {
                    div.setAttribute("class", "messagee messagee-right");
                    div.textContent = message.val().message;
                  }
                  innerInnerDiv.appendChild(div);
                  innerDiv.appendChild(innerInnerDiv);
                }
                // WORKING

                if (
                  index > 0 &&
                  snapshot.docs[index - 1].val().from == message.val().from
                ) {
                  chatSellerMessagesConversation.lastChild.appendChild(
                    innerInnerDiv
                  );
                } else {
                  chatSellerMessagesConversation.appendChild(innerDiv);
                }
              });
            })
            // .catch((error) => {
            //   console.log(error);
            // });
        })
        .catch((error) => {
          console.log(error);
        });
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
        .database()
        .ref(`/userchats/${user.displayName}`)
        //.orderByChild("lastUpdated")
        .once("value")
        .then((snapshot) => {
          this.items = [];
          snapshot.forEach((child) => {
            this.items.push(child);
          });
          this.items.reverse();

          console.log(this.items);

          if (this.items.length === 0) {
            console.log("No chatsrooms");
            noMessages.style.display = "block";
          }

          removeChats();

          this.items.forEach((chat) => {
            createChatUser(chat.val());
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

console.log(new Date().getTime());

// PRESS ENTER SEND MESSAGE
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    chatMessageText.addEventListener(
      "keyup",
      function (e) {
        // firebase.auth().onAuthStateChanged(async function (user) {
        //   if (user) {
            if (e.keyCode === 13 && !e.shiftKey) {
              if (!chatMessageText.textContent.trim()) {
                return;
              }
              let chatname = generateChatRoomName(userId, user.displayName);

              let message = {
                createdAt: new Date().getTime(),
                from: user.displayName,
                to: userId,
                message: chatMessageText.textContent,
                type: "text",
              };

              let messageTextContent = chatMessageText.textContent;

              firebase
                .database()
                .ref(`chats/${chatname}/messages`)
                .push(message);
              //   .on("child_added", updateMessages);
                //.on("child_added", (snapshot) => {
                    //if (snapshot.hasChild(chatname)) {
                    // /alert("Chat exists");
                    console.log(chatname);

                    // console.log(snapshot.val());

                    console.log(messageTextContent);

                    // firebase
                    //   .database()
                    //   .ref(`chats/${chatname}`)
                    //   .update({
                    //     lastMessage: messageTextContent,
                    //     lastUpdated: new Date().getTime(),
                    //   })
                    //   .then(() => {
                    //     firebase
                    //       .database()
                    //       .ref(`chats/${chatname}/messages`)
                    //       .push(message, (error) => {
                    //         if (error) {
                    //           console.log(error);
                    //         } else {
                    //           firebase
                    //             .database()
                    //             .ref(`userchats/${user.displayName}/${userId}`)
                    //             .set(
                    //               {
                    //                 username: userId,
                    //                 lastMessage: messageTextContent,
                    //                 lastUpdated: new Date().getTime(),
                    //               },
                    //               (error) => {
                    //                 if (error) {
                    //                   console.log(error);
                    //                 } else {
                    //                   console.log(
                    //                     "Updated user displayName userchats"
                    //                   );

                    //                   firebase
                    //                     .database()
                    //                     .ref(
                    //                       `userchats/${userId}/${user.displayName}`
                    //                     )
                    //                     .set(
                    //                       {
                    //                         username: user.displayName,
                    //                         lastMessage: messageTextContent,
                    //                         lastUpdated:
                    //                           new Date().getTime(),
                    //                       },
                    //                       (error) => {
                    //                         if (error) {
                    //                           console.log(error);
                    //                         } else {
                    //                           console.log(
                    //                             "Updated userId userchats"
                    //                           );
                    //                         }
                    //                       }
                    //                     );
                    //                 }
                    //               }
                    //             );
                    //           console.log("Added message success");
                    //         }
                    //       });

                    //     console.log("Success updated");
                    //   })
                    //   .catch((error) => {
                    //     console.log(error);
                    //   });
                  //}
                  //chatname = Object.keys(snapshot.val())[0];
                  // let innerDiv = document.createElement("div");
                  // innerDiv.setAttribute("class", "first-message-right");

                  // let innerInnerDiv = document.createElement("div");
                  // innerInnerDiv.setAttribute("class", "firstmessages--main-div");

                  // let div = document.createElement("div");
                  // div.setAttribute("class", "messagee messagee-right");
                  // div.textContent = snapshot.val().message;

                  // innerInnerDiv.appendChild(div);
                  // innerDiv.appendChild(innerInnerDiv);

                  // chatSellerMessagesConversation.appendChild(innerDiv);
                //});
                // firebase
                // .database()
                // .ref(`chats/${chatname}/messages`)
                // .off();


              // firebase
              //   .database()
              //   .ref(`chats/${chatname}/messages`)
              //   .push(message, (error) => {
              //     if (error) {
              //       console.log(error);
              //     } else {
              //       console.log("Added message");
              //     }

                  // console.log(snapshot.val());
                  // console.log("Works");
                //});
              chatMessageText.textContent = "";
            }
          // } else {
          //   console.log("Not logged in");
          // }
        //});
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    window.location.href = "sign-in.html";
  }
});



// CLICK SEND, SEND MESSAGE
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    sendMessageButton.addEventListener(
      "click",
      async function () {
        if (!chatMessageText.textContent.trim()) {
          return;
        }

        let chatname;
        let message = {
          createdAt: new Date().getTime(),
          from: user.displayName,
          to: userId,
          message: chatMessageText.textContent,
          type: "text",
        };

        // firebase
        //   .database()
        //   .ref("chats")
        //   .on("child_added", (snapshot) => {
        //     if (
        //       snapshot.hasChild(`${userId}+${user.displayName}`) ||
        //       snapshot.hasChild(`${user.displayName}+${userId}`)
        //     ) {
        //       chatname = Object.keys(snapshot.val())[0];

        //       firebase
        //         .database()
        //         .ref(`chats/${chatname}`)
        //         .update({
        //           lastMessage: chatMessageText.textContent,
        //           lastUpdated: new Date().getTime(),
        //         })
        //         .then(() => {
        //           firebase
        //             .database()
        //             .ref(`chats/${chatname}/messages`)
        //             .push(message, (error) => {
        //               if (error) {
        //                 console.log(error);
        //               } else {
        //                 firebase
        //                   .database()
        //                   .ref(`userchats/${user.displayName}/${userId}`)
        //                   .set(
        //                     {
        //                       lastMessage: chatMessageText.textContent,
        //                       lastUpdated: new Date().getTime(),
        //                     },
        //                     (error) => {
        //                       if (error) {
        //                         console.log(error);
        //                       } else {
        //                         console.log(
        //                           "Updated user displayName userchats"
        //                         );

        //                         firebase
        //                           .database()
        //                           .ref(
        //                             `userchats/${userId}/${user.displayName}`
        //                           )
        //                           .set(
        //                             {
        //                               lastMessage: chatMessageText.textContent,
        //                               lastUpdated: new Date().getTime(),
        //                             },
        //                             (error) => {
        //                               if (error) {
        //                                 console.log(error);
        //                               } else {
        //                                 console.log("Updated userId userchats");
        //                               }
        //                             }
        //                           );
        //                       }
        //                     }
        //                   );
        //                 console.log("Added message success");
        //               }
        //             });

        //           console.log("Success updated");
        //         })
        //         .catch((error) => {
        //           console.log(error);
        //         });
        //     }
        //   });

        firebase
          .database()
          .ref(`chats/${chatname}/messages`)
          .push(message, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Added message");
            }
          });

        // chatReference.onSnapshot(function (change) {
        //   let innerDiv = document.createElement("div");
        //   innerDiv.setAttribute("class", "first-message-right");

        //   let innerInnerDiv = document.createElement("div");
        //   innerInnerDiv.setAttribute("class", "firstmessages--main-div");

        //   let div = document.createElement("div");
        //   div.setAttribute("class", "messagee messagee-right");
        //   div.textContent = change.data().message;

        //   innerInnerDiv.appendChild(div);
        //   innerDiv.appendChild(innerInnerDiv);

        //   chatSellerMessagesConversation.appendChild(innerDiv);

        //   console.log(change.data());
        //});
        chatMessageText.textContent = "";
      },
      function (error) {
        console.log(error);
      }
    );
  } else {
    // No user is signed in.
    window.location.href = "sign-in.html";
  }
});

if (userId) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .database()
        .ref("chats")
        .once("value", (snapshot) => {
          let chatroom = generateChatRoomName(userId, user.displayName)
          if (snapshot.hasChild(chatroom)) {
            //let chatname = Object.keys(snapshot.val())[0];
            //loadMessages(userId);
          }
        });
    }
  });
} else {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase
        .database()
        .ref(`/userchats/${user.displayName}`)
        //.limitToLast(1)
        .once("value")
        .then((snapshot) => {
          console.log(snapshot.val());
          this.items = [];
          snapshot.forEach((child) => {
            this.items.push(child);
          });
          this.items.reverse();

          console.log(this.items);

          if (this.items.length === 0) {
            console.log("No chatsrooms");
            noMessages.style.display = "block";
          }

          removeChats();

          // this.items.forEach((chat) => {
          //   createChatUser(chat.val());
          // });
        });

      // firebase
      //   .firestore()
      //   .collection("chats")
      //   .doc(user.displayName)
      //   .collection("chats")
      //   .orderBy("lastUpdated", "desc")
      //   .limit(1)
      //   .get()
      //   .then((snapshot) => {
      //     snapshot.docs.forEach((doc) => {
      //       console.log(doc.data());

      //       loadMessages(doc.data().username);
      //     });
      //   });
    }
  });
}

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
                firebase
                  .database()
                  .ref("chats")
                  .once("value", (snapshot) => {
                    if (
                      snapshot.hasChild(
                        `${chatWithObject.username}+${user.displayName}`
                      ) ||
                      snapshot.hasChild(
                        `${user.displayName}+${chatWithObject.username}`
                      )
                    ) {
                      let chatname = Object.keys(snapshot.val())[0];
                      firebase
                        .database()
                        .ref("chats")
                        .child(chatname)
                        .push(
                          {
                            type: "image",
                            message: imageSentURL,
                            from: user.displayName,
                            to: chatWithObject.username,
                            createdAt: new Date().getTime(),
                          },
                          (error) => {
                            if (error) {
                              console.log(error);
                            } else {
                              firebase
                                .database()
                                .ref(
                                  `userchats/${user.displayName}/${chatWithObject.username}`
                                )
                                .set(
                                  {
                                    lastMessage: "image",
                                    lastUpdated: new Date().getTime(),
                                  },
                                  (error) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log(
                                        "Updated user displayName userchats"
                                      );
                                      firebase
                                        .database()
                                        .ref(
                                          `userchats/${chatWithObject.username}/${user.displayName}`
                                        )
                                        .set(
                                          {
                                            lastMessage: "image",
                                            lastUpdated:
                                              new Date().getTime(),
                                          },
                                          (error) => {
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              console.log(
                                                "Updated userId userchats"
                                              );
                                            }
                                          }
                                        );
                                    }
                                  }
                                );
                              console.log("Added image message success");
                            }
                          }
                        );
                    }
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

getChatRooms();
getMainChat();



firebase
.database()
.ref(`chats/jikkk+vitalikkk/messages`)
.on("child_added", updateMessages);

function updateMessages(data) {
  let innerDiv = document.createElement("div");
  innerDiv.setAttribute("class", "first-message-right");

  let innerInnerDiv = document.createElement("div");
  innerInnerDiv.setAttribute("class", "firstmessages--main-div");

  let div = document.createElement("div");
  div.setAttribute("class", "messagee messagee-right");
  div.textContent = data.val().message;

  innerInnerDiv.appendChild(div);
  innerDiv.appendChild(innerInnerDiv);

  chatSellerMessagesConversation.appendChild(innerDiv);
}

