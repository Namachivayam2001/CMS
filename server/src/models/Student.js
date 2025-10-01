const mongoose = require("mongoose");
const User = require("./User");

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
        class: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Class", 
            required: true 
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
StudentSchema.post("save", async function (doc, next) {
    try {
        const existingUser = await User.findOne({ refId: doc._id, role: "Student" });
        if (!existingUser) {
            await User.create({
                name: doc.name,
                username: doc.rollNumber,
                password: doc.contactDetails.email, // default password
                role: "Student",
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
StudentSchema.post("findOneAndUpdate", async function (doc, next) {
    try {
        if (doc) {
            await User.findOneAndUpdate(
                { refId: doc._id, role: "Student" },
                {
                    name: doc.name,
                    username: doc.rollNumber,
                    role: "Student",
                    // Uncomment below if you want password to follow email change:
                    // password: doc.contactDetails.email
                }
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

// For document.deleteOne()
StudentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        await User.deleteOne({ refId: this._id, role: "Student" });
        next();
    } catch (err) {
        next(err);
    }
});

// For query-based deletions (findOneAndDelete / findByIdAndDelete)
StudentSchema.pre("findOneAndDelete", async function (next) {
    try {
        const doc = await this.model.findOne(this.getFilter());
        if (doc) {
            await User.deleteOne({ refId: doc._id, role: "Student" });
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Student", StudentSchema);
