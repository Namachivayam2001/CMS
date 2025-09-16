const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Department", DepartmentSchema);
