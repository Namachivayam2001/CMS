const Attendance = require("../models/Attendance");

// @desc   Get all attendances
const getAllAttendances = async (req, res) => {
    try {
        const attendances = await Attendance.find();

        res.status(200).json({
            success: true,
            data: { attendances: attendances },
            message: "Attendances fetched successfully",
        });
    } catch (err) {
        console.error("Get All Attendances Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Mark (create/update) attendance for a specific period
const markAttendance = async (req, res) => {
    try {
        const { course, class: classId, period, date, records } = req.body;

        if (!course || !classId || !period || !date || !records) {
            return res.status(400).json({
                success: false,
                message: "Course, Class, Period, Date, and Records are required",
            });
        }

        // ✅ Check if attendance already exists for same course, period, and date
        let attendance = await Attendance.findOne({ course, class: classId, period, date });

        if (attendance) {
            attendance.records = records; 
            await attendance.save();

            return res.status(200).json({
                success: true,
                data: { attendance: attendance },
                message: "Attendance updated successfully for this period",
            });
        } else {
            attendance = new Attendance({ course, class: classId, period, date, records });
            await attendance.save();

            res.status(201).json({
                success: true,
                data: { attendance: attendance },
                message: "Attendance marked successfully for this period",
            });
        }
    } catch (err) {
        console.error("Mark Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Get attendance for a specific course (optionally by period or date)
const getCourseAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, period } = req.query;

        const filter = { course: id };
        if (date) filter.date = date;
        if (period) filter.period = period;

        const attendances = await Attendance.find(filter);

        res.status(200).json({
            success: true,
            data: { attendances: attendances },
            message: "Course attendance fetched successfully",
        });
    } catch (err) {
        console.error("Get Course Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Get attendance for a specific student
const getStudentAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, period } = req.query;

        const filter = { "records.student": id };
        if (date) filter.date = date;
        if (period) filter.period = period;

        const attendances = await Attendance.find(filter);

        res.status(200).json({
            success: true,
            data: { attendances: attendances },
            message: "Student attendance fetched successfully",
        });
    } catch (err) {
        console.error("Get Student Attendance Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getAllAttendances,
    markAttendance,
    getCourseAttendance,
    getStudentAttendance,
};
