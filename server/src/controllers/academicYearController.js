const AcademicYear = require("../models/AcademicYear");

// @desc   Get all academic years
// @route  GET /api/academicYear/fetchAll
// @access Admin, HOD
const getAcademicYears = async (req, res) => {
    try {
        const years = await AcademicYear.find().sort({ year: -1 });
        res.status(200).json({
            success: true,
            data: { years: years },
            message: "Academic years fetched successfully",
        });
    } catch (err) {
        console.error("Get Academic Years Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Create new academic year
// @route  POST /api/academicYear/create
// @access Admin
const createAcademicYear = async (req, res) => {
    try {
        const { year, isActive } = req.body;

        if (!year) {
            return res.status(400).json({ success: false, message: "Year is required" });
        }

        // Check duplicate
        const existing = await AcademicYear.findOne({ year });
        if (existing) {
            return res.status(400).json({ success: false, message: "Academic year already exists" });
        }

        const newYear = await AcademicYear.create({ year, isActive: !!isActive });

        res.status(201).json({
            success: true,
            data: { academicYear: newYear },
            message: "Academic year created successfully",
        });
    } catch (err) {
        console.error("Create Academic Year Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Update academic year
// @route  PUT /api/academicYear/update/:id
// @access Admin
const updateAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, isActive } = req.body;

        const academicYear = await AcademicYear.findById(id);
        if (!academicYear) {
            return res.status(404).json({ success: false, message: "Academic year not found" });
        }

        // Update fields directly
        if (year) academicYear.year = year;
        if (typeof isActive === "boolean") academicYear.isActive = isActive;

        await academicYear.save();

        res.status(200).json({
            success: true,
            message: "Academic year updated successfully",
        });
    } catch (err) {
        console.error("Update Academic Year Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// @desc   Delete academic year
// @route  DELETE /api/academicYear/delete/:id
// @access Admin
const deleteAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;

        const academicYear = await AcademicYear.findById(id);
        if (!academicYear) {
            return res.status(404).json({ success: false, message: "Academic year not found" });
        }

        await academicYear.deleteOne();

        res.status(200).json({
            success: true,
            message: "Academic year deleted successfully",
        });
    } catch (err) {
        console.error("Delete Academic Year Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
