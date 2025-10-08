const Attendance = require("../models/Attendance");

// @desc   Get all attendances
// @route  GET /api/attendances
// @access Admin, HOD, Teacher
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate("course", "name code")
      .populate("records.student", "name rollNumber");

    res.status(200).json({
      success: true,
      data: { attendances },
      message: "Attendances fetched successfully",
    });
  } catch (err) {
    console.error("Get All Attendances Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Mark (create) attendance for a course on a date
// @route  POST /api/attendance/mark
// @access Teacher, HOD
const markAttendance = async (req, res) => {
  try {
    const { course, class: classId, date, records } = req.body;

    if (!course || !date || !records || !classId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if attendance already exists for the course and date
    let attendance = await Attendance.findOne({ course, date });

    if (attendance) {
      // Update existing attendance
      attendance.records = records;
      attendance.class = classId;
      await attendance.save();

      return res.status(200).json({
        success: true,
        data: { attendance },
        message: "Attendance updated successfully",
      });
    } else {
      // Create new attendance
      attendance = new Attendance({ course, class: classId, date, records });
      await attendance.save();

      res.status(201).json({
        success: true,
        data: { attendance },
        message: "Attendance marked successfully",
      });
    }
  } catch (err) {
    console.error("Mark Attendance Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Update an existing attendance by ID
// @route  PUT /api/attendances/:id
// @access Teacher, HOD
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, class: classId, date, records } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance)
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });

    attendance.course = course || attendance.course;
    attendance.class = classId || attendance.class;
    attendance.date = date || attendance.date;
    attendance.records = records || attendance.records;

    await attendance.save();

    res.status(200).json({
      success: true,
      data: { attendance },
      message: "Attendance updated successfully",
    });
  } catch (err) {
    console.error("Update Attendance Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get attendance for a specific course (optional date filter)
// @route  GET /api/attendance/course/:id?date=
// @access Teacher, HOD
const getCourseAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const filter = { course: id };
    if (date) filter.date = date;

    const attendances = await Attendance.find(filter)
      .populate("course", "name code")
      .populate("records.student", "name rollNumber");

    res.status(200).json({
      success: true,
      data: { attendances },
      message: "Course attendance fetched successfully",
    });
  } catch (err) {
    console.error("Get Course Attendance Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc   Get attendance for a specific student
// @route  GET /api/attendance/student/:id
// @access Student, Teacher, HOD
const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendances = await Attendance.find({ "records.student": id })
      .populate("course", "name code semester");

    res.status(200).json({
      success: true,
      data: { attendances },
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
  updateAttendance,
  getCourseAttendance,
  getStudentAttendance,
};
