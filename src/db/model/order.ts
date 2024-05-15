import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  _id?: string;
  address: string;
  city: string;
  company: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  phone: string;
  state: string;
  zipCode: string;
  totalAmount: number;
  userId: mongoose.Schema.Types.ObjectId;
  products: {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<Order>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  company: { type: String },
  country: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  message: { type: String },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String },
  totalAmount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [
    {
      product: [
        {
          name: { type: String, required: true },
          description: { type: String },
          price: { type: Number, required: true },
          category: { type: String },
        },
      ],
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, required: true, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model<Order>("Order", orderSchema);
