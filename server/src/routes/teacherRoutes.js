const express = require("express");
const router = express.Router();
const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = require("../controllers/teacherController");
const { authenticate, authorize } = require("../middleware/auth"); // 🔒 JWT middleware

// Routes
router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getTeachers);
router.post("/create", authenticate, authorize("Admin", "HOD"), createTeacher);
router.put("/update/:id", authenticate, authorize("Admin", "HOD"), updateTeacher);
router.delete("/delete/:id", authenticate, authorize("Admin", "HOD"), deleteTeacher);


module.exports = router;
