import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔍 Token received:", token?.substring(0, 20) + "...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded successfully:", decoded);
      
      // 🔥 FIX: Use decoded._id instead of decoded.id
      req.user = await User.findById(decoded._id).select("-password");
      console.log("👤 User found:", req.user ? "Yes" : "No");

      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("❌ No authorization header found");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ✅ Middleware to check admin
const admin = (req, res, next) => {
  console.log("Admin check - User:", req.user);
  console.log("Admin check - isAdmin:", req.user?.isAdmin);
  
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// ✅ Export both functions
export { protect, admin };