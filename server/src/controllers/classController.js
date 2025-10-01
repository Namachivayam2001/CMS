const Class = require("../models/Class");

// @desc   Get all classes
// @route  GET /api/class/fetchAll
// @access Admin, HOD
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { classes: classes },
            message: "Classes fetched successfully",
        });
    } catch (err) {
        console.error("Get Classes Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Create new class
// @route  POST /api/class/create
// @access Admin, HOD
const createClass = async (req, res) => {
    try {
        const { department, academicYear, semester, section, classAdvisor } = req.body;

        if (!department || !academicYear || !semester || !section) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check duplicate (must include semester to be precise)
        const existingClass = await Class.findOne({ department, academicYear, section });
        if (existingClass) {
            return res.status(400).json({
                success: false,
                message: "Class already exists for this Department, Year & Section",
            });
        }

        // Create new class
        const newClass = new Class({
            department,
            academicYear,
            semester,
            section,
            classAdvisor: classAdvisor || null,
        });

        await newClass.save();

        res.status(201).json({
            success: true,
            data: { class: newClass },
            message: "Class created successfully",
        });
    } catch (err) {
        console.error("Create Class Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// @desc   Update class
// @route  PUT /api/class/update/:id
// @access Admin, HOD
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { department, academicYear, semester, section, classAdvisor } = req.body;

        const cls = await Class.findById(id);
        if (!cls) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        // Update fields
        if (department) cls.department = department;
        if (academicYear) cls.academicYear = academicYear;
        if (semester) cls.semester = semester;
        if (section) cls.section = section;
        cls.classAdvisor = classAdvisor || null;

        await cls.save();

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
        });
    } catch (err) {
        console.error("Update Class Error:", err);
        if (err.code === 11000) {
            // Duplicate key violation from unique index
            return res.status(400).json({ success: false, message: "Class with same Department, Year, Semester, and Section already exists" });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Delete class
// @route  DELETE /api/class/delete/:id
// @access Admin, HOD
const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const cls = await Class.findById(id);
        if (!cls) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        await cls.deleteOne();

        res.status(200).json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (err) {
        console.error("Delete Class Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getClasses,
    createClass,
    updateClass,
    deleteClass,
};