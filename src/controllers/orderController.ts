import Order from "../db/model/order";
import User from "../db/model/userModel";
import Product from "../db/model/product";
import { Request, Response } from "express";

const saveOrder = async (req: Request, res: Response) => {
  try {
    const { userId, products, totalPrice } = req.body;
    if (!userId || !products || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await User.findById(userId).populate("products");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const productIds = products.map((product: any) => product.productId);
    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length !== products.length) {
      return res.status(400).json({ message: "Some products not found" });
    }
    let totalCalculatedPrice = 0;
    for (const product of products) {
      const foundProduct = foundProducts.find(
        (p) => p._id.toString() === product.productId
      );
      if (foundProduct) {
        totalCalculatedPrice += foundProduct.price * product.quantity;
      }
    }
    if (totalPrice !== totalCalculatedPrice) {
      return res.status(400).json({ message: "Total price mismatch" });
    }
    const newOrder = new Order({
      userId,
      products,
      totalPrice: totalCalculatedPrice,
      status,
    });
    const savedOrder = await newOrder.save();
    const populatedOrder = await savedOrder.populate("userId");
    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving order" });
  }
};

export default saveOrder;
