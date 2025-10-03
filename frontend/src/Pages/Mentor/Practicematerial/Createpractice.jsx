import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";

const Createpractice = () => {
  const token = sessionStorage.getItem("token");

  // State for form fields
  const [batchList, setBatchList] = useState([]);
  const [formData, setFormData] = useState({
    materialname: "",
    materialdescription: "",
    batchId: "",
    materialimages: null,
  });

  // Fetch batch list on component mount
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
      // console.log("Response of batch list", response.data);
      setBatchList(response.data.data); // Set batch list
    } catch (error) {
      // console.log("Error fetching batch list:", error);
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
        "Content-Type": "multipart/form-data", // Set for file upload
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("materialname", formData.materialname);
      formDataToSend.append("materialdescription", formData.materialdescription);
      formDataToSend.append("batchId", formData.batchId);
      formDataToSend.append("materialimages", formData.materialimages);

      const response = await axios.post(url, formDataToSend, { headers });
      // console.log("Response of Add Practice", response.data);
      if(response.data.error==false){
        Swal.fire({
          title: "Good job!",
          text: "Add Practice Material Successfully",
          icon: "success"
        });
        setFormData({materialname:'',materialdescription:'',batchId:'',materialimages:''});
      }
    } catch (error) {
      // console.log("Error adding practice material:", error);
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
                required
              >
                {batchList.map((batch) => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchname}
                  </MenuItem>
                ))}
              </TextField>
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

export default Createpractice;
