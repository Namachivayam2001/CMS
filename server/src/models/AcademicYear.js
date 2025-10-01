const mongoose = require("mongoose");

const AcademicYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true, // "2024-2025"
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true, // mark current year active
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicYear", AcademicYearSchema);
