import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
const cors = require("cors");
import cookieParser from "cookie-parser";
import productRoute from "./routes/ProductRoutes";
import userRoutes from "./routes/userRoutes";
import connectToDatabase from "./db/db";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
dotenv.config();
const PORT: number = 8000 || process.env.PORT;

// DB Connection
connectToDatabase();

// Api routes
app.use("/products", productRoute);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
