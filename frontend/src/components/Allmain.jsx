import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";

import "./main.css";
import AdminDashboard from "../Pages/Admin/AdminDashboard.jsx";
import PageTitle from "./PageTitle.jsx";
import FranchiseDashboard from "../Pages/Mentor/FranchiseDashboard.jsx";
import Protected from "../Pages/Protected.jsx";

import Addmentor from "../Pages/Admin/Addmentor.jsx";
import AddEducator from "../Pages/Admin/Addeducator.jsx";

import Mentorlist from "../Pages/Admin/Mentorlist.jsx";
import Educatorlist from "../Pages/Admin/Educatorlist.jsx";
import Createbatch from "../Pages/Admin/Batch/Createbatch.jsx";
import Batchlist from "../Pages/Admin/Batch/Batchlist.jsx";
import Addnotice from "../Pages/Admin/Notice/Addnotice.jsx";
import Noticelist from "../Pages/Admin/Notice/Noticelist.jsx";
import Addcourse from "../Pages/Admin/Course/Addcourse.jsx";
import Courselist from "../Pages/Admin/Course/Courselist.jsx";
import Createclass from "../Pages/Admin/OrgenizeClass/Createclass.jsx";
import Classeslist from "../Pages/Admin/OrgenizeClass/Classeslist.jsx";
import Addpracticematerial from "../Pages/Admin/Practice/Addpracticematerial.jsx";
import Allmaterial from "../Pages/Admin/Practice/Allmaterial.jsx";
import CreatediscountCoupon from "../Pages/Admin/Discounts/CreatediscountCoupon.jsx";
import Regsiterstudent from "../Pages/Admin/Student/Regsiterstudent.jsx";
import Studentlist from "../Pages/Admin/Student/Studentlist.jsx";
import Buycourse from "../Pages/Admin/Buynow/Buycourse.jsx";
// import AssignBatch from "../Pages/Admin/Batch/AssignBatch.jsx";
import RegisterEducator from "../Pages/Mentor/Educator/RegisterEducator.jsx";
import Educatorlistmentor from "../Pages/Mentor/Educator/Educatorlistmentor.jsx";
import Registerstudentmentor from "../Pages/Mentor/Students/Registerstudentmentor.jsx";
import Studentlistmentor from "../Pages/Mentor/Students/Studentlistmentor.jsx";
import CreatenewBatch from "../Pages/Mentor/Batches/CreatenewBatch.jsx";
import Batchlistmentor from "../Pages/Mentor/Batches/Batchlistmentor.jsx";
import Assignbatchmentor from "../Pages/Mentor/Batches/Assignbatchmentor.jsx";
import Createnotice from "../Pages/Mentor/Noticementor/Createnotice.jsx";
import Noticelistmentor from "../Pages/Mentor/Noticementor/Noticelistmentor.jsx";
import Createnewcourse from "../Pages/Mentor/Coursementor/Createnewcourse.jsx";
import Courselistmentor from "../Pages/Mentor/Coursementor/Courselistmentor.jsx";
import OrgenizeClass from "../Pages/Mentor/Classesmentor/OrgenizeClass.jsx";
import Classlistmentor from "../Pages/Mentor/Classesmentor/Classlistmentor.jsx";
import Createpractice from "../Pages/Mentor/Practicematerial/Createpractice.jsx";
import PracticematerialList from "../Pages/Mentor/Practicematerial/PracticematerialList.jsx";
import MentorBuycourse from "../Pages/Mentor/MentorBuy/MentorBuycourse.jsx";
import Educatordashboard from "../Pages/Educator/Educatordashboard.jsx";
import GetyourClass from "../Pages/Educator/Classes/GetyourClass.jsx";
import ChangeSchedulerequest from "../Pages/Educator/Classes/ChangeSchedulerequest.jsx";
import Addhomework from "../Pages/Educator/Homework/Addhomework.jsx";
import YourhomeworkList from "../Pages/Educator/Homework/YourhomeworkList.jsx";
import Educatorprofile from "../Pages/Educator/Educatorprofile.jsx";
import OurClasslist from "../Pages/Student/SelfClasss/OurClasslist.jsx";
import Gethomework from "../Pages/Student/StuHomework/Gethomework.jsx";
import Studentprofile from "../Pages/Student/Studentprofile.jsx";
import Homerequest from "../Pages/Admin/AdminHomework/Homerequest.jsx";
import MentorProfile from "../Pages/Mentor/MentorProfile.jsx";
import StudentDashboard from "../Pages/Student/StudentDashboard.jsx";
import SpecificStudent from "../Pages/Admin/Notice/SpecificStudent.jsx";
import SpecificEducator from "../Pages/Admin/Notice/SpecificEducator.jsx";
import SpecificMentor from "../Pages/Admin/Notice/SpecificMentor.jsx";
import Getstudentnotice from "../Pages/Mentor/Noticementor/Getstudentnotice.jsx";
import Geteducatornotice from "../Pages/Mentor/Noticementor/Geteducatornotice.jsx";
import Yournotice from "../Pages/Mentor/Noticementor/Yournotice.jsx";
import HomeworkrequestMentor from "../Pages/Mentor/Homeworkmentor/HomeworkrequestMentor.jsx";
import AssignCourse from "../Pages/Admin/Course/AssignCourse.jsx";
import CourseBatchList from "../Pages/Admin/Batch/CourseBatchList.jsx";
import MarkAttendace from "../Pages/Mentor/Attendance/MarkAttendace.jsx";
import ApplyAttendance from "../Pages/Mentor/Attendance/ApplyAttendance.jsx";
import StudentAttendance from "../Pages/Mentor/Attendance/StudentAttendance.jsx";
import CourseBatchListMentor from "../Pages/Mentor/Batches/CourseBatchListMentor.jsx";
import ForgetPassword from "../Pages/ForgetPassword.jsx";
import AssignBatchToStudent from "../Pages/Admin/Batch/AssignBatchToStudent.jsx";
import AssignBatchEducatorToMentor from "../Pages/Admin/AssignBatchEducatorToMentor.jsx";
import AllDatadEduStuAndBatch from "../Pages/Mentor/AllDatadEduStuAndBatch.jsx";
import AddClassNotes from "../Pages/Educator/Notes/AddClassNotes.jsx";

const Allmain = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    //       // Map routes to page titles
    const routeToTitle = {
      "/dashboard": "Dashboard",
      "/franchisedashboard": "Franchise dashboard",
      "/add-mentor": "Add Mentor",

      "/add-educator": "Add Educator",
      "/educator-list": "Educator List",
      "/create-batch": "Create Batch",
      "/add-notice": "Add Notice",
      "/all-notice": "All Notice",
      "/add-course": "All Course",
      "/class-list": "All Clasess",
      "/add-practicematerial": "Add Practice Material",
      "/all-material": "All Practice Material",
      "/create-coupon": "Create Discount Coupon",
      "/add-student": "Register Student",
      "/buynow": "Buy Course",
      "/course-batch-list": "Batch List",
      "/homework-request": "Home Work Request",
      "/student-notice": "Student Notice",
      "/educator-notice": "Educator Notice",
      "/mentor-notice": "Mentor Notice",
      "/assign-batch-student": "Assign Batch To Student",
      "/assign-mentor-batch-educator": "Assign Batch To Mentor",
      "/add-class-notes": "Add Class Notes",
      // "/assign-course":"Assign Course",

      // mentor routes

      "/register-educator": "Register Mentor",
      "/educator-list-mentor": "Educator List",
      "/register-student": "Register Student",
      "/student-list-mentor": "Students List",
      "/create-new-batch": "Create New Batch",
      "/batch-list": "Batch List",
      "/create-notice": "Create Notice",
      "/notice-list": "All Notice",
      "/all-course": "All Course List",
      "/orgenizeclass": "Orgenize Class",
      "/all-classes": "All Classes",
      "/create-practice": "Add Practice Material",
      "/all-practicematrial": "Practice Material",
      "/buy-course": "Buy Now",
      "/profile": "Mentor Profile",
      "/stunotice": "Student Notice",
      "/edunotice": "Educator Notice",
      "/yournotice": "Your Notice",
      "/home-work-request": "Home Work Requests",
      "/markattendance": "Mark Attendance",
      "/attendance": "Attendance",

      //  educaror
      "/get-your-class": "Your Classes",
      "/shedulechnage-requests": "Your Schedule Change Requests",
      "/give-homework": "Give Homework",
      "/homework-list": "Home Work List",
      "/educator-profile": "Profile",

      // student

      "/student-class": "Your Classes",
      "/student-homework": "Home Work",
      "/student-dashboard": "Student Dashboard",
      "/forget-password": "Forget Password",
      "/all-mentor-data": "Mentor Data",
    };

    const title = routeToTitle[location.pathname];
    if (title) {
      setPageTitle(title);
    } else {
      setPageTitle("");
    }
  }, [location.pathname]);
  return (
    <>
      <Header />
      <SideBar />
      <main
        id="main"
        className="main"
        style={{ background: "#99dee0", height: "auto" }}
      >
        {/* <PageTitle page={pageTitle} /> */}
        <Routes>
          {/* <Route path='/admindashboard' element={<Protected Component={AdminDashboard} />} /> */}
          <Route
            path="/admindashboard"
            element={<Protected Component={AdminDashboard} />}
          />
          <Route
            path="/franchisedashboard"
            element={<Protected Component={FranchiseDashboard} />}
          />
          <Route
            path="/add-mentor"
            element={<Protected Component={Addmentor} />}
          />
          <Route
            path="/add-educator"
            element={<Protected Component={AddEducator} />}
          />

          <Route path="/mentor-list" element={<Protected Component={Mentorlist} />} />
          <Route path="/educator-list" element={<Protected Component={Educatorlist} />} />

          {/* Batch Routes */}

          <Route path="/create-batch" element={<Protected Component={Createbatch} />} />
          <Route path="/allbtach" element={<Protected Component={Batchlist} />} />
          <Route path="/add-notice" element={<Protected Component={Addnotice} />} />
          <Route path="/all-notice" element={<Protected Component={Noticelist} />} />
          <Route path="/add-course" element={<Protected Component={Addcourse} />} />
          <Route path="/course-list" element={<Protected Component={Courselist} />} />
          <Route path="/create-class" element={<Protected Component={Createclass} />} />
          <Route path="/class-list" element={<Protected Component={Classeslist} />} />
          <Route
            path="/add-practicematerial"
            element={< Protected Component={Addpracticematerial} />}
          />
          <Route path="/all-material" element={<Protected Component={Allmaterial} />} />
          <Route path="/create-coupon" element={<Protected Component={CreatediscountCoupon} />} />
          <Route path="/add-student" element={<Protected Component={Regsiterstudent} />} />
          <Route path="/student-list" element={<Protected Component={Studentlist} />} />
          <Route path="/buynow" element={<Protected Component={Buycourse} />} />
          <Route path="/course-batch-list" element={<Protected Component={CourseBatchList} />} />
          <Route path="/homework-request" element={<Protected Component={Homerequest} />} />
          <Route path="/student-notice" element={<Protected Component={SpecificStudent} />} />
          <Route path="/educator-notice" element={<Protected Component={SpecificEducator} />} />
          <Route path="/mentor-notice" element={<Protected Component={SpecificMentor} />} />
          <Route
            path="/assign-batch-student"
            element={<Protected Component={AssignBatchToStudent} />}
          />

          {/*  */}
          {/* <Route path="/assign-course" element={<AssignCourse />} /> */}

          {/* mentor routes */}

          <Route path="/register-educator" element={<Protected Component={RegisterEducator} />} />
          <Route
            path="/educator-list-mentor"
            element={<Educatorlistmentor />}
          />
          <Route path="/register-student" element={<Protected Component={Registerstudentmentor} />} />
          <Route path="/student-list-mentor" element={<Protected Component={Studentlistmentor} />} />
          <Route path="/create-new-batch" element={<Protected Component={CreatenewBatch} />} />
          <Route path="/batch-list" element={<Protected Component={Batchlistmentor} />} />
          <Route path="/assign-batch" element={<Protected Component={Assignbatchmentor} />} />
          <Route path="/create-notice" element={<Protected Component={Createnotice} />} />
          <Route path="/notice-list" element={<Protected Component={Noticelistmentor} />} />
          <Route path="/create-course" element={<Protected Component={Createnewcourse} />} />
          <Route path="/all-course" element={<Protected Component={Courselistmentor} />} />
          <Route path="/orgenizeclass" element={<Protected Component={OrgenizeClass} />} />
          <Route path="/all-classes" element={<Protected Component={Classlistmentor} />} />
          <Route path="/create-practice" element={<Protected Component={Createpractice} />} />
          <Route
            path="/all-practicematrial"
            element={<Protected Component={PracticematerialList} />}
          />
          <Route path="/buy-course" element={<Protected Component={MentorBuycourse} />} />
          <Route path="/profile" element={<Protected Component={MentorProfile} />} />
          <Route path="/stunotice" element={<Protected Component={Getstudentnotice} />} />
          <Route path="/edunotice" element={<Protected Component={Geteducatornotice} />} />
          <Route path="/yournotice" element={<Protected Component={Yournotice} />} />
          <Route
            path="/home-work-request"
            element={<Protected Component={HomeworkrequestMentor} />}
          />
          <Route path="/markattendance" element={<Protected Component={MarkAttendace} />} />
          <Route path="/attendance" element={<Protected Component={ApplyAttendance} />} />
          <Route path="/studentattendance" element={<Protected Component={StudentAttendance} />} />
          <Route
            path="/batch-course-list"
            element={<Protected Component={CourseBatchListMentor} />}
          />

          {/* educators routes */}

          <Route path="/educatordashboard" element={<Protected Component={Educatordashboard} />} />
          <Route path="/get-your-class" element={<Protected Component={GetyourClass} />} />
          <Route
            path="/shedulechnage-requests"
            element={<Protected Component={ChangeSchedulerequest} />}
          />
          <Route path="/give-homework" element={<Protected Component={Addhomework} />} />
          <Route path="/homework-list" element={<Protected Component={YourhomeworkList} />} />
          <Route path="/educator-profile" element={<Protected Component={Educatorprofile} />} />

          {/* student routes */}

          <Route path="/student-class" element={<Protected Component={OurClasslist} />} />
          <Route path="/student-homework" element={<Protected Component={Gethomework} />} />
          <Route path="/student-profile" element={<Protected Component={Studentprofile} />} />
          <Route path="/student-dashboard" element={<Protected Component={StudentDashboard} />} />
          <Route path="/forget-password" element={<Protected Component={ForgetPassword} />} />
          <Route
            path="/assign-mentor-batch-educator"
            element={<Protected Component={AssignBatchEducatorToMentor} />}
          />
          <Route path="/all-mentor-data" element={<Protected Component={AllDatadEduStuAndBatch} />} />
          <Route path="/add-class-notes" element={<Protected Component={AddClassNotes} />} />
          {/* user Billing routes */}
        </Routes>
      </main>
    </>
  );
};

export default Allmain;
