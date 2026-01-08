import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import userModel from '../models/userModel.js';

const userRouter = express.Router();

// Route for user login
userRouter.post('/login', loginUser);

// Route for user registration
userRouter.post('/register', registerUser);

// Route for user profile (requires auth)
userRouter.get('/profile', authMiddleware, getUserProfile);

// Route for updating profile (requires auth)
userRouter.put('/update-profile', authMiddleware, updateUserProfile);

// ✅ Secure promotion route (only admins can promote others)
userRouter.put('/make-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ success: true, message: `${email} is now an admin` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error promoting user to admin" });
  }
});

// ✅ New route: Fetch all users (only admins)
userRouter.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await userModel.find().select("name email isAdmin");
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching users" });
  }
});

export default userRouter;
