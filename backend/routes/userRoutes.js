import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT token with full user info
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// @route   POST /api/users/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user and get token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Direct bcrypt comparison instead of relying on matchPassword method
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error); // Add this for debugging
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser) // regenerate token with new name/avatar
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

router.put('/profile', protect, updateUserProfile);
// @route   PUT /api/users/profile

export default router;