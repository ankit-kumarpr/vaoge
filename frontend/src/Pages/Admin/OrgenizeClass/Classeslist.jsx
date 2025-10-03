import React, { useEffect, useState } from "react";
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from "@mui/x-data-grid";
import { 
  Container, 
  Box, 
  TextField, 
  Typography, 
  Link, 
  Modal, 
  Button, 
  Grid, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Paper,
  Chip,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  ListItemText,
  Checkbox
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  People as PeopleIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Class as ClassIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import Swal from "sweetalert2";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { motion } from "framer-motion";

const ClassesList = () => {
  const theme = useTheme();
  const token = sessionStorage.getItem("token");
  const [classList, setClassList] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    classname: "",
    batchId: "",
    classShedule: [],
    classlink: "",
    classDate: "",
    studentId: ""
  });
  const [batchList, setBatchList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState({
    classes: true,
    batches: true,
    students: true,
    updating: false
  });

  // Days dropdown options
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    GetAllClassList();
    GetAllBatchList();
    GetStudentListAPI();
  }, []);

  const GetAllClassList = async () => {
    try {
      setLoading(prev => ({ ...prev, classes: true }));
      const url = `${BASE_URL}/admin/getclass`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      if (response.data?.data) {
        setClassList(response.data.data);
        setFilteredClasses(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching class list:", error);
      showError("Failed to load classes");
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

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
      if (response.data?.data) {
        setBatchList(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching batch list:", error);
      showError("Failed to load batches");
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

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
      // console.log("Error fetching student list:", error);
      showError("Failed to load students");
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
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

  const showSuccess = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary
    });
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setFilteredClasses(
      date ? classList.filter(cls => 
        new Date(cls.classDate).toISOString().split("T")[0] === date
      ) : classList
    );
  };

  const handleEditClick = (cls) => {
    setSelectedClass({
      _id: cls.id,
      classname: cls.classname,
      batchId: cls.batchId?._id || "",
      classShedule: cls.classShedule || [],
      classlink: cls.classlink,
      classDate: cls.classDate?.split('T')[0] || "",
      studentId: cls.studentId || ""
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.text.secondary,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/admin/deleteclass/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess("Class removed successfully");
        GetAllClassList();
      } catch (error) {
        showError("Deletion failed");
      }
    }
  };

  const handleUpdateClass = async () => {
    try {
      setLoading(prev => ({ ...prev, updating: true }));
      
      // Filter out any empty schedules
      const validSchedules = selectedClass.classShedule.filter(
        schedule => schedule.day && schedule.time
      );

      const payload = {
        classname: selectedClass.classname,
        batchId: selectedClass.batchId,
        classShedule: validSchedules,
        classlink: selectedClass.classlink,
        classDate: selectedClass.classDate,
        studentId: selectedClass.studentId
      };

      const response = await axios.put(
        `${BASE_URL}/admin/updateclass/${selectedClass._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("response of u[dated api",response.data);
      showSuccess("Class updated successfully");
      setEditModalOpen(false);
      GetAllClassList();
    } catch (error) {
      console.error("Update error:", error);
      showError(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(prev => ({ ...prev, updating: false }));
    }
  };

  const handleStudentChange = (event) => {
    const { value } = event.target;
    setSelectedClass(prev => ({
      ...prev,
      studentId: value
    }));
  };

  // Handle schedule changes
  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedules = [...selectedClass.classShedule];
    updatedSchedules[index][name] = value;
    setSelectedClass(prev => ({ ...prev, classShedule: updatedSchedules }));
  };

  // Add new schedule field
  const addScheduleField = () => {
    setSelectedClass(prev => ({
      ...prev,
      classShedule: [...prev.classShedule, { day: "", time: "" }]
    }));
  };

  // Remove schedule field
  const removeScheduleField = (index) => {
    if (selectedClass.classShedule.length > 1) {
      const updatedSchedules = selectedClass.classShedule.filter((_, i) => i !== index);
      setSelectedClass(prev => ({ ...prev, classShedule: updatedSchedules }));
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ p: 2, gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
          startIcon={<RefreshIcon />}
          onClick={GetAllClassList}
          size="small"
        >
          Refresh
        </Button>
      </GridToolbarContainer>
    );
  };

  const columns = [
    { 
      field: "Sr_no", 
      headerName: "ID", 
      flex:1,
      renderCell: (params) => (
        <Badge badgeContent={params.value} color="primary" />
      )
    },
    { 
      field: "classname", 
      headerName: "Class Name", 
      width: 200,
      renderCell: (params) => (
        <Typography fontWeight={500}>{params.value}</Typography>
      )
    },
    { 
      field: "batchname", 
      headerName: "Batch", 
      flex: 2,
      renderCell: (params) => (
        <Chip
          label={params.row.batchId?.batchname || "N/A"}
          variant="outlined"
          size="small"
          avatar={
            <Avatar sx={{ 
              width: 24, 
              height: 24,
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText
            }}>
              {params.row.batchId?.batchname?.charAt(0) || "?"}
            </Avatar>
          }
        />
      )
    },
    {
      field: "student",
      headerName: "Student",
      flex: 2,
      renderCell: (params) => {
        if (!params.row.studentId) return "N/A";
        const student = studentList.find(s => s._id === params.row.studentId);
        return student ? (
          <Chip
            label={`${student.firstname} ${student.lastname}`}
            variant="outlined"
            size="small"
            avatar={
              <Avatar 
                src={student.profile} 
                sx={{ width: 24, height: 24 }}
              />
            }
          />
        ) : "N/A";
      }
    },
    {
      field: "classDate",
      headerName: "Date",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
          <Typography variant="body2">
            {params.value ? format(parseISO(params.value), 'PP') : "N/A"}
          </Typography>
        </Box>
      )
    },
    {
      field: "classShedule", 
      headerName: "Schedule",
      flex: 3,
      renderCell: (params) => (
        <Box>
          {params.row.classShedule?.map((schedule, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <ScheduleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2">
                  {schedule.day}: {schedule.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )
    },
    {
      field: "classlink",
      headerName: "Link",
      flex: 1.5,
      renderCell: (params) => params.value ? (
        <Button
          variant="outlined"
          size="small"
          startIcon={<LinkIcon />}
          href={params.value}
          target="_blank"
          sx={{
            textTransform: 'none'
          }}
        >
          Join
        </Button>
      ) : "N/A"
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const rows = filteredClasses.map((cls, index) => ({
    Sr_no: index + 1,
    id: cls._id,
    classname: cls.classname,
    batchId: cls.batchId,
    batchname: cls.batchname,
    studentId: cls.studentId,
    classDate: cls.classDate,
    classShedule: cls.classShedule,
    classlink: cls.classlink,
  }));

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '700px' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <>
      <PageTitle page="Class Management" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper elevation={3} sx={{ 
          p: 3, 
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper
        }}>
          {/* Header and Filters */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.main
            }}>
              <ClassIcon sx={{ mr: 1 }} />
              All Classes
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={handleDateChange}
                size="small"
                sx={{ width: 200 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setSelectedDate("")}
                size="small"
              >
                Clear Filters
              </Button>
            </Box>
          </Box>

          {/* Data Grid */}
          <Box sx={{ height: "auto", width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading.classes}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              components={{
                Toolbar: CustomToolbar,
              }}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          </Box>

          {/* Edit Modal */}
          <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h5" component="h2" sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit Class Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class Name"
                    value={selectedClass.classname}
                    onChange={(e) => setSelectedClass({...selectedClass, classname: e.target.value})}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <ClassIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Batch</InputLabel>
                    <Select
                      value={selectedClass.batchId}
                      onChange={(e) => setSelectedClass({...selectedClass, batchId: e.target.value})}
                      label="Batch"
                      variant="outlined"
                    >
                      {batchList.map((batch) => (
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
                            <Typography>{batch.batchname}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select
                      value={selectedClass.studentId}
                      onChange={handleStudentChange}
                      label="Student"
                      variant="outlined"
                      renderValue={(selected) => {
                        if (!selected) {
                          return <Typography variant="body2" color="text.secondary">No student selected</Typography>;
                        }
                        const student = studentList.find(s => s._id === selected);
                        return student ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={student.profile} 
                              sx={{ width: 30, height: 30, mr: 2 }}
                            />
                            <Typography>
                              {student.firstname} {student.lastname}
                            </Typography>
                          </Box>
                        ) : null;
                      }}
                    >
                      {studentList.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={student.profile} 
                              sx={{ width: 30, height: 30, mr: 2 }}
                            />
                            <Box>
                              <Typography>{student.firstname} {student.lastname}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {student.enrollmentnumber} • {student.email}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class Link"
                    value={selectedClass.classlink}
                    onChange={(e) => setSelectedClass({...selectedClass, classlink: e.target.value})}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <LinkIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Class Date"
                    value={selectedClass.classDate}
                    onChange={(e) => setSelectedClass({...selectedClass, classDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <CalendarIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                {/* Dynamic Schedule Fields */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1 }} />
                    Class Schedule
                  </Typography>
                  
                  {selectedClass.classShedule.map((schedule, index) => (
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
                            {index === selectedClass.classShedule.length - 1 ? (
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

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleUpdateClass}
                      disabled={loading.updating}
                      startIcon={<EditIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      {loading.updating ? 'Updating...' : 'Update Class'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditModalOpen(false)}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px'
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Paper>
      </motion.div>
    </>
  );
};

export default ClassesList;