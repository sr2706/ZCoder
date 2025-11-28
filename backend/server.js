import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import path from "path";
import userRoutes from "./routes/users.routes.js";
import blogRoutes from "./routes/blogposts.routes.js";
import roomRoutes from "./routes/rooms.routes.js";
import setupSocketIO from "./socket/socketHandler.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/blogposts", blogRoutes);
app.use("/api/rooms", roomRoutes);

// Setup Socket.io
setupSocketIO(io);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

httpServer.listen(PORT, () => {
  connectToMongoDB();
  console.log(`connected to server on port ${PORT}`);
});
