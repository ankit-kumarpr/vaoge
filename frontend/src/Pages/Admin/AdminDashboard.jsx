import React, { useEffect, useState } from "react";
import { FaUsers, FaArrowUp, FaRegSmile, FaRegNewspaper } from "react-icons/fa";
import { MdOutlineQueryStats } from "react-icons/md";
import { TbTruckDelivery, TbShoppingCartDiscount } from "react-icons/tb";
import { SiCodementor, SiGoogleclassroom } from "react-icons/si";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { DataGrid } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Avatar,
  Box,
  LinearProgress,
  Chip,
  Button,
} from "@mui/material";
import BASE_URL from "../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import "./admin.css";

const AdminDashboard = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId1 = decodedToken.userId;
  const user = decodedToken.role;
  const navigate = useNavigate();

  const [mentors, setMentors] = useState(0);
  const [educators, setEducators] = useState(0);
  const [studentsData, setAllStudents] = useState(0);
  const [students, setStudents] = useState([]);
  const [batches, setBatchData] = useState(0);
  const [discountCoupons, setDiscountCoupons] = useState(0);
  const [noticeData, setNoticeData] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          TotalMentors(),
          TotalEducators(),
          TotalStudents(),
          TotalBatches(),
          TotalDiscountCoupons(),
          TotalNotice(),
          TotalCourse(),
          Myprofile(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const TotalMentors = async () => {
    try {
      const url = `${BASE_URL}/admin/getallmentor`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setMentors(response.data.data.length);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalEducators = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setEducators(response.data.data.length);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalStudents = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setAllStudents(response.data.data.length);
      setStudents(response.data.data || []);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalBatches = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setBatchData(response.data.data.length);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalDiscountCoupons = async () => {
    try {
      const url = `${BASE_URL}/common/allcoupon`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setDiscountCoupons(response.data.data.length);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalNotice = async () => {
    try {
      const url = `${BASE_URL}/admin/getnotice`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setNoticeData(response.data.data.length);
    } catch (error) {
      // console.log(error);
    }
  };

  const TotalCourse = async () => {
    try {
      const url = `${BASE_URL}/admin/getcourse`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      setCourses(response.data.data.slice(0, 3)); // Show only top 3 courses
    } catch (error) {
      // console.log(error);
    }
  };

  const Myprofile = async () => {
    try {
      const url = `${BASE_URL}/admin/profile/${userId1}/${user}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("response of profile", response.data);

      setAdminProfile(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const cardData = [
    {
      title: "Total Mentors",
      value: mentors,
      percentage: "+30%",
      icon: <SiCodementor />,
      iconBg: "#3c96ef",
      move: "/mentor-list",
      trend: "up",
    },
    {
      title: "Total Educators",
      value: educators,
      percentage: "+23%",
      icon: <GiTeacher />,
      iconBg: "#51ab55",
      move: "/educator-list",
      trend: "up",
    },
    {
      title: "Total Students",
      value: studentsData,
      percentage: "-10%",
      icon: <PiStudentBold />,
      iconBg: "#ff7400",
      move: "/student-list",
      trend: "down",
    },
    {
      title: "Total Batches",
      value: batches,
      percentage: "+5%",
      icon: <SiGoogleclassroom />,
      iconBg: "#635bff",
      move: "/allbtach",
      trend: "up",
    },
    {
      title: "Discount Coupons",
      value: discountCoupons,
      percentage: "-10%",
      icon: <TbShoppingCartDiscount />,
      iconBg: "#ff0000",
      move: "/create-coupon",
      trend: "down",
    },
    {
      title: "Total Notices",
      value: noticeData,
      percentage: "+15%",
      icon: <FaRegNewspaper />,
      iconBg: "#de2768",
      move: "/all-notice",
      trend: "up",
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "enrollmentnumber", headerName: "Enrollment No.", width: 150 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    // { field: "phone", headerName: "Phone", width: 130 },
    { field: "batchname", headerName: "Batch", width: 180 },
  ];

  const rows = students.map((student, index) => ({
    id: index + 1,
    enrollmentnumber: student.enrollmentnumber,
    firstname: student.firstname,
    lastname: student.lastname,
    phone: student.phone,
    batchname: student.batchId?.batchname || "N/A",
  }));


 

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={"Admin Dashboard"} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Profile Section (Left Side) */}
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                boxShadow: 3,
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #4fcfd2, #01a2a6)",
                color: "white",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  border: "3px solid white",
                  bgcolor: "secondary.main",
                }}
              >
                {adminProfile?.firstname?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {adminProfile
                  ? `${adminProfile.firstname} ${adminProfile.lastname}`
                  : "Admin Dashboard"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {adminProfile
                  ? `Welcome back, ${adminProfile.firstname}`
                  : "Welcome back, Administrator"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {adminProfile?.email}
              </Typography>
              <Chip
                label={adminProfile?.role || "Super Admin"}
                size="small"
                sx={{
                  mt: 2,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.2)",
                  textTransform: "capitalize",
                }}
              />
            </Card>
          </Grid>

          {/* Stats Cards (Right Side) */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {cardData.map((card, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: 20,
                        width: 60,
                        height: 60,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: card.iconBg,
                        color: "white",
                        fontSize: "1.75rem",
                        boxShadow: 3,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                      <Link
                        to={card.move}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {card.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {card.value}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Chip
                            label={card.percentage}
                            size="small"
                            icon={
                              card.trend === "up" ? (
                                <FaArrowUp style={{ fontSize: "0.75rem" }} />
                              ) : (
                                <FaArrowUp
                                  style={{
                                    transform: "rotate(180deg)",
                                    fontSize: "0.75rem",
                                  }}
                                />
                              )
                            }
                            color={card.trend === "up" ? "success" : "error"}
                            sx={{
                              fontSize: "0.75rem",
                              height: "20px",
                              mr: 1,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Since last month
                          </Typography>
                        </Box>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Student List Table */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                p: 2,
                background:
                  "linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)",
                borderLeft: "4px solid #3f51b5",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 1,
                  background: "linear-gradient(135deg, #48CFCB, #01a2a6)",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <FaUsers style={{ marginRight: 10, fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold">
                  Student List
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  "& .MuiDataGrid-root": {
                    border: "none",
                    fontFamily: "'Roboto', sans-serif",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    color: "#3f51b5",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": {
                      color: "#2196f3",
                      fontWeight: 500,
                    },
                  },
                  "& .MuiDataGrid-row": {
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9f9f9",
                    },
                    "&:hover": {
                      backgroundColor: "#f0f7ff",
                    },
                  },
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableSelectionOnClick
                  components={{
                    Pagination: () => (
                      <Box
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Showing {Math.min(rows.length, 5)} of {rows.length}{" "}
                          students
                        </Typography>
                      </Box>
                    ),
                  }}
                />
              </Box>
            </Card>
          </Grid>

          {/* Top Courses */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                p: 2,
                background:
                  "linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)",
                borderLeft: "4px solid #ff9800",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 1,
                  background: "linear-gradient(to right, #ff9800, #ffc107)",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <MdOutlineQueryStats
                  style={{ marginRight: 10, fontSize: 24 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  Featured Courses
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {courses.map((course, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        p: 1.5,
                        background:
                          index % 2 === 0
                            ? "linear-gradient(to right, #f5f5f5, #ffffff)"
                            : "linear-gradient(to right, #ffffff, #f5f5f5)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                          background:
                            "linear-gradient(to right, #e3f2fd, #bbdefb)",
                        },
                      }}
                    >
                      <Avatar
                        variant="square"
                        src={`http://localhost:4500${course.courseimage}`}
                        alt={course.coursename}
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          borderRadius: 1,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          noWrap
                          sx={{
                            maxWidth: "200px",
                            color: "#1a237e",
                            fontSize: "0.95rem",
                          }}
                        >
                          {course.coursename}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5,
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={`₹${course.price}`}
                            size="small"
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              backgroundColor: "#e8f5e9",
                              p: "2px 8px",
                              borderRadius: 2,
                              color: "#2e7d32",
                              fontWeight: 500,
                            }}
                          >
                            {course.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              fontSize: "0.7rem",
                              p: "2px 8px",
                              textTransform: "none",
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
