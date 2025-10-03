import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";
import axios from "axios";
import PageTitle from "../../../components/PageTitle";
import { jwtDecode } from 'jwt-decode';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Link,
  Alert,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import Swal from "sweetalert2";

const Gethomework = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [homeworks, setHomeworks] = useState([]);
  const [filteredHomeworks, setFilteredHomeworks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [openModal, setOpenModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store multiple files
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId1 = decodedToken.userId;
  const role = decodedToken.role;

  useEffect(() => {
    Getallbatch();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      Getallhomework(selectedBatchId);
    }
  }, [selectedBatchId]);

  useEffect(() => {
    // Filter homework based on the selected date
    if (homeworks.length > 0) {
      const filtered = homeworks.filter((homework) => {
        const homeworkDate = new Date(homework.createdAt).toISOString().split('T')[0];
        return homeworkDate === selectedDate;
      });
      setFilteredHomeworks(filtered);
    }
  }, [selectedDate, homeworks]);

  const Getallbatch = async () => {
    try {
      const url = `${BASE_URL}/admin/yourbatch/${userId1}/${role}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of get all batch", response.data);
      setBatches(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const Getallhomework = async (batchId) => {
    try {
      const url = `${BASE_URL}/common/approved/${batchId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      // console.log("Response of homework all homework", response.data);
      setHomeworks(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleOpenModal = (homework) => {
    setSelectedHomework(homework);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFiles([]); // Clear selected files
    setSelectedHomework(null);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleSubmitSolution = async () => {
    if (selectedFiles.length === 0 || !selectedHomework) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("homeworkId", selectedHomework._id);
    formData.append("studentId", userId1);

    // Append all selected files to the FormData
    selectedFiles.forEach((file, index) => {
      formData.append("solutionfiles", file); // Append each file
    });

    try {
      const url = `${BASE_URL}/common/uploadsolution`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(url, formData, { headers });
      // console.log("Response of submit solution", response.data);
      if(response.data.error==false){
        Swal.fire({
          title: "Good job!",
          text: "Home work Submitted Successfully!",
          icon: "success"
        });
      }
      
      handleCloseModal();
    } catch (error) {
      // console.log(error);
      alert("Failed to submit homework. Please try again.");
    }
  };

  return (
    <>
      <PageTitle page={"Get Student Homework"} />
      <Container sx={{ mt: 4 }}>

        {/* Batch Selection Dropdown */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          {/* Batch Selection */}
          <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel id="batch-select-label">Select Batch</InputLabel>
            <Select
              labelId="batch-select-label"
              id="batch-select"
              value={selectedBatchId}
              label="Select Batch"
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              <MenuItem value="">Choose a batch...</MenuItem>
              {batches.map((batch) => (
                <MenuItem key={batch._id} value={batch.batchId}>
                  {batch.batchname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Selection */}
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            sx={{ flex: 1 }}
          />
        </Box>

        {/* Homework List */}
        {filteredHomeworks.length === 0 ? (
          <Alert severity="info">No homework found for the selected date</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredHomeworks.map((homework) => (
              <Grid item key={homework._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {homework.homeworkname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {homework.homeworkdescription}
                    </Typography>

                    {/* Display Homework Files */}
                    {homework.homeworkfiles && homework.homeworkfiles.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Attached Files:
                        </Typography>
                        {homework.homeworkfiles.map((file, index) => (
                          <Link
                            key={index}
                            href={`http://localhost:4500/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'block', mb: 1 }}
                          >
                            <Button variant="outlined" size="small">
                              View File {index + 1}
                            </Button>
                          </Link>
                        ))}
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Due Date: {new Date(homework.createdAt).toLocaleDateString()}
                    </Typography>

                    {/* Submit Homework Button */}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(homework)}
                      >
                        Submit Homework
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for File Upload */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Submit Homework</DialogTitle>
          <DialogContent>
            {selectedHomework && (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedHomework.homeworkname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedHomework.homeworkdescription}
                </Typography>
              </>
            )}

            {/* File Input */}
            <TextField
              type="file"
              fullWidth
              inputProps={{ multiple: true }} // Allow multiple files
              onChange={handleFileChange}
              sx={{ mt: 2 }}
            />

            {/* Display Selected Files */}
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files:
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleRemoveFile(index)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleSubmitSolution} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Gethomework;