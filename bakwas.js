const body = document.querySelector("body");
var room_name = "tanRi";
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername;
const firebaseConfig_cr = {
  apiKey: "AIzaSyA4Yds3L_Lgo-afrvtZhx0ArRcqYtQmyjM",
  authDomain: "unratedi.firebaseapp.com",
  databaseURL: "https://unratedi-default-rtdb.firebaseio.com",
  projectId: "unratedi",
  storageBucket: "unratedi.firebasestorage.app",
  messagingSenderId: "229728555750",
  appId: "1:229728555750:web:948202c62441f8dd9fe127",
};

const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");
let person = prompt("Please enter your name:", "tan");

if (person === "tan" || person === "Ri") {
  savedUsername = person;
} else {
  window.location = "new.html";
}

var finalTime;
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  var day = dt.getDate().toString().padStart(2, "0");
  var month = (dt.getMonth() + 1).toString().padStart(2, "0");
  dateDisplay = `${day}/${month}`;

  var timeString = dateDisplay + "-" + hours + ":" + minutes + " " + AmOrPm;
  finalTime = timeString;
}, 1000);

const db = firebaseApp_other.database();

const userRef = db.ref(`users/user${person}`);
const otherUserRef = db.ref(`users/user${person === "tan" ? "Ri" : "tan"}`);

// Main chat function for user load, chat load etc.- -------------------->
function getData() {
  // showall();
  console.log(savedUsername);
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      const output = document.getElementById("output");
      output.innerHTML = "";
      let previousSender = "";
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const messageType = childData.type;
        const messageKey = childSnapshot.key;

        const name_of_sender = childData.name;
        const time_get = childData.time;
        const isCurrentUser = name_of_sender === savedUsername;
        const alignment_time = isCurrentUser
          ? "left-align-time"
          : "right-align-time";
        const marginStyle =
          name_of_sender === previousSender ? "margin-top: -4px;" : "";

        const alignment = isCurrentUser ? "right-align2" : "left-align2";
        const alignmentClass = isCurrentUser ? "right-align" : "left-align";
        const border_align = isCurrentUser
          ? "20px 5px 20px 20px"
          : "5px 20px 20px 20px";
        const border_for_name =
          name_of_sender === previousSender
            ? "20px 20px 20px 20px"
            : border_align;

        if (messageType === "image") {
          const imageElement = childData.message;
          const img_name = childData.nameimage;
          const messageHTML =
            "<div class='main_msg_contain_img " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div id='" +
            messageKey +
            "' class='msg_contain_audio' " +
            " style='border-radius: " +
            border_for_name +
            ";'" +
            "onmousedown='startLongPress(this)' " +
            "onmouseup='clearLongPress()' " +
            "ontouchstart='startLongPress(this)' " +
            "ontouchend='clearLongPress()'" +
            " >" +
            "<img onclick='pop_img(this.src)' class='msg_contain_img' src = '" +
            imageElement +
            "' alt = '" +
            img_name +
            "' style = ' height:140px; border-radius:20px; margin-right:0px' >" +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</divclass=>" +
            "<br>";
          output.innerHTML += messageHTML;
          previousSender = name_of_sender;
        } else if (childData.message) {
          const message = childData.message;
          const messageHTML =
            "<div class='main_msg_contain " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div id='" +
            messageKey +
            "' class='msg_contain " +
            alignment +
            " ' style='border-radius: " +
            border_for_name +
            ";' " +
            "onmousedown='startLongPress(this)' " +
            "onmouseup='clearLongPress()' " +
            "ontouchstart='startLongPress(this)' " +
            "ontouchend='clearLongPress()'" +
            " >" +
            " <span class='message_text'>" +
            message +
            "</span> " +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</div>" +
            "<br>";

          output.innerHTML += messageHTML;

          previousSender = name_of_sender;
        }
      });
      output.scrollTop = output.scrollHeight;
    });
}
let longPressTimer;

let selectedMessageIds = [];

function startLongPress(element) {
  longPressTimer = setTimeout(() => {
    const elementId = element.id;
    element.style.backgroundColor = "red"; // Change background to red
    element.classList.add("selected");
    document.getElementById("btnCloseEmer").style.display = "block";
    selectedMessageIds.push(elementId);
    console.log(selectedMessageIds);
  }, 500); // 500ms for long press
}

function clearLongPress() {
  clearTimeout(longPressTimer); // Clear the timer if the press is released early
}

function deleteSelectedMessages() {
  // Reference to the Firebase chat room
  const chatRoomRef = firebaseApp_other.database().ref(room_name);

  // Loop through the selectedMessageIds and delete each corresponding message
  selectedMessageIds.forEach((messageId) => {
    // Delete the message with the specific ID from Firebase
    chatRoomRef
      .child(messageId)
      .remove()
      .then(() => {
        console.log(
          `Message with ID ${messageId} deleted successfully from Firebase.`
        );
      })
      .catch((error) => {
        console.error(`Error deleting message with ID ${messageId}:`, error);
      });
  });

  // Clear the selectedMessageIds list after deleting the messages
  selectedMessageIds = [];
  document.getElementById("btnCloseEmer").style.display = "none";
}

function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = "tanRi";
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    document.getElementById("msg").value = "";
  } else {
    console.log("Message cannot be empty");
  }
  previousSender = name;
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    send();
  }
});

function retrieveImage() {
  console.log("Retrieving latest image...");

  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          console.log("Latest image found:", imageDataUrl);

          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function clickattach() {
  console.log("file clicked");

  var input = document.getElementById("files");
  input.type = "file";
  input.onchange = (e) => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.top = "0px";
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
}

function uploadImage() {
  var fileInput = document.getElementById("files");

  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var fileName = file.name.split(".").slice(0, -1).join(".");
    console.log(fileName);
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        saveImageToDatabase(imageDataUrl, fileName);
        console.log("Image uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  } else {
    console.log("No file selected.");
  }
  document.getElementById("overlay").style.display = "none";
  retrieveImage();
}

function saveImageToDatabase(imageDataUrl, fileName, time) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      nameimage: fileName,
      time: finalTime,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
}

// document.addEventListener("keydown", function (event) {
//   if (event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
//     cancelImage();
//     document.getElementById("overlay_img").style.display = "none";
//   }
// });

function cancelImage() {
  document.getElementById("overlay").style.display = "none";
}

function pop_img(imageUrl) {
  document.getElementById("myimg_image").src = imageUrl;
  console.log(window.innerHeight);
  if (document.getElementById("myimg_image").height > window.innerHeight) {
    document.getElementById("myimg_image").height = window.innerHeight - 140;
  } //else{
  //   document.getElementById("myimg_image").height = "auto";

  // }
  document.getElementById("overlay_img").style.display = "block";
}

createChat();

function createChat() {
  var room_name1 = "tanRi";
  // Check if the chat room already exists
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        // If the chat room already exists with sender-receiver order
        navigateToChat(room_name1);
      } else {
        // If the chat room doesn't exist, create a new one
        firebaseApp_other
          .database()
          .ref("/")
          .child(room_name1)
          .update({
            purpose: "adding room name",
          })
          .then(() => {
            localStorage.setItem("room_name", room_name1);
            navigateToChat(room_name1);
            console.log("output");
          });
      }
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(room_name1) {
  localStorage.setItem("room_name", room_name1);
  console.log(localStorage.getItem("room_name"));
  getData();
}

function clearChat() {
  let chatRef = firebaseApp_other.database().ref(room_name);
  chatRef.remove();
  document.getElementById("overlay_clear").style.display = "none";
}
