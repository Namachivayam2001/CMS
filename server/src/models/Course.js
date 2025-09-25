const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
        },
        code: {
            type: String,
            required: [true, "Course code is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8, 
        },
        credits: {
            type: Number,
            default: 3,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
