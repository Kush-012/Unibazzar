const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const fetch = require("node-fetch");
const app = express();
require('dotenv').config();

require("./db/config");
const User = require("./db/signup");
const Product = require("./db/products");
const Message = require("./db/messages");

app.use(express.json());
app.use(cors());

// ------------------- Signup -------------------
app.post("/signup", async (req, res) => {
  try {
    const { id, name, password } = req.body;

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).send({ message: "User ID already exists, please login" });
    }

    let user = new User({ id, name, password });
    let result = await user.save();

    result = result.toObject();
    delete result.password;

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all users
app.get("/signup", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ------------------- Login -------------------
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.id) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send("No user found");
    }
  } else {
    res.send("Enter both id and password");
  }
});

// ------------------- Add product -------------------
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added", id: product._id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ------------------- Fetch all products -------------------
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ------------------- Fetch messages between two users -------------------
app.get("/messages", async (req, res) => {
  const { myId, otherId } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    }).sort({ timestamp: 1 });
    res.send(messages);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ------------------- Claim API -------------------
app.post("/claim", async (req, res) => {
  try {
    const { item, place, claimerid } = req.body;

    let product = await Product.findOneAndUpdate(
      { item, place, available: "yes" },
      { available: "no", claimerid },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Item not found or already claimed" });
    }

    res.json({
      message: "Item successfully claimed",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ------------------- AI Chatbot Route -------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase().trim();
    let botReply = "";

    if (userMessage.includes("lost") || userMessage.includes("missing")) {
      botReply = "I’m sorry to hear that! 🙁\n\nYou can report your lost item in the **Report Item** section. Would you like me to take you there?";
    } else if (userMessage.includes("buy") || userMessage.includes("purchase")) {
      botReply = "You can browse items in the **Find Item** section. \n\nOnce you find what you need, you can connect with the seller through our chat feature.";
    } else if (userMessage.includes("support") || userMessage.includes("contact")) {
      botReply = "No worries! \n\nYou can use the **Chat** option in the menu, and our team will assist you.";
    } else if (userMessage.includes("what is unibazaar") || userMessage.includes("about unibazaar")) {
      botReply = "UniBazaar is your campus marketplace where you can buy, sell, and report lost or found items. \n\nThink of it as a digital bazaar for students 🚀.";
    } else {
      // Fallback to Gemini for general questions
      const prompt = `
      You are Unno, the friendly AI assistant of UniBazaar. You help users find items, report lost or found items, and answer general questions about UniBazaar. Always be polite, concise, and helpful. If you don’t know something, guide the user to use the available options (Home, Find Item, Report Item, Chat).
      
      Here are some examples of how to respond, make sure to add a newline after the first sentence for better readability:
      - If a user says they lost something, respond with: "I’m sorry to hear that! 🙁\n\nYou can report your lost item in the Report Item section. Would you like me to take you there?"
      - If a user asks how to buy something, respond with: "You can browse items in the Find Item section. \n\nOnce you find what you need, you can connect with the seller through our chat feature."
      - If a user asks to contact support, respond with: "No worries! \n\nYou can use the Chat option in the menu, and our team will assist you."
      
      User message: "${userMessage}"
      `;
      
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Sorry, I couldn't understand that. Please use the options in the menu: Home, Find Item, Report Item, or Chat.";
    }

    res.json({ response: botReply });
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ response: "⚠️ Server error." });
  }
});

// ------------------- WebSocket Server -------------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "auth") {
        ws.id = data.id;
        clients.set(data.id, ws);
      } else if (data.type === "message" && ws.id) {
        const msg = new Message({
          sender: ws.id,
          receiver: data.to,
          text: data.text,
        });
        await msg.save();

        const receiverWs = clients.get(data.to);
        if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
          receiverWs.send(
            JSON.stringify({
              type: "message",
              from: ws.id,
              text: data.text,
            })
 );
        }
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on("close", () => {
    if (ws.id) {
      clients.delete(ws.id);
    }
  });
});

server.listen(4500, () => {
  console.log("Server running on port 4500");
});