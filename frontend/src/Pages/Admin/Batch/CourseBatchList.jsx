import React, { useEffect, useState } from 'react';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  useTheme,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Badge,
  IconButton,
  Tooltip,
  Button 
} from '@mui/material';
import {
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const CourseBatchList = () => {
  const theme = useTheme();
  const token = sessionStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    batches: false
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches(selectedCourse._id);
    } else {
      setBatches([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      const response = await axios.get(`${BASE_URL}/admin/getcourse`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data?.error === false) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      showError('Failed to load courses');
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchBatches = async (courseId) => {
    try {
      setLoading(prev => ({ ...prev, batches: true }));
      const response = await axios.get(`${BASE_URL}/admin/courseBatch/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data?.error === false) {
        // Flatten the nested array structure from the API response
        const batchesData = response.data.data.flat();
        setBatches(batchesData);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      showError('Failed to load batches');
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  const showError = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      background: theme.palette.background.paper,
      color: theme.palette.text.primary
    });
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    const selected = courses.find(course => course._id === courseId);
    setSelectedCourse(selected || null);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      return `${hour % 12 || 12}:${minutes.padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (error) {
      return dateString;
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: theme.palette.error.main,
        cancelButtonColor: theme.palette.text.secondary,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/admin/deleteBatch/${batchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatches(batches.filter(batch => batch._id !== batchId));
        Swal.fire({
          title: 'Deleted!',
          text: 'Batch has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Failed to delete batch:', error);
      showError('Failed to delete batch');
    }
  };

  return (
    <>
      <PageTitle page={"Batch Management"} />
      {/* <Container maxWidth="xl" sx={{ py: 4 }}> */}
        <Paper elevation={2} sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper
        }}>
          {/* Course Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: theme.palette.primary.main
            }}>
              <ClassIcon sx={{ mr: 1 }} />
              Select Course to View Batches
            </Typography>
            
            <FormControl fullWidth size="medium">
              <InputLabel>Choose a course</InputLabel>
              <Select
                value={selectedCourse?._id || ''}
                onChange={handleCourseChange}
                label="Choose a course"
                disabled={loading.courses}
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select a course...</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {course.courseimage && (
                        <Avatar 
                          src={`${BASE_URL}${course.courseimage}`} 
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography>{course.coursename}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.duration} • ₹{course.price}
                        </Typography>
                      </Box>
                      <Badge 
                        badgeContent={course.batches?.length || 0} 
                        color="primary"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Selected Course Info */}
          {selectedCourse && (
            <Paper variant="outlined" sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.background.default
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {selectedCourse.courseimage && (
                  <Avatar 
                    src={`${BASE_URL}${selectedCourse.courseimage}`} 
                    sx={{ width: 80, height: 80, mr: 3 }}
                    variant="rounded"
                  />
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedCourse.coursename}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                    {selectedCourse.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Price: ₹${selectedCourse.price}`} 
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`Duration: ${selectedCourse.duration}`} 
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`GST: ${selectedCourse.gst}%`} 
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`Created: ${formatDate(selectedCourse.createdAt)}`} 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Batch List Section */}
          <Box>
            <Typography variant="h6" sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.main
            }}>
              <PeopleIcon sx={{ mr: 1 }} />
              {selectedCourse ? `${selectedCourse.coursename} Batches` : 'Batches'}
              {selectedCourse && (
                <Chip 
                  label={`${batches.length} batch${batches.length !== 1 ? 'es' : ''}`} 
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>

            {loading.batches ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : batches.length > 0 ? (
              <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="batches table">
                  <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Batch Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Schedule</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
                      {/* <TableCell sx={{ fontWeight: 600 }}>Students</TableCell> */}
                      <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batches.map((batch) => (
                      <TableRow key={batch._id} hover>
                        <TableCell>
                          <Typography fontWeight={500}>{batch.batchname}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {batch._id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon 
                              fontSize="small" 
                              sx={{ 
                                mr: 1, 
                                color: theme.palette.text.secondary 
                              }} 
                            />
                            {formatTime(batch.schedule?.time)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {batch.schedule?.days?.map((day) => (
                              <Chip 
                                key={day} 
                                label={day} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                  backgroundColor: theme.palette.action.selected,
                                  borderColor: theme.palette.divider
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                       
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(batch.createdAt)}
                          </Typography>
                        </TableCell>
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : selectedCourse ? (
              <Paper variant="outlined" sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: theme.palette.background.default
              }}>
                <Typography variant="body1" color="text.secondary">
                  No batches found for this course
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  startIcon={<ClassIcon />}
                >
                  Create New Batch
                </Button>
              </Paper>
            ) : (
              <Paper variant="outlined" sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: theme.palette.background.default
              }}>
                <Typography variant="body1" color="text.secondary">
                  Please select a course to view batches
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      {/* </Container> */}
    </>
  );
};

export default CourseBatchList;