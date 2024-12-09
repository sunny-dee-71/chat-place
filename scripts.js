// Firebase configuration (replace with your Firebase config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
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
