const express = require("express");
const { getStudents, createStudent, updateStudent, deleteStudent } = require("../controllers/studentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Routes
router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getStudents); 
router.post("/create", authenticate, authorize("Admin", "HOD"), createStudent); 
router.put("/update/:id", authenticate, authorize("Admin", "HOD"), updateStudent);
router.delete("/delete/:id", authenticate, authorize("Admin", "HOD"), deleteStudent);

module.exports = router;
