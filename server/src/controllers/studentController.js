const Student = require("../models/Student");

// @desc   Get all students
// @route  GET /api/student/fetchAll
// @access Admin, HOD
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { students: students },
            message: "Students fetched successfully",
        });
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc   Create a new student + linked user
// @route  POST /api/student/create
// @access Admin, HOD
const createStudent = async (req, res) => {
    try {
        const { name, rollNumber, class: classId, contactDetails, dateOfJoining } = req.body;

        if (!name || !rollNumber || !classId || !contactDetails || !dateOfJoining) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check duplicate student by rollNumber or email
        const studentExists = await Student.findOne({
            $or: [{ rollNumber }, { "contactDetails.email": contactDetails.email }],
        });
        if (studentExists) {
            return res.status(400).json({ success: false, message: "Student with this Roll Number or Email already exists" });
        } 

        // Create student
        let student = await Student.create({
            name,
            rollNumber,
            class: classId,
            contactDetails,
            dateOfJoining,
        }); 

        res.status(201).json({
            success: true,
            data: { student: student },
            message: "Student and linked user created successfully",
        });
    } catch (err) {
        console.error("Create Student Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Optional: update student
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rollNumber, class: classId, contactDetails, dateOfJoining } = req.body;

        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        if (name) student.name = name;
        if (rollNumber) student.rollNumber = rollNumber;
        if (classId) student.class = classId;
        if (contactDetails?.email) student.contactDetails.email = contactDetails.email;
        if (contactDetails?.phone) student.contactDetails.phone = contactDetails.phone;
        if (dateOfJoining) student.dateOfJoining = dateOfJoining;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
        });
    } catch (err) {
        console.error("Update Student Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Optional: delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        await student.deleteOne();

        res.status(200).json({
            success: true,
            message: "Student and linked user deleted successfully",
        });
    } catch (err) {
        console.error("Delete Student Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
