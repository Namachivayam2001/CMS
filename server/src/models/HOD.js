const mongoose = require("mongoose");
const User = require("./User");

const HODSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "HOD name is required"],
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
            unique: true, // ✅ Only 1 HOD per department
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
    { timestamps: true }
);

//////////////////////
// CREATE USER HOOK //
//////////////////////
HODSchema.post("save", async function (doc, next) {
    try {
        const existingUser = await User.findOne({ refId: doc._id, role: "HOD" });
        if (!existingUser) {
            const user = new User({
                name: doc.name,
                username: doc.employeeId,
                password: doc.contactDetails.email, // default password
                role: "HOD",
                refId: doc._id,
            });
            await user.save();
        }
        next();
    } catch (err) {
        next(err);
    }
});

//////////////////////
// UPDATE USER HOOK //
//////////////////////
HODSchema.post("findOneAndUpdate", async function (doc) {
    if (!doc) return;
    await User.findOneAndUpdate(
        { refId: doc._id, role: "HOD" },
        {
            name: doc.name,
            username: doc.employeeId,
            role: "HOD",
        }
    );
});

//////////////////////
// DELETE USER HOOK //
//////////////////////
HODSchema.post("findOneAndDelete", async function (doc) {
    if (!doc) return;
    await User.deleteOne({ refId: doc._id, role: "HOD" });
});


module.exports = mongoose.model("HOD", HODSchema);
