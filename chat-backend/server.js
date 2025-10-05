// Import required modules
const express = require("express"); // Web framework for Node.js
const mongoose = require("mongoose"); // MongoDB ODM (Object Data Modeling)
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const http = require("http"); // Node.js HTTP module for creating the server
const { Server } = require("socket.io"); // Socket.IO for real-time communication
const ChatMessage = require("./models/ChatMessage"); // Mongoose model for chat messages

// Initialize Express app
const app = express();

// Create HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO server with CORS enabled for all origins
const io = new Server(server, {
  cors: {
    origin: "*" // Allow all origins (in production, specify allowed origins)
  }
});

// Define port to use (from environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS and JSON payloads
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Handle new client connection to Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming messages from client
  socket.on("sendMessage", async (data) => {
    try {
      const { user, message } = data;

      // Create a new chat message document and save to MongoDB
      const chatMessage = new ChatMessage({ user, message });
      await chatMessage.save();

      // Emit the new message to all connected clients
      io.emit("message", chatMessage);
    } catch (error) {
      console.error("Error saving or broadcasting message:", error);
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server and listen on the defined port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
