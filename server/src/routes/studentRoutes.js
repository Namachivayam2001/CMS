const express = require("express");
const { getStudents, createStudent } = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Admin, HOD, Teacher can view students
router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getStudents);

// Only Admin & HOD can create students
 router.post("/create", authenticate, authorize("Admin", "HOD"), createStudent);

module.exports = router;
