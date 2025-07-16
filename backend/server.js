import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatbotRoutes from './routes/chatbotRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js'; // ✅ ADD THIS LINE

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", adminRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/enrollments', enrollmentRoutes); // ✅ ADD THIS LINE

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});