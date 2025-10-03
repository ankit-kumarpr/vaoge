import React, { useEffect, useState } from 'react';
import BASE_URL from '../../../config';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  Paper,
  LinearProgress,
  Alert,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemIcon
} from '@mui/material';
import { CalendarToday, Class, Schedule, VideoCall, Notes, AccessTime, Description, Assignment, Upload } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import PageTitle from '../../../components/PageTitle';

const OurClasslist = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [notesDialogOpen, setNotesDialogOpen] = useState(false);
    const [homeworkDialogOpen, setHomeworkDialogOpen] = useState(false);
    const [currentClassNotes, setCurrentClassNotes] = useState([]);
    const [currentClassHomework, setCurrentClassHomework] = useState([]);
    const [notesLoading, setNotesLoading] = useState(false);
    const [homeworkLoading, setHomeworkLoading] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedClassName, setSelectedClassName] = useState('');
    const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
    const [solutionFile, setSolutionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const studentId = decodedToken.userId;

    useEffect(() => {
        if (studentId) {
            getClassesForDate();
        }
    }, [selectedDate, studentId]);

    const getClassesForDate = async () => {
        try {
            setLoading(true);
            setError('');
            const url = `${BASE_URL}/admin/getselfclass`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };
            
            const response = await axios.post(url, {
                studentId,
                date: selectedDate
            }, { headers });
            // console.log("response of student class",response.data);
            if (response.data.error === false && response.data.data) {
                setClasses(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
            } else {
                setClasses([]);
            }
        } catch (error) {
            // console.error("Error fetching classes:", error);
            setError(error.response?.data?.message || "Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const getDayColor = (day) => {
        const colors = {
            Monday: '#4e79a7',
            Tuesday: '#f28e2b',
            Wednesday: '#e15759',
            Thursday: '#76b7b2',
            Friday: '#59a14f',
            Saturday: '#edc948',
            Sunday: '#b07aa1'
        };
        return colors[day] || '#888';
    };

    const getClassNotes = async (classId, className) => {
        try {
            setNotesLoading(true);
            setSelectedClassId(classId);
            setSelectedClassName(className);
            const url = `${BASE_URL}/admin/classnotes/${classId}`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(url, { headers });
            // console.log("Response of the get class notes", response.data);
            
            if (response.data.message === "Class data with notes fetched successfully") {
                setCurrentClassNotes(response.data.notes || []);
                setNotesDialogOpen(true);
            } else {
                setCurrentClassNotes([]);
                setNotesDialogOpen(true);
            }
        } catch (error) {
            // console.log(error);
            setError("Failed to fetch class notes");
        } finally {
            setNotesLoading(false);
        }
    };

    const getClassHomework = async (classId, className) => {
        try {
            setHomeworkLoading(true);
            setSelectedClassId(classId);
            setSelectedClassName(className);
            const url = `${BASE_URL}/admin/classwork/${classId}`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(url, { headers });
            // console.log("Response of the get class homework", response.data);
            
            if (response.data.message === "Class data with home work fetched successfully") {
                setCurrentClassHomework(response.data.homework || []);
                setHomeworkDialogOpen(true);
            } else {
                setCurrentClassHomework([]);
                setHomeworkDialogOpen(true);
            }
        } catch (error) {
            // console.log(error);
            setError("Failed to fetch class homework");
        } finally {
            setHomeworkLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setSolutionFile(event.target.files[0]);
    };

    const submitClassHomeworkSolution = async (homeworkId) => {
        try {
            if (!solutionFile) {
                setError("Please select a file to upload");
                return;
            }

            setIsSubmitting(true);
            setError('');
            setSubmitSuccess(false);

            const formData = new FormData();
            formData.append('classhomeworkId', homeworkId);
            formData.append('studentId', studentId);
            formData.append('file', solutionFile);

            const url = `${BASE_URL}/admin/upload-solution`;
            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            };

            const response = await axios.post(url, formData, { headers });
            // console.log("Response of homework submit api", response.data);

            if (response.data.message === "Homework solution uploaded successfully") {
                setSubmitSuccess(true);
                setSolutionFile(null);
                // Refresh homework data
                if (selectedClassId) {
                    await getClassHomework(selectedClassId, selectedClassName);
                }
            } else {
                setError(response.data.message || "Failed to submit homework");
            }
        } catch (error) {
            // console.log(error);
            setError(error.response?.data?.message || "Failed to submit homework");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseNotesDialog = () => {
        setNotesDialogOpen(false);
        setCurrentClassNotes([]);
        setSelectedClassId(null);
        setSelectedClassName('');
    };

    const handleCloseHomeworkDialog = () => {
        setHomeworkDialogOpen(false);
        setCurrentClassHomework([]);
        setSelectedClassId(null);
        setSelectedClassName('');
        setSelectedHomeworkId(null);
        setSolutionFile(null);
        setSubmitSuccess(false);
    };

    const formatFileUrl = (url) => {
        return url.replace(/\\/g, '/');
    };

    return (
        <>
            <PageTitle page={"Your Classes"} />
            
            {/* Date Picker Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box display="flex" alignItems="center">
                    <CalendarToday color="primary" sx={{ mr: 2 }} />
                    <TextField
                        label="Select Date"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ width: 300 }}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            </Paper>

            {loading && <LinearProgress sx={{ mb: 4 }} />}
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {/* Class List */}
            {classes.length === 0 && !loading ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                        No classes scheduled for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {classes.map((cls, index) => (
                        <Grid item key={cls._id || index} xs={12} sm={6} md={4}>
                            <Card sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{ 
                                            bgcolor: 'secondary.main', 
                                            width: 40, 
                                            height: 40, 
                                            mr: 2 
                                        }}>
                                            <Class fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="bold">
                                            {cls.className}
                                        </Typography>
                                    </Box>
                                    
                                    <Divider sx={{ my: 2 }} />

                                    <Box mb={2}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <CalendarToday color="action" sx={{ mr: 1, fontSize: 20 }} />
                                            <Typography>
                                                {format(parseISO(cls.classDate), 'MMMM d, yyyy')}
                                            </Typography>
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                                                Class Schedule:
                                            </Typography>
                                            {cls.schedule?.map((scheduleItem, i) => (
                                                <Box key={i} sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    p: 1,
                                                    backgroundColor: '#f5f5f5',
                                                    borderRadius: 1
                                                }}>
                                                    <AccessTime color="action" sx={{ mr: 1, fontSize: 20 }} />
                                                    <Typography>
                                                        {scheduleItem.day}: {scheduleItem.time}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </CardContent>

                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<Notes />}
                                                onClick={() => getClassNotes(cls.classId, cls.className)}
                                                sx={{
                                                    py: 1,
                                                    borderRadius: 1,
                                                    fontWeight: 'bold',
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Notes
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<Assignment />}
                                                onClick={() => getClassHomework(cls.classId, cls.className)}
                                                sx={{
                                                    py: 1,
                                                    borderRadius: 1,
                                                    fontWeight: 'bold',
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Homework
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                href={cls.classLink}
                                                target="_blank"
                                                startIcon={<VideoCall />}
                                                sx={{
                                                    py: 1,
                                                    borderRadius: 1,
                                                    fontWeight: 'bold',
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Join
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Notes Dialog */}
            <Dialog open={notesDialogOpen} onClose={handleCloseNotesDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Notes color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                            Notes for {selectedClassName}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {notesLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : currentClassNotes.length > 0 ? (
                        <List>
                            {currentClassNotes.map((note, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Description color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={note.title}
                                        secondary={`Uploaded: ${format(parseISO(note.createdAt), 'PPpp')}`}
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            const fullUrl = `http://localhost:4500/${formatFileUrl(note.fileUrl)}`;
                                            window.open(fullUrl, '_blank');
                                        }}
                                        sx={{ ml: 2 }}
                                    >
                                        Download
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" color="text.secondary" textAlign="center" py={2}>
                            No notes available for this class
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNotesDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Homework Dialog */}
            <Dialog open={homeworkDialogOpen} onClose={handleCloseHomeworkDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Assignment color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                            Homework for {selectedClassName}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {homeworkLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : currentClassHomework.length > 0 ? (
                        <>
                            <List>
                                {currentClassHomework.map((homework, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <Description color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={homework.title}
                                            secondary={
                                                <>
                                                    <div>Uploaded: {format(parseISO(homework.createdAt), 'PPpp')}</div>
                                                    {homework.description && <div>{homework.description}</div>}
                                                </>
                                            }
                                        />
                                        {homework.fileUrl && (
                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    const fullUrl = `http://localhost:4500/${formatFileUrl(homework.fileUrl)}`;
                                                    window.open(fullUrl, '_blank');
                                                }}
                                                sx={{ ml: 2 }}
                                            >
                                                Download
                                            </Button>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Submit Your Solution
                                </Typography>
                                
                                {submitSuccess && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Homework solution submitted successfully!
                                    </Alert>
                                )}
                                
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<Upload />}
                                    >
                                        Select File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    
                                    <Typography>
                                        {solutionFile ? solutionFile.name : "No file selected"}
                                    </Typography>
                                    
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => submitClassHomeworkSolution(currentClassHomework[0]._id)}
                                        disabled={!solutionFile || isSubmitting}
                                        sx={{ ml: 'auto' }}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            "Submit Solution"
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1" color="text.secondary" textAlign="center" py={2}>
                            No homework assigned for this class
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHomeworkDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OurClasslist;