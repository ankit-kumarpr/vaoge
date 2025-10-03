const mongoose=require('mongoose');

const MarksheetSchema=new mongoose.Schema({
    marksheetId:{
        type:String,

    },
    marksheetimg:{
        type:String,
        required:true
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('Marksheet',MarksheetSchema);