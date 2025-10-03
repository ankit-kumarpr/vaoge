import React, { useState } from "react";
import "./sidebar.css";

import { FaUsers } from "react-icons/fa";
import { RiBriefcase4Fill } from "react-icons/ri";
import { IoGridOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdHistoryEdu } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import {
  MdOutlineCategory,
  MdEditDocument,
  MdOutlineCastForEducation,
} from "react-icons/md";
import {
  PiChalkboardTeacherFill,
  PiStudentBold,
  PiOfficeChairBold,
} from "react-icons/pi";
import { Link } from "react-router-dom";
import { RiDiscountPercentLine, RiFileList3Fill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";

const SideBar = () => {
  let role = "";

  const [dropdowns, setDropdowns] = useState({
    employees: false,
    categorys: false,
    educator: false,
    product: false,
    drivers: false,
    proposals: false,
    leave: false,
    batch: false,
    notice: false,
    course: false,
    classes: false,
    material: false,
    coupon: false,
    student: false,
    homeworkadmin: false,
    // mentor
    mentoreducator: false,
    studentmentor: false,
    batchmentor: false,
    noticementor: false,
    coursementor: false,
    classesmentor: false,
    materialmentor: false,
    homeworkmentor: false,
    attendance: false,

    // educator

    educatorclass: false,
    homework: false,

    // student
    studentclass: false,
    studenthomework: false,
  });

  const toggleDropdown = (name) => {
    setDropdowns({ ...dropdowns, [name]: !dropdowns[name] });
  };
  role = sessionStorage.getItem("role");
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {/* <li className='nav-item'>
                    <Link className='nav-link' to='/dashboard'>
                        <IoGridOutline size={20} />
                        <span className='nav-heading collapsed'>Dashboard</span>
                    </Link>
                </li> */}
        {role === "admin" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/admindashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Admin Dashboard</span>
              </Link>
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("categorys")}
              >
                <PiChalkboardTeacherFill size={20} />
                <span className="nav-heading collapsed">Mentor</span>
              </div>
              {dropdowns.categorys && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-mentor" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Add Mentor</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/mentor-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Mentor list</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/assign-mentor-batch-educator" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Assign Educator</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("educator")}
              >
                <MdOutlineCastForEducation size={20} />
                <span className="nav-heading collapsed">Educator</span>
              </div>
              {dropdowns.educator && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-educator" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add Educator
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/educator-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Educator list
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("student")}
              >
                <PiStudentBold size={20} />
                <span className="nav-heading collapsed">Student</span>
              </div>
              {dropdowns.student && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-student" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Register Student
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/student-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Student list
                      </span>
                    </Link>
                  </li>
                  {/* <li className="ps-3">
                    <Link to="/buynow" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Buy Course
                      </span>
                    </Link>
                  </li> */}
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div className="nav-link" onClick={() => toggleDropdown("batch")}>
                <PiOfficeChairBold size={20} />
                <span className="nav-heading collapsed">Batch</span>
              </div>
              {dropdowns.batch && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-batch" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create Batch
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/assign-batch-student" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Assign Batch
                      </span>
                    </Link>
                  </li>

                  {/* <li className="ps-3">
                    <Link to="/assign-batch" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Assign Batch
                      </span>
                    </Link>
                  </li> */}
                  <li className="ps-3">
                    <Link to="/allbtach" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">All Batches</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/course-batch-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Batch list as course
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("notice")}
              >
                <MdEditDocument size={20} />
                <span className="nav-heading collapsed">Notice</span>
              </div>
              {dropdowns.notice && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Add Notice</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">All Notice</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/student-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Student Notice
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/educator-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Educator Notice
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/mentor-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Mentor Notice
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("course")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Course</span>
              </div>
              {dropdowns.course && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-course" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Add Course</span>
                    </Link>
                  </li>
                  {/* <li className="ps-3">
                    <Link to="/assign-course" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Assign Course</span>
                    </Link>
                  </li> */}
                  <li className="ps-3">
                    <Link to="/course-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Course List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("classes")}
              >
                <SiGoogleclassroom size={20} />
                <span className="nav-heading collapsed">Classes</span>
              </div>
              {dropdowns.classes && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-class" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create Class
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/class-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Class List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("material")}
              >
                <RiFileList3Fill size={20} />
                <span className="nav-heading collapsed">Practice Material</span>
              </div>
              {dropdowns.material && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/add-practicematerial" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add Practice Material
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-material" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        All Practice Material
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("homeworkadmin")}
              >
                <FaBook size={20} />
                <span className="nav-heading collapsed">Home Work</span>
              </div>
              {dropdowns.homeworkadmin && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/homework-request" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        All Home Wrok Requests
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-material" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        All Practice Matrial
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-coupon">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Discount</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forget-password">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Forget Password</span>
              </Link>
            </li>
          </>
        )}

        {role === "mentor" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/franchisedashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Mentor Dashboard</span>
              </Link>
            </li>

            {/* <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("mentoreducator")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Educator</span>
              </div>
              {dropdowns.mentoreducator && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/register-educator" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Register Educator
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/educator-list-mentor" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Educator list
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("studentmentor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Student</span>
              </div>
              {dropdowns.studentmentor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/register-student" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Register Student
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/student-list-mentor" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Student list
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}

            {/* <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("batchmentor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Batch</span>
              </div>
              {dropdowns.batchmentor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-new-batch" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create New Batch
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/batch-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">All Batches</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/batch-course-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Course Batch List
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/assign-batch" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Assign Batch
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("noticementor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Notice</span>
              </div>
              {dropdowns.noticementor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-notice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create Notice
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/notice-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">All Notice</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/yournotice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Your Notice</span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/stunotice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Student Notice
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/edunotice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Educator Notice
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("coursementor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Course</span>
              </div>
              {dropdowns.coursementor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-course" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create New Course
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-course" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Course List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("classesmentor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Classes</span>
              </div>
              {dropdowns.classesmentor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/orgenizeclass" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Create Class
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-classes" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">Class List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("materialmentor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Practice Material</span>
              </div>
              {dropdowns.materialmentor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/create-practice" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add Practice materil
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/all-practicematrial" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        All Practice Matrial
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("homeworkmentor")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Home Work</span>
              </div>
              {dropdowns.homeworkmentor && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/home-work-request" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Home Work Request
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("attendance")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Attendance</span>
              </div>
              {dropdowns.attendance && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/markattendance" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Mark Attendance
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/studentattendance" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Student Attendacnce
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/all-mentor-data">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Your Work</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forget-password">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Foeget Password</span>
              </Link>
            </li>
          </>
        )}

        {role === "educator" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/educatordashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  Educator Dashboard
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("educatorclass")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Your Classes</span>
              </div>
              {dropdowns.educatorclass && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/get-your-class" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Get Your Classes
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/shedulechnage-requests" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Your Schedule requests
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("homework")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Home Work</span>
              </div>
              {dropdowns.homework && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/give-homework" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add Home Work
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/homework-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Home Work Request
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/educator-profile">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-class-notes">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Add Class Notes</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forget-password">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Foeget Password</span>
              </Link>
            </li>
          </>
        )}

        {role === "student" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/student-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Student Dashboard</span>
              </Link>
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("studentclass")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Your Classes</span>
              </div>
              {dropdowns.studentclass && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/student-class" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Get Your Classes
                      </span>
                    </Link>
                  </li>
                  {/* <li className="ps-3">
                    <Link to="/shedulechnage-requests" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Your Schedule requests
                      </span>
                    </Link>
                  </li> */}
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("studenthomework")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Home Work</span>
              </div>
              {dropdowns.studenthomework && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/student-homework" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        your home work
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/homework-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Home Work Request
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/student-profile">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forget-password">
                <RiDiscountPercentLine size={20} />
                <span className="nav-heading collapsed">Foeget Password</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
