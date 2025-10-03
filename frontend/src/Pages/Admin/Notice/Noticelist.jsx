import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  Avatar,
  Chip,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Attachment as AttachmentIcon,
  CheckCircle as CheckCircleIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6]
  }
}));

const AttachmentContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
}));

const getFileIcon = (fileName) => {
  if (!fileName) return <FileIcon />;
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch(extension) {
    case 'pdf':
      return <PdfIcon color="error" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon color="primary" />;
    default:
      return <FileIcon />;
  }
};

const getFilePreview = (fileUrl, fileName) => {
  if (!fileName) return null;
  
  const extension = fileName.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  
  if (isImage) {
    return (
      <img 
        src={fileUrl} 
        alt="Attachment preview" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '200px',
          marginTop: '10px',
          borderRadius: '4px'
        }} 
      />
    );
  }
  
  return null;
};

const NoticeList = () => {
    const token = sessionStorage.getItem("token");
    const [notices, setNotices] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        noticedate: '',
        noticeimage: null
    });
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        Getnoticelist();
    }, []);

    const Getnoticelist = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/getnotice`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log("Response of get notice",response.data);
            if (!response.data.error) {
                setNotices(response.data.data);
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this notice!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/admin/delnotice/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNotices(notices.filter(notice => notice._id !== id));
                    Swal.fire('Deleted!', 'The notice has been deleted.', 'success');
                } catch (error) {
                    // console.log(error);
                }
            }
        });
    };

    const handleEditClick = (notice) => {
        setSelectedNotice(notice);
        setFormData({
            subject: notice.subject,
            message: notice.message,
            noticedate: new Date(notice.noticedate).toISOString().split('T')[0],
            noticeimage: null
        });
        setPreviewImage(notice.noticeimage ? 
            `${BASE_URL}/uploads/notices/${notice.noticeimage}` : '');
        setOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formPayload = new FormData();
        formPayload.append('subject', formData.subject);
        formPayload.append('message', formData.message);
        formPayload.append('noticedate', formData.noticedate);
        if (formData.noticeimage) {
            formPayload.append('noticeimage', formData.noticeimage);
        }

        try {
            const response = await axios.put(
                `${BASE_URL}/admin/noticeupdate/${selectedNotice._id}`,
                formPayload,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.error) {
                setNotices(notices.map(notice => 
                    notice._id === selectedNotice._id ? response.data.data : notice
                ));
                setOpen(false);
                Swal.fire('Updated!', 'The notice has been updated successfully.', 'success');
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, noticeimage: file});
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getRecipientInfo = (notice) => {
        if (notice.sendToAll) {
            return (
                <Chip 
                    icon={<CheckCircleIcon fontSize="small" />}
                    label="All Users"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                />
            );
        }

        return (
            <>
                {notice.students?.length > 0 && (
                    <Tooltip title={`Students: ${notice.students.map(s => s.firstname).join(', ')}`}>
                        <Chip
                            icon={<PersonIcon fontSize="small" />}
                            label={`${notice.students.length} Student(s)`}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                        />
                    </Tooltip>
                )}
                {notice.batches?.length > 0 && (
                    <Tooltip title={`Batches: ${notice.batches.length}`}>
                        <Chip
                            icon={<GroupsIcon fontSize="small" />}
                            label={`${notice.batches.length} Batch(es)`}
                            color="secondary"
                            size="small"
                            sx={{ mr: 1 }}
                        />
                    </Tooltip>
                )}
                {notice.educators?.length > 0 && (
                    <Tooltip title={`Educators: ${notice.educators.length}`}>
                        <Chip
                            icon={<SchoolIcon fontSize="small" />}
                            label={`${notice.educators.length} Educator(s)`}
                            color="info"
                            size="small"
                            sx={{ mr: 1 }}
                        />
                    </Tooltip>
                )}
                {notice.mentors?.length > 0 && (
                    <Tooltip title={`Mentors: ${notice.mentors.length}`}>
                        <Chip
                            icon={<PersonIcon fontSize="small" />}
                            label={`${notice.mentors.length} Mentor(s)`}
                            color="warning"
                            size="small"
                        />
                    </Tooltip>
                )}
            </>
        );
    };

    return (
        <>
            <PageTitle page={"All Notices"} />
            <div style={{ padding: '20px' }}>
                {notices.map((notice) => (
                    <StyledCard key={notice._id}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: notice.sendToAll ? '#4caf50' : '#3f51b5' }}>
                                    {notice.sendToAll ? 'A' : 'N'}
                                </Avatar>
                            }
                            action={
                                <>
                                    <IconButton 
                                        aria-label="edit" 
                                        onClick={() => handleEditClick(notice)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        aria-label="delete" 
                                        onClick={() => handleDelete(notice._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                            title={
                                <Typography variant="h6" component="div">
                                    {notice.subject}
                                </Typography>
                            }
                            subheader={
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                                    <EventIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(notice.noticedate)}
                                    </Typography>
                                </div>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Typography variant="body1" paragraph>
                                {notice.message}
                            </Typography>
                            
                            <div style={{ marginTop: '16px' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Recipients:
                                </Typography>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                    {getRecipientInfo(notice)}
                                </div>
                            </div>

                            {notice.noticeimage && (
                                <AttachmentContainer>
                                    <List dense>
                                        <ListItem 
                                            button 
                                            component="a" 
                                            href={`http://localhost:4500/uploads/notices/${notice.noticeimage}`}
                                            target="_blank"
                                        >
                                            <ListItemIcon>
                                                {getFileIcon(notice.noticeimage)}
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={notice.noticeimage.split('/').pop()} 
                                                secondary="Click to download"
                                            />
                                        </ListItem>
                                    </List>
                                    {/* {getFilePreview(
                                        `http://localhost:4500/uploads/notices/${notice.noticeimage}`,
                                        notice.noticeimage
                                    )} */}
                                </AttachmentContainer>
                            )}
                        </CardContent>
                    </StyledCard>
                ))}

                <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Edit Notice</DialogTitle>
                    <form onSubmit={handleUpdate}>
                        <DialogContent dividers>
                            <TextField
                                margin="normal"
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="normal"
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={6}
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="normal"
                                label="Date"
                                name="noticedate"
                                type="date"
                                value={formData.noticedate}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            
                            <div style={{ marginTop: '20px' }}>
                                <input
                                    accept="*/*"
                                    style={{ display: 'none' }}
                                    id="noticeimage"
                                    name="noticeimage"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="noticeimage">
                                    <Button 
                                        variant="contained" 
                                        component="span"
                                        startIcon={<AttachmentIcon />}
                                    >
                                        Upload Attachment
                                    </Button>
                                </label>
                                
                                {previewImage && (
                                    <div style={{ marginTop: '16px' }}>
                                        <List dense>
                                            <ListItem>
                                                <ListItemIcon>
                                                    {getFileIcon(formData.noticeimage?.name)}
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={formData.noticeimage?.name || 'Attachment'} 
                                                />
                                            </ListItem>
                                        </List>
                                        {getFilePreview(previewImage, formData.noticeimage?.name)}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Update Notice
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        </>
    );
};

export default NoticeList;