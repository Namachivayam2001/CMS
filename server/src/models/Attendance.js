const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
    {
        class: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Class", 
            required: true 
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        period: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Period", 
            required: true 
        },
        date: {
            type: Date,
            required: true,
        },
        records: [{
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true,
            },
            status: {
                type: String,
                enum: ["present", "absent", "late"],
                required: true,
            },
        }],
    },
    { timestamps: true }
);

AttendanceSchema.index({ course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
