// Your Firebase configuration (replace with your own credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Reference to the messages in the database
const messagesRef = database.ref('messages');

// Display messages from the database
messagesRef.on('child_added', function(snapshot) {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = message.username + ": " + message.text;
    document.getElementById('messages').appendChild(messageElement);
});

// Send a new message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;

    if (messageText.trim() !== "") {
        // Save the message to the Firebase database
        messagesRef.push({
            username: "Anonymous",  // You can replace this with a real username
            text: messageText
        });
        messageInput.value = ""; // Clear the input field
    }
}
