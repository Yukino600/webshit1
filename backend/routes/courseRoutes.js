import express from "express";
import Course from "../models/course.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all courses (PUBLIC ACCESS - no auth required)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ✅ GET single course by ID (PUBLIC ACCESS - no auth required)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// ✅ POST new course (admin only)
router.post("/", protect, admin, async (req, res) => {
  const { title, description, price, level, duration } = req.body;

  if (!title || !description || !level || !duration) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const course = new Course({ 
      title, 
      description, 
      price: price || 0, 
      level, 
      duration 
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to add course" });
  }
});

// ✅ PUT update course (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { title, description, price, level, duration } = req.body;
    
    if (!title || !description || !level || !duration) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price: price || 0, level, duration },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update course" });
  }
});

// ✅ DELETE course by ID (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete course" });
  }
});

export default router;