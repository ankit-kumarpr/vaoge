const Course = require("../models/course.model");
const multer = require("multer");
const path = require("path");
const Educator = require("../models/educator.model");
const Student = require("../models/student.model");
const Enrollment = require("../models/Enrollment");
// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "courseimage/"); // Save files in "courseimage" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("courseimage"); 

// Add Course
const Addcourse = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: true, message: err.message });
    }

    const { coursename, price, gst, duration, description } = req.body;

    if (!coursename || !price || !gst) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields",
      });
    }

    try {
      const newcourse = new Course({
        coursename,
        price,
        gst,
        duration,
        description,
        courseimage: req.file?.filename ? `/courseimage/${req.file.filename}` : null,
      });
newcourse.courseId=newcourse._id;
      await newcourse.save();

      return res.status(201).json({
        error: false,
        message: "Course added successfully",
        data: newcourse,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  });
};

// Get All Courses
const Getallcourse = async (req, res) => {
  try {
    const courselist = await Course.find({ is_deleted: { $ne: 1 } });

    if (!courselist || courselist.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No courses found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "All courses",
      data: courselist,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Update Course
const Updatecourse = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: true, message: err.message });
    }

    const { courseId } = req.params;
    const { coursename, price, gst, duration, description } = req.body;

    if (!courseId) {
      return res.status(400).json({
        error: true,
        message: "Course ID is missing",
      });
    }

    try {
      
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          error: true,
          message: "Course not found",
        });
      }

      const updatedCourseImage = req.file?.filename ? `/courseimage/${req.file.filename}` : existingCourse.courseimage;

      // Update course
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          coursename,
          price,
          gst,
          duration,
          description,
          courseimage: updatedCourseImage,
        },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(400).json({
          error: true,
          message: "Course update failed",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  });
};

// delete course

const Deletecourse=async(req,res)=>{
    const {courseId}=req.params;

    try{
        if(!courseId){
            return res.status(400).json({
                error:true,
                message:"Something went wrong || Course Id missing"
            })
        }

        const delcourse=await Course.findByIdAndUpdate(courseId,{
            is_deleted:1
        },{new:true})

    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        })
    }
}


// all course list buy by any student 

const GetallcourseBystudent=async(req,res)=>{
  const { studentId } = req.params;
  try {
   
    const enrollments = await Enrollment.find({ studentId }).populate("courseId", "coursename price");

      if(!enrollments || enrollments.length==0){
        return res.status(404).json({
          error:true,
          message:"No Course purchase by student"
        })
      }

      return res.status(201).json({
        error:false,
        message:"All your course",
        data:enrollments
      })

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}




const AssignCourse = async (req, res) => {
  try {
      const { courseId, students, educators } = req.body;

      if (!courseId || (!students && !educators)) {
          return res.status(400).json({ error: true, message: "Course ID and at least one student or educator are required" });
      }

      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ error: true, message: "Course not found" });
      }

      // Validate students
      if (students && students.length > 0) {
          const validStudents = await Student.find({ _id: { $in: students } });
          if (validStudents.length !== students.length) {
              return res.status(400).json({ error: true, message: "Invalid student IDs provided" });
          }
      }

      // Validate educators
      if (educators && educators.length > 0) {
          const validEducators = await Educator.find({ _id: { $in: educators } });
          if (validEducators.length !== educators.length) {
              return res.status(400).json({ error: true, message: "Invalid educator IDs provided" });
          }
      }

      // Update course with assigned students and educators
      const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { 
              $addToSet: { students: { $each: students || [] }, educators: { $each: educators || [] } } 
          },
          { new: true }
      );

      // Update each student's record to include the assigned course
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { courses: { courseId: course._id, courseName: course.coursename } } }
    );

    await Educator.updateMany(
      { _id: { $in: educators } },
      { $addToSet: { courses: { courseId: course._id, courseName: course.coursename } } }
  );

      return res.status(200).json({
          error: false,
          message: "Course assigned successfully",
          data: updatedCourse
      });

  } catch (error) {
      return res.status(500).json({ error: true, message: "Internal server error", errorDetails: error.message });
  }
};



module.exports = {
  Addcourse,
  Getallcourse,
  Updatecourse,
  Deletecourse,
  GetallcourseBystudent,
  AssignCourse
 }
