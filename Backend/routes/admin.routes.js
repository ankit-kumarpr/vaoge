const express = require("express");
const {
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
  Getbatch,
  Updatebatch,
  Deletebatch,
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
  getUserProfile,
  GetselfClasses,
  logoutUser,
  GetBtachofCourse,
  GetClassAttendace,
  MarkAttendaceofStudentAndEducator,
  GetBatchWiseClassessList,
  GetStudentMonthlyAttendance,
  forgotPasswordRequest,
  resetPassword,
  GetselfClassesForEducator,
  assignBatchToStudent,
  AssignStuAndEduAndBatchToMentor,
  GetMentorWithDetails,
  GetStudentListofAnyEducator,
  UploadNotesOFClass,
  updateUserProfile,
  GetClassWithNotes,
  UploadhomeworkOfClass,
  GetClassWithHomework,
  UploadHomeworkSolution,
  GetSolutionsForHomework
} = require("../controllers/admin.controller");
const Notesupload = require("../middlewares/notesmulterConfig");
const classHomeWorkupload = require("../middlewares/homemulterConfig");
const uploadSolution = require("../middlewares/classworksolutionmulter");
const {
  Addnotice,
  noticeupload,
  Deletenotice,
  Getallnotice,
  Updatenotice,
  GetEducatorNotices,
  GetMentorNotices,
  GetBatchNotices,
  GetStudentNotices,
} = require("../controllers/notice.controller");

const {
  Addcourse,
  Getallcourse,
  Updatecourse,
  Deletecourse,
  GetallcourseBystudent,
  AssignCourse,
} = require("../controllers/course.controller");

const {
  AddMarksheet,
  GetStudentMarksheets,
} = require("../controllers/marksheet.controller");

const upload = require("../middlewares/multerConfig");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Admin routes
router.post("/registeradmin", registerAdmin);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/logout-user/:userId", logoutUser);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password/:token", resetPassword);

// Mentor routes
router.post("/registermentor", roleMiddleware("admin"), upload, Registermentor);
router.post("/registereducator", upload, Registereducator);
router.post("/registerstudent", upload, Registerstudent);

router.get("/getallmentor", roleMiddleware("admin"), Getallmentos);
router.get(
  "/getalleducator",
  roleMiddleware(["admin", "mentor"]),
  Getalleducators
);
router.get(
  "/getallstudent",
  roleMiddleware(["admin", "mentor"]),
  Getallstudents
);

router.put("/updatementor/:mentorId", roleMiddleware("admin"), Updatementor);
router.put(
  "/updateeducator/:educatorId",
  roleMiddleware("admin"),
  Updateducator
);
router.put(
  "/updatestudent/:studentId",
  roleMiddleware("admin"),
  Updatedstudent
);

router.delete("/delmentor/:mentorId", roleMiddleware("admin"), Deletementor);
router.delete(
  "/deleducator/:educatorId",
  roleMiddleware("admin"),
  Deleteeducator
);
router.delete("/delstudent/:studentId", roleMiddleware("admin"), Deletestudent);

router.post("/add-notice", noticeupload.single("noticeimage"), Addnotice);
router.get("/getnotice", Getallnotice);
router.delete("/delnotice/:noticeId", roleMiddleware("admin"), Deletenotice);
router.put(
  "/noticeupdate/:noticeId",
  noticeupload.single("noticeimage"),
  Updatenotice
);
router.get("/geteducatornotice/:educatorId", GetEducatorNotices);
router.get("/getmentornotice/:mentorId", GetMentorNotices);
router.get("/getbatchnotice/:batchId", GetBatchNotices);
router.get("/getstudentnotice/:studentId", GetStudentNotices);

router.post("/addbatch", roleMiddleware(["admin", "mentor"]), AddBatch);
router.get("/getbatch", roleMiddleware(["admin", "mentor"]), Getbatch);
router.put(
  "/updatebatch/:batchId",
  roleMiddleware(["admin", "mentor"]),
  Updatebatch
);
router.delete(
  "/deletebatch/:batchId",
  roleMiddleware(["admin", "mentor"]),
  Deletebatch
);
router.post(
  "/addstuexisting",
  roleMiddleware(["admin", "mentor"]),
  AddStudentsToBatch
);

router.post(
  "/assignbatchtostudent",
  roleMiddleware(["admin", "mentor"]),
  assignBatchToStudent
);
router.get("/yourbatch/:userId/:role", GetourBatch);
router.get("/courseBatch/:courseId", GetBtachofCourse);

router.post("/createclass", roleMiddleware(["admin", "mentor"]), AddClass);
router.get("/getclass", Getallclasses);
router.put(
  "/updateclass/:classId",
  roleMiddleware(["admin", "mentor"]),
  Updateclass
);
router.delete(
  "/deleteclass/:classId",
  roleMiddleware(["admin", "mentor"]),
  Deleteclass
);
router.get("/geteducatorclass/:educatorId", Getourclasses);
router.post("/getselfclass", GetselfClasses);
router.post("/getselfclasseducator", GetselfClassesForEducator);
router.get("/getbatchclass/:batchId", GetBatchWiseClassessList);

router.post(
  "/request-shedule-change",
  roleMiddleware("educator"),
  RequestScheduleChange
);
router.put(
  "/approve-shedule-change",
  roleMiddleware(["admin", "mentor"]),
  ApproveScheduleChange
);

router.get(
  "/getshedulechangerequest",
  roleMiddleware(["admin", "mentor"]),
  getAllScheduleChangeRequests
);
router.get("/yourrequest/:educatorId", Getyourequest);

router.post("/add-course", roleMiddleware(["admin", "mentor"]), Addcourse);
router.get("/getcourse", Getallcourse);
router.put("/updatecourse/:courseId", Updatecourse);
router.delete("/deletecourse/:courseId", Deletecourse);
router.post(
  "/assign-course",
  roleMiddleware(["admin", "mentor"]),
  AssignCourse
);

router.get("/getallcoursebystudent/:studentId", GetallcourseBystudent);

router.post("/upload-marksheet", AddMarksheet); // Upload Marksheet
router.get("/get-marksheets/:studentId", GetStudentMarksheets);

router.post(
  "/addpractice",
  roleMiddleware(["admin", "mentor"]),
  AddPracticeMaterial
);
router.get("/getpractice/:batchId", GetPracticeMaterial); //test left
// router.get('/getpractice/:batchId?/:studentId?', GetPracticeMaterial);

// profile

router.get("/profile/:userId/:role", getUserProfile);

// attendace

router.get("/attendance/:classId", GetClassAttendace);
router.post("/attendance/mark", MarkAttendaceofStudentAndEducator);
router.post("/student/monthly-attendance", GetStudentMonthlyAttendance);
router.post(
  "/assign-student-educator-batch-to-mentor",
  AssignStuAndEduAndBatchToMentor
);
router.get("/allmentordata/:mentorId", GetMentorWithDetails);
router.get(
  "/getstudentlistofeducator/:educatorId",
  GetStudentListofAnyEducator
);
router.post("/add-note", Notesupload.single("file"), UploadNotesOFClass);
router.put("/updateprofile/:role/:userId", updateUserProfile);
router.get("/classnotes/:classId", GetClassWithNotes);
router.get("/classwork/:classId", GetClassWithHomework);
router.post(
  "/add-class-home-work",
  classHomeWorkupload.single("file"),
  UploadhomeworkOfClass
);
router.post(
  "/upload-solution",
  uploadSolution.single("file"),
  UploadHomeworkSolution
);
router.get("/homeworksolutions/:classhomeworkId", GetSolutionsForHomework);


module.exports = router;
