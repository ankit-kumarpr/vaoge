const path = require("path");
const multer = require("multer");
const Student = require("../models/student.model");
const Marksheet = require("../models/marksheet.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "marksheets/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage }).single("marksheetimg");

const AddMarksheet = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: "File upload failed",
      });
    }

    try {
      const { studentId } = req.body;
      let marksheetimg = req.file ? req.file.path : null;

      if (!studentId) {
        return res.status(400).json({
          error: true,
          message: "Student ID is required",
        });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          error: true,
          message: "Student not found",
        });
      }

      if (!marksheetimg) {
        return res.status(400).json({
          error: true,
          message: "Marksheet image is required",
        });
      }

      const newMarksheet = new Marksheet({
        studentId,
        marksheetimg, // Stores file path
      });

      await newMarksheet.save();

      return res.status(201).json({
        error: false,
        message: "Marksheet uploaded successfully",
        data: newMarksheet,
      });
    } catch (error) {
      console.error("Error uploading marksheet:", error);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  });
};



const GetStudentMarksheets = async (req, res) => {
  try {
    const { studentId } = req.params; // Get studentId from URL params

    if (!studentId) {
      return res.status(400).json({
        error: true,
        message: "Student ID is required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        error: true,
        message: "Student not found",
      });
    }

    const marksheets = await Marksheet.find({ studentId });

    return res.status(200).json({
      error: false,
      message: "Marksheets retrieved successfully",
      data: marksheets,
    });
  } catch (error) {
    console.error("Error fetching marksheets:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = { AddMarksheet, GetStudentMarksheets };
