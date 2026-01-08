import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// ✅ Create token with isAdmin included
const createToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = createToken(user._id, user.isAdmin);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error logging in" });
  }
};

// ✅ Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "This user already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (default isAdmin = false)
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      isAdmin: false, // ✅ default to false
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.isAdmin);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error registering user" });
  }
};

// ✅ Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // comes from authMiddleware
    const user = await userModel.findById(userId).select("name email phone address city isAdmin");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// ✅ Update logged-in user's profile with validation
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // comes from authMiddleware
    const { name, phone, address, city } = req.body;

    // Validation checks
    if (!name || name.trim().length < 2) {
      return res.json({ success: false, message: "Name must be at least 2 characters long" });
    }

    if (phone && !/^\d{11}$/.test(phone)) {
      return res.json({ success: false, message: "Phone number must be exactly 11 digits" });
    }

    if (!address || address.trim().length < 5) {
      return res.json({ success: false, message: "Address must be provided" });
    }

    if (!city || city.trim().length < 2) {
      return res.json({ success: false, message: "City must be provided" });
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone, address, city },
      { new: true, runValidators: true }
    ).select("name email phone address city isAdmin");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

export { loginUser, registerUser, getUserProfile, updateUserProfile };
