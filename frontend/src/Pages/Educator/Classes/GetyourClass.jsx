import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Paper,
  InputAdornment,
  Divider,
  IconButton,
  CircularProgress,

} from '@mui/material';
import { CalendarToday, AccessTime, Class, Group, Edit, VideoCall, NoteAdd, Assignment, Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';


const GetyourClass = () => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const educator_id = decodedToken.userId;
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [openModal, setOpenModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [reason, setReason] = useState('');
  const [proposedDays, setProposedDays] = useState([]);
  const [proposedTime, setProposedTime] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Notes modal states
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [notesTitle, setNotesTitle] = useState('');
  const [selectedNotesFile, setSelectedNotesFile] = useState(null);
  const [selectedClassForNotes, setSelectedClassForNotes] = useState(null);
  const [uploadingNotes, setUploadingNotes] = useState(false);
  
  // Homework modal states
  const [openHomeworkModal, setOpenHomeworkModal] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [selectedHomeworkFile, setSelectedHomeworkFile] = useState(null);
  const [selectedClassForHomework, setSelectedClassForHomework] = useState(null);
  const [uploadingHomework, setUploadingHomework] = useState(false);

  // Homework Solutions states
  const [openSolutionsModal, setOpenSolutionsModal] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, [selectedDate]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/admin/getselfclasseducator`;
      const requestBody = {
        educatorId: educator_id,
        date: selectedDate
      };
      
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // console.log("Response of Educator Classes", response.data);
      
      if (response.data.error === false && response.data.data) {
        setClasses(response.data.data);
        setFilteredClasses(response.data.data.classes || []);
      } else {
        setClasses([]);
        setFilteredClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch classes. Please try again.'
      });
      setClasses([]);
      setFilteredClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedClass(null);
    setReason('');
    setProposedDays([]);
    setProposedTime('');
  };

  const handleSubmit = async () => {
    if (!reason || proposedDays.length === 0 || !proposedTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all fields before submitting.'
      });
      return;
    }

    const requestBody = {
      classId: selectedClass.classId,
      educatorId: educator_id,
      reason: reason,
      proposedSchedule: {
        days: proposedDays,
        time: proposedTime,
      },
    };

    try {
      const url = `${BASE_URL}/admin/request-shedule-change`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(url, requestBody, { headers });
      
      if (response.data.error === false) {
        Swal.fire({
          title: 'Success!',
          text: 'Your request has been submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        handleCloseModal();
        fetchClasses();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit request.'
      });
    }
  };

  // Notes modal handlers
  const handleOpenNotesModal = (classItem) => {
    setSelectedClassForNotes(classItem);
    setOpenNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setOpenNotesModal(false);
    setSelectedClassForNotes(null);
    setNotesTitle('');
    setSelectedNotesFile(null);
  };

  const handleNotesFileChange = (e) => {
    setSelectedNotesFile(e.target.files[0]);
  };

  const handleNotesUpload = async () => {
    if (!notesTitle || !selectedNotesFile || !selectedClassForNotes) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all fields before submitting.'
      });
      return;
    }

    setUploadingNotes(true);
    
    try {
      const formData = new FormData();
      formData.append('title', notesTitle);
      formData.append('classId', selectedClassForNotes.classId);
      formData.append('file', selectedNotesFile);

      const url = `${BASE_URL}/admin/add-note`;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(url, formData, { headers });
      
      if (response.data.message === "Note uploaded successfully") {
        Swal.fire({
          title: 'Success!',
          text: 'Notes uploaded successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        handleCloseNotesModal();
      }
    } catch (error) {
      console.error('Error uploading notes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to upload notes.'
      });
    } finally {
      setUploadingNotes(false);
    }
  };

  // Homework modal handlers
  const handleOpenHomeworkModal = (classItem) => {
    setSelectedClassForHomework(classItem);
    setOpenHomeworkModal(true);
  };

  const handleCloseHomeworkModal = () => {
    setOpenHomeworkModal(false);
    setSelectedClassForHomework(null);
    setHomeworkTitle('');
    setSelectedHomeworkFile(null);
  };

  const handleHomeworkFileChange = (e) => {
    setSelectedHomeworkFile(e.target.files[0]);
  };

  const handleHomeworkUpload = async () => {
    if (!homeworkTitle || !selectedHomeworkFile || !selectedClassForHomework) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all fields before submitting.'
      });
      return;
    }

    setUploadingHomework(true);
    
    try {
      const formData = new FormData();
      formData.append('title', homeworkTitle);
      formData.append('classId', selectedClassForHomework.classId);
      formData.append('file', selectedHomeworkFile);

      const url = `${BASE_URL}/admin/add-class-home-work`;
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(url, formData, { headers });
      
      if (response.data.error === false) {
        Swal.fire({
          title: 'Success!',
          text: 'Homework uploaded successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        handleCloseHomeworkModal();
      }
    } catch (error) {
      console.error('Error uploading homework:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to upload homework.'
      });
    } finally {
      setUploadingHomework(false);
    }
  };

  // Homework Solutions handlers
  const handleOpenSolutionsModal = async (classItem) => {
  try {
    setLoadingSolutions(true);
    setSelectedClassForHomework(classItem);
    setOpenSolutionsModal(true);
    
    // First get the homework ID for this class
    const homeworkUrl = `${BASE_URL}/admin/classwork/${classItem.classId}`;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const homeworkResponse = await axios.get(homeworkUrl, { headers });
    
    if (homeworkResponse.data.message === "Class data with home work fetched successfully" && 
        homeworkResponse.data.homework && 
        homeworkResponse.data.homework.length > 0) {
      
      const homeworkId = homeworkResponse.data.homework[0]._id;
      setSelectedHomeworkId(homeworkId);
      
      // Now get solutions for this homework
      const solutionsUrl = `${BASE_URL}/admin/homeworksolutions/${homeworkId}`;
      const solutionsResponse = await axios.get(solutionsUrl, { headers });
      
      if (solutionsResponse.data && solutionsResponse.data.solutions) {
        setSolutions(solutionsResponse.data.solutions);
      } else {
        setSolutions([]);
      }
    } else {
      setSolutions([]);
      Swal.fire({
        icon: 'info',
        title: 'No Homework Found',
        text: 'This class does not have any homework assigned yet.'
      });
    }
  } catch (error) {
    console.error('Error fetching solutions:', error);
    setSolutions([]);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to fetch homework solutions.'
    });
  } finally {
    setLoadingSolutions(false);
  }
};


  const handleCloseSolutionsModal = () => {
    setOpenSolutionsModal(false);
    setSolutions([]);
    setSelectedClassForHomework(null);
    setSelectedHomeworkId(null);
  };

  const formatFileUrl = (url) => {
    return url.replace(/\\/g, '/');
  };

  // DataGrid columns for solutions
 const solutionsColumns = [
  { 
    field: 'firstname', 
    headerName: 'Student', 
    width: 200,
    valueGetter: (params) => params.row.firstname
  },
  { 
    field: 'enrollmentNumber', 
    headerName: 'Enrollment No.', 
    width: 150
  },
  { 
    field: 'formattedDate', 
    headerName: 'Submitted At', 
    width: 180
  },
  {
    field: 'actions',
    headerName: 'Solution',
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<Visibility />}
        onClick={() => {
          if (params.row.fileUrl) {
            const fullUrl = `${BASE_URL}/${formatFileUrl(params.row.fileUrl)}`;
            window.open(fullUrl, '_blank');
          }
        }}
        disabled={!params.row.fileUrl}
      >
        View
      </Button>
    ),
    sortable: false,
    filterable: false
  }
];

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      <PageTitle page={'Your Classes'} />
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            View Your Scheduled Classes
          </Typography>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem.classId}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Class color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {classItem.className}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(parseISO(classItem.classDate), 'PPP')}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Class Schedule:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {classItem.schedule?.map((scheduleItem, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1,
                            p: 1,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1
                          }}>
                            <AccessTime color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {scheduleItem.day}: {scheduleItem.time}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        startIcon={<NoteAdd />}
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenNotesModal(classItem)}
                        size="small"
                        fullWidth
                      >
                        Upload Notes
                      </Button>
                      <Button
                        startIcon={<Assignment />}
                        variant="outlined"
                        color="success"
                        onClick={() => handleOpenHomeworkModal(classItem)}
                        size="small"
                        fullWidth
                      >
                        Upload Homework
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        startIcon={<Edit />}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenModal(classItem)}
                        size="small"
                        fullWidth
                      >
                        Reschedule
                      </Button>
                      <Button
                        startIcon={<VideoCall />}
                        variant="contained"
                        color="primary"
                        href={classItem.classLink}
                        target="_blank"
                        size="small"
                        fullWidth
                      >
                        Join Class
                      </Button>
                    </Box>
                  </CardActions>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenSolutionsModal(classItem)}
                      size="small"
                    >
                      View Homework Solutions
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No classes scheduled for {format(parseISO(selectedDate), 'PPP')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  You don't have any classes on this date.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Reschedule Class Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Edit color="primary" /> Reschedule Class
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Class: <strong>{selectedClass?.className}</strong>
          </Typography>
          
          <TextField
            label="Reason for Reschedule"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            required
          />
          
          <TextField
            label="Proposed Days (comma separated)"
            value={proposedDays.join(', ')}
            onChange={(e) => setProposedDays(e.target.value.split(',').map(day => day.trim()))}
            fullWidth
            margin="normal"
            required
            helperText="Example: Monday, Wednesday, Friday"
          />
          
          <TextField
            label="Proposed Time"
            value={proposedTime}
            onChange={(e) => setProposedTime(e.target.value)}
            fullWidth
            margin="normal"
            required
            helperText="Example: 10:00 AM"
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={!reason || proposedDays.length === 0 || !proposedTime}
            >
              Submit Request
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Upload Notes Modal */}
      <Modal open={openNotesModal} onClose={handleCloseNotesModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <NoteAdd color="primary" /> Upload Class Notes
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Class: <strong>{selectedClassForNotes?.className}</strong>
          </Typography>
          
          <TextField
            label="Notes Title"
            value={notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload File (PDF, DOC, PPT, etc.)
            </Typography>
            <input
              type="file"
              onChange={handleNotesFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              required
            />
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleCloseNotesModal} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleNotesUpload} 
              variant="contained" 
              color="primary"
              disabled={!notesTitle || !selectedNotesFile || uploadingNotes}
            >
              {uploadingNotes ? <CircularProgress size={24} /> : 'Upload Notes'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Upload Homework Modal */}
      <Modal open={openHomeworkModal} onClose={handleCloseHomeworkModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Assignment color="primary" /> Upload Class Homework
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Class: <strong>{selectedClassForHomework?.className}</strong>
          </Typography>
          
          <TextField
            label="Homework Title"
            value={homeworkTitle}
            onChange={(e) => setHomeworkTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload File (PDF, DOC, PPT, etc.)
            </Typography>
            <input
              type="file"
              onChange={handleHomeworkFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              required
            />
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleCloseHomeworkModal} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleHomeworkUpload} 
              variant="contained" 
              color="primary"
              disabled={!homeworkTitle || !selectedHomeworkFile || uploadingHomework}
            >
              {uploadingHomework ? <CircularProgress size={24} /> : 'Upload Homework'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Homework Solutions Modal */}
     <Modal open={openSolutionsModal} onClose={handleCloseSolutionsModal}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%', md: '70%' },
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  }}>
    <Typography variant="h6" component="h2" sx={{ 
      fontWeight: 600,
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Assignment color="primary" /> Homework Solutions for {selectedClassForHomework?.className}
    </Typography>
    
    {loadingSolutions ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress size={60} />
      </Box>
    ) : solutions.length === 0 ? (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        No solutions submitted yet for this homework.
      </Typography>
    ) : (
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Enrollment No.</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Submitted At</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Solution</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution) => (
              <tr key={solution._id} style={{ borderBottom: '1px solid #ddd', '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                <td style={{ padding: '12px' }}>
                  {solution.studentId?.firstname} {solution.studentId?.lastname}
                </td>
                <td style={{ padding: '12px' }}>
                  {solution.studentId?.enrollmentnumber || 'N/A'}
                </td>
                <td style={{ padding: '12px' }}>
                  {solution.submittedAt ? format(parseISO(solution.submittedAt), 'PPpp') : 'N/A'}
                </td>
                <td style={{ padding: '12px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => {
                      if (solution.fileUrl) {
                        const fullUrl = `http://localhost:4500/${formatFileUrl(solution.fileUrl)}`;
                        window.open(fullUrl, '_blank');
                      }
                    }}
                    disabled={!solution.fileUrl}
                    sx={{ textTransform: 'none' }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    )}
    
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={handleCloseSolutionsModal} variant="outlined" color="secondary">
        Close
      </Button>
    </Box>
  </Box>
</Modal>
    </Box>
  );
};

export default GetyourClass;