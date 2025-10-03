const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  couponId:{type:String},
  code: { type: String, unique: true, required: true },
  discountPercentage: { type: Number, required: true }, 
  expiryDate: { type: Date, required: true }, 
  isActive: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Coupon", CouponSchema);
