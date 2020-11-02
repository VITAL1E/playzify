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

let mainDivMessagesLeft = document.getElementById("first-message-div-id");
let divMessagesLeft = document.getElementById("firstmessages--main-div-id");

let div = document.createElement("div");
//div.setAttribute("class", "messagee");
//div.textContent = "Welcome to Zify";

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
    svg.setAttributeNS(
      null,
      "class",
      "feather feather-chevron-right chevron-for-chat"
    );

    chatProfileImageUserPart1.appendChild(chatSellerOnline);
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
      chatMessagesProfilePicturePart2.setAttribute(
        "style",
        `background-size: cover; background-image:url(${userChats.profilePhoto})`
      );

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
        PROFILE_PHOTO = snapshot.data().profilePicture
      })
      .catch((error) => {
        console.log(error);
      });

    } else {
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
        })
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
                `background-size: cover; background-image:url(${
                  PROFILE_PHOTO
                })`
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

// LOAD MESSAGES
async function loadMessages(userId) {
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
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
          snapshot.docs.forEach((message) => {
            console.log(message.data());
            let div = document.createElement("div");

            // if other user sent us message
            if (
              message.data().from === userId ||
              message.data().to === user.displayName
            ) {
              console.log("From him");
              div.setAttribute("class", "messagee");
              div.textContent = message.data().message;
              // if we sent the message
            } else {
              console.log("From me");
              div.setAttribute("class", "messagee messagee-right");
              div.textContent = message.data().message;
            }
            chatSellerMessagesConversation.appendChild(div);
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
            if (e.keyCode === 13) {
              if (!chatMessageText.textContent.trim()) {
                window.alert("type message");
                return;
              }
              const chatReference = await firebase
                .firestore()
                .collection(
                  `/chats/${user.displayName}/chats/${chatWithObject.username}/messages`
                )
                .add({
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
                  console.log("Added message");
                })
                .catch((error) => {
                  console.log(error);
                });

              chatReference.onSnapshot(function (change) {
                let div = document.createElement("div");
                div.setAttribute("class", "messagee messagee-right");
                div.textContent = change.data().message;

                chatSellerMessagesConversation.appendChild(div);

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
          window.alert("type message");
          return;
        }
        const chatReference = await firebase
          .firestore()
          .collection(
            `/chats/${user.displayName}/chats/${chatWithObject.username}/messages`
          )
          .add({
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
            console.log("Added message");
          })
          .catch((error) => {
            console.log(error);
          });

        chatReference.onSnapshot(function (change) {
          let div = document.createElement("div");
          div.setAttribute("class", "messagee messagee-right");
          div.textContent = change.data().message;

          chatSellerMessagesConversation.appendChild(div);

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

        let image = document.createElement("img");
        image.setAttribute("class", "image-preview");
        // image.setAttribute("style", "width: inherit; height: inherit; border-radius: 20px;");
        image.setAttribute("src", imageFile.result);

        const reference = firebase.storage().ref("chat_images/" + file.name);
        reference
        .put(file)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          // image.setAttribute("src", url);
          console.log(url);
        })
        .catch((error) => {
          console.log(error);
        });

        let divDocument = document.createElement("div");
        divDocument.setAttribute(
          "class",
          "messagee messagee-right chat-image-sent"
        );

        divDocument.appendChild(image);
        chatSellerMessagesConversation.appendChild(divDocument);

        divDocument.addEventListener("click", function () {
          // open images big
        });
        divDocument.setAttribute("style", `background-size: cover; background-image:url(${imageFile.result})`);
      });

      reader.readAsDataURL(file);
    } else {
      console.log("WTF not file");
    }
  }
}

inputFile.addEventListener("change", addImageToForm, false);

window.onload = function() {
  if(!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
  }
}

getChatRooms();
getMainChat();
