const multer = require("multer");
const fs = require("fs");
const path = require("path");


const uploadDir = "Homework/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});


const uploadHomework = multer({
    storage: storage,
    limits: { fileSize: Infinity }, 
}).array("homeworkfiles", 10); 

module.exports = uploadHomework;
