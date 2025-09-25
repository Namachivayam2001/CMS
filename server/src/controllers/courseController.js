const Course = require("../models/Course");
const Department = require("../models/Department");
const Teacher = require("../models/Teacher");

// @desc   Get all courses
// @route  GET /api/course/fetchAll
// @access Admin, HOD
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { courses: courses },
            message: "Courses fetched successfully",
        });
    } catch (err) {
        console.error("Get Courses Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Create a new course
// @route  POST /api/course/create
// @access Admin, HOD
const createCourse = async (req, res) => {
    try {
        const { name, code, department, teacher, semester, credits } = req.body;

        if (!name || !code || !department || !teacher || !semester) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if department exists
        const deptExists = await Department.findById(department);
        if (!deptExists) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        // Check if teacher exists
        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        // Check duplicate course
        const courseExists = await Course.findOne({ code });
        if (courseExists) {
            return res.status(400).json({ success: false, message: "Course with this code already exists" });
        }

        const course = await Course.create({
            name,
            code,
            department,
            teacher,
            semester,
            credits,
        });

        res.status(201).json({
            success: true,
            data: { course: course },
            message: "Course created successfully",
        });
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getCourses, createCourse };
