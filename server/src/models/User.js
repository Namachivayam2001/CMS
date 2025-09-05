const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roles = ['Admin', 'HOD', 'Teacher', 'Student'];

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: roles,
      required: [true, 'Role is required'],
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role', // Can reference Student/Teacher/HOD dynamically
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Optional: virtual for displaying role-related info
UserSchema.virtual('fullInfo').get(function () {
  return `${this.username} (${this.role})`;
});

// Ensure virtuals are included in JSON responses
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
