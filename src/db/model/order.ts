import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  _id?: string;
  userId: mongoose.Schema.Types.ObjectId;
  products: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<Order>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model<Order>("Order", orderSchema);
