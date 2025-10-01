const HOD = require("../models/HOD");

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
            message: "Server error",
        });
    }
};

// @desc Create HOD
// @route POST /api/hod/create
const createHOD = async (req, res) => {
    try {
        const { name, employeeId, department, contactDetails, dateOfJoining } = req.body;
 
        // Validation
        if (!name || !employeeId || !department || !contactDetails || !dateOfJoining) {
            return res.status(400).json({
                success: false, 
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
                message: "HOD with this Employee ID, Email, or Department already exists",
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

// @desc Update HOD
// @route PUT /api/hod/:id
const updateHOD = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const hod = await HOD.findOneAndUpdate({ _id: id }, updates, {
            new: true,
            runValidators: true,
        })

        if (!hod) {
            return res.status(404).json({ success: false, message: "HOD not found" });
        }

        res.status(200).json({
            success: true, 
            message: "HOD and linked user updated successfully",
        });
    } catch (err) {
        console.error("Update HOD Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc Delete HOD
// @route DELETE /api/hod/:id
const deleteHOD = async (req, res) => {
    try {
        const { id } = req.params;

        const hod = await HOD.findOneAndDelete({ _id: id });

        if (!hod) {
            return res.status(404).json({ success: false, message: "HOD not found" });
        }

        res.status(200).json({
            success: true, 
            message: "HOD and linked user deleted successfully",
        });
    } catch (err) {
        console.error("Delete HOD Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
  getHODs,
  createHOD,
  updateHOD,
  deleteHOD,
};
