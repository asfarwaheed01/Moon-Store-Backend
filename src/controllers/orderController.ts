import Order from "../db/model/order";
import { Request, Response } from "express";

const saveOrder = async (req: Request, res: Response) => {
  try {
    const {
      address,
      city,
      company,
      country,
      email,
      firstName,
      lastName,
      message,
      phone,
      state,
      zipCode,
      userId,
      products,
      totalAmount,
      status,
    } = req.body;

    const newOrder = new Order({
      address,
      city,
      company,
      country,
      email,
      firstName,
      lastName,
      message,
      phone,
      state,
      zipCode,
      userId,
      products,
      totalAmount,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteOrder = await Order.findByIdAndDelete(id);
    if (!deleteOrder) {
      res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

const getOrdersByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("User ID:", id);

  try {
    const orders = await Order.find({ userId: id }).select(
      "_id totalAmount status products"
    );
    console.log("Orders:", orders);

    if (orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "Orders not found" });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { saveOrder, getAllOrders, deleteOrder, getOrdersByUserId };
