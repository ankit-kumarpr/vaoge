const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch"  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  date: { type: Date, required: true, default: Date.now },
  educatorAttendance: {
    educatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Educator", required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
  },
  studentAttendance: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      status: { type: String, enum: ["Present", "Absent"], required: true },
    },
  ],
});


module.exports = mongoose.model("Attendance", AttendanceSchema);