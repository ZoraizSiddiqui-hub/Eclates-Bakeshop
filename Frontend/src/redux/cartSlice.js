// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  addToCart as addToCartAPI,
  removeFromCart,
  clearCart as clearCartAPI
} from '../api/api';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// ✅ Thunks for backend integration

// Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await getCart();
  return res.data.cart; // adjust if backend returns differently
});

// Add item to backend cart
export const addItemToCart = createAsyncThunk('cart/addItemToCart', async (item) => {
  await addToCartAPI(item._id); // backend call
  return item; // return item so Redux can update state
});

// Remove item from backend cart
export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (itemId) => {
  await removeFromCart(itemId);
  return itemId;
});

// Clear backend cart
export const clearCartThunk = createAsyncThunk('cart/clearCartThunk', async () => {
  await clearCartAPI();
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find(item => item._id === _id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const { _id, name, price, image, quantity = 1 } = action.payload;
        const existingItem = state.items.find(item => item._id === _id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({ _id, name, price, image, quantity });
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { updateQuantity } = cartSlice.actions;
export { fetchCart, addItemToCart, removeItemFromCart, clearCartThunk };
export default cartSlice.reducer;
