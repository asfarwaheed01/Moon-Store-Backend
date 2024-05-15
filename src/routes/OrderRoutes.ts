import express from "express";
import {
  deleteOrder,
  getAllOrders,
  saveOrder,
} from "../controllers/orderController";
const router = express.Router();

router.post("/", saveOrder);
router.get("/", getAllOrders);
router.delete("/:id", deleteOrder);

export default router;
