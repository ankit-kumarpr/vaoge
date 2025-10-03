import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { Autocomplete, TextField, Button, Box, Typography, Chip } from '@mui/material';
import Swal from 'sweetalert2';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const Assignbatchmentor = () => {
  const token = sessionStorage.getItem('token');
  const [batches, setBatches] = useState([]); // State for batch list
  const [students, setStudents] = useState([]); // State for student list
  const [selectedBatch, setSelectedBatch] = useState(null); // Selected batch
  const [selectedStudents, setSelectedStudents] = useState([]); // Selected students (multiple)

  // Fetch batch list
  useEffect(() => {
    Getallbatches();
    Getallstudents();
  }, []);

  const Getallbatches = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("Response of batch list", response.data);
      setBatches(response.data.data); // Set batch list
    } catch (error) {
      // console.log(error);
    }
  };

  // Fetch student list
  const Getallstudents = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("Response of student api", response.data);
      setStudents(response.data.data); // Set student list
    } catch (error) {
      // console.log(error);
    }
  };

  // Assign batch to students
  const Addbatchtostudent = async () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      alert("Please select a batch and at least one student.");
      return;
    }

    try {
      const url = `${BASE_URL}/admin/assignbatchtostudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const body = {
        batchId: selectedBatch._id, 
        students: selectedStudents.map(student => student._id) // Array of selected student IDs
      };
      // console.log("body of add batch",body);
      const response = await axios.post(url, body, { headers: headers });
      // console.log("Response of batch assign", response.data);
      if(response.data.error==false){
        Swal.fire({
            title: "Good job!",
            text: "Batch Assigned Successfully",
            icon: "success"
          });
      }
      
    } catch (error) {
      // console.log(error);
      alert("Failed to assign batch.");
    }
  };

  return (
    <>
      <PageTitle page={"Assign Batch"} />

      
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        {/* Batch Dropdown */}
        <Typography variant="h6" gutterBottom>
          Select Batch
        </Typography>
        <Autocomplete
          options={batches}
          getOptionLabel={(option) => option.batchname} // Display batch name
          value={selectedBatch}
          onChange={(event, newValue) => setSelectedBatch(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Batch" variant="outlined" fullWidth />
          )}
        />

        {/* Student Dropdown (Multiple Selection) */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Select Students
        </Typography>
        <Autocomplete
          multiple
          options={students}
          getOptionLabel={(option) => `${option.firstname} ${option.lastname}`} // Display student name
          value={selectedStudents}
          onChange={(event, newValue) => setSelectedStudents(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Students" variant="outlined" fullWidth />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option._id}
                label={`${option.firstname} ${option.lastname}`}
                {...getTagProps({ index })}
              />
            ))
          }
        />

        {/* Assign Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={Addbatchtostudent}
            disabled={!selectedBatch || selectedStudents.length === 0}
          >
            Assign Batch
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Assignbatchmentor;