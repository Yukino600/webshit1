// backend/controllers/courseController.js
import Course from "../models/course.js";

export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const course = new Course({ title, description, price });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin-only course creation function
export const createCourseAdmin = async (req, res) => {
  try {
    // Check if user is admin (assuming you have user info in req.user from authMiddleware)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { title, description, price, category, instructor, duration, level } = req.body;
    
    // Create course with admin-specific fields
    const courseData = {
      title,
      description,
      price,
      category,
      instructor,
      duration,
      level,
      createdBy: req.user.id,
      isAdminCreated: true,
      status: 'active' // Auto-approve admin courses
    };

    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully by admin',
      data: course
    });
    
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error creating course',
      error: err.message
    });
  }
};