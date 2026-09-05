const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    headName: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    avgResolutionDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
