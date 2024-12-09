// Firebase configuration (replace with your Firebase config)
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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const messagesRef = db.ref('messages');

// Send a message
const sendMessage = () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  if (message) {
    messagesRef.push({
      text: message,
      timestamp: Date.now()
    });
    messageInput.value = ''; // Clear input field
  }
};

// Display messages
const displayMessages = (snapshot) => {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = ''; // Clear previous messages

  snapshot.forEach(childSnapshot => {
    const message = childSnapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = message.text;
    messagesContainer.appendChild(messageElement);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
};

// Listen for new messages
messagesRef.on('child_added', displayMessages);

// Send button click handler
document.getElementById('send-btn').addEventListener('click', sendMessage);

// Allow pressing "Enter" to send message
document.getElementById('message-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
