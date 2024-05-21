import express from "express";
import {
  deleteOrder,
  getAllOrders,
  getOrdersByUserId,
  saveOrder,
} from "../controllers/orderController";
const router = express.Router();

router.post("/", saveOrder);
router.get("/", getAllOrders);
router.delete("/:id", deleteOrder);
router.get("/:id", getOrdersByUserId);

export default router;
