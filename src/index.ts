import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
const cors = require("cors");
import cookieParser from "cookie-parser";
import productRoute from "./routes/ProductRoutes";
import userRoutes from "./routes/userRoutes";
import stripeRoutes from "./routes/StripeRoutes";
import orderRoutes from "./routes/OrderRoutes";
import otpRoutes from "./routes/otpRoutes";
import connectToDatabase from "./db/db";
import { Server } from "socket.io";
import { createServer } from "http";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
dotenv.config();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// const PORT: number = 8000 || process.env.PORT;
const PORT: number = Number(process.env.PORT);
console.log(process.env.PORT);

// DB Connection
connectToDatabase();

// Api routes
app.use("/products", productRoute);
app.use("/api/users", userRoutes);
app.use("/stripe", stripeRoutes);
app.use("/order", orderRoutes);
app.use("/admin", otpRoutes);

const users = new Map();
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("message", msg);
  });
  socket.on("register", (userId) => {
    users.set(userId, socket.id);
  });
  socket.on("send-message", ({ sender, receiver, message }) => {
    console.log(`Message from ${sender} to ${receiver}: ${message}`);
    const receiverSocketId = users.get(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", { sender, message });
    } else {
      console.log(`Receiver ${receiver} not connected`);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    users.forEach((value, key) => {
      if (value === socket.id) {
        users.delete(key);
        console.log(`User ${key} with socket ID ${socket.id} removed`);
      }
    });
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
