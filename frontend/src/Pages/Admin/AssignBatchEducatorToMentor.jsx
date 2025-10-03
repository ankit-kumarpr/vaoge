import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config';
import PageTitle from '../../components/PageTitle';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// MUI Components
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemText,
  Checkbox,
  OutlinedInput,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import Swal from 'sweetalert2';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AssignBatchEducatorToMentor = () => {
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const mentorId = decodedToken.userId;

    // State for all lists
    const [batchList, setBatchList] = useState([]);
    const [educatorList, setEducatorList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [mentorList, setMentorList] = useState([]);
    
    // State for selected items
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [selectedEducators, setSelectedEducators] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GetMentorList();
        GetAllBatchList();
        GetAllEducatorList();
        GetallStudentList();
    }, []);

  const  navigate=useNavigate();
    // get all mentor list
    const GetMentorList = async () => {
        try {
            setIsLoading(true);
            const url = `${BASE_URL}/admin/getallmentor`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(url, { headers: headers });
            // console.log("Response of Mentor List API", response.data.data);
            setMentorList(response.data.data);
        } catch (error) {
            // console.log(error);
            toast.error('Failed to fetch mentor list');
        } finally {
            setIsLoading(false);
        }
    }

    // fetching all batch
    const GetAllBatchList = async () => {
        try {
            setIsLoading(true);
            const url = `${BASE_URL}/admin/getbatch`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(url, { headers: headers });
            setBatchList(response.data.data);
        } catch (error) {
            // console.log(error);
            toast.error('Failed to fetch batch list');
        } finally {
            setIsLoading(false);
        }
    }

    // fetching all educator
    const GetAllEducatorList = async () => {
        try {
            setIsLoading(true);
            const url = `${BASE_URL}/admin/getalleducator`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(url, { headers: headers });
            setEducatorList(response.data.data || []);
        } catch (error) {
            // console.log(error);
            toast.error('Failed to fetch educator list');
        } finally {
            setIsLoading(false);
        }
    }

    // fetching all student
    const GetallStudentList = async () => {
        try {
            setIsLoading(true);
            const url = `${BASE_URL}/admin/getallstudent`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(url, { headers: headers });
            setStudentList(response.data.data);
        } catch (error) {
            // console.log(error);
            toast.error('Failed to fetch student list');
        } finally {
            setIsLoading(false);
        }
    }

    // assign all things
    const AssignBatchEducatorStudent = async () => {
        try {
            if (!selectedMentor) {
                toast.warning('Please select a mentor');
                return;
            }

            if (selectedBatches.length === 0 && selectedEducators.length === 0 && selectedStudents.length === 0) {
                toast.warning('Please select at least one batch, educator, or student');
                return;
            }

            setIsLoading(true);
            const url = `${BASE_URL}/admin/assign-student-educator-batch-to-mentor`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }

            const payload = {
                mentorId: selectedMentor,
                educators: selectedEducators,
                students: selectedStudents,
                batches: selectedBatches
            };

            // console.log("Payload for Assign Batch", payload);
            const response = await axios.post(url, payload, { headers: headers });
            // console.log("Response of Assign APi",response.data);

            if (response.data.message == "Mentor assigned successfully.") {
                // toast.success(response.data.message);

                Swal.fire({
                    title: "Good job!",
                    text: "Mentor Assign Successfully",
                    icon: "success"
                  }).then(()=>{
                    navigate('/admindashboard')
                  });
                setSelectedMentor('');
                setSelectedBatches([]);
                setSelectedEducators([]);
                setSelectedStudents([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            // console.log(error);
            toast.error('Failed to assign resources to mentor');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container maxWidth="lg" style={{ padding: '24px' }}>
            <PageTitle page={"Assign Batch Educator To Mentor"} />
            
            <Paper elevation={3} style={{ padding: '32px', borderRadius: '12px' }}>
                <Typography variant="h4" style={{ marginBottom: '24px', color: '#1976d2', fontWeight: 600 }}>
                    Assign Resources to Mentor
                </Typography>
                
                <Divider style={{ margin: '24px 0' }} />
                
                {/* Mentor Selection (Single Select) */}
                <Box style={{ marginBottom: '32px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="mentor-select-label">Select Mentor</InputLabel>
                        <Select
                            labelId="mentor-select-label"
                            value={selectedMentor}
                            onChange={(e) => setSelectedMentor(e.target.value)}
                            input={<OutlinedInput label="Select Mentor" />}
                            MenuProps={MenuProps}
                        >
                            {mentorList.map((mentor) => (
                                <MenuItem key={mentor._id} value={mentor._id}>
                                    <ListItemText primary={`${mentor.firstname} ${mentor.lastname} (${mentor.mentorId || mentor._id})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Batches Selection (Multi Select) */}
                <Box style={{ marginBottom: '32px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="batch-select-label">Select Batches</InputLabel>
                        <Select
                            labelId="batch-select-label"
                            multiple
                            value={selectedBatches}
                            onChange={(e) => setSelectedBatches(e.target.value)}
                            input={<OutlinedInput label="Select Batches" />}
                            renderValue={(selected) => (
                                <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {selected.map((value) => {
                                        const batch = batchList.find(b => b.batchId === value);
                                        return (
                                            <Chip 
                                                key={value} 
                                                label={`${batch?.batchname} (${batch?.coursename})`} 
                                                style={{ margin: '4px' }} 
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {batchList.map((batch) => (
                                <MenuItem key={batch.batchId} value={batch.batchId}>
                                    <Checkbox checked={selectedBatches.indexOf(batch.batchId) > -1} />
                                    <ListItemText primary={`${batch.batchname} (${batch.coursename})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                
                {/* Educators Selection (Multi Select) */}
                <Box style={{ marginBottom: '32px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="educator-select-label">Select Educators</InputLabel>
                        <Select
                            labelId="educator-select-label"
                            multiple
                            value={selectedEducators}
                            onChange={(e) => setSelectedEducators(e.target.value)}
                            input={<OutlinedInput label="Select Educators" />}
                            renderValue={(selected) => (
                                <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {selected.map((value) => {
                                        const educator = educatorList.find(e => e.educatorId === value);
                                        return (
                                            <Chip 
                                                key={value} 
                                                label={`${educator?.firstname} ${educator?.lastname}`} 
                                                style={{ margin: '4px' }} 
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {educatorList.map((educator) => (
                                <MenuItem key={educator.educatorId} value={educator.educatorId}>
                                    <Checkbox checked={selectedEducators.indexOf(educator.educatorId) > -1} />
                                    <ListItemText primary={`${educator.firstname} ${educator.lastname} (${educator.educatorId})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                
                {/* Students Selection (Multi Select) */}
                <Box style={{ marginBottom: '32px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="student-select-label">Select Students</InputLabel>
                        <Select
                            labelId="student-select-label"
                            multiple
                            value={selectedStudents}
                            onChange={(e) => setSelectedStudents(e.target.value)}
                            input={<OutlinedInput label="Select Students" />}
                            renderValue={(selected) => (
                                <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {selected.map((value) => {
                                        const student = studentList.find(s => s.studentId === value);
                                        return (
                                            <Chip 
                                                key={value} 
                                                label={`${student?.firstname} ${student?.lastname}`} 
                                                style={{ margin: '4px' }} 
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {studentList.map((student) => (
                                <MenuItem key={student.studentId} value={student.studentId}>
                                    <Checkbox checked={selectedStudents.indexOf(student.studentId) > -1} />
                                    <ListItemText primary={`${student.firstname} ${student.lastname} (${student.enrollmentnumber})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                
                {/* Submit Button */}
                <Box style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={AssignBatchEducatorStudent}
                        disabled={isLoading}
                        style={{ 
                            padding: '12px 24px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            ...(isLoading && { padding: '12px 24px' })
                        }}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isLoading ? 'Assigning...' : 'Assign Resources'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default AssignBatchEducatorToMentor;