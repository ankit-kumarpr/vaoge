const mongoose = require("mongoose");

const NoticeSchema = mongoose.Schema({
  noticeId: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  noticedate: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  noticeimage: {
    type: String,
  },
  sendToAll: {
    type: Boolean,
    default: true, 
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  educators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Educator",
    },
  ],
  mentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor", 
    },
  ],
});

module.exports = mongoose.model("Notice", NoticeSchema);
