import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // optional
  address: { type: String }, // full address as one field
  city: { type: String },    // city as separate field
  cartData: { type: Object, default: {} },
  isAdmin: { type: Boolean, default: false }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
