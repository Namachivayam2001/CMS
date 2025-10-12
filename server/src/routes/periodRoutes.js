const express = require("express");
const { createPeriod, getAllPeriods, updatePeriod } = require("../controllers/periodController"); 
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Routes
router.post("/create", authenticate, authorize("Admin", "HOD"), createPeriod); 
router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getAllPeriods);  
router.put("/:id", authenticate, authorize("Admin", "HOD"), updatePeriod);  

module.exports = router;
