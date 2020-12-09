let nickname = document.getElementById("user-nickname-id");
let verified = document.getElementById("verified-span-id");
let followers = document.getElementById("followers-id");
let following = document.getElementById("following-id");

let sellingButton = document.getElementById("selling-button-id");
let aboutButton = document.getElementById("about-button-id");
// What user is selling
let textSelling = document.getElementById("selling-text-id");
let divMainSelling = document.getElementById("product-list-selling-id");
// Description of user
let textAbout = document.getElementById("about-text-id");

let followButton = document.getElementById("follow-button-id");
let unfollowButton = document.getElementById("unfollow-button-id");
let settings = document.getElementById("settings-div-id");
let message = document.getElementById("message-div-id");

// FOLLOWERS
let popupFollowers = document.getElementById("popup-followers-id");
let closeModalFollowers = document.getElementById("close-followers-modal-id");
let divMainFollowersList = document.getElementById("followers-list-id");

// FOLLOWING
let popupFollowing = document.getElementById("popup-following-id");
let closeModalFollowing = document.getElementById("close-following-modal-id");
let divMainFollowingList = document.getElementById("following-list-id");

// REVIEWS
let reviews = document.getElementById("user-reviews-id");
let popupReviews = document.getElementById("popup-reviews-id");
let closeModalReviews = document.getElementById("close-reviews-modal-id");
let divReviews = document.getElementById("reviews-list-id");

let profilePicture = document.getElementById("main-seller-image-id");

const url = new URL(window.location.href);
let userId = url.searchParams.get("id");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("user-not-logged-in-header-id").style.display =
      "none";
    document.getElementById("user-logged-in-header-id").style.display = "block";
  } else {
    document.getElementById("user-not-logged-in-header-id").style.display =
      "block";
    document.getElementById("user-logged-in-header-id").style.display = "none";
  }
});

function getUserDetails() {
  firebase.auth().onAuthStateChanged(function (user) {
    let userFollowers = [];
    let numberOfFollowers;
    let numberOfFollowing;

    let userReference = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          alert("User does not exist");
          if (!user) {
            location.href = "index.html";
          }
        }
        console.log(snapshot.data().description);
        userFollowers = snapshot.data().followers;
        numberOfFollowing = snapshot.data().following.length;
        numberOfFollowers = snapshot.data().followers.length;
        nickname.textContent = snapshot.data().username;
      })
      .then(() => {
        firebase
          .firestore()
          .collection("reviews")
          .doc(userId)
          .collection("reviews")
          .get()
          .then((snapshot) => {
            let size = snapshot.size;

            firebase
              .firestore()
              .collection("reviews")
              .doc(userId)
              .collection("reviews")
              .where("status", "==", "Positive")
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                  reviews.style.display = "block";
                }
                let percentage = (querySnapshot.size * 100) / size;
                document.getElementById(
                  "span-success-rate-id"
                ).textContent = `${percentage.toFixed(0)}%`;
                document.getElementById(
                  "span-additional-rate-id"
                ).textContent = `Success Rate out of ${size} Orders`;

                let greenLine = document.getElementById("green-line-id");
                let redLine = document.getElementById("red-line-id");

                greenLine.style.width = `${percentage.toFixed(0)}%`;
                redLine.style.width = `${100 - percentage.toFixed(0)}%`;
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });

    if (user) {
      // If same user and logged
      if (userId === user.displayName) {
        settings.style.display = "block";
        message.style.display = "none";
        console.log("Same user");

        settings.addEventListener("click", function () {
          window.location.href = "settings.html";
        });
      } else {
        // If different user and logged
        settings.style.display = "none";
        message.style.display = "block";

        message.addEventListener("click", function () {
          let PROFILE_PHOTO;

          let chatname = generateChatRoomName(user.displayName, userId);
          console.log(chatname);

          firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((snapshot) => {
              PROFILE_PHOTO = snapshot.data().profilePicture;
            })
            .then(() => {
              let chat = firebase.firestore().collection("chats").doc(chatname);

              if (chat && chat.exists) {
                chat
                  .update({
                    lastUpdated: new Date(),
                  })
                  .then(() => {
                    console.log("Chat updated");
                  })
                  .then(() => {
                    firebase
                      .firestore()
                      .collection("userchats")
                      .doc(user.displayName)
                      .collection("userchats")
                      .doc(userId)
                      .set(
                        {
                          lastUpdated: new Date(),
                        },
                        { merge: true }
                      )
                      .then(() => {
                        firebase
                          .firestore()
                          .collection("userchats")
                          .doc(userId)
                          .collection("userchats")
                          .doc(user.displayName)
                          .set(
                            {
                              lastUpdated: new Date(),
                            },
                            { merge: true }
                          )
                          .then(() => {
                            location.href = `chat.html?id=${userId}`;
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      })
                      .then(() => {
                        console.log("Everything updated");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                chat
                  .set({
                    lastUpdated: new Date(),
                    lastMessage: "",
                    user1: user.displayName,
                    user2: userId,
                    user1Photo: user.photoURL,
                    user2Photo: PROFILE_PHOTO,
                  })
                  .then(() => {
                    console.log("Chat set");
                  })
                  .then(() => {
                    let userchatReference = firebase
                      .firestore()
                      .collection("userchats")
                      .doc(user.displayName)
                      .collection("userchats")
                      .doc(userId);

                    console.log(userchatReference.id);

                    userchatReference
                      .set({
                        username: userId,
                        userPhoto: PROFILE_PHOTO,
                        lastMessage: "",
                        lastUpdated: new Date(),
                      })
                      .then(() => {
                        userchatReference
                          .set(
                            {
                              userchatId: userchatReference.id,
                            },
                            { merge: true }
                          )
                          .then(() => {
                            let userchatOtherReference = firebase
                              .firestore()
                              .collection("userchats")
                              .doc(userId)
                              .collection("userchats")
                              .doc(user.displayName);

                            console.log(userchatOtherReference.id);

                            userchatOtherReference
                              .set({
                                username: user.displayName,
                                userPhoto: user.photoURL,
                                lastMessage: "",
                                lastUpdated: new Date(),
                              })
                              .then(() => {
                                userchatOtherReference
                                  .set(
                                    {
                                      userchatId: userchatOtherReference.id,
                                    },
                                    { merge: true }
                                  )
                                  .then(() => {
                                    console.log(
                                      "Created new userchat for both users"
                                    );
                                    location.href = `chat.html?id=${userId}`;
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      })
                      .then(() => {
                        console.log("Done");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
        console.log(JSON.stringify(userFollowers));

        // If different user and logged
        if (userFollowers.includes(user.displayName)) {
          // If follower and logged
          console.log("yes following");

          unfollowButton.style.display = "inline-block";
          followButton.style.display = "none";

          unfollowButton.addEventListener("click", unfollowUserEvent);
        } else {
          // If not follower and logged
          console.log("no following");

          followButton.style.display = "inline-block";
          unfollowButton.style.display = "none";

          followButton.addEventListener("click", followUserEvent);
        }
      }

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then(function (snapshot) {
          console.log(snapshot.data());
          if (snapshot.data().profilePicture !== null) {
            profilePicture.setAttribute(
              "style",
              `background:url(${
                snapshot.data().profilePicture
              }); background-size: cover;`
            );
          }
          following.textContent = `${numberOfFollowing} following`;
          followers.textContent = `${numberOfFollowers} followers`;

          removeFollowers();
        });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          PROFILE_PHOTO = snapshot.data().profilePicture;
        })
        .catch((error) => {
          console.log(error);
        });

      console.log(JSON.stringify(userFollowers));

      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then(function (snapshot) {
          console.log(snapshot.data());
          if (snapshot.data().profilePicture !== null) {
            profilePicture.setAttribute(
              "style",
              `background:url(${
                snapshot.data().profilePicture
              }); background-size: cover;`
            );
          }
          following.textContent = `${numberOfFollowing} following`;
          followers.textContent = `${numberOfFollowers} followers`;
        });

      removeFollowers();

      console.log("Not logged in");
    }

    if (user) {
      let userCurrentReference = firebase
        .firestore()
        .collection("users")
        .doc(user.displayName);

      function followUserEvent() {
        unfollowButton.style.display = "inline-block";
        followButton.style.display = "none";

        removeFollowers();
        console.log("You started following " + userId);

        userReference
          .update({
            followers: firebase.firestore.FieldValue.arrayUnion(
              user.displayName
            ),
          })
          .then(() => {
            userCurrentReference
              .update({
                following: firebase.firestore.FieldValue.arrayUnion(userId),
              })
              .then(() => {
                getFollowersCount();
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("notifications")
                  .doc(userId)
                  .collection("notifications")
                  .add({
                    typeOfNotification: "General",
                    action: "followed you",
                    userPhoto: user.photoURL,
                    from: user.displayName,
                    createdAt: new Date(),
                    seen: false,
                  })
                  .then((reference) => {
                    console.log("Successfuly added notification " + reference);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        followButton.removeEventListener("click", followUserEvent);
        unfollowButton.removeEventListener("click", unfollowUserEvent);
      }

      function unfollowUserEvent() {
        followButton.style.display = "inline-block";
        unfollowButton.style.display = "none";

        removeFollowers();
        console.log("You stopped following " + userId);

        userReference
          .update({
            followers: firebase.firestore.FieldValue.arrayRemove(
              user.displayName
            ),
          })
          .then(() => {
            userCurrentReference
              .update({
                following: firebase.firestore.FieldValue.arrayRemove(userId),
              })
              .then(() => {
                getFollowersCount();
              })
              .then(() => {
                console.log("Unfollowed success");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        followButton.removeEventListener("click", followUserEvent);
        unfollowButton.removeEventListener("click", unfollowUserEvent);
      }
    }
  });
}

function getFollowersCount() {
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((snapshot) => {
      following.textContent = `${snapshot.data().following.length} followers`;
      followers.textContent = `${snapshot.data().followers.length} followers`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function isVerfiedCheck() {
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        if (snapshot.data().verified === true) {
          console.log("Not Verified");
          verified.style.display = "inline-block";
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

isVerfiedCheck();

// FOLLOWERS
followers.addEventListener("click", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    popupFollowers.style.display = "block";

    closeModalFollowers.addEventListener("click", function () {
      popupFollowers.style.display = "none";
      removeThereIsNothing();
      removeFollowers();
    });

    let userReference;
    let followersOfUser = [];
    let followersOfFollower = [];
    let followerImage;
    let followerUsername;
    let followerFollowers = [];

    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((snapshot) => {
        followersOfUser = snapshot.data().followers;
        console.log(followersOfUser);

        if (followersOfUser.length === 0) {
          removeFollowers();
          let div = document.createElement("div");
          div.setAttribute("class", "no-something");
          div.textContent = "there are no followers";
          divMainFollowersList.appendChild(div);
        } else {
          let userCollectionReference = firebase
            .firestore()
            .collection("users");

          if (user) {
            userCollectionReference
              .doc(user.displayName)
              .get()
              .then((snapshot) => {
                userReference = snapshot.data();
              })
              .catch((error) => {
                console.log(error);
              });
          }

          console.log(followersOfUser);

          followersOfUser.forEach((follower) => {
            removeThereIsNothing();
            let following = false;

            console.log(follower);

            userCollectionReference
              .doc(follower)
              .get()
              .then((snapshot) => {
                followersOfFollower = snapshot.data();
                console.log(followersOfFollower);
                console.log("Username " + followersOfFollower.username);
                console.log("Image " + followersOfFollower.profilePicture);
                console.log("followers " + followersOfFollower.followers);

                let divMainFollower = document.createElement("div");
                divMainFollower.setAttribute("class", "main-followers-list-2");

                let divFollower = document.createElement("div");
                divFollower.setAttribute("class", "main-followers-list-3");

                let username = document.createElement("div");
                username.setAttribute("class", "main-followers-text");
                username.textContent = followersOfFollower.username;

                let image = document.createElement("div");
                image.setAttribute("class", "main-followers-img");

                if (followersOfFollower.profilePicture !== null) {
                  image.setAttribute(
                    "style",
                    `background-image:url(${followersOfFollower.profilePicture}); background-size: cover;`
                  );
                }

                image.addEventListener("click", function () {
                  window.location.href = `user.html?id=${username.textContent}`;
                });

                console.log(followersOfFollower.username);

                let follow = document.createElement("div");
                if (user) {
                  if (followersOfFollower.username !== user.displayName) {
                    if (
                      followersOfFollower.followers.includes(user.displayName)
                    ) {
                      following = true;
                      console.log("User is in followers");
                      follow.setAttribute("class", "unfollow-for-modal-btn");
                      follow.textContent = "unfollow";
                    } else {
                      following = false;
                      console.log("User is not in followers");
                      follow.setAttribute("class", "follow-for-modal-btn");
                      follow.textContent = "follow";
                    }
                  }
                } else {
                  following = false;
                  console.log("User is not in followers");
                  follow.setAttribute("class", "follow-for-modal-btn");
                  follow.textContent = "follow";
                }

                follow.addEventListener("click", toggleFollowUserEvent);

                divFollower.appendChild(image);
                divFollower.appendChild(username);
                divMainFollower.appendChild(divFollower);
                divMainFollower.appendChild(follow);
                divMainFollowersList.appendChild(divMainFollower);

                function toggleFollowUserEvent() {
                  if (!user) {
                    location.href = "sign-in.html";
                    return;
                  }

                  if (following === false) {
                    following = true;
                    follow.textContent = "unfollow";
                    follow.setAttribute("class", "unfollow-for-modal-btn");

                    userCollectionReference
                      .doc(follower)
                      .update({
                        followers: firebase.firestore.FieldValue.arrayUnion(
                          user.displayName
                        ),
                      })
                      .then(() => {
                        userCollectionReference
                          .doc(user.displayName)
                          .update({
                            following: firebase.firestore.FieldValue.arrayUnion(
                              follower
                            ),
                          })
                          .then(() => {
                            getFollowersCount();
                            console.log("Added to following");
                          })
                          .then(() => {
                            firebase
                              .firestore()
                              .collection("notifications")
                              .doc(follower)
                              .collection("notifications")
                              .add({
                                typeOfNotification: "General",
                                action: "followed you",
                                userPhoto: user.photoURL,
                                from: user.displayName,
                                createdAt: new Date(),
                                seen: false,
                              })
                              .then((reference) => {
                                console.log(
                                  "Successfuly added notification " + reference
                                );
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      })
                      .then(() => {
                        console.log("User " + user.displayName);
                        console.log("Successfully followed");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    following = false;
                    follow.textContent = "follow";
                    follow.setAttribute("class", "follow-for-modal-btn");

                    userCollectionReference
                      .doc(follower)
                      .update({
                        followers: firebase.firestore.FieldValue.arrayRemove(
                          user.displayName
                        ),
                      })
                      .then(() => {
                        userCollectionReference
                          .doc(user.displayName)
                          .update({
                            following: firebase.firestore.FieldValue.arrayRemove(
                              follower
                            ),
                          })
                          .then(() => {
                            console.log("Removed from following");
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      })
                      .then(() => {
                        console.log("Successfully unfollowed");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }

                  follow.removeEventListener("click", toggleFollowUserEvent);
                }
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// FOLLOWING
following.addEventListener("click", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    popupFollowing.style.display = "block";

    closeModalFollowing.addEventListener("click", function () {
      popupFollowing.style.display = "none";
      removeThereIsNothing();
      removeFollowers();
    });

    let userReference;
    let followingOfUser = [];
    let followingOfFollower = [];
    let followerImage;
    let followerUsername;
    let followerFollowers = [];

    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((snapshot) => {
        followingOfUser = snapshot.data().following;
        console.log(followingOfUser);

        if (followingOfUser.length === 0) {
          removeFollowers();
          let div = document.createElement("div");
          div.setAttribute("class", "no-something");
          div.textContent = "there are no following";
          divMainFollowingList.appendChild(div);
        } else {
          let userCollectionReference = firebase
            .firestore()
            .collection("users");

          userCollectionReference
            .doc(user.displayName)
            .get()
            .then((snapshot) => {
              userReference = snapshot.data();
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(followingOfUser);

          followingOfUser.forEach((follower) => {
            removeThereIsNothing();

            console.log(follower);

            userCollectionReference
              .doc(follower)
              .get()
              .then((snapshot) => {
                followingOfFollower = snapshot.data();
                console.log(followingOfFollower);
                console.log("Username " + followingOfFollower.username);
                console.log("Image " + followingOfFollower.profilePicture);
                console.log("followers " + followingOfFollower.followers);

                let divMainFollower = document.createElement("div");
                divMainFollower.setAttribute("class", "main-followers-list-2");

                let divFollower = document.createElement("div");
                divFollower.setAttribute("class", "main-followers-list-3");

                let username = document.createElement("div");
                username.setAttribute("class", "main-followers-text");
                username.textContent = followingOfFollower.username;

                let image = document.createElement("div");
                image.setAttribute("class", "main-followers-img");

                if (followingOfFollower.profilePicture !== null) {
                  image.setAttribute(
                    "style",
                    `background-image:url(${followingOfFollower.profilePicture}); background-size: cover;`
                  );
                }

                image.addEventListener("click", function () {
                  window.location.href = `user.html?id=${username.textContent}`;
                });

                console.log(followingOfFollower.username);

                let unfollow = document.createElement("div");
                unfollow.setAttribute("class", "unfollow-for-modal-btn");
                unfollow.textContent = "unfollow";

                console.log("User is following");

                unfollow.addEventListener("click", unfollowUserEvent);

                divFollower.appendChild(image);
                divFollower.appendChild(username);
                divMainFollower.appendChild(divFollower);
                divMainFollower.appendChild(unfollow);
                divMainFollowingList.appendChild(divMainFollower);

                function unfollowUserEvent() {
                  if (!user) {
                    location.href = "sign-in.html";
                    return;
                  }

                  unfollow.textContent = "follow";
                  unfollow.setAttribute("class", "follow-for-modal-btn");

                  userCollectionReference
                    .doc(follower)
                    .update({
                      followers: firebase.firestore.FieldValue.arrayRemove(
                        user.displayName
                      ),
                    })
                    .then(() => {
                      userCollectionReference
                        .doc(user.displayName)
                        .update({
                          following: firebase.firestore.FieldValue.arrayRemove(
                            follower
                          ),
                        })
                        .then(() => {
                          getFollowersCount();
                          console.log("Unfollowed");
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .then(() => {
                      console.log("User " + user.displayName);
                      console.log("Successfully unfollowed");
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  unfollow.removeEventListener("click", unfollowUserEvent);
                }
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// REVIEWS
reviews.addEventListener("click", function () {
  popupReviews.style.display = "block";

  firebase
    .firestore()
    .collection("reviews")
    .doc(userId)
    .collection("reviews")
    .get()
    .then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.docs.forEach((doc) => {
          let review = doc.data();

          let divMainReview = document.createElement("div");
          divMainReview.setAttribute(
            "class",
            "allordderaction reviews-changes"
          );

          let divUsername = document.createElement("div");
          divUsername.setAttribute("class", "history-order-nickname");
          divUsername.textContent = review.username;

          let divDescription = document.createElement("div");
          divDescription.setAttribute(
            "class",
            "history-order-nickname mn-change"
          );
          divDescription.textContent = review.description;

          let timeagoSpan = document.createElement("span");
          timeagoSpan.textContent = getTimeSince(
            review.createdAt.seconds * 1000
          );

          let divReviewIcon = document.createElement("div");
          if (review.status === "Positive") {
            divReviewIcon.setAttribute("class", "positive-review");
          } else {
            divReviewIcon.setAttribute("class", "negative-review");
          }

          divDescription.appendChild(timeagoSpan);
          divMainReview.appendChild(divUsername);
          divMainReview.appendChild(divDescription);
          divMainReview.appendChild(divReviewIcon);

          divReviews.appendChild(divMainReview);
        });
      } else {
        let div = document.createElement("div");
        div.setAttribute("class", "no-something");
        div.textContent = "there are no reviews";

        divReviews.appendChild(div);
      }
    })
    .then(() => {
      console.log("Successfully displayed reviewers");
    })
    .catch((error) => {
      console.log(error);
    });

  closeModalReviews.addEventListener("click", function () {
    popupReviews.style.display = "none";
    removeEmptySpace();
    removeReviews();
  });
});

getUserDetails();

let postsArray = [];
const getPosts = async () => {
  removePosts();
  let docs;
  let postsSize;
  let lastVisible;
  let postsReference = firebase
    .firestore()
    .collection("games")
    .where("seller", "==", userId)
    .orderBy("createdAt");

  await postsReference.get().then((snapshot) => {
    docs = snapshot;
    postsSize = snapshot.size;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    // console.log("last", lastVisible.data());
  });
  docs["docs"].forEach((doc) => {
    postsArray.push(doc.data());
  });

  if (postsSize > 0) {
    textSelling.style.display = "none";
    postsArray.forEach((post) => {
      createPost(post);
    });
    postsArray = [];
  } else {
    textSelling.style.display = "block";
  }
};

function createPost(post) {
  let div = document.createElement("div");
  div.setAttribute("class", "product-home-show");
  div.setAttribute("style", "margin-top: 34px");

  let divSellerRoundImage = document.createElement("div");
  divSellerRoundImage.setAttribute("class", "seller-round-image");
  divSellerRoundImage.setAttribute("style", "background-size: cover;");

  if (post.sellerPhoto !== null) {
    divSellerRoundImage.setAttribute(
      "style",
      `background:url(${post.sellerPhoto}); background-size: cover;`
    );
  }

  let divSellerName = document.createElement("div");
  divSellerName.setAttribute("class", "seller-name");

  let divVerified = document.createElement("div");
  divVerified.setAttribute("class", "verified");

  let divProductDescription = document.createElement("div");
  divProductDescription.setAttribute("class", "product-description");

  let divProductDescriptionMiniSign = document.createElement("div");

  if (post.category === "Accounts") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign"
    );
  } else if (post.category === "Items") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-2"
    );
  } else if (post.category === "GameCoins") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-3"
    );
  } else if (post.category === "Boosting") {
    divProductDescriptionMiniSign.setAttribute(
      "class",
      "category-product-listed-mini-sign category-product-listed-mini-sign-4"
    );
  } else {
    console.log("Problem with catogry icon");
  }

  let divProductName = document.createElement("div");
  divProductName.setAttribute("class", "listed-game-name");

  let divProductPrice = document.createElement("div");
  divProductPrice.setAttribute("class", "price-game-listed");

  let divProductPriceArrow = document.createElement("span");
  divProductPriceArrow.setAttribute("class", "arrow-right-price");

  let divProductPriceSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  divProductPriceSVG.setAttribute(
    "class",
    "feather feather-chevron-right chevron-for-payment"
  );
  divProductPriceSVG.setAttributeNS(null, "viewBox", "0 0 " + 24 + " " + 24);
  divProductPriceSVG.setAttributeNS(null, "width", 24);
  divProductPriceSVG.setAttributeNS(null, "height", 24);
  divProductPriceSVG.setAttributeNS(null, "fill", "none");
  divProductPriceSVG.setAttributeNS(null, "stroke-width", 2);
  divProductPriceSVG.setAttributeNS(null, "stroke", "currentColor");
  divProductPriceSVG.setAttributeNS(null, "stroke-linecap", "round");
  divProductPriceSVG.setAttributeNS(null, "stroke-linejoin", "round");

  let divProductPricePolyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  divProductPricePolyline.setAttributeNS(null, "points", "9 18 15 12 9 6");

  divSellerName.textContent = post.seller;
  divProductDescription.textContent = post.description;
  divProductName.textContent = post.title;
  divProductPrice.textContent = `${post.price} EUR`;
  divSellerName.appendChild(divVerified);
  divProductDescription.appendChild(divProductDescriptionMiniSign);
  divProductPriceSVG.appendChild(divProductPricePolyline);
  divProductPriceArrow.appendChild(divProductPriceSVG);
  divProductPrice.appendChild(divProductPriceArrow);

  div.appendChild(divSellerRoundImage);
  div.appendChild(divSellerName);
  div.appendChild(divProductDescription);
  div.appendChild(divProductName);
  div.appendChild(divProductPrice);

  divMainSelling.appendChild(div);

  div.addEventListener("click", function () {
    window.location.href = `post.html?id=${post.postId}`;
  });
}

sellingButton.addEventListener("click", () => {
  console.log("Click selling");
  aboutButton.classList.remove("switch-1-selected");
  sellingButton.classList.add("switch-1-selected");
  textAbout.style.display = "none";
  getPosts();
});

aboutButton.addEventListener("click", () => {
  console.log("Click about");
  sellingButton.classList.remove("switch-1-selected");
  aboutButton.classList.add("switch-1-selected");
  textAbout.style.display = "block";
  textSelling.style.display = "none";

  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then(function (snapshot) {
      console.log(snapshot.data());
      if (
        snapshot.data().description !== undefined ||
        snapshot.data().description !== ""
      ) {
        textAbout.innerText = snapshot.data().description;
      } else {
        textAbout.innerText = "There is not description";
      }
    })
    .catch(function () {
      console.log("Could not read description of the store");
    });

  removePosts();
});

function generateChatRoomName(user1, user2) {
  let result = user1.toLowerCase().localeCompare(user2.toLowerCase());

  if (result === 1) {
    console.log(1);
    console.log(`${user2}+${user1}`);
    return `${user2}+${user1}`;
  }
  if (result === -1) {
    console.log(-1);
    console.log(`${user1}+${user2}`);
    return `${user1}+${user2}`;
  }
  console.log("last");
  //console.log(`${user1}+${user2}`);
  return `${user1}+${user2}`;
}

const removePosts = () => {
  let elements = document.getElementsByClassName("product-home-show");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeFollowers = () => {
  let elements = document.getElementsByClassName("main-followers-list-2");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeReviews = () => {
  let elements = document.getElementsByClassName(
    "allordderaction reviews-changes"
  );

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeEmptySpace = () => {
  let elements = document.getElementsByClassName("no-something");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const removeThereIsNothing = () => {
  let elements = document.getElementsByClassName("no-something");

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

function getTimeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

getPosts();
