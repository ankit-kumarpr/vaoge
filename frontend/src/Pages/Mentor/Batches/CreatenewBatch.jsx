import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Container, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';


const CreatenewBatch = () => {
  const token = sessionStorage.getItem("token");
  const [mentors, setMentors] = useState([]);
  const [educators, setEducators] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    batchname: "",
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
    Getmentorlist();
    Geteducators();
    Getstudents();
  }, []);

  const Getmentorlist = async () => {
    try {
      const url = `${BASE_URL}/admin/getallmentor`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("response of mentor", response.data);
      setMentors(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const Geteducators = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("response of educator", response.data);
      setEducators(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const Getstudents = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("response of student", response);
      setStudents(response.data.data);
    } catch (error) {
      // console.log(error);
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

  const handleMultipleSelect = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/admin/addbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(url, formData, { headers: headers });
      // console.log("Batch created successfully", response.data);
      if(response.data.error==false)
      {
        Swal.fire({
            title: "Good job!",
            text: "Batch Created Successfully",
            icon: "success"
          });
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <PageTitle page={"Create Batch"} />
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Batch Name
  </Typography>
              <TextField
                fullWidth
                label="Batch Name"
                name="batchname"
                value={formData.batchname}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Select Mentor
  </Typography>
              <FormControl fullWidth>
                {/* <InputLabel>Mentor</InputLabel> */}
                <Select
                  name="mentorId"
                  value={formData.mentorId}
                  onChange={handleChange}
                  
                >
                  {mentors.map((mentor) => (
                    <MenuItem key={mentor._id} value={mentor._id}>
                      {mentor.firstname} {mentor.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Select Educator
  </Typography>
              <FormControl fullWidth>
                {/* <InputLabel>Educators</InputLabel> */}
                <Select
                  name="educators"
                  multiple
                  value={formData.educators}
                  onChange={handleMultipleSelect}
                  required
                >
                  {educators.map((educator) => (
                    <MenuItem key={educator._id} value={educator._id}>
                      {educator.firstname} {educator.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Select Student
  </Typography>
              <FormControl fullWidth>
                <InputLabel>Students</InputLabel>
                <Select
                  name="students"
                  multiple
                  value={formData.students}
                  onChange={handleMultipleSelect}
                  required
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.firstname} {student.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Select Days
  </Typography>
              <FormControl fullWidth>
                {/* <InputLabel>Schedule Days</InputLabel> */}
                <Select
                  name="days"
                  multiple
                  value={formData.schedule.days}
                  onChange={(e) => handleScheduleChange({ target: { name: "days", value: e.target.value } })}
                  required
                >
                  {daysOptions.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
    Schedule Time
  </Typography>
              <TextField
                fullWidth
                // label="Schedule Time"
                name="time"
                type="time"
                value={formData.schedule.time}
                onChange={handleScheduleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Create Batch
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default CreatenewBatch;