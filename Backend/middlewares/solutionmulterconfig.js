const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure "Solutions" directory exists
const solutionDir = "Homework/Solutions/";
if (!fs.existsSync(solutionDir)) {
    fs.mkdirSync(solutionDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, solutionDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});


const uploadSolutionFiles = multer({
    storage: storage,
    limits: { fileSize: Infinity }, 
}).array("solutionfiles", 10); 

module.exports = uploadSolutionFiles;
