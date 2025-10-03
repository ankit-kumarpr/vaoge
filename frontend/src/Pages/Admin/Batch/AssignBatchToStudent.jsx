import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../../config';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import PageTitle from '../../../components/PageTitle';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const AssignBatchToStudent = () => {
  const token = sessionStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState({
    courses: false,
    batches: false,
    students: false,
    submitting: false
  });

  useEffect(() => {
    GetStudentList();
    Getallcourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      BatchlistAPI(selectedCourse);
    } else {
      setBatches([]);
      setSelectedBatch('');
    }
  }, [selectedCourse]);

const navigate=useNavigate();

  const GetStudentList = async () => {
    try {
      setLoading(prev => ({ ...prev, students: true }));
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of student api", response.data);
      if (response.data.error === false) {
        setStudents(response.data.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const Getallcourses = async () => {
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      const url = `${BASE_URL}/admin/getcourse`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of course list", response.data);
      if (response.data.error === false) {
        setCourses(response.data.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const BatchlistAPI = async (courseId) => {
    try {
      setLoading(prev => ({ ...prev, batches: true }));
      const url = `${BASE_URL}/admin/courseBatch/${courseId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of batch list", response.data);
      if (response.data.error === false) {
        const batchList = response.data.data[0] || [];
        setBatches(batchList);
      }
    } catch (error) {
      // console.log(error);
      setBatches([]);
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student._id));
    }
  };

  const AssignBatchToStudentAPI = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      alert('Please select a batch and at least one student');
      return;
    }
  
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const url = `${BASE_URL}/admin/assignbatchtostudent`; // Added /api to the path
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      
      // Modified request body structure based on common API patterns
      const requestBody = {
        batchId: selectedBatch, // Changed to batch_id (common API convention)
        studentIds: selectedStudents // Changed to student_ids array
      };
      
      // console.log("Request body for assigning batch to student", requestBody);
      const response = await axios.post(url, requestBody, { headers });
      // console.log("Response of assign batch to student", response.data);
      
      if (response.data.error === false) {
        Swal.fire({
          title: "Good job!",
          text: "Batch Assign Student Successfully",
          icon: "success"
        }).then(()=>{
          navigate('/admindashboard')
        });
        setSelectedBatch('');
        setSelectedStudents([]);
        GetStudentList();
      } else {
        // Handle API-specific error messages
        alert(response.data.message || 'Failed to assign batch');
      }
    } catch (error) {
      // console.log("Error details:", error);
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        alert(error.response.data.message || 'Failed to assign batch. Server error.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        alert('Request setup error: ' + error.message);
      }
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <>
      <PageTitle page="Assign Batch to Students" />
      <Container maxWidth="lg">
        <StyledCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
                <Typography variant="h4">B</Typography>
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Batch Assignment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assign students to course batches
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              {/* Course and Batch Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" disabled={loading.courses}>
                  <InputLabel id="course-select-label">Select Course</InputLabel>
                  <Select
                    labelId="course-select-label"
                    id="course-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    label="Select Course"
                  >
                    {loading.courses ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} />
                      </MenuItem>
                    ) : (
                      courses.map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={course.courseimage} 
                              sx={{ width: 24, height: 24, mr: 2 }}
                            />
                            {course.coursename}
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" disabled={!selectedCourse || loading.batches}>
                  <InputLabel id="batch-select-label">Select Batch</InputLabel>
                  <Select
                    labelId="batch-select-label"
                    id="batch-select"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    label="Select Batch"
                  >
                    {loading.batches ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} />
                      </MenuItem>
                    ) : batches.length > 0 ? (
                      batches.map((batch) => (
                        <MenuItem key={batch._id} value={batch._id}>
                          <Box>
                            <Typography>{batch.batchname}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {batch.schedule?.days?.join(", ")} • {batch.schedule?.time}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {selectedCourse ? "No batches available" : "Select a course first"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Student List */}
              <Grid item xs={12}>
                <SectionHeader variant="h6">Student List</SectionHeader>
                <Paper elevation={2} sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {loading.students ? (
                    <Box display="flex" justifyContent="center" p={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List dense>
                      <ListItem button onClick={handleSelectAll}>
                        <ListItemText 
                          primary={
                            <Typography fontWeight="bold">
                              {selectedStudents.length === students.length ? 
                                "Deselect All" : "Select All"}
                            </Typography>
                          } 
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            checked={selectedStudents.length === students.length && students.length > 0}
                            indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                            onChange={handleSelectAll}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {students.map((student) => (
                        <ListItem key={student._id} button onClick={() => handleStudentSelect(student._id)}>
                          <Avatar 
                            src={student.profile} 
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <ListItemText 
                            primary={`${student.firstname} ${student.lastname}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {student.enrollmentnumber}
                                </Typography>
                                {` • ${student.email}`}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleStudentSelect(student._id)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={AssignBatchToStudentAPI}
                    disabled={loading.submitting || !selectedBatch || selectedStudents.length === 0}
                    size="large"
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: "8px",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem"
                    }}
                  >
                    {loading.submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Assign Batch"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Container>
    </>
  );
};

export default AssignBatchToStudent;