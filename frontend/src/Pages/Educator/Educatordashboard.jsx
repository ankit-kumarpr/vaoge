import React, { useEffect, useState } from "react";
import { FaUsers, FaArrowUp, FaRegSmile, FaRegNewspaper } from "react-icons/fa";
import { MdOutlineQueryStats } from "react-icons/md";
import { TbTruckDelivery, TbShoppingCartDiscount } from "react-icons/tb";
import { SiCodementor, SiGoogleclassroom } from "react-icons/si";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { DataGrid } from "@mui/x-data-grid";
import { jwtDecode } from 'jwt-decode';
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
  Button
} from "@mui/material";
import BASE_URL from "../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
// import "./admin.css";

const Educatordashboard = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
    const userId1 = decodedToken.userId;
    const user = decodedToken.role;
  const navigate = useNavigate();

 
  
  

 
  const [noticeData, setNoticeData] = useState(0);
  const [data,setclassessdata]=useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          // Getyourclassess(),
          TotalNotice(),
          Myprofile(),
          TotalCourse(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 
// const Getyourclassess=async()=>{
//   try{

//     const url=`${BASE_URL}/admin/geteducatorclass/${userId1}`;

//     const headers={
//       "Content-Type":"application/json",
//       Accept:"application/json",
//       Authorization:`Bearer ${token}`
//     }

//     const response=await axios.get(url,{headers:headers});
//     console.log("Response fo get class",response.data);
//     setclassessdata(response.data.data);
//   }
//   catch(error){
//     console.log(error);
//   }
// }
 

  

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

  

  const Myprofile=async()=>{
    try{

      const url=`${BASE_URL}/admin/profile/${userId1}/${user}`;
      const headers={
        "Content-Type":"application/json",
        Accept:"application/json",
        Authorization:`Bearer ${token}`
      }
      const response=await axios.get(url,{headers:headers});
      // console.log("response of profile",response.data);
      
      setAdminProfile(response.data.data);
    }
    catch(error){
      // console.log(error);
    }
  }
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

  const cardData = [
  
   
    
  
    {
      title: "Total Notices",
      value: noticeData,
      percentage: "+15%",
      icon: <FaRegNewspaper />,
      iconBg: "#de2768",
      move: "/notice-list",
      trend: "up",
    },
  ];

  

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={"Educator Dashboard"} />
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
      background: "linear-gradient(135deg, #ff9800 0%, #ff5722 100%)",
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
      {adminProfile ? `${adminProfile.firstname} ${adminProfile.lastname}` : 'Admin Dashboard'}
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
      {adminProfile ? `Welcome back, ${adminProfile.firstname}` : 'Welcome back, Administrator'}
    </Typography>
    <Typography variant="caption" sx={{ opacity: 0.8 }}>
      {adminProfile?.email}
    </Typography>
    <Chip
      label={adminProfile?.role || 'Super Admin'}
      size="small"
      sx={{ 
        mt: 2, 
        color: "white", 
        bgcolor: "rgba(255,255,255,0.2)",
        textTransform: 'capitalize'
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
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Chip
                    label={card.percentage}
                    size="small"
                    icon={
                      card.trend === "up" ? (
                        <FaArrowUp style={{ fontSize: "0.75rem" }} />
                      ) : (
                        <FaArrowUp
                          style={{ transform: "rotate(180deg)", fontSize: "0.75rem" }}
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
  {/* <Grid item xs={12} md={8}>
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      p: 2,
      background: "linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)",
      borderLeft: "4px solid #3f51b5",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        transform: "translateY(-2px)"
      }
    }}
  >
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      mb: 2,
      p: 1,
      background: "linear-gradient(to right, #3f51b5, #2196f3)",
      borderRadius: 2,
      color: "white"
    }}>
      <FaUsers style={{ marginRight: 10, fontSize: 24 }} />
      <Typography variant="h6" fontWeight="bold">
        Today's Classes
      </Typography>
    </Box>
    
    {data && data.length > 0 ? (
      
      <Grid container spacing={2}>
        {data
          .filter(classItem => {
            const classDate = new Date(classItem.classDate);
            const today = new Date();
            return (
              classDate.getDate() === today.getDate() &&
              classDate.getMonth() === today.getMonth() &&
              classDate.getFullYear() === today.getFullYear()
            );
          })
          .map((classItem, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  background: "linear-gradient(to right, #f8f9fa, #ffffff)",
                  borderLeft: "4px solid #4caf50",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  {classItem.classname}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Batch:</strong> {classItem.batchId?.batchname || "N/A"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Time:</strong> {classItem.classShedule?.time || "N/A"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {new Date(classItem.classDate).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  href={classItem.classlink}
                  target="_blank"
                  sx={{ mt: 1 }}
                >
                  Join Class
                </Button>
              </Card>
            </Grid>
          ))}
      </Grid>
    ) : (
     
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          textAlign: "center"
        }}
      >
       
        <Typography variant="h6" color="textSecondary">
          No classes scheduled for today
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Check back later or view upcoming classes
        </Typography>
      </Box>
    )}
  </Card>
</Grid> */}

  {/* Top Courses */}
  <Grid item xs={12} md={12}>
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        p: 2,
        background: "linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)",
        borderLeft: "4px solid #ff9800",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        mb: 2,
        p: 1,
        background: "linear-gradient(to right, #ff9800, #ffc107)",
        borderRadius: 2,
        color: "white"
      }}>
        <MdOutlineQueryStats style={{ marginRight: 10, fontSize: 24 }} />
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
                background: index % 2 === 0 
                  ? "linear-gradient(to right, #f5f5f5, #ffffff)"
                  : "linear-gradient(to right, #ffffff, #f5f5f5)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  background: "linear-gradient(to right, #e3f2fd, #bbdefb)"
                }
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
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
                    fontSize: "0.95rem"
                  }}
                >
                  {course.coursename}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                    alignItems: "center"
                  }}
                >
                  <Chip 
                    label={`₹${course.price}`} 
                    size="small" 
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: "0.75rem"
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
                      fontWeight: 500
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
                      textTransform: "none"
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

export default Educatordashboard;