const mongoose = require("mongoose");
const User = require("./User");

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


//////////////////////
// CREATE USER HOOK //
//////////////////////
TeacherSchema.post("save", async function (doc, next) {
    try {
        const existingUser = await User.findOne({ refId: doc._id, role: "Teacher" });
        if (!existingUser) {
            await User.create({
                name: doc.name,
                username: doc.employeeId,
                password: doc.contactDetails.email, // default password (hashed in User pre-save)
                role: "Teacher",
                refId: doc._id,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
});

//////////////////////
// UPDATE USER HOOK //
//////////////////////
TeacherSchema.post("findOneAndUpdate", async function (doc, next) {
    try {
        if (doc) {
            await User.findOneAndUpdate(
                { refId: doc._id, role: "Teacher" },
                {
                    name: doc.name,
                    username: doc.employeeId,
                    role: "Teacher",
                },
                { new: true }
            );
        }
        next();
    } catch (err) {
        next(err);
    }
});

//////////////////////
// DELETE USER HOOK //
//////////////////////
TeacherSchema.post("findOneAndDelete", async function (doc, next) {
    try {
        if (doc) {
            await User.deleteOne({ refId: doc._id, role: "Teacher" });
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
