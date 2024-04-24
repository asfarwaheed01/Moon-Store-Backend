import { Router } from "express";
import {
  addProduct,
  deleteProducts,
  editProducts,
  getAllProducts,
  getSingleProduct,
} from "../controllers/productsController";
import upload from "../middleware/multer";

const router = Router();

router.get("/", getAllProducts);
router.post("/addproduct", upload.single("image"), addProduct);
router.put("/:id", upload.single("image"), editProducts);
router.delete("/:id", deleteProducts);
router.get("/:id", getSingleProduct);

export default router;
