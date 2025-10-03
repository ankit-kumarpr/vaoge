import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Link,
  Chip,
  TextField,
  Grid
} from '@mui/material';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
  const token = sessionStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState({
    courses: false,
    batches: false,
    classes: false
  });
  const [error, setError] = useState('');

  // Format today's date as YYYY-MM-DD for the input field
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    getCourseList();
  }, []);

  const navigate=useNavigate();

  const handleAttendace = (classId) => {
    navigate("/attendance", { state: { classId } });
    
  };

  // Fetch batches when course changes
  useEffect(() => {
    if (selectedCourse) {
      getBatchList(selectedCourse);
      setSelectedBatch('');
      setAllClasses([]);
      setFilteredClasses([]);
    }
  }, [selectedCourse]);

  // Fetch classes when batch changes
  useEffect(() => {
    if (selectedBatch) {
      getClassListBatchWise(selectedBatch);
    }
  }, [selectedBatch]);

  // Filter classes when date or allClasses changes
  useEffect(() => {
    if (allClasses.length > 0 && selectedDate) {
      filterClassesByDate();
    }
  }, [selectedDate, allClasses]);

  const filterClassesByDate = () => {
    const filtered = allClasses.filter(cls => {
      if (!cls.classDate) return false;
      const classDate = new Date(cls.classDate).toISOString().split('T')[0];
      return classDate === selectedDate;
    });
    setFilteredClasses(filtered);
  };

  const getCourseList = async () => {
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      setError('');
      const response = await axios.get(`${BASE_URL}/admin/getcourse`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError('Failed to load courses. Please refresh the page.');
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const getBatchList = async (courseId) => {
    try {
      setLoading(prev => ({ ...prev, batches: true }));
      setError('');
      const response = await axios.get(`${BASE_URL}/admin/courseBatch/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const batchesData = response.data.data.flat();
      setBatches(batchesData || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setError('Failed to load batches. Please try selecting the course again.');
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  const getClassListBatchWise = async (batchId) => {
    try {
      setLoading(prev => ({ ...prev, classes: true }));
      setError('');
      const response = await axios.get(`${BASE_URL}/admin/getbatchclass/${batchId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const classesData = response.data.data.flat().filter(cls => cls) || [];
      setAllClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError('Failed to load class schedule. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const formatClassDays = (days) => {
    if (!days || !Array.isArray(days)) return 'N/A';
    return days.join(', ');
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageTitle page="Mark Attendance" />
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Select Course and Batch
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="course-select-label">Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourse}
                label="Course"
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={loading.courses}
              >
                <MenuItem value="">
                  <em>{loading.courses ? 'Loading courses...' : 'Select a course'}</em>
                </MenuItem>
                {courses.map(course => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.coursename}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="batch-select-label">Batch</InputLabel>
              <Select
                labelId="batch-select-label"
                id="batch-select"
                value={selectedBatch}
                label="Batch"
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={!selectedCourse || loading.batches}
              >
                <MenuItem value="">
                  <em>{loading.batches ? 'Loading batches...' : 'Select a batch'}</em>
                </MenuItem>
                {batches.map(batch => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {selectedBatch && (
        <Paper elevation={3} sx={{ overflow: 'hidden', mb: 4 }}>
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h2">
                  Class Schedule for {batches.find(b => b._id === selectedBatch)?.batchname || 'Selected Batch'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="date"
                  label="Select Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          
          {loading.classes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredClasses.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Class Link</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClasses.map((cls) => (
                    <TableRow key={cls._id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {cls.classname || 'Unnamed Class'}
                        </Typography>
                        <Chip 
                          label={cls.batchname} 
                          size="small" 
                          sx={{ mt: 1 }} 
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        {formatDisplayDate(cls.classDate)}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatClassDays(cls.classShedule?.days)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cls.classShedule?.time || 'No time specified'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {cls.classlink ? (
                          <Link href={cls.classlink} target="_blank" rel="noopener">
                            Join Class
                          </Link>
                        ) : (
                          'No link provided'
                        )}
                      </TableCell>
                      <TableCell align="right">
  <Button 
    variant="contained" 
    color="primary"
    size="small"
    onClick={() => handleAttendace(cls._id)} // Pass class ID here
  >
    Mark Attendance
  </Button>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {allClasses.length > 0 
                  ? 'No classes scheduled for the selected date' 
                  : 'No classes scheduled for this batch'}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default MarkAttendance;