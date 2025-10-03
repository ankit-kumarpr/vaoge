import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
  Box,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  Class as ClassIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const AllDatadEduStuAndBatch = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const mentorId = decodedToken.userId;

  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    educators: true,
    students: true,
    batches: true
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  useEffect(() => {
    GetMentorAlldataAPI();
  }, []);

  const GetMentorAlldataAPI = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/allmentordata/${mentorId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers });
      // console.log("Mentor data", response.data);
      setMentorData(response.data.mentor);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!mentorData) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          No mentor data found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: '24px 0' }}>
      <Paper elevation={3} style={{ padding: '24px', borderRadius: '12px' }}>
        {/* Mentor Profile Section */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={mentorData.profile ? `http://localhost:4500/${mentorData.profile}` : undefined}
              alt={`${mentorData.firstname} ${mentorData.lastname}`}
              style={{ width: '150px', height: '150px',backgroundSize:"contain" }}
            >
              <PersonIcon style={{ fontSize: '60px' }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              {mentorData.firstname} {mentorData.lastname}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Mentor ID: {mentorData.mentorId}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              <Chip label={`Email: ${mentorData.email}`} variant="outlined" />
              <Chip label={`Phone: ${mentorData.phone}`} variant="outlined" />
              <Chip label={`Role: ${mentorData.role}`} color="primary" />
            </Box>
          </Grid>
        </Grid>

        <Divider style={{ margin: '24px 0' }} />

        {/* Educators Accordion */}
        <Accordion expanded={expanded.educators} onChange={handleAccordionChange('educators')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <GroupsIcon color="primary" style={{ marginRight: '8px' }} />
              <Typography variant="h6">Educators</Typography>
              <Chip 
                label={`${mentorData.educators?.length || 0}`} 
                size="small" 
                style={{ marginLeft: '12px' }} 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {mentorData.educators?.length > 0 ? (
              <List>
                {mentorData.educators.map((educator, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${educator.firstname} ${educator.lastname}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            ID: {educator.educatorId}
                          </Typography>
                          <br />
                         
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No educators assigned
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Students Accordion */}
        <Accordion expanded={expanded.students} onChange={handleAccordionChange('students')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <SchoolIcon color="secondary" style={{ marginRight: '8px' }} />
              <Typography variant="h6">Students</Typography>
              <Chip 
                label={`${mentorData.students?.length || 0}`} 
                size="small" 
                color="secondary" 
                style={{ marginLeft: '12px' }} 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {mentorData.students?.length > 0 ? (
              <List>
                {mentorData.students.map((student, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.firstname} ${student.lastname}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            Enrollment: {student.enrollmentnumber}
                          </Typography>
                         
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No students assigned
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Batches Accordion */}
        <Accordion expanded={expanded.batches} onChange={handleAccordionChange('batches')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <ClassIcon style={{ color: '#4caf50', marginRight: '8px' }} />
              <Typography variant="h6">Batches</Typography>
              <Chip 
                label={`${mentorData.batches?.length || 0}`} 
                size="small" 
                style={{ backgroundColor: '#4caf50', color: 'white', marginLeft: '12px' }} 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {mentorData.batches?.length > 0 ? (
              <List>
                {mentorData.batches.map((batch, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#4caf50' }}>
                        <ClassIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={batch.batchName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            Course: {batch.courseName}
                          </Typography>
                          <br />
                          Schedule: {batch.schedule?.days?.join(', ')} at {batch.schedule?.time}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No batches assigned
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
};

export default AllDatadEduStuAndBatch;