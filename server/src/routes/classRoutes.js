const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getClasses, createClass, updateClass, deleteClass } = require("../controllers/classController");
const router = express.Router();

router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getClasses);
router.post("/create", authenticate, authorize("Admin", "HOD"), createClass);
router.put("/update/:id", authenticate, authorize("Admin", "HOD"), updateClass);
router.delete("/delete/:id", authenticate, authorize("Admin", "HOD"), deleteClass);

module.exports = router;
