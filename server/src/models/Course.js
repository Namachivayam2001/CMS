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
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        class: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Class", 
            required: true 
        }, // 👈 course assigned to class
        credits: {
            type: Number,
            default: 3,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
