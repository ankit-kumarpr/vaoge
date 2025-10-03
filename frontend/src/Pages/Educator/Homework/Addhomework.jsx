import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Grid,
  Chip,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Addhomework = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const educatorId = decodedToken.userId;
  const role = decodedToken.role;
  const [batchList, setBatchList] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [homeworkName, setHomeworkName] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [homeworkFiles, setHomeworkFiles] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errors, setErrors] = useState({
    homeworkName: false,
    selectedStudents: false,
  });

  useEffect(() => {
    Getbatchlist();
    GetStudentList();
  }, []);


  const navigate=useNavigate();
  const Getbatchlist = async () => {
    try {
      const url = `${BASE_URL}/admin/yourbatch/${educatorId}/${role}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      setBatchList(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const GetStudentList = async () => {
    try {
      const url = `${BASE_URL}/admin/getstudentlistofeducator/${educatorId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      setStudentList(response.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleStudentChange = (event) => {
    const { value } = event.target;
    setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
    setErrors({...errors, selectedStudents: false});
  };

  const validateForm = () => {
    const newErrors = {
      homeworkName: !homeworkName.trim(),
      selectedStudents: selectedStudents.length === 0,
    };
    setErrors(newErrors);
    return !newErrors.homeworkName && !newErrors.selectedStudents;
  };

  const Givehomework = async () => {
    if (!validateForm()) return;

    try {
      const url = `${BASE_URL}/common/addhomework`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();
      formData.append("homeworkname", homeworkName);
      formData.append("homeworkdescription", homeworkDescription);
      formData.append("educatorId", educatorId);
      
      // Append each student ID separately
      selectedStudents.forEach(studentId => {
        formData.append("studentIds[]", studentId);
      });

      // Optional batch ID
      if (selectedBatchId) {
        formData.append("batchId", selectedBatchId);
      }

      if (homeworkFiles) {
        formData.append("homeworkfiles", homeworkFiles);
      }

      const response = await axios.post(url, formData, { headers: headers });
      // console.log("Homework added successfully", response.data);
      if(response.data.error==false){
        Swal.fire({
          title: "Good job!",
          text: "Home work added successfully !",
          icon: "success"
        }).then(()=>{
          navigate('/homework-list');
        });
      }
      
      // Reset form
      setSelectedBatchId("");
      setHomeworkName("");
      setHomeworkDescription("");
      setHomeworkFiles(null);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error adding homework:", error);
      alert("Failed to add homework. Please try again.");
    }
  };

  return (
    <>
      <PageTitle page={"Give Home Work"} />
      <Box sx={{ maxWidth: "auto", margin: "auto", marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Homework
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Homework Name *"
              value={homeworkName}
              onChange={(e) => {
                setHomeworkName(e.target.value);
                setErrors({...errors, homeworkName: false});
              }}
              error={errors.homeworkName}
              helperText={errors.homeworkName ? "Homework name is required" : ""}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="batch-select-label">Select Batch (Optional)</InputLabel>
              <Select
                labelId="batch-select-label"
                id="batch-select"
                value={selectedBatchId}
                label="Select Batch (Optional)"
                onChange={(e) => setSelectedBatchId(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {batchList.map((batch) => (
                  <MenuItem key={batch._id} value={batch._id}>
                    {batch.batchname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth margin="normal" error={errors.selectedStudents}>
          <InputLabel id="student-select-label">Select Students *</InputLabel>
          <Select
            labelId="student-select-label"
            id="student-select"
            multiple
            value={selectedStudents}
            onChange={handleStudentChange}
            input={<OutlinedInput label="Select Students *" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const student = studentList.find(s => s._id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={student ? `${student.firstname} ${student.lastname}` : value}
                    />
                  );
                })}
              </Box>
            )}
          >
            {studentList.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {`${student.firstname} ${student.lastname}`}
              </MenuItem>
            ))}
          </Select>
          {errors.selectedStudents && (
            <FormHelperText>At least one student must be selected</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Homework Description"
          multiline
          rows={4}
          value={homeworkDescription}
          onChange={(e) => setHomeworkDescription(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setHomeworkFiles(e.target.files[0])}
          style={{ marginTop: 16, marginBottom: 16 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={Givehomework}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Submit Homework
        </Button>
      </Box>
    </>
  );
};

export default Addhomework;