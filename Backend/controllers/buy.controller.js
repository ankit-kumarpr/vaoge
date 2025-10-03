const Coupon = require("../models/coupon.model");
const Student = require("../models/student.model");
const Course = require("../models/course.model");
const ConfirmedOrder=require("../models/ConfirmedOrder");
const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");

// create discount coupon

const Createcoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon already exists" });
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code,
      discountPercentage,
      expiryDate,
      isActive: true,
    });

    newCoupon.couponId = newCoupon._id;
    await newCoupon.save();

    res.json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// get all coupon

const Getalldiscoutcoupon=async(req,res)=>{
  try{
    const couponlist=await Coupon.find();

    // if(!couponlist || couponlist.length==0){
    //   return res.status(404).json({
    //     error:true,
    //     message:"No Coupon found",
    //     data:[]
    //   })
    // }

    return res.status(201).json({
      error:false,
      message:"All coupon list ",
      data:couponlist
    })
  }
  catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
}
// check discount

const Checkdiscount = async (req, res) => {
  try {
    const { coursePrice, couponCode } = req.body;

    // Check if coupon exists and is active
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired coupon" });
    }

    // Calculate discount
    const discount = (coursePrice * coupon.discountPercentage) / 100;
    const priceAfterDiscount = coursePrice - discount;

    res.json({
      success: true,
      message: "Discount calculated successfully",
      data: {
        originalPrice: coursePrice,
        discount,
        priceAfterDiscount,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// const Buy course

const Buycourse = async (req, res) => {
  try {
    const { studentId, courseId, courseprice, gstPercentage, couponCode } = req.body;

    // Validate Student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Validate Course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let price = parseFloat(courseprice); // Original price from request
    let gstRate = parseFloat(gstPercentage); // GST % from request
    let discount = 0;

    // Check if coupon code is provided and valid
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (!coupon) {
        return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
      }
      discount = (price * coupon.discountPercentage) / 100; // Calculate discount amount
      price -= discount; // Deduct discount from price
    }

    // Calculate amounts
    let totalAmountAfterDiscount = price; // Final price after discount but before GST
    let gstAmount = (totalAmountAfterDiscount * gstRate) / 100; // GST Amount
    let totalAmountWithGST = totalAmountAfterDiscount + gstAmount; // Final amount after GST

    // Save Enrollment Data in DB
    const enrollment = new Enrollment({
      studentId,
      courseId,
      price: parseFloat(courseprice), // Original price before discount
      discount,
      finalPrice: totalAmountAfterDiscount, // Price after discount
      gstPercentage: gstRate, // Store GST %
      gst: gstAmount, // GST Amount
      totalAmountAfterDiscount, // Price after discount before GST
      totalAmount: totalAmountWithGST, // Final amount after GST
      couponCode: couponCode || null,
    });

    await enrollment.save(); // ✅ Ensure data is saved properly

    // Response
    res.json({
      success: true,
      message: "Course purchased successfully",
      data: {
        _id: enrollment._id,
        studentId,
        courseId,
        originalPrice: parseFloat(courseprice),
        totalDiscount: discount,
        totalAmountAfterDiscount,
        gstPercentage: gstRate,
        gstAmount,
        totalAmountWithGST,
        couponCode: couponCode || "No Coupon Applied",
      },
    });
  } catch (error) {
    console.error("Error in Buycourse:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const confirmorders = async (req, res) => {
  try {
    const { id, razorpayResponse } = req.body; // Add razorpayResponse to the request body

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid ID is required",
      });
    }

    // Find Enrollment by ID
    const buycourse = await Enrollment.findById(id);
    if (!buycourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found or order not confirmed",
      });
    }

    // Prepare response data
    const responseData = {
      success: true,
      message: "Course order confirmed",
      data: buycourse,
      razorpayResponse: razorpayResponse, // Include Razorpay response in the response data
    };

    // Save API response dynamically to DB
    await ConfirmedOrder.create({ responseData });

    // Return response
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in confirmorders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




module.exports = {
  Createcoupon,
  Checkdiscount,
  Buycourse,
  Getalldiscoutcoupon,
  confirmorders
};
