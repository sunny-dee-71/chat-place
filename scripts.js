// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration (replace with your actual credentials from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCvkwIdF7Uc1ga-O0j6jMniJ0CgSDIlM7U",
  authDomain: "chat-place-e2479.firebaseapp.com",
  databaseURL: "https://chat-place-e2479-default-rtdb.firebaseio.com",
  projectId: "chat-place-e2479",
  storageBucket: "chat-place-e2479.firebasestorage.app",
  messagingSenderId: "201517086579",
  appId: "1:201517086579:web:c2404d1df36ac01134b706",
  measurementId: "G-ESCMY4GS2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);  // Initialize Realtime Database

// Reference to the 'messages' node in Firebase Realtime Database
const messagesRef = ref(db, 'messages');

// Display messages in the chat container when they're added to Firebase
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  const message = snapshot.val();  // Get message from snapshot

  if (message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message.text;  // Display message text
    messagesContainer.appendChild(messageElement);

    // Scroll to the bottom to see the newest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

// Listen for new messages added to Firebase
onChildAdded(messagesRef, displayMessages);

// Send message to Firebase
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();  // Clean up whitespace

  if (message) {
    const messageData = {
      text: message,
      timestamp: Date.now()
    };

    console.log("Sending message to Firebase:", messageData);  // Log what we're sending

    push(messagesRef, messageData)
      .then(() => {
        console.log("Message successfully pushed to Firebase");
        messageInput.value = '';  // Clear input after sending
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Error sending message. Check console for details.");  // Show an alert for debugging
      });
  }
};

// Attach the sendMessage function to the "Send" button
const sendButton = document.getElementById('send-btn');
sendButton.addEventListener('click', sendMessage);
