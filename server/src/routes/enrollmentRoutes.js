const express = require("express");
const { getEnrollments, createEnrollment } = require("../controllers/enrollmentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/fetchAll", authenticate, authorize("Admin", "HOD", "Teacher"), getEnrollments);
router.post("/create", authenticate, authorize("Admin", "HOD"), createEnrollment);

module.exports = router;
