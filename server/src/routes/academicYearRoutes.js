const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
    getAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
} = require("../controllers/academicYearController");

const router = express.Router();

router.get("/fetchAll", authenticate, authorize("Admin", "HOD"), getAcademicYears);
router.post("/create", authenticate, authorize("Admin", "HOD"), createAcademicYear);
router.put("/update/:id", authenticate, authorize("Admin", "HOD"), updateAcademicYear);
router.delete("/delete/:id", authenticate, authorize("Admin", "HOD"), deleteAcademicYear);

module.exports = router;
