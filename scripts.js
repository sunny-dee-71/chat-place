// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
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

// Reference to 'messages' node in Firebase Realtime Database
const messagesRef = ref(db, 'messages');

// Send message function
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();  // Trim spaces

  if (message) {
    // Push message to Firebase
    push(messagesRef, {
      text: message,
      timestamp: Date.now()
    });

    messageInput.value = '';  // Clear input field after sending
  }
};

// Display messages in the chat container
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  const message = snapshot.val();  // Get message from snapshot

  const messageElement = document.createElement('div');
  messageElement.textContent = message.text;  // Display message text
  messagesContainer.appendChild(messageElement);

  // Scroll to the bottom to see the newest message
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

// Listen for new messages added to Firebase
onChildAdded(messagesRef, displayMessages);

// Event listener for Send button
document.getElementById('send-btn').addEventListener('click', sendMessage);

// Optional: Allow pressing Enter to send the message
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
