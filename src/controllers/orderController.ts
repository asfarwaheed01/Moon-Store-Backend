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
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export { saveOrder, getAllOrders };
