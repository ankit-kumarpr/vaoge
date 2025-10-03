const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema({
    homeworkId:{
        type:String,
    },

    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        // required: true
    },
    studentIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        }
      ],
    educatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Educator", 
        required: true
    },
    homeworkname: {
        type: String,
        required: true
    },
    homeworkdescription: {
        type: String,
        required: true
    },
    homeworkfiles: {
        type: [String], 
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"], 
        default: "Pending"
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Homework", HomeworkSchema);
