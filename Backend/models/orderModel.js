// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", // ✅ must match userModel registration
    required: true 
  },
  items: [
    {
      itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "food", // ✅ must match your food model name
        required: true 
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" }
}, { timestamps: true }); // ✅ use timestamps instead of manual createdAt

// ✅ Register as "order" (singular) to match convention
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
