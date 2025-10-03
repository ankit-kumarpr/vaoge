import React, { useEffect, useState } from "react";
import { 
  TextField, 
  Button, 
  MenuItem, 
  Grid, 
  Container, 
  Typography, 
  Select, 
  FormControl, 
  InputLabel,
  Paper,
  Box,
  Chip,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Checkbox,
  ListItemText
} from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import {
  Class as ClassIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  AddCircle as AddIcon,
  ArrowBack as BackIcon,
  People as PeopleIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CreateClass = () => {
  const theme = useTheme();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    classname: "",
    batchId: "",
    classlink: "",
    classDate: "",
    studentId: "",
    classShedule: [{ day: "", time: "" }] // Initialize with one empty schedule
  });

  // State for batch list and student list
  const [batchList, setBatchList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState({
    batches: true,
    students: true,
    submitting: false
  });

  // Days options for dropdown
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch batch list and student list
  useEffect(() => {
    GetAllBatchList();
    GetStudentListAPI();
  }, []);

  const GetAllBatchList = async () => {
    try {
      setLoading(prev => ({ ...prev, batches: true }));
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      const batches = Array.isArray(response.data?.data) ? response.data.data : [];
      setBatchList(batches);
    } catch (error) {
      // console.log("Error fetching batches:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load batches",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
      setBatchList([]);
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  // Get student list
  const GetStudentListAPI = async () => {
    try {
      setLoading(prev => ({ ...prev, students: true }));
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      if (response.data.error === false) {
        setStudentList(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching students:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load students",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
      setStudentList([]);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle student selection change
  const handleStudentChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, studentId: value }));
  };

  // Handle schedule changes
  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedules = [...formData.classShedule];
    updatedSchedules[index][name] = value;
    setFormData(prev => ({ ...prev, classShedule: updatedSchedules }));
  };

  // Add new schedule field
  const addScheduleField = () => {
    setFormData(prev => ({
      ...prev,
      classShedule: [...prev.classShedule, { day: "", time: "" }]
    }));
  };

  // Remove schedule field
  const removeScheduleField = (index) => {
    if (formData.classShedule.length > 1) {
      const updatedSchedules = formData.classShedule.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, classShedule: updatedSchedules }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const url = `${BASE_URL}/admin/createclass`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Filter out any empty schedules
      const validSchedules = formData.classShedule.filter(
        schedule => schedule.day && schedule.time
      );

      const payload = {
        classname: formData.classname,
        batchId: formData.batchId,
        classShedule: validSchedules,
        classlink: formData.classlink,
        classDate: formData.classDate,
        studentId: formData.studentId
      };

      const response = await axios.post(url, payload, { headers });
      // console.log("Response of create class", response.data);

      if(response.data?.error === false){
        Swal.fire({
          title: "Success!",
          text: "Class Created Successfully",
          icon: "success"
        }).then(() => {
          navigate('/class-list');
        });
        setFormData({
          classname: '',
          batchId: '',
          classlink: '',
          classDate: '',
          studentId: '',
          classShedule: [{ day: "", time: "" }]
        });
      }
    } catch (error) {
      // console.log("Error creating class:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create class",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const getSelectedBatch = () => {
    return batchList.find(batch => batch._id === formData.batchId);
  };

  return (
    <>
      <PageTitle page={"Create Class"} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper
        }}>
          {/* Header with back button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Back to Class List">
                <IconButton 
                  onClick={() => navigate('/class-list')}
                  sx={{ mr: 2 }}
                >
                  <BackIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}>
                <ClassIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Create New Class
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Class Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class Name"
                  name="classname"
                  value={formData.classname}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <ClassIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>

              {/* Batch Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Batch</InputLabel>
                  <Select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    variant="outlined"
                    disabled={loading.batches}
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  >
                    {loading.batches ? (
                      <MenuItem disabled>Loading batches...</MenuItem>
                    ) : batchList.length > 0 ? (
                      batchList.map((batch) => (
                        <MenuItem key={batch._id} value={batch._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 30, 
                                height: 30, 
                                mr: 2,
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText
                              }}
                            >
                              {batch.batchname.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography>{batch.batchname}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {batch.schedule?.days?.join(', ')}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No batches available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Selected Batch Info */}
              {formData.batchId && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.background.default
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Selected Batch:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          mr: 2,
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText
                        }}
                      >
                        {getSelectedBatch()?.batchname?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {getSelectedBatch()?.batchname}
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                          <Chip 
                            label={`Days: ${getSelectedBatch()?.schedule?.days?.join(', ') || 'Not set'}`} 
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={`Time: ${getSelectedBatch()?.schedule?.time || 'Not set'}`} 
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Student Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Student</InputLabel>
                  <Select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleStudentChange}
                    variant="outlined"
                    disabled={loading.students}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography variant="body2" color="text.secondary">No student selected</Typography>;
                      }
                      const student = studentList.find(s => s._id === selected);
                      return student ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 2,
                              backgroundColor: theme.palette.secondary.light
                            }}
                          >
                            {student.firstname.charAt(0)}{student.lastname.charAt(0)}
                          </Avatar>
                          <Typography>
                            {student.firstname} {student.lastname}
                          </Typography>
                        </Box>
                      ) : null;
                    }}
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  >
                    {loading.students ? (
                      <MenuItem disabled>Loading students...</MenuItem>
                    ) : studentList.length > 0 ? (
                      studentList.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar 
                              sx={{ 
                                width: 30, 
                                height: 30, 
                                mr: 2,
                                backgroundColor: theme.palette.secondary.light
                              }}
                            >
                              {student.firstname.charAt(0)}{student.lastname.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography>{student.firstname} {student.lastname}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {student.enrollmentnumber} • {student.email}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No students available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Class Link */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class Link"
                  name="classlink"
                  value={formData.classlink}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <LinkIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>

              {/* Class Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Class Date"
                  name="classDate"
                  value={formData.classDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <CalendarIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>

              {/* Class Schedule - Dynamic Fields */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  Class Schedule
                </Typography>
                
                {formData.classShedule.map((schedule, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Day Selection */}
                      <Grid item xs={12} md={5}>
                        <FormControl fullWidth>
                          <InputLabel>Day {index + 1}</InputLabel>
                          <Select
                            name="day"
                            value={schedule.day}
                            onChange={(e) => handleScheduleChange(index, e)}
                            required
                            variant="outlined"
                            sx={{
                              borderRadius: '12px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                              }
                            }}
                          >
                            {daysOptions.map((day) => (
                              <MenuItem key={day} value={day}>
                                {day}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Time Selection */}
                      <Grid item xs={9} md={5}>
                        <TextField
                          fullWidth
                          label={`Time ${index + 1}`}
                          type="time"
                          name="time"
                          value={schedule.time}
                          onChange={(e) => handleScheduleChange(index, e)}
                          required
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
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

                      {/* Add/Remove Buttons */}
                      <Grid item xs={3} md={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {index === formData.classShedule.length - 1 ? (
                            <Tooltip title="Add another schedule">
                              <IconButton
                                onClick={addScheduleField}
                                color="primary"
                                sx={{ 
                                  backgroundColor: theme.palette.primary.light,
                                  '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: '#fff'
                                  }
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Remove this schedule">
                              <IconButton
                                onClick={() => removeScheduleField(index)}
                                color="error"
                                sx={{ 
                                  backgroundColor: theme.palette.error.light,
                                  '&:hover': {
                                    backgroundColor: theme.palette.error.main,
                                    color: '#fff'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size="large"
                  disabled={loading.submitting}
                  startIcon={<AddIcon />}
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
                  {loading.submitting ? 'Creating Class...' : 'Create Class'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </>
  );
};

export default CreateClass;