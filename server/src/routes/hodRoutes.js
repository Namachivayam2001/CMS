const express = require("express");
const router = express.Router();
const { getHODs, createHOD } = require("../controllers/hodController");
const { authenticate, authorize } = require("../middleware/auth");

// Routes
router.get("/fetchAll", authenticate, authorize("Admin"), getHODs);
router.post("/create", authenticate, authorize("Admin"), createHOD);

module.exports = router;
