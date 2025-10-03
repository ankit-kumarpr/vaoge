const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classId: {
        type: String
    },
    classname: {
        type: String,
        required: true,
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
    },
    batchname: {
        type: String,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    studentname: {
        type: String,
    },
    classShedule: [{
        day: { 
            type: String, 
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true
        },
        time: { 
            type: String,
            required: true
        }
    }],
    classlink: {
        type: String,
        required: true
    },
    classDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Class", ClassSchema);