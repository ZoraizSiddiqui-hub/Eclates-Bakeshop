// middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    // If admin, allow request to continue
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Admin verification failed" });
  }
};

export default adminMiddleware;
