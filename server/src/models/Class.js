const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Department", 
        required: true 
    },
    academicYear: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "AcademicYear", 
        required: true 
    },
    semester: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 8 
    },
    section: { 
        type: String, 
        required: true, 
        trim: true 
    }, // A, B, C
    classAdvisor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Teacher", 
        default: null 
    },
  },
  { timestamps: true }
);

// Unique: One class per dept + year + semester + section
ClassSchema.index({ department: 1, academicYear: 1, semester: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("Class", ClassSchema);
