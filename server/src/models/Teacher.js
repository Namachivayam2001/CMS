const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9_-]+$/, "Employee ID must be alphanumeric"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    contactDetails: {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
      },
    },
    dateOfJoining: {
      type: Date,
      required: [true, "Date of Joining is required"],
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

module.exports = mongoose.model("Teacher", TeacherSchema);
