const express = require("express");

const router = express.Router();

const {
  Createcoupon,
  Checkdiscount,
  Buycourse,
  Getalldiscoutcoupon,
  confirmorders


} = require("../controllers/buy.controller");
const roleMiddleware = require("../middlewares/roleMiddleware");
const uploadHomework = require("../middlewares/multerhomewordConfig");
const uploadSolutionFiles = require("../middlewares/solutionmulterconfig");
const paymentcontrol = require("../controllers/paymentcontroller");
const {
  addHomework, 
  updateHomeworkStatus, 
  getApprovedHomework, 
   UploadSolution,
  reviewSolution,
  getApprovedSolutions,
  GeteducatorhomeWork,
  GetallhomeworkRequest,
 }=require("../controllers/homework.controller");

 const {  ApplyLeave, UpdateLeaveStatus, Getleave}=require("../controllers/educator.controller");
 const { AddnewStudent,GetallnewStudent } = require("../controllers/newstudent.controller");
 const NewStudent = require("../middlewares/multernewstudentconfig");


 router.post("/addnewstudent", NewStudent.fields([{ name: "profile" }, { name: "adharimage" }]), AddnewStudent);
 router.get("/newstulist", GetallnewStudent);










router.post("/create-coupon", roleMiddleware("admin"), Createcoupon);
router.post("/check-discount", Checkdiscount);
router.post("/buycourse", Buycourse);
router.post("/confirmpay", confirmorders);
router.get("/allcoupon",roleMiddleware(["admin", "mentor"]), Getalldiscoutcoupon);

router.post("/addhomework", uploadHomework,roleMiddleware("educator"), addHomework);
router.put("/update-status",roleMiddleware(["admin", "mentor"]), updateHomeworkStatus);
router.get("/approved/:batchId", getApprovedHomework);
router.get("/educatorhomework/:educatorId",GeteducatorhomeWork);
router.get("/homeworkrequest",GetallhomeworkRequest);

router.post("/uploadsolution", uploadSolutionFiles, UploadSolution);
router.put("/homeworkcheck",roleMiddleware("educator"),reviewSolution);


router.post('/applyleave', ApplyLeave);
router.put('/updateleave/:leaveId', UpdateLeaveStatus);
router.get('/getleave', Getleave);

router.post("/orders", paymentcontrol.orders);
router.post("/verify", paymentcontrol.verify);
module.exports = router;
