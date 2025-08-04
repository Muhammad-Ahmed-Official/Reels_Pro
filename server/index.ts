// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use(express.static("public"));

import express from "express";
import cors from "cors";


import dotenv from "dotenv";
import { createServer } from "http";
import dbConnect from "./db.js";
import { connectRabbitMQ, sendNotification } from "./services/rabbitmq.js";
import { Notification } from "./Notification.model.js";
import { SocketService } from "./services/socket.js";

dotenv.config({quiet:true});

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN_1 || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

const startServer = async () => {
    try {
    await dbConnect();
    // await connectRabbitMQ();
    
    const socketService = new SocketService();
    socketService.io.attach(httpServer);
    socketService.initListener();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

// Routes
app.post("/api/notify", async (req, res) => {
  try {
    const notif = req.body;
    await Notification.create(notif);
    await sendNotification(notif);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error in /notify:", error);
    res.status(500).json({ success: false, error: "Notification failed" });
  }
});

export { app };