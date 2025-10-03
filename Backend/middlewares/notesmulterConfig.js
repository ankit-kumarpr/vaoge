const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure "uploads/notes" folder exists
const notesFolder = 'uploads/notes';
if (!fs.existsSync(notesFolder)) {
  fs.mkdirSync(notesFolder, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, notesFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only pdf, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
  }
};

// Multer setup with no file size limit (infinite)
const Notesupload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: Infinity }
});

module.exports = Notesupload;
