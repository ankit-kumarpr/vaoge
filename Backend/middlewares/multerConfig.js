const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload paths
const mentorUploadPath = "uploads/mentors/";
const educatorUploadPath = "uploads/educators/";
const studentUploadPath = "uploads/students/";  
// Ensure directories exist
if (!fs.existsSync(mentorUploadPath)) {
  fs.mkdirSync(mentorUploadPath, { recursive: true });
}

if (!fs.existsSync(educatorUploadPath)) {
  fs.mkdirSync(educatorUploadPath, { recursive: true });
}

if (!fs.existsSync(studentUploadPath)) {
  fs.mkdirSync(studentUploadPath, { recursive: true });  
}

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = studentUploadPath; 

  
    if (req.originalUrl.includes("registerstudent")) {
      uploadFolder = studentUploadPath;  
    }
    else if (req.originalUrl.includes("registermentor")) {
      uploadFolder = mentorUploadPath;  
    }

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only JPEG, JPG, PNG, or PDF files are allowed!"));
};

// Upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter,
}).fields([
  { name: "profile", maxCount: 1 },
  { name: "adharimage", maxCount: 1 },
  { name: "panimage", maxCount: 1 },
  { name: "degree", maxCount: 10 },
]);

module.exports = upload;
