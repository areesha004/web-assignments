import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/ProductsController.js";

const router = express.Router();

router.post("/create", createProduct);           
router.get("/get", getProducts);             
router.get("/get/:id", getProductById);       
router.put("/update/:id", updateProduct);      
router.delete("/delete/:id", deleteProduct);   

export default router;
