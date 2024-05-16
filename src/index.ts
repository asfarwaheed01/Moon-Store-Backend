import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
const cors = require("cors");
import cookieParser from "cookie-parser";
import productRoute from "./routes/ProductRoutes";
import userRoutes from "./routes/userRoutes";
import stripeRoutes from "./routes/StripeRoutes";
import orderRoutes from "./routes/OrderRoutes";
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
    origin: "http://localhost:3000",
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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
