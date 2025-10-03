const mongoose = require("mongoose");

const PracticeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  materialname: {
    type: String,
    required: true,
  },
  materialimages: {
    type: [String],
    required: true,
  },
  materialdescription: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Practice", PracticeSchema);
