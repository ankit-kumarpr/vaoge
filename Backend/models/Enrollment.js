const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  courseprice: { type: String,  }, 
  discount: { type: String, default: 0 }, 
  finalPrice: { type: String, }, 
  gstPercentage: { type: String, required: true }, 
  gst: { type: String,  },
  totalAmountAfterDiscount: { type: String,  }, 
  totalAmount: { type: Number,  }, 
  couponCode: { type: String, default: null }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
