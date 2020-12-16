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

    let chatProfileImageUserPart1 = document.createElement("div");
    chatProfileImageUserPart1.setAttribute("class", "chat-profile-1");

    if (userChats.profilePhoto !== null) {
      chatProfileImageUserPart1.setAttribute(
        "style",
        `background:url(${userChats.profilePhoto}); background-size:cover;`
      );
    }

    // let chatSellerOnline = document.createElement("div");
    // chatSellerOnline.setAttribute("class", "seller-is-online-for-chat");

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

    // chatProfileImageUserPart1.appendChild(chatSellerOnline);
    chatUsernameMessageUserPart2.appendChild(chatUsernameBold);
    chatUsernameMessageUserPart2.appendChild(chatMessageLight);
    arrowChat.appendChild(svg);

    chatEntireSectionUser.appendChild(chatProfileImageUserPart1);
    chatEntireSectionUser.appendChild(chatUsernameMessageUserPart2);
    chatEntireSectionUser.appendChild(arrowChat);

    chatEntireSectionUser.addEventListener("click", function () {
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

      if (userChats.profilePhoto !== null) {
        chatMessagesProfilePicturePart2.setAttribute(
          "style",
          `background-size: cover; background-image:url(${userChats.profilePhoto})`
        );
      }

      // Messages only appended
      //chatMessagesPart2Header.appendChild();
    });

    chatHistoryUsersList.appendChild(chatEntireSectionUser);
  }
}

async function getMainChat() {
  firebase.auth().onAuthStateChanged(async function (user) {
    let PROFILE_PHOTO;
    let LAST_CHAT_USERNAME;

    if (userId) {
      LAST_CHAT_USERNAME = userId;
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
    } else {
      firebase
        .firestore()
        .collection("chats")
        .where("user", "==", user.displayName)
        .where("seller", "==", user.displayName)
        // .doc(user.displayName)
        // .collection("chats")
        .orderBy("lastUpdated", "desc")
        .limit(1)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());

            LAST_CHAT_USERNAME = doc.data().username;

            console.log("userId " + LAST_CHAT_USERNAME);

            let chatMessagesProfilePicturePart2 = document.getElementById(
              "chat-messages-user-photo-id"
            );
            chatMessagesProfilePicturePart2.setAttribute(
              "style",
              `background-size: cover; background-image:url(${
                doc.data().profilePhoto
              })`
            );

            let chatMessagesUsernamePart2 = document.getElementById(
              "nickname-name-header-id"
            );
            chatMessagesUsernamePart2.textContent = doc.data().username;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (user) {
      console.log("user " + LAST_CHAT_USERNAME);
      firebase
        .firestore()
        .collection("chats")
        .doc(user.displayName)
        .collection("chats")
        .doc(LAST_CHAT_USERNAME)
        .get()
        .then(async (snapshot) => {
          if (snapshot.exists) {
            let chatMessagesProfilePicturePart2 = document.getElementById(
              "chat-messages-user-photo-id"
            );
            chatMessagesProfilePicturePart2.setAttribute(
              "style",
              `background-size: cover; background-image:url(${
                snapshot.data().profilePhoto
              })`
            );
            let chatMessagesUsernamePart2 = document.getElementById(
              "nickname-name-header-id"
            );
            chatMessagesUsernamePart2.textContent = snapshot.data().username;

            await firebase
              .firestore()
              .collection("chats")
              .doc(user.displayName)
              .collection("chats")
              .doc(userId)
              .collection("messages")
              .get()
              .then((snapshot) => {
                if (snapshot.exists) {
                  console.log("There are messages");
                  loadMessages(userId);
                } else {
                  console.log("No messages");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            // INITIALIZED CHAT

            console.log(userId);
            firebase
              .firestore()
              .collection("chats")
              .doc(user.displayName)
              .collection("chats")
              .doc(userId)
              .set({
                lastMessage: "",
                lastUpdated: new Date(),
                profilePhoto: PROFILE_PHOTO,
                username: userId,
              })
              .then(() => {
                console.log("Created successfully");
                let chatMessagesProfilePicturePart2 = document.getElementById(
                  "chat-messages-user-photo-id"
                );
                chatMessagesProfilePicturePart2.setAttribute(
                  "style",
                  `background-size: cover; background-image:url(${PROFILE_PHOTO})`
                );

                let chatMessagesUsernamePart2 = document.getElementById(
                  "nickname-name-header-id"
                );
                chatMessagesUsernamePart2.textContent = userId;
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Not logged in");
    }
  });
}

// function createMessagesFromOther(...arrayMessages) {
//   let div = document.createElement("div");
//   div.setAttribute("class", "first-message-div");

//   for (let i = 0; i < arrayMessages.length; i++) {
//     let innerDiv = document.createElement("div");
//     innerDiv.setAttribute("class", "firstmessages--main-div");

//     let innerInnerDiv = document.createElement("div");

//     if (arrayMessages[i].type === "image") {
//       innerInnerDiv.setAttribute("class", "chat-image-sent");
//       innerInnerDiv.setAttribute(
//         "style",
//         `background:url(${arrayMessages[i].message}); background-size:cover;`
//       );
//       innerInnerDiv.addEventListener("click", function () {
//         chatImageView.style.display = "block";
//         chatImageViewSrc.setAttribute("src", arrayMessages[i].message);
//       });
//     }

//     if (arrayMessages[i].type === "text") {
//       innerInnerDiv.setAttribute("class", "messagee");
//       innerInnerDiv.textContent = arrayMessages[i].message;
//     }

//     innerDiv.appendChild(innerInnerDiv);
//     div.appendChild(innerDiv);
//   }
//   chatSellerMessagesConversation.appendChild(div);
// }

// function createMessagesFromMe(...arrayMessages) {
//   let div = document.createElement("div");
//   div.setAttribute("class", "first-message-right");

//   for (let i = 0; i < arrayMessages.length; i++) {
//     let innerDiv = document.createElement("div");
//     innerDiv.setAttribute("class", "firstmessages--main-div");

//     let innerInnerDiv = document.createElement("div");

//     if (arrayMessages[i].type === "image") {
//       innerInnerDiv.setAttribute(
//         "class",
//         "messagee messagee-right chat-image-sent"
//       );
//       innerInnerDiv.setAttribute(
//         "style",
//         `background:url(${arrayMessages[i].message}); background-size:cover;`
//       );
//       innerInnerDiv.addEventListener("click", function () {
//         chatImageView.style.display = "block";
//         chatImageViewSrc.setAttribute("src", arrayMessages[i].message);
//       });
//     }

//     if (arrayMessages[i].type === "text") {
//       innerInnerDiv.setAttribute(
//         "class",
//         "messagee messagee-right"
//       );
//       innerInnerDiv.textContent = arrayMessages[i].message;
//     }

//     innerDiv.appendChild(innerInnerDiv);
//     div.appendChild(innerDiv);
//   }
//   chatSellerMessagesConversation.appendChild(div);
// }

// LOAD MESSAGES
async function loadMessages(userId) {
  firebase.auth().onAuthStateChanged(async function (user) {
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

      let messagesReference = firebase
        .firestore()
        .collection("chats")
        .doc(user.displayName)
        .collection("chats")
        .doc(userId)
        .collection("messages")
        .orderBy("createdAt")
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
const getChatRooms = async () => {
  firebase.auth().onAuthStateChanged(async function (user) {
    let docs;
    let lastVisible;
    let chatsReference;

    if (user) {
      chatsReference = firebase
        .firestore()
        .doc(`/chats/${user.displayName}`)
        .collection("chats")
        .orderBy("lastUpdated", "desc");

      await chatsReference.get().then((snapshot) => {
        if (snapshot.size === 0) {
          noMessages.style.display = "block";
          return;
        }
        docs = snapshot;
        chatsCollectionSize = snapshot.size;
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        console.log("last", lastVisible.data());
      });
      docs["docs"].forEach((doc) => {
        console.log(doc.data());
        chatsArray.push(doc.data());
      });
      chatsArray.forEach((chat) => {
        createChatUser(chat);
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
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    chatMessageText.addEventListener(
      "keyup",
      async function (e) {
        firebase.auth().onAuthStateChanged(async function (user) {
          if (user) {
            if (e.keyCode === 13 && !e.shiftKey) {
              if (!chatMessageText.textContent.trim()) {
                return;
              }
              const chatReference = await firebase
                .firestore()
                .collection(
                  `/chats/${user.displayName}/chats/${chatWithObject.username}/messages`
                )
                .add({
                  type: "text",
                  message: chatMessageText.textContent,
                  from: user.displayName,
                  to: chatWithObject.username,
                  createdAt: new Date(),
                });

              firebase
                .firestore()
                .doc(
                  `/chats/${user.displayName}/chats/${chatWithObject.username}`
                )
                .set(
                  {
                    lastMessage: chatMessageText.textContent,
                    lastUpdated: new Date(),
                  },
                  { merge: true }
                )
                .then(() => {
                  firebase
                    .firestore()
                    .collection(
                      `/chats/${chatWithObject.username}/chats/${user.displayName}/messages`
                    )
                    .add({
                      type: "text",
                      message: chatMessageText.textContent,
                      from: chatWithObject.username,
                      to: user.displayName,
                      createdAt: new Date(),
                    })
                    .then((reference) => {
                      console.log(reference);

                      firebase
                        .firestore()
                        .doc(
                          `/chats/${chatWithObject.username}/chats/${user.displayName}`
                        )
                        .set(
                          {
                            lastMessage: chatMessageText.textContent,
                            lastUpdated: new Date(),
                          },
                          { merge: true }
                        );
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });

              chatReference.onSnapshot(function (change) {
                let innerDiv = document.createElement("div");
                innerDiv.setAttribute("class", "first-message-right");
      
                let innerInnerDiv = document.createElement("div");
                innerInnerDiv.setAttribute("class", "firstmessages--main-div");

                let div = document.createElement("div");
                div.setAttribute("class", "messagee messagee-right");
                div.textContent = change.data().message;

                innerInnerDiv.appendChild(div);
                innerDiv.appendChild(innerInnerDiv);

                chatSellerMessagesConversation.appendChild(innerDiv);

                console.log(change.data());
              });
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
        const chatReference = await firebase
          .firestore()
          .collection(
            `/chats/${user.displayName}/chats/${chatWithObject.username}/messages`
          )
          .add({
            type: "text",
            message: chatMessageText.textContent,
            to: chatWithObject.username,
            from: user.displayName,
            createdAt: new Date().toISOString(),
          });

        firebase
          .firestore()
          .doc(`/chats/${user.displayName}/chats/${chatWithObject.username}`)
          .set(
            {
              lastMessage: chatMessageText.textContent,
              lastUpdated: new Date(),
            },
            { merge: true }
          )
          .then(() => {
            firebase
              .firestore()
              .collection(
                `/chats/${chatWithObject.username}/chats/${user.displayName}/messages`
              )
              .add({
                type: "text",
                message: chatMessageText.textContent,
                from: chatWithObject.username,
                to: user.displayName,
                createdAt: new Date(),
              })
              .then((reference) => {
                console.log(reference);

                firebase
                  .firestore()
                  .doc(
                    `/chats/${chatWithObject.username}/chats/${user.displayName}`
                  )
                  .set(
                    {
                      lastMessage: chatMessageText.textContent,
                      lastUpdated: new Date(),
                    },
                    { merge: true }
                  );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        chatReference.onSnapshot(function (change) {
          let innerDiv = document.createElement("div");
          innerDiv.setAttribute("class", "first-message-right");

          let innerInnerDiv = document.createElement("div");
          innerInnerDiv.setAttribute("class", "firstmessages--main-div");

          let div = document.createElement("div");
          div.setAttribute("class", "messagee messagee-right");
          div.textContent = change.data().message;

          innerInnerDiv.appendChild(div);
          innerDiv.appendChild(innerInnerDiv);

          chatSellerMessagesConversation.appendChild(innerDiv);

          console.log(change.data());
        });
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
                  .firestore()
                  .collection(
                    `/chats/${user.displayName}/chats/${chatWithObject.username}/messages`
                  )
                  .add({
                    type: "image",
                    message: imageSentURL,
                    from: user.displayName,
                    to: chatWithObject.username,
                    createdAt: new Date(),
                  })
                  .then((reference) => {
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
        .doc(user.displayName)
        .collection("chats")
        .orderBy("lastUpdated", "desc")
        .limit(1)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());

            loadMessages(doc.data().username);
          });
        });
    }
  });
}

getChatRooms();
getMainChat();
