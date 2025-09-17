const express = require("express");
const router = express.Router();
const { getTeachers, createTeacher } = require("../controllers/teacherController");
const { authenticate, authorize } = require("../middleware/auth"); // 🔒 JWT middleware

// Routes
router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getTeachers);
router.post("/create", authenticate, authorize("Admin", "HOD"), createTeacher);

module.exports = router;
