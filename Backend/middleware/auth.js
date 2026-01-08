import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach decoded values to request
    req.userId = token_decode.id;
    req.isAdmin = token_decode.isAdmin;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Token expired. Please login again." });
  }
};

export default authMiddleware;
