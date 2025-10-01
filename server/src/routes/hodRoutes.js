const express = require("express");
const router = express.Router();
const { getHODs, createHOD, updateHOD, deleteHOD } = require("../controllers/hodController");
const { authenticate, authorize } = require("../middleware/auth");

// Routes
router.get("/fetchAll", authenticate, authorize("Admin"), getHODs);
router.post("/create", authenticate, authorize("Admin"), createHOD);
router.put("/update/:id", authenticate, authorize("Admin"), updateHOD);
router.delete("/delete/:id", authenticate, authorize("Admin"), deleteHOD);

module.exports = router;
