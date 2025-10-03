import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const Noticelistmentor = () => {
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
    // };

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

    return (
        <>
            <PageTitle page={"All Notices"} />
            <div className="container mt-4">
                {notices.map((notice) => (
                    <div key={notice._id} className="card mb-3 p-3 shadow-sm">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <span className="fw-bold text-primary">Voage Learniing | Mentor</span>
                                <br />
                                <span className="text-muted">{new Date(notice.noticedate).toLocaleDateString()}</span>
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                                <span className="badge bg-warning me-2">Event Invitation</span>
                                <FaEdit 
                                    className="text-primary me-2 cursor-pointer"
                                    onClick={() => handleEditClick(notice)}
                                    style={{ fontSize: '1.2rem' }}
                                />
                                <FaTrash 
                                    className="text-danger cursor-pointer"
                                    onClick={() => handleDelete(notice._id)}
                                    style={{ fontSize: '1.2rem' }}
                                />
                            </div>
                        </div>
                        <hr />
                        <h5 className="fw-bold">{notice.subject}</h5>
                        <p>{notice.message}</p>
                        {notice.noticeimage && (
                            <div>
                                <strong className="text-danger">Attachments:</strong>
                                <div className="mt-2">
                                    {notice.noticeimage.endsWith(".pdf") ? (
                                        <a 
                                            href={`http://localhost:4500/uploads/notices/${notice.noticeimage}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="d-inline-block"
                                        >
                                            <img 
                                                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                                alt="PDF Document"
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px',
                                                    border: '2px solid #dc3545',
                                                    borderRadius: '5px',
                                                    padding: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <a 
                                            href={`${BASE_URL}/uploads/notices/${notice.noticeimage}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src={`http://localhost:4500/uploads/notices/${notice.noticeimage}`} 
                                                alt="Notice Attachment" 
                                                style={{ 
                                                    maxWidth: '60px',
                                                    border: '2px solid #ddd',
                                                    borderRadius: '5px',
                                                    padding: '5px'
                                                }}
                                                className="img-thumbnail"
                                            />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Edit Notice</DialogTitle>
                    <form onSubmit={handleUpdate}>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="dense"
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
                            
                            <div className="mt-3">
                                <label htmlFor="noticeimage">
                                    <Button 
                                        variant="contained" 
                                        component="span"
                                        color="primary"
                                    >
                                        Upload Image/PDF
                                    </Button>
                                    <input
                                        type="file"
                                        id="noticeimage"
                                        name="noticeimage"
                                        onChange={handleFileChange}
                                        accept="image/*,application/pdf"
                                        hidden
                                    />
                                </label>
                                
                                {previewImage && (
                                    <div className="mt-2">
                                        {formData.noticeimage?.type === 'application/pdf' ? (
                                            <span className="text-danger">PDF file selected</span>
                                        ) : (
                                            <img 
                                                src={previewImage} 
                                                alt="Preview" 
                                                style={{ 
                                                    maxWidth: '200px', 
                                                    maxHeight: '200px',
                                                    marginTop: '10px'
                                                }} 
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        </>
    );
};

export default Noticelistmentor;