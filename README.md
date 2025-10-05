
# Chat Website using MERN Stack



A dynamic real-time chat web application built using the MERN stack — MongoDB, Express.js, React.js, and Node.js — combined with Socket.IO for real-time communication.

---

## Overview

The "Chat Website" project enables instant messaging between users with a simple and interactive UI. It uses a backend server as a middleman between the React frontend and MongoDB database. Socket.IO facilitates live, real-time message exchange.

---

## Preview

Here’s a glimpse of the final output:

---<img width="955" height="910" alt="Screenshot 2025-10-05 123405" src="https://github.com/user-attachments/assets/c1589fb4-b92e-4453-84ef-34dbbf86deb3" />
<img width="957" height="918" alt="Screenshot 2025-10-05 123356" src="https://github.com/user-attachments/assets/b8bca56c-3cc1-4509-907e-01d812ff3d96" />
<img width="953" height="954" alt="Screenshot 2025-10-05 123346" src="https://github.com/user-attachments/assets/dd7d57be-6806-4a8f-88d6-b37b4db4f8a3" />


## Approach to Create the Chat Website

1. Build the backend server to serve as a middleman between MongoDB and React frontend.
2. Design a simple and interactive UI where users can send messages and receive responses in real-time.
3. Use Socket.IO to support real-time bi-directional communication.
4. Store all chat messages in a MongoDB database.

---

## Steps to Create the Project

### Step 1: Create backend folder and initialize project

```bash
mkdir chat-backend
cd chat-backend
npm init -y
npm install express mongoose cors socket.io
````

---

### Step 2: Backend folder structure and dependencies

```
chat-backend/
├── server.js
├── models/
│   └── ChatMessage.js
├── package.json
└── ...
```

**Key dependencies in `package.json`:**

```json
"dependencies": {
  "cors": "^2.8.5",
  "express": "^4.18.2",
  "mongoose": "^8.0.4",
  "socket.io": "^4.7.3"
}
```

---

### Step 3: Create ChatMessage model (`models/ChatMessage.js`)

```js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
```

---

### Step 4: Start the backend server

```bash
node server.js
```

---

### Step 5: Create the frontend React app

```bash
cd ..
npx create-react-app chat-frontend
cd chat-frontend
npm install axios react-router-dom socket.io-client
```

---

### Step 6: Frontend folder structure and dependencies

```
chat-frontend/
├── src/
│   └── ChatRoom.js
├── package.json
└── ...
```

**Key dependencies in `package.json`:**

```json
"dependencies": {
  "axios": "^1.6.5",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.1",
  "socket.io-client": "^4.7.3",
  "styled-components": "^6.1.8"
}
```

---

### Step 7: Example `ChatRoom.js` component

```jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch initial messages from backend
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Listen for new messages via WebSocket
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (user && message) {
      socket.emit("sendMessage", { user, message });
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            <strong>{msg.user}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
```

---

### Step 8: Start the frontend React app

```bash
npm start
```

---

## Output

Open your browser at `http://localhost:3000` and test the chat by opening multiple tabs or different browsers to simulate multiple users chatting in real-time.

---

## Summary

You now have a working real-time chat application with:

* Backend server handling data and real-time events
* React frontend for interactive messaging
* MongoDB database for message persistence
* Socket.IO for live communication

---
