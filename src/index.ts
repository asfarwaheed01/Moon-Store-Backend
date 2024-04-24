import express, { Application } from "express";
import dotenv from "dotenv";
const cors = require("cors");
import productRoute from "./routes/ProductRoutes";
import connectToDatabase from "./db/db";

const app: Application = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const PORT: number = 8000;

// DB Connection
connectToDatabase();

// Api routes
app.use("/products", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
