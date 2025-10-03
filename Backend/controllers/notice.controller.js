const multer = require("multer");
const path = require("path");
const Notice = require("../models/notice.model");
const express = require("express");
const Educator = require("../models/educator.model");
const Student = require("../models/student.model");
const Mentor = require("../models/mentor.model");
const nodemailer = require("nodemailer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notices");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File upload filter (only allow images and PDFs)
const noticeupload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images (jpeg, jpg, png) or PDFs are allowed"));
    }
  },
});

// get all notice
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: "rajdevchauhan1074@gmail.com",
    pass: "sshb xrvd rnqf ruqy",
  },
});

// const Addnotice = async (req, res) => {
//   try {
//     const { subject, message, noticedate, sendToAll, students, batches, educators, mentors } = req.body;
//     const noticeimage = req.file ? req.file.filename : null;

//     if (!subject || !message) {
//       return res.status(400).json({
//         error: true,
//         message: "Subject and message are required",
//       });
//     }

//     // Ensure at least one target group is selected
//     if (!sendToAll && !students && !batches && !educators && !mentors) {
//       return res.status(400).json({
//         error: true,
//         message: "You must select at least one recipient group (all, students, batches, educators, or mentors).",
//       });
//     }

//     // Create the notice object
//     const newNotice = new Notice({
//       noticeId: new Notice()._id,
//       subject,
//       message,
//       noticedate: noticedate || Date.now(),
//       noticeimage,
//       sendToAll: sendToAll || true,
//       students: students ? students.split(",") : [], // Convert CSV string to array
//       batches: batches ? batches.split(",") : [],
//       educators: educators ? educators.split(",") : [],
//       mentors: mentors ? mentors.split(",") : [],
//     });

//     newNotice.noticeId = newNotice._id;
//     await newNotice.save();

//     return res.status(201).json({
//       error: false,
//       message: "Notice added successfully",
//       data: newNotice,
//     });
//   } catch (error) {
//     console.error("Error adding notice:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Internal server error",
//     });
//   }
// };


const Addnotice = async (req, res) => {
  try {
    const { subject, message, noticedate, sendToAll, students, educators, mentors } = req.body;
    const noticeimage = req.file ? req.file.filename : null;

    if (!subject || !message) {
      return res.status(400).json({
        error: true,
        message: "Subject and message are required",
      });
    }

    if (!sendToAll && !students && !educators && !mentors) {
      return res.status(400).json({
        error: true,
        message: "You must select at least one recipient group.",
      });
    }

    const newNotice = new Notice({
      noticeId: new Notice()._id,
      subject,
      message,
      noticedate: noticedate || Date.now(),
      noticeimage,
      sendToAll: sendToAll || true,
      students: students ? students.split(",") : [],
      educators: educators ? educators.split(",") : [],
      mentors: mentors ? mentors.split(",") : [],
    });

    await newNotice.save();

    let recipientEmails = [];

    if (sendToAll) {
      const allStudents = await Student.find({}, "email");
      const allEducators = await Educator.find({}, "email");
      const allMentors = await Mentor.find({}, "email");
      recipientEmails.push(...allStudents.map(s => s.email));
      recipientEmails.push(...allEducators.map(e => e.email));
      recipientEmails.push(...allMentors.map(m => m.email));
    } else {
      if (students) {
        const studentIds = students.split(",");
        const selectedStudents = await Student.find({ _id: { $in: studentIds } }, "email");
        recipientEmails.push(...selectedStudents.map(s => s.email));
      }
      if (educators) {
        const educatorIds = educators.split(",");
        const selectedEducators = await Educator.find({ _id: { $in: educatorIds } }, "email");
        recipientEmails.push(...selectedEducators.map(e => e.email));
      }
      if (mentors) {
        const mentorIds = mentors.split(",");
        const selectedMentors = await Mentor.find({ _id: { $in: mentorIds } }, "email");
        recipientEmails.push(...selectedMentors.map(m => m.email));
      }
    }

    recipientEmails = [...new Set(recipientEmails)];

    // Prepare attachment if file was uploaded
    let attachments = [];
    if (noticeimage) {
      attachments.push({
        filename: noticeimage,
        path: path.join(__dirname, "../uploads/notices/", noticeimage),
      });
    }

    // Send emails
    for (const email of recipientEmails) {
      await transporter.sendMail({
        from: '"Your App Name" <youremail@gmail.com>',
        to: email,
        subject: `New Notice: ${subject}`,
        text: message,
        html: `<p>${message}</p>`,
        attachments: attachments,
      });
    }

    return res.status(201).json({
      error: false,
      message: "Notice added and emails with attachments sent successfully",
      data: newNotice,
    });
  } catch (error) {
    console.error("Error adding notice:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all notice 
const Getallnotice = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("students", "firstname email")
      .populate("batches", "batchName")
      .populate("educators", "firstname email")
      .populate("mentors", "firstname email");

    return res.status(200).json({
      error: false,
      message: "Notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get specific student notice

const GetStudentNotices = async (req, res) => {
  try {
    const { studentId } = req.params;
    const notices = await Notice.find({ students: studentId });

    return res.status(200).json({
      error: false,
      message: "Student notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching student notices:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

//

// get notice of specific batch

const GetBatchNotices = async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const notices = await Notice.find({ batches: batchId });

    return res.status(200).json({
      error: false,
      message: "Batch notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching batch notices:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get notice specifc mentor

const GetMentorNotices = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const notices = await Notice.find({ mentors: mentorId });

    return res.status(200).json({
      error: false,
      message: "Mentor notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching mentor notices:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get educator notice
const GetEducatorNotices = async (req, res) => {
  try {
    const { educatorId } = req.params;
    const notices = await Notice.find({ educators: educatorId });
    // console.log("Educator notices", notices);

    return res.status(200).json({
      error: false,
      message: "Educator notices retrieved successfully",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching educator notices:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// update notice

const Updatenotice = async (req, res) => {
  const { noticeId } = req.params;
  const { subject, message, noticedate } = req.body;
  const noticeimage = req.file ? req.file.filename : undefined; // Handle new image if uploaded

  try {
    if (!noticeId) {
      return res.status(400).json({
        error: true,
        message: "Notice ID is required",
      });
    }

    // Find the existing notice
    const existingNotice = await Notice.findById(noticeId);
    if (!existingNotice) {
      return res.status(404).json({
        error: true,
        message: "Notice not found",
      });
    }

    // Update fields only if they are provided
    const updateData = {
      subject: subject || existingNotice.subject,
      message: message || existingNotice.message,
      noticedate: noticedate || existingNotice.noticedate,
      noticeimage: noticeimage || existingNotice.noticeimage, // Use existing image if none uploaded
    };

    // Update notice in database
    const updatedNotice = await Notice.findByIdAndUpdate(noticeId, updateData, {
      new: true,
    });

    return res.status(200).json({
      error: false,
      message: "Notice updated successfully",
      data: updatedNotice,
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// delete notice

const Deletenotice = async (req, res) => {
  const { noticeId } = req.params;

  try {
    if (!noticeId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong",
      });
    }

    const delnotice = await Notice.findByIdAndDelete(noticeId);

    if (!delnotice) {
      return res.status(404).json({
        error: true,
        message: "Notice not deleted",
      });
    }

    return res.status(201).json({
      error: false,
      message: "Notice deleted successfully",
      data: delnotice,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  Addnotice,
  noticeupload,
  Deletenotice,
  Getallnotice,
  Updatenotice,
  GetEducatorNotices,
  GetMentorNotices,
  GetBatchNotices,
  GetStudentNotices,
};
