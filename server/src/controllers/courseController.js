const Course = require("../models/Course");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");

// ------------------ GET ALL COURSES ------------------
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

// ------------------ CREATE COURSE ------------------
const createCourse = async (req, res) => {
    try {
        const { name, code, class: classId, teacher, credits } = req.body;

        if (!name || !code || !classId || !teacher) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const classExists = await Class.findById(classId);
        if (!classExists) return res.status(404).json({ success: false, message: "Class not found" });

        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) return res.status(404).json({ success: false, message: "Teacher not found" });

        const courseExists = await Course.findOne({ name, code: code.toUpperCase(), classId });
        if (courseExists) return res.status(400).json({ success: false, message: "Course with this Class already exists" });

        const course = await Course.create({
            name,
            code: code.toUpperCase(),
            class: classId,
            teacher,
            credits: credits || 3,
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

// ------------------ UPDATE COURSE ------------------
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, class: classId, teacher, credits } = req.body;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        if (classId) {
            const classExists = await Class.findById(classId);
            if (!classExists) return res.status(404).json({ success: false, message: "Class not found" });
            course.class = classId;
        }

        if (teacher) {
            const teacherExists = await Teacher.findById(teacher);
            if (!teacherExists) return res.status(404).json({ success: false, message: "Teacher not found" });
            course.teacher = teacher;
        }

        if (name) course.name = name;
        if (code) course.code = code.toUpperCase();
        if (credits !== undefined) course.credits = credits;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
        });
    } catch (err) {
        console.error("Update Course Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ------------------ DELETE COURSE ------------------
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err) {
        console.error("Delete Course Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
