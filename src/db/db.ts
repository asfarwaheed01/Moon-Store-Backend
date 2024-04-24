import mongoose from "mongoose";

async function connectToDatabase() {
  const mongodbUrl =
    process.env.MONGODB_URL ||
    "mongodb+srv://asfarwaheed01:Et555rw7cGYYAQzF@type-1.8on9uvt.mongodb.net/?retryWrites=true&w=majority&appName=type-1";

  try {
    await mongoose.connect(mongodbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDatabase;
