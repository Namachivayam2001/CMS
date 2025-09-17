const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll Number is required"],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9_-]+$/, "Roll Number must be alphanumeric"]
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

module.exports = mongoose.model("Student", StudentSchema);
