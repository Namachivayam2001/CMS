const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    day: {
        type: String,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        required: true,
    },
    period: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Period",
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
});

module.exports = mongoose.model("Timetable", timetableSchema);