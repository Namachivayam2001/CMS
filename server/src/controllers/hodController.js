const HOD = require("../models/HOD");
const User = require("../models/User");

// @desc Fetch all HODs
// @route GET /api/hod/fetchAll
const getHODs = async (req, res) => {
    try {
        const hods = await HOD.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { hods: hods },
            message: "HODs fetched successfully",
        });
    } catch (err) {
        console.error("Get HODs Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};

// @desc Create HOD
// @route POST /api/hod/create
const createHOD = async (req, res) => {
    try {
        const { name, employeeId, department, contactDetails, dateOfJoining } = req.body;

        const username = employeeId; // login username
        const password = `${contactDetails.email}`; // default password

        // Validation
        if (!name || !employeeId || !department || !contactDetails || !dateOfJoining) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "All fields are required",
        });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 3 characters",
            });
        }

        if (!/^[A-Za-z0-9_-]+$/.test(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID",
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(contactDetails?.email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email is required",
            });
        }

        if (!/^[0-9]{10}$/.test(contactDetails?.phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone must be 10 digits",
            });
        }

        if (!dateOfJoining || new Date(dateOfJoining) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid Date of Joining",
            });
        }

        // Check duplicate HOD (same department or email/employeeId)
        const isHODExists = await HOD.findOne({
            $or: [
                { employeeId },
                { "contactDetails.email": contactDetails.email },
                { department },
            ],
        });

        if (isHODExists) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "HOD with this Employee ID, Email, or Department already exists",
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

        // Create HOD
        const hod = await HOD.create({
            name,
            employeeId,
            department,
            contactDetails,
            dateOfJoining,
        });

        // Create linked user
        const user = new User({
            username,
            password,
            role: "HOD",
            refId: hod._id,
        });

        await user.save();

        res.status(201).json({
            success: true,
            data: { hod: hod },
            message: `HOD and linked user created successfully`,
        });
    } catch (err) {
        console.error("Create HOD Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};

module.exports = {
  getHODs,
  createHOD,
};
