const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(cors());


// const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/vibelink";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Connection schema
const connectionSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  connected_user_email: { type: String, required: true },
});

const Connection = mongoose.model("Connection", connectionSchema);

// Message schema
const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const SentMessage = mongoose.model("SentMessage", messageSchema);

// Routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ status: "success", message: "Login successful", username: user.username });
    } else {
      res.status(401).json({ status: "error", message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error executing query" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const newUser = new User({ email, password, username });
    await newUser.save();
    res.json({ status: "success", message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error creating user" });
  }
});

app.get("/chat-list", async (req, res) => {
  const email = req.headers.email;

  try {
    const connections = await Connection.find({ user_email: email });
    const connectedUserEmails = connections.map(connection => connection.connected_user_email);
    const users = await User.find({ email: { $in: connectedUserEmails } }, { username: 1, email: 1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ status: "error", message: "Error fetching users" });
  }
});


app.post("/add-chat", async (req, res) => {
  const email = req.headers.email;
  const useremail = req.headers.useremail;

  try {
    await Connection.create({ user_email: email, connected_user_email: useremail });
    await Connection.create({ user_email: useremail, connected_user_email: email });

    res.json({ status: "success", message: "User added to chat list" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error adding user" });
  }
});

app.get("/add-users", async (req, res) => {
  const email = req.headers.email;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required in the headers",
    });
  }

  try {
    const connectedUsers = await Connection.find({ user_email: email }).select(
      "connected_user_email"
    );

    const connectedEmails = connectedUsers.map((user) => user.connected_user_email);
    const usersToAdd = await User.find({
      email: { $nin: [...connectedEmails, email] },
    }).sort({ created_at: 1 });

    res.json(usersToAdd);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
    });
  }
});


app.get("/messages", async (req, res) => {
  const { email, useremail } = req.headers;

  try {
    const sentMessages = await SentMessage.find({ from: email, to: useremail }).sort({ time: 1 });
    const receivedMessages = await SentMessage.find({ from: useremail, to: email }).sort({ time: 1 });

    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => new Date(a.time) - new Date(b.time));
    res.json(allMessages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.delete("/deleteMsg/:id", async (req, res) => {
  try {
    const deletedMessage = await SentMessage.findByIdAndDelete(req.params.id);
    
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the message" });
  }
});



// Socket.IO
io.on("connection", (socket) => {

  socket.on("send private message", async (msg) => {
    const { from, to, message } = msg;

    try {
      io.to(to).emit("receive private message", { ...msg });
      io.to(from).emit("receive private message", { ...msg, isSender: true });

      const newMessage = new SentMessage({ message, from, to });
      await newMessage.save();
    } catch (err) {
      console.error("Error inserting message into sentmessages collection:", err);
    }
  });

  socket.on("join room", (email) => {
    socket.join(email);
  });

  socket.on("disconnect", () => {
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
});
