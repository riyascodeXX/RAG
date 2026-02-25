import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Userchat from "./models/userchat.js";
import Chat from "./models/chat.js";
import { clerkMiddleware, requireAuth } from '@clerk/express'




const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  process.env.CLIENT_URL_3,
  "http://localhost:5173",
  "https://rag-coral-nine.vercel.app",
]
  .flatMap((value) => (value ? value.split(",") : []))
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongodb");
  } catch (err) {
    console.log("mongodb connection failed:", err.message);
    throw err;
  }
};

/*app.get("/api/test",(req, res) => {
  res.json({ message: "API test working" });
  const userId=req.auth.userId
  console.log(userId)
  }
);*/

app.get("/", (_req, res) => {
  res.status(200).json({ message: "AMC backend is running" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    dbReadyState: mongoose.connection.readyState,
  });
});

app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth && req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    })

    const savedChat = await newChat.save()

    const userChats = await Userchat.find({ userId })

    if (!userChats.length) {
      const newUserChat = new Userchat({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text ? text.substring(0, 35) : "",
          },
        ],
      });
      await newUserChat.save();
    } else {
      await Userchat.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 35),
            },
          },
        }
      )
    }

    return res.status(201).json({ id: savedChat._id });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error creating chat" })
  }
})



app.get("/api/userchats", requireAuth(), async (req, res) => {
  const userId = req.auth && req.auth.userId;

  if (!userId) return res.status(401).json({ message: "Unauthenticated" });
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected" });
  }

  try {
    const doc = await Userchat.findOne({ userId });
    const chats = doc ? doc.chats : [];
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Error fetching userchats: ${err.message}` });
  }
});


app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth && req.auth.userId;

  if (!userId) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching user chats" });
  }
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth && req.auth.userId;
  const { question, answer } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthenticated" });

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }] }] : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).json(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding conversation" });
  }
});


app.use((err, req, res, next) => {
  console.log(err.stack);

  if (err?.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  const statusCode = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal server error";
  return res.status(statusCode).json({ message });
});

const startServer = async () => {
  await connect();
  app.listen(PORT, () => {
  console.log("server running on " + PORT);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});


     
