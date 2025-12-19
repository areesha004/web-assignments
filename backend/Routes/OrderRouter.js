import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../Controllers/OrderController.js";

const OrderRouter = express.Router();

OrderRouter.post("/create", createOrder);
OrderRouter.get("/get", getAllOrders);
OrderRouter.get("/get/:orderId", getOrderById);
OrderRouter.patch("/:orderId/status", updateOrderStatus);

export default OrderRouter;