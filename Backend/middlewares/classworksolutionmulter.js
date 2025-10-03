const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure the upload folder exists
const solutionFolder = "uploads/solutions";
if (!fs.existsSync(solutionFolder)) {
  fs.mkdirSync(solutionFolder, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, solutionFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Multer upload instance with unlimited file size
const uploadSolution = multer({
  storage: storage,
  limits: { fileSize: Infinity }, 
  fileFilter: (req, file, cb) => {
    cb(null, true); 
  },
});

module.exports = uploadSolution;
