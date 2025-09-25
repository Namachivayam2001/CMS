const Attendance = require("../models/Attendance");

// @desc   Mark attendance for a course on a date
// @route  POST /api/attendance/mark
// @access Teacher, HOD
const markAttendance = async (req, res) => {
    try {
        const { course, date, records } = req.body;

        if (!course || !date || !records) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        let attendance = await Attendance.findOne({ course, date });

        if (attendance) {
            attendance.records = records; // update
        } else {
            attendance = new Attendance({ course, date, records });
        }

        await attendance.save();

        res.status(201).json({
            success: true,
            data: { attendance: attendance },
            message: "Attendance marked successfully",
        });
    } catch (err) {
        console.error("Mark Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Get attendance for a course
// @route  GET /api/attendance/course/:id?date=
// @access Teacher, HOD
const getCourseAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        let filter = { course: id };
        if (date) filter.date = date;

        const attendance = await Attendance.find(filter)
            .populate("course", "name code")
            .populate("records.student", "name rollNumber");

        res.status(200).json({
            success: true,
            data: { attendance: attendance },
            message: "Course attendance fetched successfully",
        });
    } catch (err) {
        console.error("Get Course Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Get attendance for a student
// @route  GET /api/attendance/student/:id
// @access Student, HOD, Teacher
const getStudentAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.find({ "records.student": id })
            .populate("course", "name code semester");

        res.status(200).json({
            success: true,
            data: { attendance },
            message: "Student attendance fetched successfully",
        });
    } catch (err) {
        console.error("Get Student Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { markAttendance, getCourseAttendance, getStudentAttendance };
