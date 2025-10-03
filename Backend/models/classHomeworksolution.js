const mongoose = require("mongoose");

const ClassHomeworkSolutionSchema = new mongoose.Schema({
  classhomeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "classhomework",  
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",  
    required: true,
  },
  fileUrl: { type: String, required: true }, 
  fileType: { type: String },  
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("classhomeworksolution", ClassHomeworkSolutionSchema);
