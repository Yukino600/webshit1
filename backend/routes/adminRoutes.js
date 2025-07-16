import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  blockUser,
} from "../controller/adminUserController.js";
import {
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,  // ✅ Add this import
} from "../controller/adminCourseController.js";

const router = express.Router();

// 🧑‍💼 Users
router.get("/admin/users", protect, admin, getAllUsers);
router.patch("/admin/users/:id/block", protect, admin, blockUser);

// 📚 Courses
router.get("/admin/courses", protect, admin, getAllCourses);
router.post("/admin/courses", protect, admin, createCourse);
router.patch("/admin/courses/:id", protect, admin, updateCourse); // ✅ Add this route
router.delete("/admin/courses/:id", protect, admin, deleteCourse);
// 📊 Admin Dashboard Stats
router.get("/admin/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    // if you have enrollments:
    // const totalEnrollments = await Enrollment.countDocuments();
    const totalEnrollments = 0; // or fetch from your enrollment collection

    res.json({ totalUsers, totalCourses, totalEnrollments });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
export default router;