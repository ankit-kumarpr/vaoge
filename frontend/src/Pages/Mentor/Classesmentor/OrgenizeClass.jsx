import React, { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Grid, Container, Typography, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";

const OrgenizeClass = () => {
  const token = sessionStorage.getItem("token");

  // State for form fields
  const [formData, setFormData] = useState({
    classname: "",
    batchId: "",
    classlink: "",
    classDate: "",
    days: [],
    time: "",
  });

  // State for batch list
  const [batchList, setBatchList] = useState([]);

  // Days options for multi-select dropdown
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const navigate=useNavigate();
  // Fetch batch list
  useEffect(() => {
    GetAllBatchList();
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

      // console.log("Batch API Response:", response.data);

      // Ensure batchList is an array
      const batches = Array.isArray(response.data.data) ? response.data.data : [];
      setBatchList(batches);
    } catch (error) {
      // console.log("Error fetching batches:", error);
      setBatchList([]);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle days selection change
  const handleDaysChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, days: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/admin/createclass`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        classname: formData.classname,
        batchId: formData.batchId,
        classShedule: {
          days: formData.days, // Already an array
          time: formData.time,
        },
        classlink: formData.classlink,
        classDate: formData.classDate,
      };

      const response = await axios.post(url, payload, { headers });

      // console.log("Class Created Successfully:", response.data);
      if(response.data.error==false){
        Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success"
        }).then(()=>{
          navigate('/class-list')
        });
        setFormData({classname:'',batchId:'',classlink:'',classDate:'',days:'',time:''});
      }
    } catch (error) {
      // console.log("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
  };

  return (
    <Container>
      <PageTitle page={"Create New Class"} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Class Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class Name"
              name="classname"
              value={formData.classname}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Batch Selection */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Select Batch"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
            >
              {batchList.length > 0 ? (
                batchList.map((batch) => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Batches Available</MenuItem>
              )}
            </TextField>
          </Grid>

          {/* Class Link */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class Link"
              name="classlink"
              value={formData.classlink}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Class Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="classDate"
              value={formData.classDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Class Days (Multi-select Dropdown) */}
          <Grid item xs={12} sm={6}>
          <Typography variant="body1" gutterBottom>
    Class Days
  </Typography>
            <FormControl fullWidth>
              {/* <InputLabel>Class Days</InputLabel> */}
              <Select
                multiple
                name="days"
                value={formData.days}
                onChange={handleDaysChange}
                required
                renderValue={(selected) => selected.join(", ")}
              >
                {daysOptions.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Class Time */}
          <Grid item xs={12} sm={6}>
          <Typography variant="body1" gutterBottom>
    Class Time
  </Typography>
            <TextField
              fullWidth
              // label="Class Time (e.g. 08:30 AM - 11:30 AM)"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Class
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default OrgenizeClass;