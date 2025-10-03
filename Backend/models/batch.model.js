const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  batchId: { type: String },
  batchname: { type: String, required: true },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  coursename: { type: String, required: true },
  schedule: {
    days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }], 
    time: { type: String }
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  }],
  educators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Educator"
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add validation for maximum 30 students
BatchSchema.pre('save', function(next) {
  if (this.students && this.students.length > 30) {
    throw new Error('Batch cannot have more than 30 students');
  }
  next();
});

module.exports = mongoose.model("Batch", BatchSchema);