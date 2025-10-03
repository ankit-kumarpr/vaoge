import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Swal from "sweetalert2";

const Addpracticematerial = () => {
  const token = sessionStorage.getItem("token");

  // State for form fields
  const [batchList, setBatchList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [formData, setFormData] = useState({
    materialname: "",
    materialdescription: "",
    batchId: "",
    studentId: "", // Added studentId field
    materialimages: null,
  });

  // Fetch batch list and student list on component mount
  useEffect(() => {
    GetAllBatchList();
    GetStudentListAPI();
  }, []);

  const GetAllBatchList = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      // console.log("Response of batch list", response.data);
      setBatchList(response.data.data); // Set batch list
    } catch (error) {
      // console.log("Error fetching batch list:", error);
    }
  };

  // Get student list
  const GetStudentListAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of student list", response.data);
      if (response.data?.error === false) {
        setStudentList(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching students:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, materialimages: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${BASE_URL}/admin/addpractice`;

      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("materialname", formData.materialname);
      formDataToSend.append("materialdescription", formData.materialdescription);
      formDataToSend.append("batchId", formData.batchId);
      formDataToSend.append("studentId", formData.studentId); // Added studentId to form data
      formDataToSend.append("materialimages", formData.materialimages);

      const response = await axios.post(url, formDataToSend, { headers });
      // console.log("Response of Add Practice", response.data);
      if (response.data.error === false) {
        Swal.fire({
          title: "Good job!",
          text: "Add Practice Material Successfully",
          icon: "success",
        });
        setFormData({
          materialname: "",
          materialdescription: "",
          batchId: "",
          studentId: "",
          materialimages: null,
        });
      }
    } catch (error) {
      // console.log("Error adding practice material:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add practice material",
        icon: "error",
      });
    }
  };

  return (
    <>
      <PageTitle page={"Add Practice Material"} />
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Material Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Material Name"
                name="materialname"
                value={formData.materialname}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Material Description */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Material Description"
                name="materialdescription"
                value={formData.materialdescription}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Batch Selection */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Batch"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                
              >
                {batchList.map((batch) => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchname}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Student Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Student</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  label="Select Student"
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography>Select a student</Typography>;
                    }
                    const student = studentList.find((s) => s._id === selected);
                    return (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            mr: 2,
                            backgroundColor: "secondary.light",
                          }}
                        >
                          {student?.firstname?.charAt(0)}
                          {student?.lastname?.charAt(0)}
                        </Avatar>
                        <Typography>
                          {student?.firstname} {student?.lastname}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {studentList.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            mr: 2,
                            backgroundColor: "secondary.light",
                          }}
                        >
                          {student.firstname.charAt(0)}
                          {student.lastname.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography>
                            {student.firstname} {student.lastname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.enrollmentnumber}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label">
                Upload Material
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {formData.materialimages && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {formData.materialimages.name}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default Addpracticematerial;