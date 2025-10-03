import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Paper,
  Box,
  List,
  Button,
  IconButton,
  Badge, // Added the missing Badge import
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Event as EventIcon,
  Person as PersonIcon,
  Notifications as NoticeIcon,
  Class as ClassIcon,
  Group as GroupIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const NoticeCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const AttachmentPreview = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Yournotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId1 = decodedToken.userId;

  useEffect(() => {
    GetanystudentNotice();
  }, []);

  const GetanystudentNotice = async () => {
    try {
      const url = `${BASE_URL}/admin/getmentornotice/${userId1}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers });
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

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const getRecipientsInfo = (notice) => {
    if (notice.sendToAll) {
      return "All students";
    }
    
    const recipients = [];
    if (notice.students && notice.students.length > 0) {
      recipients.push(`${notice.students.length} student(s)`);
    }
    if (notice.batches && notice.batches.length > 0) {
      recipients.push(`${notice.batches.length} batch(es)`);
    }
    if (notice.educators && notice.educators.length > 0) {
      recipients.push(`${notice.educators.length} educator(s)`);
    }
    
    return recipients.join(", ") || "Specific recipients";
  };

  const handleOpenAttachment = (attachment) => {
    setCurrentAttachment(attachment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAttachment(null);
  };

  const getAttachmentType = (filename) => {
    if (!filename) return 'file';
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'file';
  };

  const downloadAttachment = (filename) => {
    const fileUrl = `http://localhost:4500/uploads/notices/${filename}`;
    window.open(fileUrl, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (notices.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <NoticeIcon color="disabled" style={{ fontSize: 80 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Notices Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You don't have any notices yet.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={"Mentor Notice"} />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Notices
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You have {notices.length} notice(s)
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <List>
            {notices.map((notice) => (
              <NoticeCard key={notice._id} elevation={3}>
                <CardContent>
                  {/* <Box display="flex" alignItems="center" mb={2}>
                    <StyledBadge badgeContent={notice.priority || "Normal"} color="secondary">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <NoticeIcon />
                      </Avatar>
                    </StyledBadge>
                    <Box ml={2}>
                      <Typography variant="h6" component="div">
                        {notice.subject}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Posted on {formatDate(notice.createdAt)}
                      </Typography>
                    </Box>
                  </Box> */}
                  
                  <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                    <h6>Subject: </h6>
                    {notice.message}
                  </Typography>
                  
                  {notice.noticeimage && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Attachment:
                      </Typography>
                      <AttachmentPreview>
                        <Box display="flex" alignItems="center">
                          {getAttachmentType(notice.noticeimage) === 'pdf' ? (
                            <PdfIcon color="error" fontSize="large" />
                          ) : (
                            <ImageIcon color="primary" fontSize="large" />
                          )}
                          <Box ml={2}>
                            <Typography variant="body2">
                              {notice.noticeimage}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getAttachmentType(notice.noticeimage).toUpperCase()} file
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          {getAttachmentType(notice.noticeimage) === 'image' && (
                            <IconButton 
                              onClick={() => handleOpenAttachment(notice.noticeimage)}
                              color="primary"
                              aria-label="view attachment"
                            >
                              <ZoomIcon />
                            </IconButton>
                          )}
                          <IconButton 
                            onClick={() => downloadAttachment(notice.noticeimage)}
                            color="primary"
                            aria-label="download attachment"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </AttachmentPreview>
                    </>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item>
                      <Chip
                        icon={<EventIcon fontSize="small" />}
                        label={`Notice Date: ${formatDate(notice.noticedate)}`}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    {/* <Grid item>
                      <Chip
                        icon={<GroupIcon fontSize="small" />}
                        label={getRecipientsInfo(notice)}
                        variant="outlined"
                        size="small"
                      />
                    </Grid> */}
                  </Grid>
                </CardContent>
              </NoticeCard>
            ))}
          </List>
        </Grid>
      </Grid>

      {/* Attachment Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {currentAttachment && (
            getAttachmentType(currentAttachment) === 'pdf' ? (
              <iframe 
                src={`http://localhost:4500/uploads/notices/${currentAttachment}`}
                width="100%"
                height="600px"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            ) : (
              <img
                src={`http://localhost:4500/uploads/notices/${currentAttachment}`}
                alt="Notice Attachment"
                style={{ width: '100%', height: 'auto' }}
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<DownloadIcon />}
            onClick={() => downloadAttachment(currentAttachment)}
          >
            Download
          </Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Yournotice;