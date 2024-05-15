import express from "express";
import { config, payment } from "../controllers/stripeControllers";
const router = express.Router();

router.post("/payment", payment);
router.get("/config", config);

export default router;
