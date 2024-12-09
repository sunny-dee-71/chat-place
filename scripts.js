
// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Your Firebase configuration
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
const db = getDatabase(app);  // Initialize the Realtime Database

// Reference to the 'messages' node in the database
const messagesRef = ref(db, 'messages');

// Send message function
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message) {
    // Push the message to Firebase
    push(messagesRef, {
      text: message,
      timestamp: Date.now()
    });
    messageInput.value = ''; // Clear the input field after sending
  }
};

// Display messages
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  const message = snapshot.val();

  const messageElement = document.createElement('div');
  messageElement.textContent = message.text;
  messagesContainer.appendChild(messageElement);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Scroll to the bottom
};

// Listen for new messages added to the database
onChildAdded(messagesRef, displayMessages);

// Event listener for the 'Send' button
document.getElementById('send-btn').addEventListener('click', sendMessage);

// Allow pressing "Enter" to send the message
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
