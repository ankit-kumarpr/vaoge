const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  mentorId: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: { type: String, required: true },
  qualification:{type:String},

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
    branch: { type: String},
    accountholder: { type: String },
    accountnumber: { type: String },
    ifsc: { type: String },
  },


  educators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Educator" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  batches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],


  otp: { type: String, default: null },
  profile: { type: String },
  adharimage: { type: String },
  role: { type: String, default: "mentor" },
  createdAt: { type: Date, default: Date.now },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Mentor", MentorSchema);
