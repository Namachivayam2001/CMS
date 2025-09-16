const Department = require("../models/Department");

// @desc   Get all departments
// @route  GET /api/department/fetchAll
// @access Admin
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: {
                departments: departments
            },
            message: "All Departments Fetched Successfully"
        });
    } catch (err) {
        console.error("Get Departments Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error" 
        });
    }
};

// @desc   Create a new department
// @route  POST /api/department/create
// @access Admin
const createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;
        if (!name || !code) {
            return res
                .status(400)
                .json({ 
                    success: false,
                    data: null,
                    message: "Name and Code are required" ,
                });
        }

        // Check duplicate
        const exists = await Department.findOne({ $or: [{ name }, { code }] });
        if (exists) {
        return res.status(400).json({ 
                success: false,
                data: null,
                message: "Department with this name or code already exists" ,
            });
        }

        const department = await Department.create({ name, code });
        res.status(201).json({
            success: true,
            data: {
                department: department
            },
            message: `${department.name} Department Created Successfully`
        });
    } catch (err) {
        console.error("Create Department Error:", err);
        res.status(500).json({
            success: false,
            data: null,
            message: "Server error" 
        });
    }
};

module.exports = { getDepartments, createDepartment };
