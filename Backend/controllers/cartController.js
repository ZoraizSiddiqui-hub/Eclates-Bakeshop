// backend/controllers/cartController.js
import userModel from '../models/userModel.js';
import foodModel from '../models/foodmodels.js';

// ------------------------------------------------------
// Helper: Build full cart array from user.cartData
// ------------------------------------------------------
const buildCartResponse = async (cartData = {}) => {
  const itemIds = Object.keys(cartData);
  if (itemIds.length === 0) return [];

  const foods = await foodModel.find({ _id: { $in: itemIds } });

  return foods
    .map((food) => ({
      _id: food._id.toString(),
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      quantity: cartData[food._id.toString()] || 0,
      stock: food.stock,
    }))
    .filter((item) => item.quantity > 0);
};

// ------------------------------------------------------
// Add to Cart (with quantity + stock validation)
// ------------------------------------------------------
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const foodItem = await foodModel.findById(itemId);
    if (!foodItem) return res.json({ success: false, message: 'Food item not found' });

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const cartData = userData.cartData || {};
    const currentQty = cartData[itemId] || 0;

    // ⭐ Correct remaining stock logic
    if (currentQty + qty > foodItem.stock) {
      const remaining = foodItem.stock - currentQty;
      return res.json({
        success: false,
        message: `Only ${remaining} item(s) left in stock`,
      });
    }

    // Update quantity
    cartData[itemId] = currentQty + qty;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    const cart = await buildCartResponse(cartData);

    res.json({ success: true, message: 'Item(s) added to cart', cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error while adding to cart' });
  }
};

// ------------------------------------------------------
// Fetch Cart Items
// ------------------------------------------------------
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const cart = await buildCartResponse(userData.cartData || {});

    res.json({ success: true, message: 'Cart data fetched', cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error while fetching cart data' });
  }
};

// ------------------------------------------------------
// Remove an item completely from Cart
// ------------------------------------------------------
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: 'User not found' });

    const cartData = userData.cartData || {};
    delete cartData[itemId];

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    const cart = await buildCartResponse(cartData);

    res.json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error while removing from cart' });
  }
};

// ------------------------------------------------------
// Update quantity of an item in cart
// ------------------------------------------------------
const updateCartQuantity = async (req, res) => {
  try {
    console.log("UPDATE HIT:", req.body);
    const userId = req.userId;
    const { itemId, quantity } = req.body;

    const foodItem = await foodModel.findById(itemId);
    if (!foodItem) return res.json({ success: false, message: 'Food item not found' });

    const qty = Number(quantity);

    // Fetch user cart to know current quantity
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};
    const currentQty = cartData[itemId] || 0;

    // If removing item
    if (qty <= 0) {
      await userModel.findByIdAndUpdate(
        userId,
        { $unset: { [`cartData.${itemId}`]: "" } },
        { new: true }
      );
    } else {
      // ⭐ Calculate remaining stock (same logic as addToCart)
      const remaining = foodItem.stock - currentQty;

      // If user tries to exceed stock
      if (qty > foodItem.stock) {
        return res.json({
          success: false,
          message: `Only ${remaining} item(s) left in stock`,
        });
      }

      // Update quantity
      await userModel.findByIdAndUpdate(
        userId,
        { [`cartData.${itemId}`]: qty },
        { new: true }
      );
    }

    const updatedUser = await userModel.findById(userId);
    const cart = await buildCartResponse(updatedUser.cartData);

    res.json({ success: true, message: 'Cart quantity updated', cart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error updating cart quantity' });
  }
};


// ------------------------------------------------------
// Clear Cart
// ------------------------------------------------------
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

    res.json({ success: true, message: 'Cart cleared', cart: [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error while clearing cart' });
  }
};

export { addToCart, getCart, removeFromCart, clearCart, updateCartQuantity };
