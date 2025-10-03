import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BASE_URL from '../../../config';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Snackbar
} from '@mui/material';
import { CheckCircleOutline, HighlightOff, Person, School } from '@mui/icons-material';
import PageTitle from '../../../components/PageTitle';

const ApplyAttendance = () => {
  const location = useLocation();
  const classId = location.state?.classId;
  const [attendanceData, setAttendanceData] = useState({
    classData: {},
    students: [],
    educator: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (classId) {
      GetClassAttendance();
    } else {
      setError('Class ID is missing');
      setLoading(false);
    }
  }, [classId]);

  const GetClassAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const url = `${BASE_URL}/admin/attendance/${classId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      setAttendanceData({
        classData: response.data.classData || {},
        students: response.data.students || [],
        educator: response.data.educator || []
      });
      // console.log("Response of class attendance",response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError(error.response?.data?.message || 'Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (type, id) => {
    if (!editable) return;
    
    setAttendanceData(prev => {
      const newData = { ...prev };
      if (type === 'student') {
        newData.students = newData.students.map(person => 
          person._id === id 
            ? { ...person, status: person.status === 'Present' ? 'Absent' : 'Present' } 
            : person
        );
      } else {
        newData.educator = newData.educator.map(person => 
          person._id === id 
            ? { ...person, status: person.status === 'Present' ? 'Absent' : 'Present' } 
            : person
        );
      }
      return newData;
    });
  };

  const submitAttendance = async () => {
    if (!attendanceData || !classId) {
      setSnackbar({
        open: true,
        message: 'Invalid attendance data',
        severity: 'error'
      });
      return;
    }
  
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/attendance/mark`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
  
      // Prepare payload with proper validation
      const payload = {
        classId: classId,
        educatorAttendance: attendanceData.educator.length > 0 ? {
          educatorId: attendanceData.educator[0]._id,
          status: attendanceData.educator[0].status 
        } : null,
        studentAttendance: attendanceData.students.map(student => ({
          studentId: student._id,
          status: student.status 
        }))
      };
  
      // Validate payload before sending
      if (!payload.studentAttendance || payload.studentAttendance.length === 0) {
        throw new Error('No students to mark attendance for');
      }
  
      // Remove educatorAttendance if null to avoid sending undefined/null
      if (!payload.educatorAttendance) {
        delete payload.educatorAttendance;
      }
  
      const response = await axios.post(url, payload, { headers });
      // console.log("Response of the attendeance submit",response.data);
      setSnackbar({
        open: true,
        message: response.data?.message || 'Attendance marked successfully!',
        severity: 'success'
      });
      setEditable(false);
    } catch (error) {
      // console.error('Error submitting attendance:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 
               error.message || 
               'Failed to update attendance. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && !attendanceData.classData._id) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!attendanceData.classData._id) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">No attendance data found for this class</Alert>
      </Container>
    );
  }

  return (
    <>
      <PageTitle page={"Attendance"} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Class Information Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1">
              {attendanceData.classData.classname || 'Class'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip 
                label={attendanceData.classData.batchname || 'Batch'} 
                color="secondary" 
                size="medium"
              />
              <Chip 
                label={attendanceData.classData.classDate ? 
                  `${new Date(attendanceData.classData.classDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}` : 'Date not set'}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary">
              {attendanceData.classData.classShedule?.days?.join(', ') || 'No days'} at {attendanceData.classData.classShedule?.time || 'no time'}
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={editable}
                  onChange={() => setEditable(!editable)}
                  color="primary"
                />
              }
              label="Edit Mode"
              labelPlacement="start"
            />
          </Box>
        </Paper>

        {/* Attendance Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                height: 4,
              },
            }}
          >
            <Tab 
              icon={<School fontSize="small" />} 
              iconPosition="start" 
              label={`Students (${attendanceData.students.length})`} 
              sx={{ py: 2 }}
            />
            <Tab 
              icon={<Person fontSize="small" />} 
              iconPosition="start" 
              label={`Educators (${attendanceData.educator.length})`} 
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* Students Attendance */}
        {tabValue === 0 && (
          <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'primary.contrastText' }}>Student</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText' }}>Email</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText' }}>Status</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.students.map((student) => (
                  <TableRow key={`student-${student._id}`} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                          {student.firstname?.charAt(0)?.toUpperCase() || 'S'}
                        </Avatar>
                        <Typography>
                          {student.firstname} {student.lastname}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={student.status || 'Absent'}
                        color={student.status === 'Present' ? 'success' : 'error'}
                        size="small"
                        icon={student.status === 'Present' ? <CheckCircleOutline fontSize="small" /> : <HighlightOff fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color={student.status === 'Present' ? 'error' : 'success'}
                        onClick={() => handleStatusChange('student', student._id)}
                        disabled={!editable}
                        size="small"
                        startIcon={student.status === 'Present' ? <HighlightOff /> : <CheckCircleOutline />}
                      >
                        {student.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Educators Attendance */}
        {tabValue === 1 && (
          <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'primary.contrastText' }}>Educator</TableCell>
                  <TableCell sx={{ color: 'primary.contrastText' }}>Email</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText' }}>Status</TableCell>
                  <TableCell align="center" sx={{ color: 'primary.contrastText' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.educator.map((educator) => (
                  <TableRow key={`educator-${educator._id}`} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 32, height: 32 }}>
                          {educator.firstname?.charAt(0)?.toUpperCase() || 'E'}
                        </Avatar>
                        <Typography>
                          {educator.firstname} {educator.lastname}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{educator.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={educator.status || 'Absent'}
                        color={educator.status === 'Present' ? 'success' : 'error'}
                        size="small"
                        icon={educator.status === 'Present' ? <CheckCircleOutline fontSize="small" /> : <HighlightOff fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color={educator.status === 'Present' ? 'error' : 'success'}
                        onClick={() => handleStatusChange('educator', educator._id)}
                        disabled={!editable}
                        size="small"
                        startIcon={educator.status === 'Present' ? <HighlightOff /> : <CheckCircleOutline />}
                      >
                        {educator.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Summary and Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total: {attendanceData.students.length + attendanceData.educator.length} | 
              Present: {attendanceData.students.filter(s => s.status === 'Present').length + 
                      attendanceData.educator.filter(e => e.status === 'Present').length} | 
              Absent: {attendanceData.students.filter(s => s.status === 'Absent').length + 
                      attendanceData.educator.filter(e => e.status === 'Absent').length}
            </Typography>
          </Box>
          
          {editable && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submitAttendance}
              disabled={loading}
              sx={{ minWidth: 180 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Attendance'}
            </Button>
          )}
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApplyAttendance;