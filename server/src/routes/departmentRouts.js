const express = require("express");
const { getDepartments, createDepartment } = require("../controllers/departmentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Only Admin can access
router.get("/fetchAll", authenticate, authorize("Admin"), getDepartments);
router.post("/create", authenticate, authorize("Admin"), createDepartment);

module.exports = router;
