import express from "express";
import { getAllOrders, saveOrder } from "../controllers/orderController";
const router = express.Router();

router.post("/", saveOrder);
router.get("/", getAllOrders);

export default router;
