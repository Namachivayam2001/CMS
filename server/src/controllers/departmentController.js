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
                    message: "Name and Code are required" ,
                });
        }

        // Check duplicate
        const exists = await Department.findOne({ $or: [{ name }, { code }] });
        if (exists) {
        return res.status(400).json({ 
                success: false, 
                message: "Department with this name or code already exists" ,
            });
        }

        const department = await Department.create({ name, code });
        res.status(201).json({
            success: true,
            data: {
                department: department
            },
            message: `Department Created Successfully`
        });
    } catch (err) {
        console.error("Create Department Error:", err);
        res.status(500).json({
            success: false, 
            message: "Server error" 
        });
    }
};

// @desc   Update department
// @route  PUT /api/department/update/:id
// @access Admin
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({
                success: false, 
                message: "Department not found"
            });
        }

        // Check for duplicate name/code with other departments
        if (name || code) {
            const duplicate = await Department.findOne({
                $or: [{ name }, { code }],
                _id: { $ne: id }
            });
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Another department with this name or code already exists"
                });
            }
        }

        if (name) department.name = name;
        if (code) department.code = code;

        await department.save();

        res.status(200).json({
            success: true,
            message: "Department Updated Successfully"
        });
    } catch (err) {
        console.error("Update Department Error:", err);
        res.status(500).json({
            success: false, 
            message: "Server error"
        });
    }
};

// @desc   Delete department
// @route  DELETE /api/department/delete/:id
// @access Admin
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({
                success: false, 
                message: "Department not found"
            });
        }

        await department.deleteOne();

        res.status(200).json({
            success: true, 
            message: "Department Deleted Successfully"
        });
    } catch (err) {
        console.error("Delete Department Error:", err);
        res.status(500).json({
            success: false, 
            message: "Server error"
        });
    }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
