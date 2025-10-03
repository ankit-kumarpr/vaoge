const mongoose = require("mongoose");

const EducatorSchema = new mongoose.Schema({

  educatorId: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ }, 
  password: { type: String, required: true },
  qualification: { type: String, required: true },
  
    course: {
      courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course"
      },
      courseName: { 
        type: String
      }
    },
    
    batch: {
      batchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Batch"
      },
      batchName: { 
        type: String
      }
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

  Bank: {
    bankname: { type: String },
    branch: { type: String },
    accountholder: { type: String  },
    accountnumber: { type: String },
    ifsc: { type: String },
  },

  otp: { type: String, default: null },
  profile: { type: String },
  adharimage: { type: String },
  panimage:{type:String},
  degree: [{ type: String }],
  role: { type: String, default: "educator" },
  createdAt: { type: Date, default: Date.now },
  is_deleted:{
    type:Boolean,
    default:false,
},


status:{type:String,enum:["Prasent","Absent"], default:"Absent"}

});

module.exports = mongoose.model("Educator", EducatorSchema);
