const mongoose=require("mongoose");
const ClassHomeWorkSchema = new mongoose.Schema({
    c: { type: String },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },  // file path or URL
    fileType: { type: String }, // optional, e.g., 'pdf', 'image/png'
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("classhomework", ClassHomeWorkSchema);