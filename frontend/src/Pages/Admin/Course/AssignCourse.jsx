import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  Paper
} from '@mui/material';

const AssignCourse = () => {
  const token = sessionStorage.getItem('token');

  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedEducators, setSelectedEducators] = useState([]);

  // Fetch all data
  useEffect(() => {
    Getallstudents();
    Getalleducators();
    Getallcourse();
  }, []);

  const Getallstudents = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers });
      setStudents(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const Getalleducators = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers });
      setEducators(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const Getallcourse = async () => {
    try {
      const url = `${BASE_URL}/admin/getcourse`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers });
      setCourses(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleAssignCourse = async () => {
    try {
      const url = `${BASE_URL}/admin/assign-course`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const payload = {
        courseId: selectedCourse,
        students: selectedStudents,
        educators: selectedEducators
      };
      const response = await axios.post(url, payload, { headers });
      // console.log("Assignment successful", response.data);
      // Reset form after successful assignment
      setSelectedCourse('');
      setSelectedStudents([]);
      setSelectedEducators([]);
      alert('Course assigned successfully!');
    } catch (error) {
      // console.log(error);
      alert('Error assigning course');
    }
  };

  return (
    <>
      <PageTitle page={'Assign Course'} />
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Assign Course to Students and Educators
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                label="Select Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.coursename}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Students</InputLabel>
              <Select
                multiple
                value={selectedStudents}
                onChange={(e) => setSelectedStudents(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((studentId) => {
                      const student = students.find(s => s._id === studentId);
                      return student ? (
                        <Chip key={studentId} label={`${student.firstname} ${student.lastname}`} />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    <Checkbox checked={selectedStudents.indexOf(student._id) > -1} />
                    <ListItemText primary={`${student.firstname} ${student.lastname} (${student.enrollmentnumber})`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Educators</InputLabel>
              <Select
                multiple
                value={selectedEducators}
                onChange={(e) => setSelectedEducators(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((educatorId) => {
                      const educator = educators.find(e => e._id === educatorId);
                      return educator ? (
                        <Chip key={educatorId} label={`${educator.firstname} ${educator.lastname}`} />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {educators.map((educator) => (
                  <MenuItem key={educator._id} value={educator._id}>
                    <Checkbox checked={selectedEducators.indexOf(educator._id) > -1} />
                    <ListItemText primary={`${educator.firstname} ${educator.lastname}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignCourse}
              disabled={!selectedCourse || (selectedStudents.length === 0 && selectedEducators.length === 0)}
              fullWidth
            >
              Assign Course
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AssignCourse;