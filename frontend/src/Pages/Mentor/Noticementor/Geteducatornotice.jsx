import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { 
  TextField, 
  MenuItem, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Event as EventIcon,
  Person as PersonIcon,
  NotificationsOff as NoNoticeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const Geteducatornotice = () => {
  const token = sessionStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetstudentList();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      GetanystudentNotice(selectedStudent);
    }
  }, [selectedStudent]);

  const GetstudentList = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers });
      // console.log("Educator list",response.data);
      if (!response.data.error) {
        setStudents(response.data.data);
      }
    } catch (error) {
      // console.log(error);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const GetanystudentNotice = async (studentId) => {
    try {
      setLoading(true);
      setNotices([]); // Clear previous notices
      const url = `${BASE_URL}/admin/geteducatornotice/${studentId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers });
      // console.log("student notice api response",response.data);
      if (!response.data.error) {
        setNotices(response.data.data || []);
      }
    } catch (error) {
      // console.log(error);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <>
      <PageTitle page={"Educator Notice"} />
      <div style={{ padding: '20px' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="student-select-label">Select Educator</InputLabel>
          <Select
            labelId="student-select-label"
            value={selectedStudent}
            onChange={handleStudentChange}
            label="Select Student"
            disabled={loading}
          >
            {students.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={`${BASE_URL}/${student.profile}`} 
                    sx={{ width: 32, height: 32, mr: 2 }}
                  >
                    {student.firstname.charAt(0)}
                  </Avatar>
                  <div>
                    <Typography>{student.firstname} {student.lastname}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.enrollmentnumber}
                    </Typography>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && selectedStudent && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <Typography color="error" style={{ marginTop: '20px' }}>
            {error}
          </Typography>
        )}

        {!loading && selectedStudent && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Notices for {students.find(s => s._id === selectedStudent)?.firstname}
            </Typography>

            {notices.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '200px',
                color: 'text.secondary'
              }}>
                <NoNoticeIcon style={{ fontSize: '60px', marginBottom: '20px' }} />
                <Typography variant="h6">No notices found for this student</Typography>
                <Typography variant="body2">This student hasn't received any notices yet</Typography>
              </div>
            ) : (
              notices.map((notice) => (
                <Card key={notice._id} style={{ marginBottom: '20px' }}>
                  <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <EventIcon color="action" style={{ marginRight: '10px' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {formatDate(notice.noticedate)}
                      </Typography>
                    </div>
                    <Typography variant="h6" gutterBottom>
                      {notice.subject}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {notice.message}
                    </Typography>
                    {notice.noticeimage && (
                      <Chip
                        icon={<PersonIcon />}
                        label="Attachment available"
                        variant="outlined"
                        onClick={() => window.open(`http://localhost:4500/uploads/notices/${notice.noticeimage}`, '_blank')}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Geteducatornotice;