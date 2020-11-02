(function (window, document, undefined) {
  "use strict";

  let sendReportButton = document.getElementById("send-report-button-id");

  let inputFile = document.getElementById("addImg1");

  let rowOfPhotos = document.getElementById("support-row-photos-id");

  sendReportButton.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("signed in");
        
        let nameOfProblemValue = document.getElementById("support-problem-name-id").value;
        let descriptionOfProblemValue = document.getElementById("productDescriptionInput").innerText;

        if (nameOfProblemValue.length !== 0 && descriptionOfProblemValue.length !== 0) {
          let problemReference = firebase.firestore().collection("problems").doc();

          let problem = {
            user: user.displayName,
            name: nameOfProblemValue,
            status: "Unresolved",
            createdAt: new Date(),
            userEmail: user.email,
            userPhoto: user.photoURL,
            description: descriptionOfProblemValue
          }
          
          problemReference.set(problem).then(function () {
            problemReference.set(
              {
                problemId: problemReference.id,
              },
              { merge: true }
            ) 
          })
          .catch(function (error) {
            console.log(error);
          });
          
          alert("Problem submitted");
          window.location.href = "homepage.html";
        } else {
          alert("You have to write something");
        }
      } else {
      console.log("Not signed in");
      }
    });
    console.log("clicked send");
  });



  let numberOfImages = 0;
  let imagesArray = [];

  function addImageToForm(e) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let files = e.target.files;
        if (numberOfImages + files.length > 1) {
          alert("You can only upload at most 1 file!");
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
      
              //const reference = firebase.storage().ref(`${username}/document_images/` + file.name);
      
              let divDocument = document.createElement("div");
              let divDocumentClose = document.createElement("div");
              let image = document.createElement("img");
      
              divDocument.setAttribute("class", "id-document");
              divDocumentClose.setAttribute("class", "id-document-close");
              divDocumentClose.setAttribute("style", "margin-right: 59px;");

              divDocumentClose.addEventListener("click", function () {
                divDocument.style.display = "none";
                numberOfImages--;
                const reference = firebase.storage().ref(`${user.displayName}/problem_images/` + file.name);
                reference
                  .delete();
                  //.then(snapshot => snapshot.ref.getDownloadURL());
              });
              image.setAttribute("class", "image-preview");
              image.setAttribute(
                "style",
                "width: 85px; height: 78px; margin-left: -55px; border-radius: 20px;"
              );
              image.setAttribute("src", imageFile.result);
      
              divDocument.appendChild(divDocumentClose);
              divDocument.appendChild(image);
              rowOfPhotos.appendChild(divDocument);
            });
            const reference = firebase.storage().ref(`${user.displayName}/problem_images/` + file.name);
            reference
              .put(file)
              .then(snapshot => snapshot.ref.getDownloadURL())
              .then(url => {
                imagesArray.push(url);
                //window.alert(url);
               });
            reader.readAsDataURL(file);
          } else {
            image.style.display = null;
          }
        }
      } else {
        console.log("Not logged in");
      }
    });
  }

  inputFile.addEventListener("change", addImageToForm, false);

})(window, document);
