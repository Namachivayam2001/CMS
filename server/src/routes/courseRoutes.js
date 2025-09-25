const express = require("express");
const { getCourses, createCourse } = require("../controllers/courseController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getCourses);
router.post("/create", authenticate, authorize("Admin", "HOD"), createCourse);

module.exports = router;
