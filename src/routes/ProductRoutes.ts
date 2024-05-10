import { Router } from "express";
import {
  addProduct,
  deleteProducts,
  editProducts,
  findProducts,
  getAllProducts,
  getSingleProduct,
} from "../controllers/productsController";
import upload from "../middleware/multer";

const router = Router();

router.get("/", getAllProducts);
router.post("/addproduct", upload.single("image"), addProduct);
router.put("/:id", upload.single("image"), editProducts);
router.delete("/:id", deleteProducts);
router.post("/:id", getSingleProduct);
router.get("/:id", getSingleProduct);
router.get("/search/:name", findProducts);

export default router;
