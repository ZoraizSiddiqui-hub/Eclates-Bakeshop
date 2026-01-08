// routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

// User: place order
router.post("/place", authMiddleware, placeOrder);

// User: get his own orders
router.get("/user", authMiddleware, getUserOrders);

// User/Admin: get single order by id
router.get("/:orderId", authMiddleware, getOrderById);

// Admin: get all orders

router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);

// Admin: update order status
router.put("/admin/update-status", authMiddleware, adminMiddleware, updateOrderStatus);
// Admin: get single order by id
router.get("/admin/:orderId", authMiddleware, adminMiddleware, getOrderById);


export default router;
