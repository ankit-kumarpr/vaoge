const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentId: { type: String },
  enrollmentnumber: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fathername: { type: String, required: true },
  mothername: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  alternatephone: { type: String, match: /^[0-9]{10}$/ }, // Made optional
  password: { type: String },
  qualification: { type: String, required: true },
  homephone:{type:String, match: /^[0-9]{10}$/},
  
  course: {
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course"
    },
    courseName: { 
      type: String
    }
  },
  
  // batch: {
  //   batchId: { 
  //     type: mongoose.Schema.Types.ObjectId, 
  //     ref: "Batch"
  //   },
  //   batchName: { 
  //     type: String
  //   }
  // },
  batches: [{
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    batchName: { type: String }
  }],
  educator:{
    educatorId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Educator"
    },
    firstname:{
      type:String
  },
  lastname:{
    type:String
  },
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

  otp: { type: String, default: null },
  profile: { type: String },
  adharimage: { type: String },
  role: { type: String, default: "student" },
  createdAt: { type: Date, default: Date.now },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  // status:{
  //   type: String, enum: ["Present", "Absent"],
  // }
});

module.exports = mongoose.model("Student", StudentSchema);