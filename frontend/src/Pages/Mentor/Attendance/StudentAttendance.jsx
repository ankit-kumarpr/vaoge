import React, { useState, useEffect } from 'react';
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
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid, 
  Card, 
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Alert,
  Box
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  Person, 
  BarChart,
  EventAvailable,
  EventBusy
} from '@mui/icons-material';
import BASE_URL from '../../../config';
import axios from 'axios';
import PageTitle from '../../../components/PageTitle';

const StudentAttendance = () => {
  const token = sessionStorage.getItem('token');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState({
    student: null,
    summary: {
      presentCount: 0,
      absentCount: 0,
      attendancePercentage: 0,
      totalClasses: 0
    },
    attendance: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Months array for dropdown
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  // Generate years (current year and 5 previous years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Fetch student list
  useEffect(() => {
    const GetStudentList = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/admin/getallstudent`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        setStudents(response.data.data || []);
      } catch (error) {
        setError("Failed to load student list");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    GetStudentList();
  }, [token]);

  // Fetch attendance when student, month or year changes
  useEffect(() => {
    if (selectedStudent) {
      GetStudentAttendance();
    }
  }, [selectedStudent, selectedMonth, selectedYear]);

  const GetStudentAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const url = `${BASE_URL}/admin/student/monthly-attendance`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const requestBody = {
        studentId: selectedStudent,
        month: selectedMonth,
        year: selectedYear
      };
      
      const response = await axios.post(url, requestBody, { headers });
      // console.log("Response fo the attendance api",response.data);
      // Safely handle the response data
      const responseData = response.data || {};
      
      setAttendanceData({
        student: responseData.student || getStudentDetails(selectedStudent),
        summary: {
          presentCount: responseData.presentCount || 0,
          absentCount: responseData.absentCount || 0,
          attendancePercentage: responseData.attendancePercentage || 0,
          totalClasses: responseData.totalClasses || 0
        },
        attendance: responseData.attendanceDetails || []
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load attendance data");
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get student details from local list
  const getStudentDetails = (studentId) => {
    const student = students.find(s => s._id === studentId);
    return student ? {
      name: `${student.firstname} ${student.lastname}`,
      enrollment: student.enrollmentnumber,
      batch: student.batch?.batchName || 'N/A',
      course: student.course?.courseName || 'N/A'
    } : null;
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const getStatusIcon = (status) => {
    return status === 'Present' ? 
      <CheckCircle color="success" /> : 
      <Cancel color="error" />;
  };

  return (
    <>
      <PageTitle page={"Student Attendance"} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Student Selection Card */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="student-select-label">Select Student</InputLabel>
                <Select
                  labelId="student-select-label"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Select Student"
                  disabled={loading}
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                          {student.firstname?.charAt(0)}
                        </Avatar>
                        {student.firstname} {student.lastname} ({student.enrollmentnumber})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  label="Month"
                  disabled={!selectedStudent || loading}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  onChange={handleYearChange}
                  label="Year"
                  disabled={!selectedStudent || loading}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading && <LinearProgress sx={{ mb: 4 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Student Info and Summary */}
        {attendanceData.student && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person color="primary" sx={{ fontSize: 40, mr: 2 }} />
                      <Typography variant="h6">
                        {attendanceData.student.name}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      <strong>Enrollment:</strong> {attendanceData.student.enrollment}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Batch:</strong> {attendanceData.summary.totalClasses}
                    </Typography>
                    {/* <Typography variant="body1">
                      <strong>Course:</strong> {attendanceData.student.course}
                    </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Summary for {months.find(m => m.value === selectedMonth)?.name} {selectedYear}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <EventAvailable color="primary" sx={{ fontSize: 40 }} />
                          <Typography variant="h5">
                            {attendanceData.summary.presentCount}
                          </Typography>
                          <Typography variant="body2">Present</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <EventBusy color="error" sx={{ fontSize: 40 }} />
                          <Typography variant="h5">
                            {attendanceData.summary.absentCount}
                          </Typography>
                          <Typography variant="body2">Absent</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <BarChart color="secondary" sx={{ fontSize: 40 }} />
                          <Typography variant="h5">
                            {attendanceData.summary.attendancePercentage}%
                          </Typography>
                          <Typography variant="body2">Attendance</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Detailed Attendance Table */}
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Class Attendance Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.attendance.length > 0 ? (
                      attendanceData.attendance.map((record) => (
                        <TableRow key={record.attendanceId || record.classId}>
                          <TableCell>
                            {record.classDate ? new Date(record.classDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </TableCell>
                          <TableCell>{record.className || 'N/A'}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={record.status || 'Absent'}
                              color={record.status === 'Present' ? 'success' : 'error'}
                              icon={getStatusIcon(record.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No attendance records found for this period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default StudentAttendance;