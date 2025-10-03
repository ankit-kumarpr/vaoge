import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../../config';
import { TextField, Button, Container, Grid, MenuItem, FormControl, InputLabel, Select, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';

const AddNotice = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    noticedate: '',
    noticeimage: null,
    sendToAll: 'false',
    students: [],
    batches: [],
    educators: [],
    mentors: []
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [educators, setEducators] = useState([]);
  // const [mentors, setMentors] = useState([]);

  useEffect(() => {
    Getsutudents();
    GetBatcheslist();
    Geteducators();
    // Getmentors();
  }, []);

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, noticeimage: e.target.files[0] });
  };

  const AddNoticeAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/add-notice`;
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('noticedate', formData.noticedate);
      formDataToSend.append('sendToAll', formData.sendToAll);
      
      // Convert arrays to comma-separated strings
      if (formData.sendToAll === 'false') {
        formDataToSend.append('students', formData.students.join(','));
        formDataToSend.append('batches', formData.batches.join(','));
        formDataToSend.append('educators', formData.educators.join(','));
        // formDataToSend.append('mentors', formData.mentors.join(','));
      }
      
      if (formData.noticeimage) {
        formDataToSend.append('noticeimage', formData.noticeimage);
      }
  
      const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(url, formDataToSend, { headers });
      // console.log("Response of add notice",response.data);
      if(response.data.data.error==false);
      {
        Swal.fire({
          title: "Good job!",
          text: "Notice Added Successfully..",
          icon: "success"
        }).then(()=>{
          navigate("/notice-list");
        });
      }
      // ... rest of your success handling code
    } catch (error) {
      // console.log('Error adding notice:', error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add notice",
        icon: "error"
      });
    }
  };

  // Get student list
  const Getsutudents = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(url, { headers: headers });
      // console.log("student list",response.data);
      setStudents(response.data.data.map(student => ({
        id: student._id,
        name: `${student.firstname} ${student.lastname}`
      })));
    } catch (error) {
      // console.error("Error fetching students:", error);
    }
  }

  // Get batch list
  const GetBatcheslist = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(url, { headers: headers });
      // console.log("Batch list",response.data);
      setBatches(response.data.data.map(batch => ({
        id: batch._id,
        name: batch.batchname
      })));
    } catch (error) {
      // console.error("Error fetching batches:", error);
    }
  }

  // Get educators list
  const Geteducators = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(url, { headers: headers });
      // console.log("Educator list",response.data);
      setEducators(response.data.data.map(educator => ({
        id: educator._id,
        name: `${educator.firstname} ${educator.lastname}`
      })));
    } catch (error) {
      // console.error("Error fetching educators:", error);
    }
  }

  // Get mentors list
  // const Getmentors = async () => {
  //   try {
  //     const url = `${BASE_URL}/admin/getallmentor`;
  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${token}`
  //     }

  //     const response = await axios.get(url, { headers: headers });
  //     console.log("mentor list",response.data);
  //     setMentors(response.data.data.map(mentor => ({
  //       id: mentor._id,
  //       name: `${mentor.firstname} ${mentor.lastname}`
  //     })));
  //   } catch (error) {
  //     console.error("Error fetching mentors:", error);
  //   }
  // }

  return (
    <>
      <PageTitle page={"Add Notice"} />
      <Container>
        <Grid container spacing={2}>
          {/* First Row - 2 columns */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="noticedate"
              value={formData.noticedate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Second Row - Full width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Third Row - 2 columns */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Send to All</InputLabel>
              <Select
                name="sendToAll"
                value={formData.sendToAll}
                onChange={handleChange}
                label="Send to All"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>

          {/* Conditional fields - only show when sendToAll is false */}
          {formData.sendToAll === 'false' && (
            <>
              {/* Fourth Row - 2 columns */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Students</InputLabel>
                  <Select
                    name="students"
                    multiple
                    value={formData.students}
                    onChange={handleMultiSelectChange}
                    label="Students"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedStudent = students.find(s => s.id === value);
                          return <Chip key={value} label={selectedStudent?.name || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Batches</InputLabel>
                  <Select
                    name="batches"
                    multiple
                    value={formData.batches}
                    onChange={handleMultiSelectChange}
                    label="Batches"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedBatch = batches.find(b => b.id === value);
                          return <Chip key={value} label={selectedBatch?.name || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {batches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Fifth Row - 2 columns */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Educators</InputLabel>
                  <Select
                    name="educators"
                    multiple
                    value={formData.educators}
                    onChange={handleMultiSelectChange}
                    label="Educators"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedEducator = educators.find(e => e.id === value);
                          return <Chip key={value} label={selectedEducator?.name || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {educators.map((educator) => (
                      <MenuItem key={educator.id} value={educator.id}>
                        {educator.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mentors</InputLabel>
                  <Select
                    name="mentors"
                    multiple
                    value={formData.mentors}
                    onChange={handleMultiSelectChange}
                    label="Mentors"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const selectedMentor = mentors.find(m => m.id === value);
                          return <Chip key={value} label={selectedMentor?.name || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {mentors.map((mentor) => (
                      <MenuItem key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
            </>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              className="float-right" 
              color="primary" 
              onClick={AddNoticeAPI}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AddNotice;