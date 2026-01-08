// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  addToCart as addToCartAPI,
  removeFromCart,
  clearCart as clearCartAPI,
  updateCartQuantityAPI,
} from '../api/api';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// ---------------- FETCH CART ----------------
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCart();
      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Failed to fetch cart');
      }
      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

// ---------------- ADD TO CART ----------------
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const res = await addToCartAPI(item._id, qty);

      if (!res.data.success) {
        // e.g. "Only 2 item(s) left in stock"
        return rejectWithValue(res.data.message || 'Failed to add to cart');
      }

      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue('Failed to add to cart');
    }
  }
);

// ---------------- REMOVE ITEM ----------------
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await removeFromCart(itemId);

      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Failed to remove from cart');
      }

      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue('Failed to remove from cart');
    }
  }
);

// ---------------- CLEAR CART ----------------
export const clearCartThunk = createAsyncThunk(
  'cart/clearCartThunk',
  async (_, { rejectWithValue }) => {
    try {
      const res = await clearCartAPI();

      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Failed to clear cart');
      }

      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue('Failed to clear cart');
    }
  }
);

// ---------------- UPDATE QUANTITY (BACKEND SYNC) ----------------
export const updateCartQuantityThunk = createAsyncThunk(
  'cart/updateCartQuantityThunk',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartQuantityAPI(itemId, quantity);

      if (!res.data.success) {
        return rejectWithValue(res.data.message || 'Failed to update quantity');
      }

      return res.data.cart || [];
    } catch (err) {
      return rejectWithValue('Failed to update quantity');
    }
  }
);

// ---------------- SLICE ----------------
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = 'succeeded';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart';
      })

      // ADD
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add to cart';
      })

      // REMOVE
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove from cart';
      })

      // CLEAR
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to clear cart';
      })

      // UPDATE QUANTITY
      .addCase(updateCartQuantityThunk.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update quantity';
      });
  },
});

export default cartSlice.reducer;
