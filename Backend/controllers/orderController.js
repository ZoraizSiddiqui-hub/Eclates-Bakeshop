// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodmodels.js";

// ------------------------------------------------------
// Place order (validate stock, deduct stock, save order, clear cart)
// ------------------------------------------------------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const cartData = user.cartData || {};
    const itemIds = Object.keys(cartData);

    if (itemIds.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const { address } = req.body;
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.postalCode
    ) {
      return res.json({
        success: false,
        message: "Address information is incomplete",
      });
    }

    const foods = await foodModel.find({ _id: { $in: itemIds } });

    for (const food of foods) {
      const requestedQty = cartData[food._id];
      if (requestedQty > food.stock) {
        return res.json({
          success: false,
          message: `Only ${food.stock} item(s) left in stock for ${food.name}`,
        });
      }
    }

    for (const food of foods) {
      const requestedQty = cartData[food._id];
      food.stock -= requestedQty;
      await food.save();
    }

    const orderItems = foods.map((food) => ({
      itemId: food._id,
      quantity: cartData[food._id],
      price: food.price,
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = await orderModel.create({
      userId,
      items: orderItems,
      totalAmount,
      address,
      status: "Pending", // ✅ ensure status is always set
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// ------------------------------------------------------
// Get all orders for the logged-in user
// GET /api/orders/user
// ------------------------------------------------------
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "User orders fetched",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ------------------------------------------------------
// Get single order details (for the logged-in user or admin)
// GET /api/orders/:orderId
// ------------------------------------------------------
export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate("items.itemId")              // ✅ populate food items
      .populate("userId", "name email");     // ✅ populate user info

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // If not admin, ensure the order belongs to the user
    if (!req.isAdmin && order.userId._id.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this order" });
    }

    res.json({
      success: true,
      message: "Order details fetched",
      order,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching order details" });
  }
};

// ------------------------------------------------------
// Admin: Get all orders
// GET /api/orders/admin/all
// ------------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json({
      success: true,
      message: "All orders fetched",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching all orders" });
  }
};

// ------------------------------------------------------
// Admin: Update order status
// PUT /api/orders/admin/update-status
// body: { orderId, status }
// ------------------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const allowedStatuses = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order status" });
  }
};
