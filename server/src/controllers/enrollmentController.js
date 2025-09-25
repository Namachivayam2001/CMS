const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// @desc   Get all enrollments
// @route  GET /api/enrollment/fetchAll
// @access Admin, HOD, Teacher
const getEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name rollNumber")
            .populate("course", "name code")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { enrollments: enrollments },
            message: "Enrollments fetched successfully",
        });
    } catch (err) {
        console.error("Get Enrollments Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Enroll a student in a course
// @route  POST /api/enrollment/create
// @access Admin, HOD
const createEnrollment = async (req, res) => {
    try {
        const { student, course, academicYear, semester } = req.body;

        if (!student || !course || !academicYear || !semester) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if student exists
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Check if course exists
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Prevent duplicate enrollment
        const enrollmentExists = await Enrollment.findOne({ student, course });
        if (enrollmentExists) {
            return res.status(400).json({ success: false, message: "Student already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            student,
            course,
            academicYear,
            semester,
        });

        res.status(201).json({
            success: true,
            data: { enrollment: enrollment },
            message: "Enrollment created successfully",
        });
    } catch (err) {
        console.error("Create Enrollment Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getEnrollments, createEnrollment };
