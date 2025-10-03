const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
    },
    coursename: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    gst: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    courseimage: {
        type: String,
    },
   
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    educators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Educator"
    }],
    batches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Course', CourseSchema);