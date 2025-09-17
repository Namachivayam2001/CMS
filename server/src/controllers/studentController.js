const Student = require("../models/Student");
const User = require("../models/User");

// @desc   Get all students
// @route  GET /api/student/fetchAll
// @access Admin, HOD
const getStudents = async (req, res) => {
    try {
        // if (req.user.role === "HOD") {
        //     let filter = {};            
        //     const hod = await HOD.findById(req.user.refId).populate("department", "_id name code"); // Find HOD info and its department

        //     if (!hod) {
        //         return res.status(404).json({
        //             success: false,
        //             data: null,
        //             message: "HOD not found",
        //         });
        //     }
            
        //     filter = { department: hod.department._id }; // Restrict to only students of HOD’s department

        //     const students = await Student.find(filter)
        //         .populate("department", "name code")
        //         .sort({ createdAt: -1 });

        //     res.status(200).json({
        //         success: true,
        //         data: { 
        //             students: students,
        //         },
        //         message: "Students Fetched Successfully",
        //     });
        // } else {
            const students = await Student.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: { 
                    students: students,
                },
                message: "Students Fetched Successfully",
            });
        //}
        
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};


// @desc   Create a new student + linked user
// @route  POST /api/student/create
// @access Admin, HOD
const createStudent = async (req, res) => {
    try {
        const { name, rollNumber, department, contactDetails, dateOfJoining} = req.body;
        const username = rollNumber;
        const password = `${contactDetails.email}`;

        if (!name || !rollNumber || !department || !contactDetails || !dateOfJoining ) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "All fields are required",
            });
        }

        // Extra manual validations before DB call
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Name must be at least 3 characters" });
        }

        if (!rollNumber || !/^[A-Za-z0-9_-]+$/.test(rollNumber)) {
            return res.status(400).json({ success: false, message: "Invalid Roll Number" });
        }

        if (!contactDetails?.email || !/^\S+@\S+\.\S+$/.test(contactDetails.email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }

        if (!contactDetails?.phone || !/^[0-9]{10}$/.test(contactDetails.phone)) {
            return res.status(400).json({ success: false, message: "Phone must be 10 digits" });
        }

        if (!dateOfJoining || new Date(dateOfJoining) > new Date()) {
            return res.status(400).json({ success: false, message: "Invalid Date of Joining" });
        }

        // Check duplicate rollNumber or email
        const isStudentExists = await Student.findOne({
            $or: [{ rollNumber }, { "contactDetails.email": contactDetails.email }],
        });

        if (isStudentExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Student with this Roll Number or Email already exists",
            });
        }

        // Check duplicate
        const isUserExists = await User.findOne({ username });

        if (isUserExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User with this Roll Number/User Name already exists",
            });
        }
        

        // Create student first
        const student = await Student.create({
            name,
            rollNumber,
            department,
            contactDetails,
            dateOfJoining,
        });

        // Create linked user (refId = student._id)
        const user = new User({
            username,
            password, // plain → will be hashed in pre('save')
            role: "Student",
            refId: student._id,
        });

        await user.save();

        res.status(201).json({
            success: true,
            data: {
                student: student,
            },
            message: `Student and linked user created successfully`,
        });
    } catch (err) {
        console.error("Create Student Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};

module.exports = { getStudents, createStudent };