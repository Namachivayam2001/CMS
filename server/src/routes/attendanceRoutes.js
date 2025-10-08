const express = require("express");
const router = express.Router();
const {
  getAllAttendances,
  markAttendance,
  updateAttendance,
  getCourseAttendance,
  getStudentAttendance,
} = require("../controllers/attendanceController");

// Public/Authorized routes
router.get("/attendances", getAllAttendances);
router.post("/attendance/mark", markAttendance);
router.put("/attendances/:id", updateAttendance);
router.get("/attendance/course/:id", getCourseAttendance);
router.get("/attendance/student/:id", getStudentAttendance);

module.exports = router;
