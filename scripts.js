// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvkwIdF7Uc1ga-O0j6jMniJ0CgSDIlM7U",
  authDomain: "chat-place-e2479.firebaseapp.com",
  databaseURL: "https://chat-place-e2479-default-rtdb.firebaseio.com",
  projectId: "chat-place-e2479",
  storageBucket: "chat-place-e2479.appspot.com",
  messagingSenderId: "201517086579",
  appId: "1:201517086579:web:c2404d1df36ac01134b706",
  measurementId: "G-ESCMY4GS2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to the 'messages' node in Firebase
const messagesRef = ref(db, 'messages');

// Generate a random username
const generateUsername = () => {
  const adjectives = ['Awesome', 'Crazy', 'Friendly', 'Mighty', 'Happy', 'Funny'];
  const nouns = ['Lion', 'Tiger', 'Panda', 'Shark', 'Penguin', 'Elephant'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
};

// Get or generate the username
let username = localStorage.getItem('username');
if (!username) {
  username = generateUsername();
  localStorage.setItem('username', username);
}

// State to track if replying
let replyToMessageId = null;
let replyToMessageText = null;

// Start the reply process
const startReplying = (messageId, originalMessage) => {
  replyToMessageId = messageId;
  replyToMessageText = originalMessage;

  const replyBanner = document.getElementById('reply-banner');
  document.getElementById('replying-to-text').textContent = `Replying to: "${originalMessage}"`;
  replyBanner.style.display = 'block';
};

// Cancel the reply process
const cancelReply = () => {
  replyToMessageId = null;
  replyToMessageText = null;

  const replyBanner = document.getElementById('reply-banner');
  replyBanner.style.display = 'none';
};

// Send a message to Firebase
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message) {
    const messageData = {
      text: message,
      username: username,
      timestamp: Date.now(),
      replyTo: replyToMessageText || null
    };

    push(messagesRef, messageData)
      .then(() => {
        messageInput.value = '';
        cancelReply();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Error sending message.");
      });
  }
};

// Display messages
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  const message = snapshot.val();
  const messageId = snapshot.key;

  if (message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.dataset.messageId = messageId;

    // Username
    const usernameElement = document.createElement('div');
    usernameElement.textContent = message.username;
    usernameElement.style.fontWeight = 'bold';
    messageElement.appendChild(usernameElement);

    // Reply-to message (if applicable)
    if (message.replyTo) {
      const replyToElement = document.createElement('div');
      replyToElement.textContent = `Replying to: "${message.replyTo}"`;
      replyToElement.style.fontStyle = 'italic';
      replyToElement.style.color = '#888';
      messageElement.appendChild(replyToElement);
    }

    // Message text
    const messageTextElement = document.createElement('div');
    messageTextElement.textContent = message.text;
    messageElement.appendChild(messageTextElement);

    // Add swipe event listener for reply functionality
    let startX = 0;

    messageElement.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    });

    messageElement.addEventListener('touchmove', (event) => {
      const touchX = event.touches[0].clientX;
      const swipeDistance = touchX - startX;

      // Trigger reply on swipe right
      if (swipeDistance > 50) {
        startReplying(messageId, message.text);
      }
    });

    // Add the message to the container
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }
};

// Listen for new messages
onChildAdded(messagesRef, displayMessages);

// Attach send button event listener
const sendButton = document.getElementById('send-btn');
sendButton.addEventListener('click', sendMessage);