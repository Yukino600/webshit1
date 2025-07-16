import Course from "../models/course.js"; // Make sure this matches your actual file name

// 📚 GET all courses (admin)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// 🗑 DELETE course (admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Use findByIdAndDelete instead of remove (deprecated)
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

// ✅ CREATE new course (admin)
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, level, duration } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = new Course({
      title,
      description,
      price: price || 0,
      level: level || "Beginner",
      duration: duration || 0,
    });

    const created = await course.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
};

// 🔄 UPDATE course (admin)
export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, level, duration } = req.body;

    // Add validation
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price: price || 0,
        level: level || "Beginner",
        duration: duration || 0,
      },
      { new: true, runValidators: true } // Added runValidators
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error("Update course error:", err); // Add logging
    res.status(500).json({ message: "Failed to update course", error: err.message });
  }
};