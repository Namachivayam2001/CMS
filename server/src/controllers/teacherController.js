const Teacher = require("../models/Teacher");
const User = require("../models/User");

// @desc Fetch all teachers
// @route GET /api/teacher/fetchAll
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { 
            teachers: teachers,
        },
        message: "Teachers Fetched Successfully",
    });
    } catch (err) {
        console.error("Get Teachers Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};

// @desc Create teacher
// @route POST /api/teacher/create
const createTeacher = async (req, res) => {
    try {
        const { name, employeeId, department, contactDetails, dateOfJoining } = req.body;

        const username = employeeId; // Use employeeId as username
        const password = `${contactDetails.email}`; // Default password

        // Basic required field validation
        if (!name || !employeeId || !department || !contactDetails || !dateOfJoining) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "All fields are required",
            });
        }

        // Manual validations
        if (name.trim().length < 3) {
            return res
                .status(400)
                .json({ success: false, message: "Name must be at least 3 characters" });
        }

        if (!/^[A-Za-z0-9_-]+$/.test(employeeId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Employee ID" });
        }

        if (!contactDetails?.email || !/^\S+@\S+\.\S+$/.test(contactDetails.email)) {
            return res
                .status(400)
                .json({ success: false, message: "Valid email is required" });
        }

        if (!contactDetails?.phone || !/^[0-9]{10}$/.test(contactDetails.phone)) {
            return res
                .status(400)
                .json({ success: false, message: "Phone must be 10 digits" });
        }

        if (!dateOfJoining || new Date(dateOfJoining) > new Date()) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Date of Joining" });
        }

        // Check duplicate teacher
        const isTeacherExists = await Teacher.findOne({
            $or: [{ employeeId }, { "contactDetails.email": contactDetails.email }],
        });

        if (isTeacherExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Teacher with this Employee ID or Email already exists",
            });
        }

        // Check duplicate user
        const isUserExists = await User.findOne({ username });
        if (isUserExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User with this Employee ID/User Name already exists",
            });
        }

        // Create teacher first
        const teacher = await Teacher.create({
            name,
            employeeId,
            department,
            contactDetails,
            dateOfJoining,
        });

        // Create linked user
        const user = new User({
            username,
            password, // will be hashed in pre('save')
            role: "Teacher",
            refId: teacher._id,
        });

        await user.save();

        res.status(201).json({
            success: true,
            data: { 
                teacher: teacher,
            },
            message: `${teacher.name} and linked user created successfully`,
        });
    } catch (err) {
        console.error("Create Teacher Error:", err);
        res.status(500).json({
        success: false,
        data: null,
        message: "Server error",
        });
    }
};

module.exports = {
  getTeachers,
  createTeacher,
};