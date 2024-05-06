import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  cloudinary_id: string;
}

const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  cloudinary_id: String,
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
