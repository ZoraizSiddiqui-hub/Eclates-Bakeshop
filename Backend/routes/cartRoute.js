// backend/routes/cartRoute.js
import express from 'express';
import {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCartQuantity,
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.get('/get', authMiddleware, getCart);
cartRouter.delete('/remove', authMiddleware, removeFromCart);
cartRouter.delete('/clear', authMiddleware, clearCart);
cartRouter.post("/update", authMiddleware, updateCartQuantity);

export default cartRouter;
