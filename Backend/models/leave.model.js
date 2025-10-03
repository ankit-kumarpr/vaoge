const mongoose = require("mongoose");

const LeaveSchema=new mongoose.Schema({
    leaveId:{
        type:String,
    },
    educatorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Educator",
        required:true
    },
    Subject:{
        type:String,
        required:true
    },
    startdate:{
        type:Date,
        required:true
    },
    enddate:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})
module.exports=mongoose.model("Leave",LeaveSchema);