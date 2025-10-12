const Admin = require("../models/admin.model");
const Mentor = require("../models/mentor.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/emailService");
const nodemailer = require("nodemailer");
const {
  sendForgetPasswordEmail,
} = require("../utils/forgetpasswordemailService");
const upload = require("../middlewares/multerConfig");
const Educator = require("../models/educator.model");
const Student = require("../models/student.model");
const Batch = require("../models/batch.model");
const Class = require("../models/class.model");
const Course = require("../models/course.model");
const ScheduleChangeRequest = require("../models/ScheduleChangeRequest");
const Practice = require("../models/practice.model");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Attendance = require("../models/attendance.model");
const Note = require("../models/notes");
const classhomework = require("../models/classhomework");
const classhomeworksolution = require("../models/classHomeworksolution");
const mongoose = require("mongoose");

// Register Admin
const registerAdmin = async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;
  try {
    if (!email || !firstname || !phone || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Some fields are missing!" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: true, message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
    });

    newAdmin.adminId = newAdmin._id;
    await newAdmin.save();
    return res
      .status(201)
      .json({ error: false, message: "Admin Registered Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const findUserByEmail = async (email) => {
  const admin = await Admin.findOne({ email });
  if (admin) return { user: admin, role: "admin" };

  const mentor = await Mentor.findOne({ email });
  if (mentor) return { user: mentor, role: "mentor" };

  const educator = await Educator.findOne({ email });
  if (educator) return { user: educator, role: "educator" };

  const student = await Student.findOne({ email });
  if (student) return { user: student, role: "student" };

  return null;
};

const findUserById = async (id) => {
  // console.log("user Id", id);
  const admin = await Admin.findById(id);
  if (admin) return { user: admin };

  const mentor = await Mentor.findById(id);
  if (mentor) return { user: mentor };

  const educator = await Educator.findById(id);
  if (educator) return { user: educator };

  const student = await Student.findById(id);
  if (student) return { user: student };

  return null;
};
// Login user

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userResponse = await findUserByEmail(email);

//     if (!userResponse) {
//       return res.status(400).json({ error: true, message: "User not found" });
//     }

//     const { user, role } = userResponse;
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ error: true, message: "Invalid credentials" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     await user.save();

//     await sendOTPEmail(user.email, otp);

//     return res.status(200).json({
//       error: false,
//       message: "OTP sent successfully",
//       email: user.email,
//       role,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: true, message: "Internal Server Error" });
//   }
// };

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Email and passsword in login is ",email, password);
    console.log("Email and passsword in login is ", password);
    const userResponse = await findUserByEmail(email);
console.log("user response",userResponse);
    if (!userResponse) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const { user, role } = userResponse;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }

    if (role === "admin") {
      // Admin → send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      await user.save();

      await sendOTPEmail(user.email, otp);

      return res.status(200).json({
        error: false,
        message: "OTP sent successfully",
        email: user.email,
        role,
      });
    } else {
      // Other roles → skip OTP, generate token directly
      const token = jwt.sign(
        { userId: user._id, email: user.email, role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      user.token = token;
      user.isVerified = true; // mark as verified
      await user.save();

      return res.status(200).json({
        error: false,
        message: "Login successful",
        token,
        firstname: user.firstname,
        email: user.email,
        role,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
// Verify OTP & Generate JWT Token

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userResponse = await findUserByEmail(email);
    // console.log("User Response:", userResponse);

    if (!userResponse || !userResponse.user || !userResponse.role) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const { user, role } = userResponse;

    if (!user.otp) {
      return res
        .status(400)
        .json({ error: true, message: "OTP is missing or invalid" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ error: true, message: "Invalid OTP" });
    }

    user.otp = null;
    user.isVerified = true;

    const token = jwt.sign(
      { userId: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.token = token;

    try {
      await user.save();
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res
        .status(500)
        .json({ error: true, message: "Error saving user" });
    }

    // Step 7: Return success response
    return res.status(200).json({
      error: false,
      message: "Login successful",
      token,
      firstname: user.firstname,
      email: user.email,
      role,
    });
  } catch (error) {
    console.error("Error:", error); // Debugging log
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

// logout api

const logoutUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // console.log("id", userId);
    const userResponse = await findUserById(userId);
    // console.log("user", userResponse);
    if (!userResponse) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const { user } = userResponse;

    user.token = null;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Logout successful",
      data: {
        user: user.firstname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

// forget password controller

const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Search across all models
    const roles = [
      { model: Admin, role: "admin" },
      { model: Mentor, role: "mentor" },
      { model: Educator, role: "educator" },
      { model: Student, role: "student" },
    ];

    let user = null;
    let role = null;

    for (const entry of roles) {
      const found = await entry.model.findOne({ email });
      if (found) {
        user = found;
        role = entry.role;
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/newpassword/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER1,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER1,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent successfully!" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// reset password

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    // Match role with correct model
    let Model;
    switch (role) {
      case "admin":
        Model = Admin;
        break;
      case "manager":
        Model = Manager;
        break;
      case "employee":
        Model = Employee;
        break;
      case "client":
        Model = Client;
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    // Find user by ID
    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// const forgotPasswordRequest = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const userResponse = await findUserByEmail(email);

//     if (!userResponse) {
//       return res.status(404).json({ error: true, message: "User not found" });
//     }

//     const { user } = userResponse;

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     await user.save();

//     await sendOTPEmail(user.email, otp); // Reuse your existing OTP mail function

//     return res.status(200).json({
//       error: false,
//       message: "OTP sent to your email address",
//       email: user.email,
//     });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     return res.status(500).json({ error: true, message: "Server error" });
//   }
// };

// // reste password controller

// const resetPassword = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   try {
//     const userResponse = await findUserByEmail(email);

//     if (!userResponse) {
//       return res.status(404).json({ error: true, message: "User not found" });
//     }

//     const { user } = userResponse;

//     if (!user.otp || user.otp !== otp) {
//       return res.status(400).json({ error: true, message: "Invalid OTP" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.otp = null; // Clear OTP after successful reset
//     await user.save();

//     return res.status(200).json({
//       error: false,
//       message: "Password reset successfully. Please login with new password.",
//     });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     return res.status(500).json({ error: true, message: "Server error" });
//   }
// };

// const Registereducator = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       email,
//       phone,
//       password,
//       sameAddress,
//       "currentAddress.addressline1": addressline1,
//       "currentAddress.addressline2": addressline2,
//       "currentAddress.city": city,
//       "currentAddress.state": state,
//       "currentAddress.country": country,
//       "currentAddress.zip": zip,
//       "currentAddress.landmark": landmark,
//       "permanentAddress.addressline1": permanent_addressline1,
//       "permanentAddress.addressline2": permanent_addressline2,
//       "permanentAddress.city": permanent_city,
//       "permanentAddress.state": permanent_state,
//       "permanentAddress.country": permanent_country,
//       "permanentAddress.zip": permanent_zip,
//       "permanentAddress.landmark": permanent_landmark,
//       "Bank.bankname": bankname,
//       "Bank.branch": branch,
//       "Bank.accountholder": accountholder,
//       "Bank.accountnumber": accountnumber,
//       "Bank.ifsc": ifsc,
//       batchId, // Include batchId for assigning educator to batch
//     } = req.body;
//     console.log(
//       "csfsdg",
//       firstname,
//       lastname,
//       email,
//       phone,
//       password,
//       sameAddress,
//       addressline1,
//       addressline2,
//       city,
//       state,
//       country,
//       zip,
//       landmark,
//       permanent_addressline1,
//       permanent_addressline2,
//       permanent_city,
//       permanent_state,
//       permanent_country,
//       permanent_zip,
//       permanent_landmark,
//       bankname,
//       branch,
//       accountholder,
//       accountnumber,
//       ifsc,
//       batchId
//     );
//     // Assign paths from uploaded files
//     const profile = req.files?.profile ? req.files.profile[0].path : null;
//     const adharimage = req.files?.adharimage
//       ? req.files.adharimage[0].path
//       : null;
//     const panimage = req.files?.panimage ? req.files.panimage[0].path : null;
//     const degree = req.files?.degree ? req.files.degree[0].path : null;

//     if (!firstname || !lastname || !email || !phone || !password) {
//       return res.status(400).json({
//         error: true,
//         message: "Missing required fields!",
//       });
//     }

//     const existingEducator = await Educator.findOne({ email });
//     if (existingEducator) {
//       return res.status(400).json({
//         error: true,
//         message: "Email already registered!",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const currentAddress = {
//       addressline1,
//       addressline2,
//       city,
//       state,
//       country,
//       zip,
//       landmark,
//     };
//     const permanentAddress =
//       sameAddress === "false"
//         ? {
//             addressline1: permanent_addressline1,
//             addressline2: permanent_addressline2,
//             city: permanent_city,
//             state: permanent_state,
//             country: permanent_country,
//             zip: permanent_zip,
//             landmark: permanent_landmark,
//           }
//         : currentAddress;

//     const newEducator = new Educator({
//       firstname,
//       lastname,
//       email,
//       phone,
//       password: hashedPassword,
//       currentAddress,
//       permanentAddress,
//       Bank: { bankname, branch, accountholder, accountnumber, ifsc },
//       profile,
//       adharimage,
//       panimage,
//       degree,
//     });

//     newEducator.educatorId = newEducator._id;
//     await newEducator.save();

//     // If batchId is provided, assign educator to the batch
//     if (batchId) {
//       const batch = await Batch.findById(batchId);
//       if (!batch) {
//         return res.status(404).json({
//           error: true,
//           message: "Batch not found!",
//         });
//       }

//       // Ensure only one educator per batch
//       if (batch.educator) {
//         return res.status(400).json({
//           error: true,
//           message: "Batch already has an assigned educator!",
//         });
//       }

//       batch.educator = newEducator._id;
//       await batch.save();
//     }

//     return res.status(201).json({
//       error: false,
//       message: "Educator registered successfully!",
//       data: newEducator,
//     });
//   } catch (error) {
//     console.error("Error in Registereducator:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error!",
//     });
//   }
// };

// Register Educator

const Registereducator = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
      qualification,
      sameAddress,
      "currentAddress.addressline1": addressline1,
      "currentAddress.addressline2": addressline2,
      "currentAddress.city": city,
      "currentAddress.state": state,
      "currentAddress.country": country,
      "currentAddress.zip": zip,
      "currentAddress.landmark": landmark,
      "permanentAddress.addressline1": permanent_addressline1,
      "permanentAddress.addressline2": permanent_addressline2,
      "permanentAddress.city": permanent_city,
      "permanentAddress.state": permanent_state,
      "permanentAddress.country": permanent_country,
      "permanentAddress.zip": permanent_zip,
      "permanentAddress.landmark": permanent_landmark,
      "Bank.bankname": bankname,
      "Bank.branch": branch,
      "Bank.accountholder": accountholder,
      "Bank.accountnumber": accountnumber,
      "Bank.ifsc": ifsc,
      courseId,
      batchId,
    } = req.body;

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !password ||
      !qualification ||
      !courseId
    ) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields!",
      });
    }

    // Check if email exists
    const existingEducator = await Educator.findOne({ email });
    if (existingEducator) {
      return res.status(400).json({
        error: true,
        message: "Email already registered!",
      });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        error: true,
        message: "Invalid course ID!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare addresses
    const currentAddress = {
      addressline1,
      addressline2,
      city,
      state,
      country,
      zip,
      landmark,
    };
    const permanentAddress =
      sameAddress === "false"
        ? {
            addressline1: permanent_addressline1,
            addressline2: permanent_addressline2,
            city: permanent_city,
            state: permanent_state,
            country: permanent_country,
            zip: permanent_zip,
            landmark: permanent_landmark,
          }
        : currentAddress;

    // Create educator data object
    const educatorData = {
      educatorId: null, // Will be set after save
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      qualification,
      currentAddress,
      permanentAddress,
      Bank: { bankname, branch, accountholder, accountnumber, ifsc },
      profile: req.files?.profile?.[0]?.path,
      adharimage: req.files?.adharimage?.[0]?.path,
      panimage: req.files?.panimage?.[0]?.path,
      degree: req.files?.degree?.map((file) => file.path),
      course: {
        courseId,
        courseName: course.coursename,
      },
      // courses: [{
      //   courseId,
      //   courseName: course.coursename
      // }],
      role: "educator",
    };

    // Add batch information if provided
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(400).json({
          error: true,
          message: "Invalid batch ID!",
        });
      }

      // Verify batch belongs to the same course
      if (batch.courseId.toString() !== courseId) {
        return res.status(400).json({
          error: true,
          message: "Batch doesn't belong to selected course!",
        });
      }

      // Check if batch already has an educator
      if (batch.educator) {
        return res.status(400).json({
          error: true,
          message: "Batch already has an assigned educator!",
        });
      }

      educatorData.batch = {
        batchId,
        batchName: batch.batchname,
      };

      educatorData.batches = [
        {
          batchId,
          batchName: batch.batchname,
        },
      ];
    }

    // Create and save educator
    const newEducator = new Educator(educatorData);
    newEducator.educatorId = newEducator._id;
    await newEducator.save();

    // Update batch with educator reference if batch was assigned
    if (batchId) {
      await Batch.findByIdAndUpdate(batchId, {
        $set: { educator: newEducator._id },
        $addToSet: { educators: newEducator._id },
      });
    }

    // Update course with educator reference
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { educators: newEducator._id },
    });

    return res.status(201).json({
      error: false,
      message: "Educator registered successfully!",
      data: newEducator,
    });
  } catch (error) {
    console.error("Error in Registereducator:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

const Registermentor = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
      qualification,
      sameAddress,
      "currentAddress.addressline1": currentAddressLine1,
      "currentAddress.addressline2": currentAddressLine2,
      "currentAddress.city": currentCity,
      "currentAddress.state": currentState,
      "currentAddress.country": currentCountry,
      "currentAddress.zip": currentZip,
      "currentAddress.landmark": currentLandmark,
      "permanentAddress.addressline1": permanentAddressLine1,
      "permanentAddress.addressline2": permanentAddressLine2,
      "permanentAddress.city": permanentCity,
      "permanentAddress.state": permanentState,
      "permanentAddress.country": permanentCountry,
      "permanentAddress.zip": permanentZip,
      "permanentAddress.landmark": permanentLandmark,
      "Bank.bankname": bankname,
      "Bank.branch": branch,
      "Bank.accountholder": accountholder,
      "Bank.accountnumber": accountnumber,
      "Bank.ifsc": ifsc,
    } = req.body;

    // Ensure required fields are provided
    if (!firstname || !lastname || !email || !phone || !password) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields!",
      });
    }

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({
        error: true,
        message: "Email already registered!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct address objects
    const currentAddress = {
      addressline1: currentAddressLine1,
      addressline2: currentAddressLine2,
      city: currentCity,
      state: currentState,
      country: currentCountry,
      zip: currentZip,
      landmark: currentLandmark,
    };

    const permanentAddress =
      sameAddress === "true"
        ? currentAddress
        : {
            addressline1: permanentAddressLine1,
            addressline2: permanentAddressLine2,
            city: permanentCity,
            state: permanentState,
            country: permanentCountry,
            zip: permanentZip,
            landmark: permanentLandmark,
          };

    // Handle profile & Aadhar image uploads
    const profile = req.files?.profile?.[0]?.path || null;
    const adharimage = req.files?.adharimage?.[0]?.path || null;

    // Create mentor object
    const newMentor = new Mentor({
      firstname,
      lastname,
      email,
      phone,
      qualification,
      password: hashedPassword,
      currentAddress,
      permanentAddress,
      Bank: { bankname, branch, accountholder, accountnumber, ifsc },
      profile,
      adharimage,
    });

    // Assign unique mentor ID
    newMentor.mentorId = newMentor._id;
    await newMentor.save();

    return res.status(201).json({
      error: false,
      message: "Mentor registered successfully!",
      data: newMentor,
    });
  } catch (error) {
    console.error("Error in Registermentor:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

const generateEnrollmentNumber = async () => {
  try {
    const lastStudent = await Student.findOne().sort({ enrollmentnumber: -1 });

    let newNumber = 1; // Default start number

    if (lastStudent && lastStudent.enrollmentnumber) {
      const lastNumber = parseInt(
        lastStudent.enrollmentnumber.replace("VOAGESTU", ""),
        10
      );
      newNumber = lastNumber + 1;
    }

    return `VOAGESTU${String(newNumber).padStart(3, "0")}`;
  } catch (error) {
    console.error("Error generating enrollment number:", error);
    throw new Error("Could not generate enrollment number");
  }
};

const Registerstudent = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      fathername,
      mothername,
      qualification,
      email,
      phone,
      alternatephone,
      password,
      homephone,
      sameAddress,
      "currentAddress.addressline1": addressline1,
      "currentAddress.addressline2": addressline2,
      "currentAddress.city": city,
      "currentAddress.state": state,
      "currentAddress.country": country,
      "currentAddress.zip": zip,
      "currentAddress.landmark": landmark,
      "permanentAddress.addressline1": permanent_addressline1,
      "permanentAddress.addressline2": permanent_addressline2,
      "permanentAddress.city": permanent_city,
      "permanentAddress.state": permanent_state,
      "permanentAddress.country": permanent_country,
      "permanentAddress.zip": permanent_zip,
      "permanentAddress.landmark": permanent_landmark,
      batchId,
      courseId,
      batchName,
      courseName,
      educatorId,
    } = req.body;

    const profile = req.files?.profile ? req.files.profile[0].path : null;
    const adharimage = req.files?.adharimage
      ? req.files.adharimage[0].path
      : null;

    if (!firstname || !lastname || !email || !phone || !password || !courseId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields!" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: true, message: "Email already registered!" });
    }

    const enrollmentnumber = await generateEnrollmentNumber();
    const hashedPassword = await bcrypt.hash(password, 10);

    const currentAddress = {
      addressline1,
      addressline2,
      city,
      state,
      country,
      zip,
      landmark,
    };
    const permanentAddress =
      sameAddress === "false"
        ? {
            addressline1: permanent_addressline1,
            addressline2: permanent_addressline2,
            city: permanent_city,
            state: permanent_state,
            country: permanent_country,
            zip: permanent_zip,
            landmark: permanent_landmark,
          }
        : currentAddress;

    let educator = null;
    if (educatorId) {
      educator = await Educator.findById(educatorId);
      if (!educator) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid educator ID!" });
      }
    }

    const newStudent = new Student({
      enrollmentnumber,
      firstname,
      lastname,
      fathername,
      mothername,
      qualification,
      homephone,
      email,
      phone,
      alternatephone,
      currentAddress,
      permanentAddress,
      password: hashedPassword,
      course: { courseId, courseName },
      batch: batchId ? { batchId, batchName } : null,
      educator: educator
        ? {
            educatorId: educator._id,
            firstname: educator.firstname,
            lastname: educator.lastname,
          }
        : null,
      profile,
      adharimage,
      role: "student",
    });

    newStudent.studentId = newStudent._id;

    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch)
        return res
          .status(400)
          .json({ error: true, message: "Invalid batch ID!" });
      if (batch.students.length >= 30)
        return res
          .status(400)
          .json({ error: true, message: "Batch is already full!" });

      batch.students.push(newStudent._id);
      await batch.save();
    }

    await newStudent.save();

    return res.status(201).json({
      error: false,
      message: "Student registered successfully!",
      data: [newStudent],
    });
  } catch (error) {
    console.error("Error in Registerstudent:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error!" });
  }
};

//Get all mentors list

const Getallmentos = async (req, res) => {
  try {
    const mentorlist = await Mentor.find({ is_deleted: { $ne: 1 } });
    if (!mentorlist || mentorlist.length == 0) {
      return res.status(404).json({
        error: true,
        message: "No mentor found",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Mentor list",
      data: mentorlist,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all educators list

const Getalleducators = async (req, res) => {
  try {
    const educatorlist = await Educator.find({ is_deleted: { $ne: 1 } });
    if (!educatorlist || educatorlist.length == 0) {
      return res.status(404).json({
        error: true,
        message: "No educator found",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Educator list",
      data: educatorlist,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get all student list

// const Getallstudents = async (req, res) => {
//   try {
//     const studentlist = await Student.find({ is_deleted: { $ne: 1 } });
//     if (!studentlist || studentlist.length == 0) {
//       return res.status(404).json({
//         error: true,
//         message: "No student found",
//       });
//     }

//     return res.status(201).json({
//       error: false,
//       message: "Student list",
//       data: studentlist,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };

const Getallstudents = async (req, res) => {
  try {
    const studentlist = await Student.find({ is_deleted: { $ne: 1 } });

    if (!studentlist || studentlist.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No student found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Student list",
      data: studentlist,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
// Update any mentor

const Updatementor = async (req, res) => {
  const { mentorId } = req.params;
  const { firstname, phone, email, bankname, accountnumber, ifsc, branch } =
    req.body;

  try {
    if (!mentorId) {
      return res.status(400).json({
        error: true,
        message: "Missing mentorId",
      });
    }

    if (!email || !firstname || !ifsc) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: email, firstname, ifsc",
      });
    }

    const data = {
      firstname,
      phone,
      email,
      bankname,
      branch,
      accountnumber,
      ifsc,
    };

    const newmentor = await Mentor.findByIdAndUpdate(mentorId, data, {
      new: true,
    });

    if (!newmentor) {
      return res.status(404).json({
        error: true,
        message: "Mentor not found or data not updated",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Mentor Updated Successfully",
      data: newmentor,
    });
  } catch (error) {
    console.error("Error updating mentor:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// update any educator
const Updateducator = async (req, res) => {
  const { educatorId } = req.params;
  const {
    firstname,
    phone,
    email,
    bankname,
    accountnumber,
    ifsc,
    branch,
    batchId,
  } = req.body;

  try {
    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Missing educatorId",
      });
    }

    if (!email || !firstname || !ifsc) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: email, firstname, ifsc",
      });
    }

    const updateData = {
      firstname,
      phone,
      email,
      bankname,
      branch,
      accountnumber,
      ifsc,
    };

    const updatedEducator = await Educator.findByIdAndUpdate(
      educatorId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedEducator) {
      return res.status(404).json({
        error: true,
        message: "Educator not found or data not updated",
      });
    }

    // If batchId is provided, assign or update educator's batch
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({
          error: true,
          message: "Batch not found!",
        });
      }

      // Ensure that the batch does not already have a different educator
      if (batch.educator && batch.educator.toString() !== educatorId) {
        return res.status(400).json({
          error: true,
          message: "Batch is already assigned to another educator!",
        });
      }

      batch.educator = educatorId;
      await batch.save();
    }

    return res.status(200).json({
      error: false,
      message: "Educator updated successfully!",
      data: updatedEducator,
    });
  } catch (error) {
    console.error("Error updating educator:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Update Student
const Updatedstudent = async (req, res) => {
  const { studentId } = req.params;
  const {
    firstname,
    phone,
    fathername,
    mothername,
    qualification,
    email,
    bankname,
    accountnumber,
    ifsc,
    branch,
    batchId, // Include batchId for batch assignment
  } = req.body;

  try {
    if (!studentId) {
      return res.status(400).json({
        error: true,
        message: "Missing StudentId",
      });
    }

    if (!email || !firstname || !ifsc) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: email, firstname, ifsc",
      });
    }

    const data = {
      firstname,
      phone,
      email,
      bankname,
      branch,
      accountnumber,
      ifsc,
      fathername,
      mothername,
      qualification,
    };

    // If batchId is provided, assign student to batch
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({
          error: true,
          message: "Batch not found",
        });
      }

      // Check if batch has space for a new student
      if (batch.students.length >= 30) {
        return res.status(400).json({
          error: true,
          message: "Batch is already full (max 30 students)",
        });
      }

      // Add student to batch if not already present
      if (!batch.students.includes(studentId)) {
        batch.students.push(studentId);
        await batch.save();
      }

      data.batchId = batchId; // Save batchId in student data
    }

    // Update student details
    const newstudent = await Student.findByIdAndUpdate(studentId, data, {
      new: true,
    });

    if (!newstudent) {
      return res.status(404).json({
        error: true,
        message: "Student not found or data not updated",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Student Updated Successfully",
      data: newstudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete Mentor

const Deletementor = async (req, res) => {
  const { mentorId } = req.params;

  try {
    if (!mentorId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Mentor ID missing",
      });
    }

    const delmentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { is_deleted: 1 },
      { new: true }
    );

    if (!delmentor) {
      return res.status(404).json({
        error: true,
        message: "Mentor not delete",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Mentor Deleted successfully",
      data: delmentor,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete Educator
const Deleteeducator = async (req, res) => {
  const { educatorId } = req.params;

  try {
    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Educator ID missing",
      });
    }

    const deleducator = await Mentor.findByIdAndUpdate(
      educatorId,
      { is_deleted: 1 },
      { new: true }
    );

    if (!deleducator) {
      return res.status(404).json({
        error: true,
        message: "Educator not delete",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Educator Deleted successfully",
      data: deleducator,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete Student

const Deletestudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    if (!studentId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Student ID missing",
      });
    }

    const delstudent = await Mentor.findByIdAndUpdate(
      studentId,
      { is_deleted: 1 },
      { new: true }
    );

    if (!delstudent) {
      return res.status(404).json({
        error: true,
        message: "Student not delete",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Educator Deleted successfully",
      data: delstudent,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// create class

const AddBatch = async (req, res) => {
  try {
    const { batchname, courseId, schedule } = req.body;

    if (!batchname || !courseId || !schedule) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }

    // Find the course name using courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    // Create batch with courseId and coursename
    const newBatch = new Batch({
      batchname,
      courseId,
      coursename: course.coursename, // Save course name in batch
      schedule,
    });

    newBatch.batchId = newBatch._id;
    await newBatch.save();

    return res.status(201).json({
      error: false,
      message: "Batch created successfully",
      data: [newBatch],
    });
  } catch (error) {
    console.error("Error adding batch:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// get all Batch

// assign batch

const assignBatchToStudent = async (req, res) => {
  try {
    const { studentIds, batchId } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "studentIds must be a non-empty array" });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: true, message: "Batch not found" });
    }

    if (batch.students.length + studentIds.length > 30) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Batch cannot have more than 30 students",
        });
    }

    let updatedStudents = [];
    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (!student) {
        console.warn(`Student with ID ${studentId} not found, skipping.`);
        continue; // skip if student not found
      }

      // Check if student already has this batch in their batches list
      const alreadyInBatch = student.batches.some(
        (b) => b.batchId.toString() === batchId
      );

      if (!alreadyInBatch) {
        student.batches.push({
          batchId: batch._id,
          batchName: batch.batchname,
        });
        await student.save();
      }

      // Check if batch already includes this student
      const alreadyInStudentList = batch.students.some(
        (sId) => sId.toString() === studentId
      );

      if (!alreadyInStudentList) {
        batch.students.push(student._id);
      }

      updatedStudents.push(student);
    }

    await batch.save();

    return res.status(200).json({
      error: false,
      message: "Students assigned to batch successfully",
      batch,
      updatedStudentsCount: updatedStudents.length,
    });
  } catch (error) {
    console.error("Error in assignBatchToStudent:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all batch

const Getbatch = async (req, res) => {
  try {
    const batchlist = await Batch.find({ is_deleted: { $ne: 1 } });

    if (!batchlist || batchlist.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No Batch created for  found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Batch list",
      data: batchlist,
    });
  } catch (error) {
    console.error("Error fetching batch list:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get batch onthe basis of courseId

const GetBtachofCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res
        .status(404)
        .json({ error: true, message: "Course not found!" });
    }

    const batchList = await Batch.find({ courseId }).populate(
      "courseId",
      "coursename"
    );

    if (!batchList || batchList.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No batches found for this course" });
    }

    return res.status(201).json({
      error: false,
      message: "Batch List of specific course",
      data: [batchList],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get own batch list
const GetourBatch = async (req, res) => {
  const { userId, role } = req.params;

  try {
    if (!userId || !role) {
      return res.status(400).json({
        error: true,
        message: "User ID or role not provided",
      });
    }

    let AllClass;

    if (role === "educator") {
      // Educator: Find classes where the user is an assigned educator
      AllClass = await Batch.find({ educators: userId })
        .populate("batchId batchname")
        .exec();
    } else if (role === "student") {
      // Student: Find classes where the user is enrolled
      AllClass = await Batch.find({ students: userId })
        .populate("batchId batchname")
        .exec();
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid role provided",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Class list retrieved successfully",
      data: AllClass,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// add students in existing batch
const AddStudentsToBatch = async (req, res) => {
  try {
    // console.log("Received request body:", req.body);

    const { batchId, students } = req.body;
    // console.log("Batch Id in controller", batchId);

    if (!batchId || !students) {
      return res.status(400).json({
        error: true,
        message: "Batch ID and students array are required.",
      });
    }

    // Fetch batch
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: true, message: "Batch not found." });
    }

    // Validate students
    const existingStudents = await Student.find({ _id: { $in: students } });
    if (existingStudents.length !== students.length) {
      return res
        .status(400)
        .json({ error: true, message: "One or more students are invalid." });
    }

    // Check student count
    const totalStudents = batch.students.length + students.length;
    if (totalStudents > 30) {
      return res.status(400).json({
        error: true,
        message: "A batch cannot have more than 30 students.",
      });
    }

    // Add students
    batch.students.push(...students);
    await batch.save();

    // Update students' batchId
    await Student.updateMany(
      { _id: { $in: students } },
      { $set: { batchId: batch._id } }
    );

    return res.status(200).json({
      error: false,
      message: "Students added to batch successfully.",
      data: batch,
    });
  } catch (error) {
    console.error("Error adding students to batch:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// delete batch

const Deletebatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    if (!batchId) {
      return res.status(400).json({
        error: true,
        message: "something went wrong || Batch Id missing",
      });
    }

    const delbatch = await Batch.findByIdAndDelete(
      batchId,
      { is_deleted: 1 },
      { new: true }
    );
    if (!delbatch) {
      return res.status(404).json({
        error: true,
        message: "Batch not deleted",
      });
    }
    return res.status(201).json({
      error: true,
      message: "Batch deleted successfully",
      data: delbatch,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// update Batch

const Updatebatch = async (req, res) => {
  const { batchId } = req.params;

  const { batchname, schedule } = req.body;
  try {
    if (!batchId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Batch Id missing",
      });
    }

    const data = {
      batchname,
      schedule,
    };

    const updatebatch = await Batch.findByIdAndUpdate(batchId, data, {
      new: true,
    });
    if (!updatebatch) {
      return res.status(404).json({
        error: true,
        message: "Batch not updated ",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Batch Updated successfully",
      data: updatebatch,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal serve error",
    });
  }
};

// create class

// const AddClass = async (req, res) => {
//   try {
//     const { classname, batchId, classShedule, classlink, classDate } = req.body;

//     if (!classname || !batchId || !classShedule || !classlink || !classDate) {
//       return res.status(400).json({
//         error: true,
//         message: "Missing required fields",
//       });
//     }

//     // Find the batch to get batchname
//     const batch = await Batch.findById(batchId);
//     if (!batch) {
//       return res.status(404).json({
//         error: true,
//         message: "Batch not found",
//       });
//     }

//     // Create the class with batch details
//     const newClass = new Class({
//       // Generate classId
//       classname,
//       batchId: batch._id, // Store batch ObjectId
//       batchname: batch.batchname, // Store batchname directly
//       classShedule,
//       classlink,
//       classDate,
//     });

//     newClass.classId = newClass._id;
//     await newClass.save();

//     // Prepare response data
//     const responseData = {
//       classId: newClass._id,
//       classname: newClass.classname,
//       batch: {
//         batchId: newClass.batchId,
//         batchname: newClass.batchname,
//       },
//       classShedule: newClass.classShedule,
//       classlink: newClass.classlink,
//       classDate: newClass.classDate,
//       createdAt: newClass.createdAt,
//     };

//     return res.status(201).json({
//       error: false,
//       message: "Class created successfully!",
//       data: responseData,
//     });
//   } catch (error) {
//     console.error("Error adding class:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };

// const AddClass = async (req, res) => {
//   try {
//     const { classname, batchId, studentId, classShedule, classlink, classDate } = req.body;

//     if (!classname || !classShedule || !classlink || !classDate) {
//       return res.status(400).json({
//         error: true,
//         message: "Missing required fields (classname, classShedule, classlink, classDate)",
//       });
//     }

//     let batchname = null;
//     let studentname = null;

//     if (batchId) {
//       const batch = await Batch.findById(batchId);
//       if (!batch) {
//         return res.status(404).json({
//           error: true,
//           message: "Batch not found",
//         });
//       }
//       batchname = batch.batchname;
//     }

//     if (studentId) {
//       const student = await Student.findById(studentId);
//       if (!student) {
//         return res.status(404).json({
//           error: true,
//           message: "Student not found",
//         });
//       }
//       studentname = student.studentname; // Adjust field name if needed
//     }

//     const newClass = new Class({
//       classname,
//       batchId: batchId || null,
//       batchname: batchname || null,
//       studentId: studentId || null,
//       studentname: studentname || null,
//       classShedule,
//       classlink,
//       classDate,
//     });

//     newClass.classId = newClass._id;
//     await newClass.save();

//     const responseData = {
//       classId: newClass._id,
//       classname: newClass.classname,
//       batch: {
//         batchId: newClass.batchId,
//         batchname: newClass.batchname,
//       },
//       student: {
//         studentId: newClass.studentId,
//         studentname: newClass.studentname,
//       },
//       classShedule: newClass.classShedule,
//       classlink: newClass.classlink,
//       classDate: newClass.classDate,
//       createdAt: newClass.createdAt,
//     };

//     return res.status(201).json({
//       error: false,
//       message: "Class created successfully!",
//       data: responseData,
//     });
//   } catch (error) {
//     console.error("Error adding class:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };

const AddClass = async (req, res) => {
  try {
    const {
      classname,
      batchId,
      studentId,
      classShedule,
      classlink,
      classDate,
    } = req.body;

    if (
      !classname ||
      !Array.isArray(classShedule) ||
      classShedule.length === 0 ||
      !classlink ||
      !classDate
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Missing required fields (classname, classShedule as array, classlink, classDate)",
      });
    }

    // Validate each schedule entry
    for (const entry of classShedule) {
      if (!entry.day || !entry.time) {
        return res.status(400).json({
          error: true,
          message: "Each classShedule entry must have 'day' and 'time'",
        });
      }
    }

    let batchname = null;
    let studentname = null;

    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({
          error: true,
          message: "Batch not found",
        });
      }
      batchname = batch.batchname;
    }

    if (studentId) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found",
        });
      }
      studentname = student.studentname;
    }

    const newClass = new Class({
      classname,
      batchId: batchId || null,
      batchname: batchname || null,
      studentId: studentId || null,
      studentname: studentname || null,
      classShedule,
      classlink,
      classDate,
    });

    newClass.classId = newClass._id;
    await newClass.save();

    const responseData = {
      classId: newClass._id,
      classname: newClass.classname,
      batch: {
        batchId: newClass.batchId,
        batchname: newClass.batchname,
      },
      student: {
        studentId: newClass.studentId,
        studentname: newClass.studentname,
      },
      classShedule: newClass.classShedule,
      classlink: newClass.classlink,
      classDate: newClass.classDate,
      createdAt: newClass.createdAt,
    };

    return res.status(201).json({
      error: false,
      message: "Class created successfully!",
      data: responseData,
    });
  } catch (error) {
    console.error("Error adding class:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get all classes

const Getallclasses = async (req, res) => {
  try {
    const classlist = await Class.find({ is_deleted: { $ne: 1 } }).populate({
      path: "batchId",
      select: "batchname", // Only fetch batch name
    });

    if (!classlist || classlist.length == 0) {
      return res.status(404).json({
        error: true,
        message: "No class found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "All class list",
      data: classlist,
    });
  } catch (error) {
    console.error("Error fetching class list:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get any batch classes

const GetBatchWiseClassessList = async (req, res) => {
  const { batchId } = req.params;
  try {
    if (!batchId) {
      return res.status(400).json({
        error: true,
        message: "Batch Id is required",
      });
    }
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        error: true,
        message: "Batch not found",
      });
    }
    const classlist = await Class.find({ batchId }).populate(
      "batchId",
      "batchname"
    );

    return res.status(201).json({
      error: false,
      message: "Class List Batch Wise",
      data: [classlist],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Update classes

// const Updateclass = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const updates = req.body;

//     if (!classId) {
//       return res.status(400).json({
//         error: true,
//         message: "Class ID is required",
//       });
//     }

//     // Find the class document
//     const classToUpdate = await Class.findById(classId);
//     if (!classToUpdate || classToUpdate.is_deleted) {
//       return res.status(404).json({
//         error: true,
//         message: "Class not found",
//       });
//     }

//     // Update schedule (ensure deep change detection)
//     if (updates.classShedule) {
//       const newSchedule = { ...classToUpdate.classShedule?.toObject() };

//       if (updates.classShedule.days) {
//         newSchedule.days = updates.classShedule.days;
//       }
//       if (updates.classShedule.time) {
//         newSchedule.time = updates.classShedule.time;
//       }

//       classToUpdate.classShedule = newSchedule;
//       classToUpdate.markModified("classShedule");
//     }

//     // Update core fields
//     if (updates.classname) classToUpdate.classname = updates.classname;
//     if (updates.classlink) classToUpdate.classlink = updates.classlink;
//     if (updates.classDate) classToUpdate.classDate = updates.classDate;

//     // Handle batch update
//     if (updates.batchId) {
//       if (
//         !classToUpdate.batchId ||
//         updates.batchId !== classToUpdate.batchId.toString()
//       ) {
//         const batch = await Batch.findById(updates.batchId);
//         if (!batch) {
//           return res.status(404).json({
//             error: true,
//             message: "Batch not found",
//           });
//         }
//         classToUpdate.batchId = batch._id;
//         classToUpdate.batchname = batch.batchname;
//       }
//     } else {
//       // If batchId is explicitly removed, clear it
//       classToUpdate.batchId = null;
//       classToUpdate.batchname = null;
//     }

//     // Handle student update (optional)
//     if (updates.studentId) {
//       if (
//         !classToUpdate.studentId ||
//         updates.studentId !== classToUpdate.studentId.toString()
//       ) {
//         const student = await Student.findById(updates.studentId);
//         if (!student) {
//           return res.status(404).json({
//             error: true,
//             message: "Student not found",
//           });
//         }
//         classToUpdate.studentId = student._id;
//         classToUpdate.studentname = student.studentname;
//       }
//     } else {
//       // If studentId is explicitly removed, clear it
//       classToUpdate.studentId = null;
//       classToUpdate.studentname = null;
//     }

//     // Save the updated document
//     const updatedClass = await classToUpdate.save();

//     // Prepare response
//     const responseData = {
//       classId: updatedClass._id,
//       classname: updatedClass.classname,
//       batch: updatedClass.batchId
//         ? {
//             batchId: updatedClass.batchId,
//             batchname: updatedClass.batchname,
//           }
//         : null,
//       student: updatedClass.studentId
//         ? {
//             studentId: updatedClass.studentId,
//             studentname: updatedClass.studentname,
//           }
//         : null,
//       classShedule: updatedClass.classShedule,
//       classlink: updatedClass.classlink,
//       classDate: updatedClass.classDate,
//       createdAt: updatedClass.createdAt,
//       updatedAt: updatedClass.updatedAt,
//     };

//     return res.status(200).json({
//       error: false,
//       message: "Class updated successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     console.error("Error updating class:", error);
//     return res.status(500).json({
//       error: true,
//       message: error.message || "Internal server error",
//     });
//   }
// };

const Updateclass = async (req, res) => {
  try {
    const { classId } = req.params;
    const updates = req.body;

    if (!classId) {
      return res.status(400).json({
        error: true,
        message: "Class ID is required",
      });
    }

    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate || classToUpdate.is_deleted) {
      return res.status(404).json({
        error: true,
        message: "Class not found",
      });
    }

    // Update schedule
    if (updates.classShedule) {
      // Expecting updates.classShedule to be an array like:
      // [{ day: 'Monday', time: '12pm' }, { day: 'Friday', time: '4pm' }]
      classToUpdate.classShedule = updates.classShedule;
      classToUpdate.markModified("classShedule");
    }

    // Update core fields
    if (updates.classname) classToUpdate.classname = updates.classname;
    if (updates.classlink) classToUpdate.classlink = updates.classlink;
    if (updates.classDate) classToUpdate.classDate = updates.classDate;

    // Handle batch update
    if (updates.batchId) {
      if (
        !classToUpdate.batchId ||
        updates.batchId !== classToUpdate.batchId.toString()
      ) {
        const batch = await Batch.findById(updates.batchId);
        if (!batch) {
          return res.status(404).json({
            error: true,
            message: "Batch not found",
          });
        }
        classToUpdate.batchId = batch._id;
        classToUpdate.batchname = batch.batchname;
      }
    } else if (updates.batchId === null) {
      classToUpdate.batchId = null;
      classToUpdate.batchname = null;
    }

    // Handle student update
    if (updates.studentId) {
      if (
        !classToUpdate.studentId ||
        updates.studentId !== classToUpdate.studentId.toString()
      ) {
        const student = await Student.findById(updates.studentId);
        if (!student) {
          return res.status(404).json({
            error: true,
            message: "Student not found",
          });
        }
        classToUpdate.studentId = student._id;
        classToUpdate.studentname = student.studentname;
      }
    } else if (updates.studentId === null) {
      classToUpdate.studentId = null;
      classToUpdate.studentname = null;
    }

    const updatedClass = await classToUpdate.save();

    const responseData = {
      classId: updatedClass._id,
      classname: updatedClass.classname,
      batch: updatedClass.batchId
        ? {
            batchId: updatedClass.batchId,
            batchname: updatedClass.batchname,
          }
        : null,
      student: updatedClass.studentId
        ? {
            studentId: updatedClass.studentId,
            studentname: updatedClass.studentname,
          }
        : null,
      classShedule: updatedClass.classShedule,
      classlink: updatedClass.classlink,
      classDate: updatedClass.classDate,
      createdAt: updatedClass.createdAt,
    };

    return res.status(200).json({
      error: false,
      message: "Class updated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({
      error: true,
      message: error.message || "Internal server error",
    });
  }
};

// delete class
const Deleteclass = async (req, res) => {
  const { classId } = req.params;

  try {
    if (!classId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing class Id",
      });
    }

    const delclass = await Class.findByIdAndDelete(classId);

    if (!delclass) {
      return res.status(404).json({
        error: true,
        message: "Class not delete",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Class Deleted successfully",
      data: delclass,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all class of my any educator of his

const Getourclasses = async (req, res) => {
  const { educatorId } = req.params;

  try {
    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Educator Id not found",
      });
    }

    // Find all classes where the educator is assigned
    const AllClass = await Class.find({ educators: educatorId })
      .populate("batchId students mentorId")
      .exec();

    return res.status(200).json({
      error: false,
      message: "All class list",
      data: AllClass,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// class shdedule class change

// const GetselfClasses = async (req, res) => {
//   try {
//     const { studentId, date } = req.body;

//     console.log("Received studentId:", studentId);
//     console.log("Received date:", date);

//     if (!mongoose.Types.ObjectId.isValid(studentId)) {
//       return res.status(400).json({ error: true, message: "Invalid student ID" });
//     }

//     const student = await Student.findById(studentId).lean();
//     if (!student) {
//       return res.status(404).json({ error: true, message: "Student not found" });
//     }

//     console.log("Student:", student);

//     if (!student.batches || student.batches.length === 0) {
//       return res.status(400).json({ error: true, message: "No batches for student" });
//     }

//     const batchIds = student.batches.map(b => b.batchId);
//     console.log("Batch IDs:", batchIds);

//     const queryDate = new Date(date);
//     const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
//     console.log("Date range:", startOfDay, endOfDay);

//     const classes = await Class.find({
//       batchId: { $in: batchIds },
//       // Comment out date filter temporarily to test:
//       // classDate: { $gte: startOfDay, $lte: endOfDay },
//       is_deleted: false
//     }).lean();

//     console.log("Classes found:", classes);

//     return res.status(200).json({
//       error: false,
//       message: "Classes fetched",
//       data: classes
//     });

//   } catch (error) {
//     console.error("Error in GetselfClasses:", error);
//     return res.status(500).json({ error: true, message: "Server error" });
//   }
// };
const GetselfClasses = async (req, res) => {
  try {
    const { studentId, date } = req.body;

    // console.log("Received studentId:", studentId);
    // console.log("Received date:", date);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid student ID" });
    }

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res
        .status(404)
        .json({ error: true, message: "Student not found" });
    }

    // console.log("Student:", student);

    if (!student.batches || student.batches.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "No batches for student" });
    }

    const batchIds = student.batches.map((b) => b.batchId);
    // console.log("Batch IDs:", batchIds);

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
    // console.log("Date range:", startOfDay, endOfDay);

    const classes = await Class.find({
      batchId: { $in: batchIds },
      classDate: { $gte: startOfDay, $lte: endOfDay },
      is_deleted: false,
    })
      .select("classname classShedule classlink classDate batchId")
      .lean();

    // console.log("Classes found:", classes);

    if (!classes.length) {
      return res
        .status(404)
        .json({
          error: true,
          message: "No classes found for this student on the given date",
        });
    }

    const formattedClasses = classes.map((cls) => ({
      classId: cls._id,
      className: cls.classname,
      schedule: cls.classShedule || [], // Return array of { day, time }
      classLink: cls.classlink,
      classDate: cls.classDate,
      batchId: cls.batchId,
    }));

    return res.status(200).json({
      error: false,
      message: "Classes fetched successfully",
      data: formattedClasses,
      totalClasses: classes.length,
    });
  } catch (error) {
    console.error("Error in GetselfClasses:", error);
    return res.status(500).json({ error: true, message: "Server error" });
  }
};

// get educator self classes
// const GetselfClassesForEducator = async (req, res) => {
//   try {
//     const { educatorId, date } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(educatorId)) {
//       return res.status(400).json({
//         error: true,
//         message: "Invalid educator ID"
//       });
//     }

//     if (!date || isNaN(Date.parse(date))) {
//       return res.status(400).json({
//         error: true,
//         message: "Invalid date format"
//       });
//     }

//     // Get all batches that include this educator
//     const batches = await Batch.find({
//       educators: educatorId
//     }).select('_id').lean();

//     if (!batches.length) {
//       return res.status(404).json({
//         error: true,
//         message: "No batches found for this educator"
//       });
//     }

//     const batchIds = batches.map(b => b._id);

//     // Time range for the day
//     const queryDate = new Date(date);
//     const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

//     // Get classes of those batches on the given date
//     const classes = await Class.find({
//       batchId: { $in: batchIds },
//       classDate: {
//         $gte: startOfDay,
//         $lte: endOfDay
//       },
//       is_deleted: false
//     })
//       .select('classname classShedule classlink classDate')
//       .sort({ classDate: 1 })
//       .lean();

//     const formattedClasses = classes.map(cls => ({
//       classId: cls._id,
//       className: cls.classname,
//       schedule: {
//         days: cls.classShedule?.days,
//         time: cls.classShedule?.time
//       },
//       classLink: cls.classlink,
//       classDate: cls.classDate
//     }));

//     return res.status(200).json({
//       error: false,
//       message: "Educator classes retrieved successfully",
//       data: {
//         educatorId,
//         date: queryDate.toISOString().split('T')[0],
//         classes: formattedClasses,
//         totalClasses: classes.length
//       }
//     });

//   } catch (error) {
//     console.error("Error fetching educator classes:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error"
//     });
//   }
// };

const GetselfClassesForEducator = async (req, res) => {
  try {
    const { educatorId, date } = req.body;

    if (!educatorId || !date) {
      return res.status(400).json({
        error: true,
        message: "educatorId and date are required",
      });
    }

    const educator = await Educator.findOne({ educatorId }).lean();
    if (!educator) {
      return res.status(404).json({
        error: true,
        message: "Educator not found",
      });
    }

    const educatorObjectId = educator._id;

    const batches = await Batch.find({
      educators: educatorObjectId,
    })
      .select("_id")
      .lean();

    if (!batches.length) {
      return res.status(404).json({
        error: true,
        message: "No batches found for this educator",
      });
    }

    const batchIds = batches.map((b) => b._id);

    const inputDate = new Date(date);
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    const classes = await Class.find({
      batchId: { $in: batchIds },
      is_deleted: false,
      classDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .select("classname classShedule classlink classDate batchId")
      .sort({ classDate: 1 })
      .lean();

    if (!classes.length) {
      return res.status(404).json({
        error: true,
        message: "No classes found for this educator on the given date",
      });
    }

    const formattedClasses = classes.map((cls) => ({
      classId: cls._id,
      className: cls.classname,
      schedule: cls.classShedule || [], // return array of { day, time }
      classLink: cls.classlink,
      classDate: cls.classDate,
      batchId: cls.batchId,
    }));

    return res.status(200).json({
      error: false,
      message: "Educator classes retrieved successfully",
      data: {
        educatorId,
        date,
        classes: formattedClasses,
        totalClasses: classes.length,
      },
    });
  } catch (error) {
    console.error("Error fetching educator classes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const RequestScheduleChange = async (req, res) => {
  try {
    const { classId, educatorId, reason, proposedSchedule } = req.body;

    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Eductor Id missing",
      });
    }

    // Proceed with schedule change request
    const request = new ScheduleChangeRequest({
      classId,
      educatorId,
      reason,
      proposedSchedule,
    });

    await request.save();
    return res.status(201).json({
      error: false,
      message: "Request submitted successfully",
      data: request,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Approve the request of class change
const ApproveScheduleChange = async (req, res) => {
  try {
    const { classId, mentorId, requestId } = req.body;

    // Fetch the class and verify mentor
    const existingClass = await Class.findById(classId);
    // console.log("existing", existingClass);
    if (!existingClass) {
      return res.status(404).json({ error: true, message: "Class not found" });
    }

    // Check if mentorId from req.body matches the actual class mentor
    if (existingClass.mentorId?.toString() !== mentorId) {
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized mentor" });
    }

    // Find the schedule change request
    const scheduleRequest = await ScheduleChangeRequest.findById(requestId);
    if (!scheduleRequest || scheduleRequest.status !== "Pending") {
      return res.status(404).json({
        error: true,
        message: "Schedule change request not found or already processed",
      });
    }

    // Update the class schedule
    existingClass.classSchedule = scheduleRequest.proposedSchedule;
    await existingClass.save();

    // Mark request as approved
    scheduleRequest.status = "Approved";
    await scheduleRequest.save();

    return res.status(200).json({
      error: false,
      message: "Class schedule updated successfully",
      data: existingClass,
    });
  } catch (error) {
    console.error("Error approving schedule change:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// get all redshedule request

const getAllScheduleChangeRequests = async (req, res) => {
  try {
    const requests = await ScheduleChangeRequest.find({ status: "Pending" })
      .populate("classId", "classname")
      .populate("educatorId", "name email,role,phone");

    return res.status(200).json({
      error: false,
      message: "Schedule change requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching schedule change requests:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// get all your request

const Getyourequest = async (req, res) => {
  const { educatorId } = req.params;

  try {
    if (!educatorId) {
      return res.status(400).json({
        error: true,
        message: "Educator ID is required",
      });
    }

    // Find schedule change requests for the given educator
    const requests = await ScheduleChangeRequest.find({ educatorId })
      .populate("classId", "classname classShedule classlink") // Populating class details
      .exec();

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No schedule change requests found for this educator",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Schedule change requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching schedule change requests:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Add Marksheet

const Addmarksheet = async (req, res) => {
  const { studentId, marksheetimg } = req.body;
  try {
    if (!studentId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Student Id not found",
      });
    }

    const newmarksheet = new marksheetimg({
      studentId,
      marksheetimg,
    });
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        error: true,
        message: "Student not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Add Practice Material

const uploadDir = "uploads/Practice";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Store in "Practice" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const practiceUpload = multer({
  storage: storage,
  limits: { fileSize: Infinity },
  fileFilter: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new Error("Invalid file"));
    }
    cb(null, true);
  },
}).array("materialimages", 10);

const AddPracticeMaterial = async (req, res) => {
  practiceUpload(req, res, async function (err) {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).json({
        error: true,
        message: "File upload failed",
        details: err.message,
      });
    }

    try {
      const { materialname, materialdescription, studentId, batchId } =
        req.body;
      let materialimages = req.files ? req.files.map((file) => file.path) : [];

      if (!materialname || !materialdescription) {
        return res.status(400).json({
          error: true,
          message:
            "Missing required fields: materialname and materialdescription are mandatory",
        });
      }

      let student = null;
      if (studentId) {
        student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({
            error: true,
            message: "Student not found",
          });
        }
      }

      let batch = null;
      if (batchId) {
        batch = await Batch.findById(batchId);
        if (!batch) {
          return res.status(404).json({
            error: true,
            message: "Batch not found",
          });
        }
      }

      const newMaterial = new Practice({
        studentId: student ? student._id : undefined,
        batchId: batch ? batch._id : undefined,
        materialname,
        materialimages,
        materialdescription,
      });

      await newMaterial.save();

      return res.status(201).json({
        error: false,
        message: "Practice material added successfully",
        data: newMaterial,
      });
    } catch (error) {
      console.error("Error adding practice material:", error);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
        details: error.message,
      });
    }
  });
};

// Get Practice Material by batch

// const GetPracticeMaterial = async (req, res) => {
//   const { batchId } = req.params;

//   try {
//     if (!batchId) {
//       return res.status(400).json({
//         error: true,
//         message: "Something went wrong || Batch Id missing",
//       });
//     }

//     const materialdata = await Practice.find({ batchId });
//     console.log("Practice material", materialdata);
//     if (!materialdata || materialdata.length == 0) {
//       return res.status(404).json({
//         error: true,
//         message: "No Practice material found",
//       });
//     }

//     return res.status(201).json({
//       error: false,
//       message: "Practice material list",
//       data: materialdata,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };

const GetPracticeMaterial = async (req, res) => {
  const { batchId, studentId } = req.params;

  try {
    if (!batchId && !studentId) {
      return res.status(400).json({
        error: true,
        message: "Either batchId or studentId is required",
      });
    }

    const query = {
      is_deleted: false,
    };

    if (batchId) {
      query.batchId = batchId;
    }
    if (studentId) {
      query.studentId = studentId;
    }

    const materialdata = await Practice.find(query);
    // console.log("Practice material", materialdata);

    if (!materialdata || materialdata.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No Practice material found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Practice material list",
      data: materialdata,
    });
  } catch (error) {
    console.error("Error fetching practice materials:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// educator profile

const getUserProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;
    let userModel;

    if (role === "student") {
      userModel = Student;
    } else if (role === "mentor") {
      userModel = Mentor;
    } else if (role === "admin") {
      userModel = Admin;
    } else if (role === "educator") {
      userModel = Educator;
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid role! Use 'student', 'mentor', or 'educator'.",
      });
    }

    // Find user by ID
    const user = await userModel
      .findOne({ _id: userId })
      .select("-password -otp");

    if (!user) {
      return res.status(404).json({
        error: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found!`,
      });
    }

    return res.status(200).json({
      error: false,
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } profile fetched successfully!`,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

// update profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const { fullName, email, phone } = req.body;

    // Split fullName into firstname and lastname
    let firstname = undefined;
    let lastname = undefined;

    if (fullName) {
      const nameParts = fullName.split(" ");
      firstname = nameParts[0]; // First name
      lastname = nameParts[1] || ""; // Last name (handle cases where only one name part is provided)
    }

    let userModel;

    if (role === "student") {
      userModel = Student;
    } else if (role === "mentor") {
      userModel = Mentor;
    } else if (role === "admin") {
      userModel = Admin;
    } else if (role === "educator") {
      userModel = Educator;
    } else {
      return res.status(400).json({
        error: true,
        message:
          "Invalid role! Use 'student', 'mentor', 'admin', or 'educator'.",
      });
    }

    // Build update object
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    // Update user profile
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select("-password -otp");

    if (!updatedUser) {
      return res.status(404).json({
        error: true,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found!`,
      });
    }

    return res.status(200).json({
      error: false,
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } profile updated successfully!`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
};

// attendance system

const GetClassAttendace = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findById(classId).populate("batchId");
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const batchId = classData.batchId._id;

    // Check if attendance already exists for this class
    const existingAttendance = await Attendance.findOne({ classId })
      .sort({ date: -1 }) // Get most recent attendance
      .lean();

    // Get all students in the batch
    const students = await Student.find({ "batch.batchId": batchId })
      .select("firstname lastname email _id")
      .lean();

    // Get all educators in the batch
    const educator = await Educator.find({ "batch.batchId": batchId })
      .select("firstname lastname email _id")
      .lean();

    // Map existing attendance status if available
    let studentStatus = {};
    let educatorStatus = {};

    if (existingAttendance) {
      // Map student statuses
      existingAttendance.studentAttendance.forEach((att) => {
        studentStatus[att.studentId.toString()] = att.status;
      });

      // Map educator status if exists
      if (existingAttendance.educatorAttendance) {
        educatorStatus[
          existingAttendance.educatorAttendance.educatorId.toString()
        ] = existingAttendance.educatorAttendance.status;
      }
    }

    // Prepare response with current status
    const response = {
      classData,
      students: students.map((student) => ({
        ...student,
        status: studentStatus[student._id.toString()] || "Absent",
      })),
      educator: educator.map((edu) => ({
        ...edu,
        status: educatorStatus[edu._id.toString()] || "Absent",
      })),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mark attendace

const MarkAttendaceofStudentAndEducator = async (req, res) => {
  try {
    const { classId, educatorAttendance, studentAttendance } = req.body;

    if (!classId || !studentAttendance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Validate student attendance data
    if (!Array.isArray(studentAttendance)) {
      return res
        .status(400)
        .json({ message: "Student attendance should be an array" });
    }

    // Check if attendance already exists for this class
    const existingAttendance = await Attendance.findOne({ classId }).sort({
      date: -1,
    });

    // If attendance exists, update it instead of creating new
    if (existingAttendance) {
      existingAttendance.studentAttendance = studentAttendance.map(
        (student) => ({
          studentId: student.studentId,
          status: student.status,
        })
      );

      if (educatorAttendance && educatorAttendance.educatorId) {
        existingAttendance.educatorAttendance = {
          educatorId: educatorAttendance.educatorId,
          status: educatorAttendance.status,
        };
      }

      await existingAttendance.save();
      return res
        .status(200)
        .json({ message: "Attendance updated successfully" });
    }

    // If no existing attendance, create new
    const attendanceRecord = new Attendance({
      classId,
      batchId: classData.batchId,
      courseId: classData.courseId,
      studentAttendance,
      educatorAttendance:
        educatorAttendance && educatorAttendance.educatorId
          ? {
              educatorId: educatorAttendance.educatorId,
              status: educatorAttendance.status,
            }
          : undefined,
      date: new Date(),
    });

    await attendanceRecord.save();
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// get any student attendace record
const GetStudentMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.body;

    // Validate inputs - using mongoose.Types.ObjectId properly
    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Create proper ObjectId instance
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: "Invalid month (1-12)" });
    }

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({ message: "Invalid year" });
    }

    // Calculate date range for the month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

    // Find all attendance records where this student is present
    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          "studentAttendance.studentId": studentObjectId,
        },
      },
      {
        $unwind: "$studentAttendance",
      },
      {
        $match: {
          "studentAttendance.studentId": studentObjectId,
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "classDetails",
        },
      },
      {
        $unwind: "$classDetails",
      },
      {
        $project: {
          date: 1,
          status: "$studentAttendance.status",
          classId: "$classDetails._id",
          className: "$classDetails.classname",
          classDate: "$classDetails.classDate",
          attendanceId: "$_id",
        },
      },
    ]);

    // Calculate summary statistics
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (a) => a.status === "Present"
    ).length;
    const absentCount = totalClasses - presentCount;
    const attendancePercentage =
      totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    res.json({
      studentId,
      month: monthNum,
      year: yearNum,
      totalClasses,
      presentCount,
      absentCount,
      attendancePercentage,
      attendanceDetails: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(500).json({ message: error.message });
  }
};

// assign educator ans student and batch to mentor

const AssignStuAndEduAndBatchToMentor = async (req, res) => {
  try {
    const { mentorId, educators, students, batches } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updatedEducators = [];
    const updatedStudents = [];
    const updatedBatches = [];

    if (educators && educators.length) {
      for (const educatorId of educators) {
        const educator = await Educator.findById(educatorId);
        if (!educator) {
          return res
            .status(404)
            .json({ error: `Educator not found: ${educatorId}` });
        }
        educator.mentor = mentor._id;
        await educator.save();
        updatedEducators.push(educatorId);
      }
      // Add to mentor's educator list (avoid duplicates)
      mentor.educators = [...new Set([...mentor.educators, ...educators])];
    }

    if (students && students.length) {
      for (const studentId of students) {
        const student = await Student.findById(studentId);
        if (!student) {
          return res
            .status(404)
            .json({ error: `Student not found: ${studentId}` });
        }
        student.mentor = mentor._id;
        await student.save();
        updatedStudents.push(studentId);
      }
      // Add to mentor's student list (avoid duplicates)
      mentor.students = [...new Set([...mentor.students, ...students])];
    }

    if (batches && batches.length) {
      for (const batchId of batches) {
        const batch = await Batch.findById(batchId);
        if (!batch) {
          return res.status(404).json({ error: `Batch not found: ${batchId}` });
        }
        batch.mentor = mentor._id;
        await batch.save();
        updatedBatches.push(batchId);
      }
      // Add to mentor's batch list (avoid duplicates)
      mentor.batches = [...new Set([...mentor.batches, ...batches])];
    }

    await mentor.save();

    res.status(200).json({
      message: "Mentor assigned successfully.",
      updated: {
        educators: updatedEducators,
        students: updatedStudents,
        batches: updatedBatches,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get mentor all data
const GetMentorWithDetails = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId)
      .populate("educators")
      .populate("students")
      .populate("batches");

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json({
      message: "Mentor details fetched successfully.",
      mentor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get any specific educator assign students

const GetStudentListofAnyEducator = async (req, res) => {
  try {
    const { educatorId } = req.params;

    if (!educatorId) {
      return res
        .status(400)
        .json({ error: true, message: "Educator ID is required!" });
    }

    const students = await Student.find({
      "educator.educatorId": educatorId,
      is_deleted: false,
    }).select("firstname lastname email phone");

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No students found for this educator!" });
    }

    return res.status(200).json({
      error: false,
      message: "Students fetched successfully!",
      data: students,
    });
  } catch (error) {
    console.error("Error in getStudentsByEducator:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error!" });
  }
};

// upload notes

const UploadNotesOFClass = async (req, res) => {
  try {
    const { title, classId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const note = new Note({
      title,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      classId,
    });

    await note.save();

    res.status(201).json({ message: "Note uploaded successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get class notes

const GetClassWithNotes = async (req, res) => {
  try {
    const { classId } = req.params;
    // Find class details
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find all notes linked to this class
    const notes = await Note.find({ classId: classId });

    res.status(200).json({
      message: "Class data with notes fetched successfully",
      class: classData,
      notes: notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// upload class home work
const UploadhomeworkOfClass = async (req, res) => {
  try {
    const { title, classId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const classwork = new classhomework({
      title,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      classId,
    });

    await classwork.save();

    res
      .status(201)
      .json({ message: "Class Home work uploaded successfully", classwork });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get notes

const GetClassWithHomework = async (req, res) => {
  try {
    const { classId } = req.params;
    // Find class details
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find all notes linked to this class
    const homework = await classhomework.find({ classId: classId });

    res.status(200).json({
      message: "Class data with home work fetched successfully",
      class: classData,
      homework: homework,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const UploadHomeworkSolution = async (req, res) => {
  try {
    const { classhomeworkId, studentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Solution file is required" });
    }

    const solution = new classhomeworksolution({
      classhomeworkId,
      studentId,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
    });

    await solution.save();

    res
      .status(201)
      .json({ message: "Homework solution submitted successfully", solution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get home work solutions of student by class wise

const GetSolutionsForHomework = async (req, res) => {
  try {
    const { classhomeworkId } = req.params;
    // console.log("homework id", classhomeworkId);
    const solutions = await classhomeworksolution
      .find({ classhomeworkId })
      .populate("studentId", "firstname lastname enrollmentnumber")
      .populate("classhomeworkId", "title");
    // console.log("solutions", solutions);
    res.status(200).json({ solutions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  registerAdmin,
  loginUser,
  verifyOTP,
  Registermentor,
  Registereducator,
  Registerstudent,
  Getallmentos,
  Getallstudents,
  Getalleducators,
  Updatementor,
  Updateducator,
  Updatedstudent,
  Deletementor,
  Deleteeducator,
  Deletestudent,
  AddBatch,
  Updatebatch,
  Deletebatch,
  Getbatch,
  AddClass,
  Getallclasses,
  Updateclass,
  Deleteclass,
  RequestScheduleChange,
  ApproveScheduleChange,
  getAllScheduleChangeRequests,
  AddPracticeMaterial,
  GetPracticeMaterial,
  AddStudentsToBatch,
  Getourclasses,
  Getyourequest,
  GetourBatch,
  assignBatchToStudent,
  // getEducatorProfile,
  getUserProfile,
  GetselfClasses,
  logoutUser,
  GetBtachofCourse,

  // attendance

  GetClassAttendace,
  MarkAttendaceofStudentAndEducator,
  GetBatchWiseClassessList,
  GetStudentMonthlyAttendance,

  // forget password
  forgotPasswordRequest,
   resetPassword,
  GetselfClassesForEducator,
  AssignStuAndEduAndBatchToMentor,
  GetMentorWithDetails,
  GetStudentListofAnyEducator,
  UploadNotesOFClass,
  updateUserProfile,
  GetClassWithNotes,
  UploadhomeworkOfClass,
  GetClassWithHomework,
  UploadHomeworkSolution,
  GetSolutionsForHomework,
};
