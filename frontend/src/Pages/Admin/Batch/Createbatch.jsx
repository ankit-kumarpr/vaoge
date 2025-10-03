import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Grid, 
  Typography,
  Paper,
  Chip,
  Avatar,
  Box,
  Divider,
  useTheme
} from '@mui/material';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import {
  Schedule as ScheduleIcon,
  Class as ClassIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

const Createbatch = () => {
  const theme = useTheme();
  const token = sessionStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchname: "",
    courseId: "",
    mentorId: "",
    educators: [],
    students: [],
    schedule: {
      days: [],
      time: ""
    }
  });

  // Days options for the dropdown
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    Getcourselist();
  }, []);

  const Getcourselist = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/getcourse`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers: headers });
      if (response.data && !response.data.error) {
        setCourses(response.data.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/addbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.post(url, formData, { headers: headers });
      
      if(response.data.error === false) {
        Swal.fire({
          title: "Success!",
          text: "Batch Created Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
        setFormData({
          batchname: "",
          courseId: "",
          mentorId: "",
          educators: [],
          students: [],
          schedule: {
            days: [],
            time: ""
          }
        });
      }
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create batch",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCourse = () => {
    return courses.find(course => course._id === formData.courseId);
  };

  return (
    <>
      <PageTitle page={"Create New Batch"} />
      {/* <Container maxWidth="lg" sx={{ py: 4 }}> */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[4]
          }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.main
            }}>
              <ClassIcon sx={{ mr: 1 }} /> Batch Information
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Batch Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Batch Name"
                    name="batchname"
                    value={formData.batchname}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <PeopleIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                </Grid>

                {/* Course Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Course</InputLabel>
                    <Select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    >
                      {courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {course.courseimage && (
                              <Avatar 
                                src={`${BASE_URL}${course.courseimage}`} 
                                sx={{ width: 30, height: 30, mr: 2 }}
                              />
                            )}
                            <Box>
                              <Typography>{course.coursename}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                ₹{course.price} • {course.duration}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Selected Course Info */}
                {formData.courseId && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      background: theme.palette.background.default
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Selected Course:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getSelectedCourse()?.courseimage && (
                          <Avatar 
                            src={`${BASE_URL}${getSelectedCourse()?.courseimage}`} 
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                        )}
                        <Box>
                          <Typography variant="h6">
                            {getSelectedCourse()?.coursename}
                          </Typography>
                          <Box sx={{ display: 'flex', mt: 1 }}>
                            <Chip 
                              label={`₹${getSelectedCourse()?.price}`} 
                              size="small" 
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={getSelectedCourse()?.duration} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`GST: ${getSelectedCourse()?.gst}%`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )}

                {/* <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid> */}

                {/* Schedule Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main
                  }}>
                    <ScheduleIcon sx={{ mr: 1 }} /> Schedule Details
                  </Typography>
                </Grid>

                {/* Days Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Days</InputLabel>
                    <Select
                      name="days"
                      multiple
                      value={formData.schedule.days}
                      onChange={(e) => handleScheduleChange({ 
                        target: { name: "days", value: e.target.value } 
                      })}
                      required
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {daysOptions.map((day) => (
                        <MenuItem key={day} value={day}>
                          <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Time Selection */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Schedule Time"
                    name="time"
                    type="time"
                    value={formData.schedule.time}
                    onChange={handleScheduleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                      }
                    }}
                  >
                    {loading ? 'Creating Batch...' : 'Create Batch'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      {/* </Container> */}
    </>
  );
};

export default Createbatch;