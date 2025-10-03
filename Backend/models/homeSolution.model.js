const mongoose=require('mongoose');

const HomeworkSolutionSchema=new mongoose.Schema({
    solutionId:{
        type:String,
    },
    
    homeworkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Homework",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", 
        required: true
    },
    solutionfiles: {
        type: [String], 
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"], 
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model("HomeworkSolution",HomeworkSolutionSchema);