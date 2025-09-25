const express = require("express");
const { markAttendance, getCourseAttendance, getStudentAttendance } = require("../controllers/attendanceController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/mark", authenticate, authorize("Teacher", "HOD"), markAttendance);
router.get("/course/:id", authenticate, authorize("Teacher", "HOD"), getCourseAttendance);
router.get("/student/:id", authenticate, authorize("Student", "HOD", "Teacher"), getStudentAttendance);

module.exports = router;
