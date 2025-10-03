import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const Createnewcourse = () => {
  const token = sessionStorage.getItem('token');

  const [formData, setFormData] = useState({
    coursename: '',
    price: '',
    gst: '',
    duration: '',
    description: '',
    courseimage: null,
  });

  const navigate=useNavigate();
  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, courseimage: e.target.files[0] });
  };

  // API call to add course
  const AddcourseAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/add-course`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append('coursename', formData.coursename);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('gst', formData.gst);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('description', formData.description);

      if (formData.courseimage) {
        formDataToSend.append('courseimage', formData.courseimage);
      }

      const response = await axios.post(url, formDataToSend, { headers });
      // console.log("Response for Add course API:", response.data);
      if(response.data.error==false){
        Swal.fire({
            title: "Good job!",
            text: "Course Added Successfully !",
            icon: "success"
          }).then(()=>{
            navigate("/all-course");
          });
      }
      
      
    } catch (error) {
      // console.error("Error adding course:", error);
    }
  };

  return (
    <>
      <PageTitle page={"Add Course"} />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Course Name"
              name="coursename"
              value={formData.coursename}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="GST Percentage"
              name="gst"
              type="text"
              value={formData.gst}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={AddcourseAPI}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Createnewcourse;
