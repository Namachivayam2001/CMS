const Period = require("../models/Period");

// @desc   Get all periods
// @route  GET /api/periods
// @access Private (Admin, CollegeAdmin)
const getAllPeriods = async (req, res) => {
    try {
        const periods = await Period.find().sort({ startTime: 1 });
        res.status(200).json({
            success: true,
            data: { periods: periods },
            message: "Periods fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Create a new period
// @route  POST /api/periods
// @access Private (Admin)
const createPeriod = async (req, res) => {
    try {
        const { name, startTime, endTime } = req.body;

        console.log("requist Body: ", req.body);

        if (!name || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const existing = await Period.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, message: "Period already exists" });
        }

        const period = await Period.create({ name, startTime, endTime });

        res.status(201).json({
            success: true,
            data: { period: period },
            message: "Period created successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Update period
// @route  PUT /api/periods/:id
// @access Private (Admin)
const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startTime, endTime } = req.body;

    const updated = await Period.findByIdAndUpdate(
      id,
      { name, startTime, endTime },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Period not found" });
    }

    res.status(200).json({
      success: true,
      data: { period: updated },
      message: "Period updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPeriods,
  createPeriod,
  updatePeriod,
};
