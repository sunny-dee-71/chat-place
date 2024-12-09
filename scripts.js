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
const db = getDatabase(app);
const messagesRef = ref(db, 'messages');

// Generate a random username
const generateUsername = () => {
  const adjectives = ['Awesome', 'Crazy', 'Friendly', 'Mighty', 'Happy', 'Funny'];
  const nouns = ['Lion', 'Tiger', 'Panda', 'Shark', 'Penguin', 'Elephant'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 1000)}`;
};

let username = localStorage.getItem('username');
if (!username) {
  username = generateUsername();
  localStorage.setItem('username', username);
}

let replyToMessage = null;

// Send a message to Firebase
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message) {
    const messageData = {
      text: message,
      username: username,
      timestamp: Date.now(),
      replyTo: replyToMessage ? {
        id: replyToMessage.id,
        text: replyToMessage.text,
        username: replyToMessage.username
      } : null
    };

    push(messagesRef, messageData)
      .then(() => {
        messageInput.value = '';
        replyToMessage = null;
        updateReplyBanner();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Error sending message. Check console for details.");
      });
  }
};

// Update the reply banner
const updateReplyBanner = () => {
  const replyBanner = document.getElementById('reply-banner');
  if (replyToMessage) {
    replyBanner.style.display = 'block';
    replyBanner.textContent = `Replying to: "${replyToMessage.text}" by ${replyToMessage.username}`;
  } else {
    replyBanner.style.display = 'none';
  }
};

// Display messages in the chat container
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  const message = snapshot.val();
  const id = snapshot.key;

  if (message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const usernameElement = document.createElement('div');
    usernameElement.textContent = message.username;
    usernameElement.style.fontWeight = 'bold';
    usernameElement.style.marginBottom = '5px';

    const messageTextElement = document.createElement('div');
    messageTextElement.textContent = message.text;

    // Show the reply preview if the message is a reply
    if (message.replyTo) {
      const replyPreview = document.createElement('div');
      replyPreview.className = 'reply-preview';
      replyPreview.textContent = `Replying to: "${message.replyTo.text}" by ${message.replyTo.username}`;
      messageElement.appendChild(replyPreview);
    }

    // Add a reply button
    const replyButton = document.createElement('button');
    replyButton.textContent = 'Reply';
    replyButton.className = 'reply-btn';
    replyButton.addEventListener('click', () => {
      replyToMessage = { id, text: message.text, username: message.username };
      updateReplyBanner();
    });

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(messageTextElement);
    messageElement.appendChild(replyButton);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};

// Listen for new messages
onChildAdded(messagesRef, displayMessages);

// Attach the sendMessage function to the "Send" button
const sendButton = document.getElementById('send-btn');
sendButton.addEventListener('click', sendMessage);
