const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc   Get all users
// @route  GET /api/user/fetchAll
// @access Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true, 
            data: {
                users: users 
            },
            message: "All Users Fetched Successfully",
        });
    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error",
        });
    }
};



module.exports = { getUsers };
