import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = req.body.blocked;
    await user.save();
    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};
