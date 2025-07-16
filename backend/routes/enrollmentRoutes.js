import express from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET user's enrolled courses
router.get("/my-courses", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title description price')
      .sort({ enrolledAt: -1 });

    // Transform data to match your frontend expectations
    const courses = enrollments.map(enrollment => ({
      id: enrollment.course._id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      price: enrollment.course.price,
      progress: enrollment.progress,
      status: enrollment.status,
      enrolledDate: enrollment.enrolledAt,
      lastAccessed: enrollment.lastAccessed,
      // Add some default values for missing fields
      instructor: "Instructor", // You might want to add this to Course model
      category: "General", // You might want to add this to Course model
      duration: "TBD", // You might want to add this to Course model
      level: "Beginner", // You might want to add this to Course model
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop" // Default image
    }));

    res.json(courses);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
});

// ✅ POST enroll in a course
router.post("/enroll", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: req.user._id,
      course: courseId,
      status: 'not-started'
    });

    await enrollment.save();

    res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment: enrollment
    });

  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
});

// ✅ PUT update course progress
router.put("/progress", protect, async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    if (!courseId || progress === undefined) {
      return res.status(400).json({ message: "Course ID and progress are required" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      { 
        progress: progress,
        lastAccessed: new Date(),
        status: progress === 0 ? 'not-started' : 
                progress === 100 ? 'completed' : 'in-progress',
        completedAt: progress === 100 ? new Date() : null
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({
      message: "Progress updated successfully",
      enrollment: enrollment
    });

  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ✅ DELETE unenroll from course
router.delete("/unenroll/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({
      user: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Successfully unenrolled from course" });

  } catch (err) {
    console.error("Error unenrolling:", err);
    res.status(500).json({ error: "Failed to unenroll from course" });
  }
});

export default router;