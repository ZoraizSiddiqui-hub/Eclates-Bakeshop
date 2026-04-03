import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please login again."
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const token_decode = jwt.decode(token);

    // Attach decoded values directly
    req.userId = token_decode.id;
    req.isAdmin = token_decode.isAdmin;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed."
    });
  }
};

export default authMiddleware;
