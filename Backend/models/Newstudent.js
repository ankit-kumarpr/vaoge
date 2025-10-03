const mongoose=require('mongoose');

const NewStudentSchema=new mongoose.Schema({

    stuId:{
        type:String
    },
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String
    },
    fathername:{
        type:String,
    },
    mothername:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    alternatephone:{
        type:String,
    },
    qualification:{
        type:String,
    },
    currentAddress: {
        addressline1: String,
        addressline2: String,
        city: String,
        state: String,
        country: String,
        zip: { type: String, match: /^[0-9]{6}$/ },
        landmark: String,
      },
    
      permanentAddress: {
        addressline1: String,
        addressline2: String,
        city: String,
        state: String,
        country: String,
        zip: { type: String, match: /^[0-9]{6}$/ },
        landmark: String,
      },
         profile: { type: String },
        adharimage: { type: String },
        role: { type: String, default: "newstudent" },
        createdAt: { type: Date, default: Date.now },
    
});

module.exports=mongoose.model("Newstudent",NewStudentSchema);