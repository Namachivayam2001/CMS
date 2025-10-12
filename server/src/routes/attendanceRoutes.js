const express = require("express");
const router = express.Router();
const {
  getAllAttendances,
  markAttendance,
  getCourseAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");
const { authenticate, authorize } = require("../middleware/auth");

// Private routes
router.get("/attendances", authenticate, authorize("Admin", "HOD", "Teacher"), getAllAttendances);
router.post("/attendance/mark", authenticate, authorize("Admin", "Teacher", "HOD"), markAttendance);
router.get("/attendance/course/:id", authenticate, authorize("Admin", "HOD", "Teacher"), getCourseAttendance);
router.get("/attendance/student/:id", authenticate, authorize("Admin", "Student", "Teacher", "HOD"), getStudentAttendance);

module.exports = router;
