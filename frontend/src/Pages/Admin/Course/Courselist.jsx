import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Chip,
  Grid,
  Avatar,
  Paper,
  styled
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, CloudUpload } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  '&:hover': {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const CourseImage = styled(CardMedia)({
  height: 160,
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5'
});

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.main,
  color: 'white'
}));

const Courselist = () => {
  const token = sessionStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    coursename: "",
    price: "",
    duration: "",
    description: "",
    gst: "",
    courseimage: null,
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    Getcourselist();
  }, []);

  const Getcourselist = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/getcourse`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data && !response.data.error) {
        setCourses(response.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/admin/deletecourse/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCourses(courses.filter((course) => course._id !== id));
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      coursename: course.coursename,
      price: course.price,
      duration: course.duration,
      description: course.description,
      gst: course.gst,
      courseimage: null,
    });
    setPreviewImage(
      course.courseimage ? `${BASE_URL}${course.courseimage}` : ""
    );
    setOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("coursename", formData.coursename);
    formPayload.append("price", formData.price);
    formPayload.append("duration", formData.duration);
    formPayload.append("description", formData.description);
    formPayload.append("gst", formData.gst);
    if (formData.courseimage) {
      formPayload.append("courseimage", formData.courseimage);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/admin/updatecourse/${selectedCourse._id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.error) {
        setCourses(
          courses.map((course) =>
            course._id === selectedCourse._id ? response.data.data : course
          )
        );
        setOpen(false);
        Swal.fire("Updated!", "Course has been updated successfully.", "success");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, courseimage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <PageTitle page={"Course List"} />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <StyledCard>
                <Box sx={{ position: 'relative' }}>
                  <CourseImage
                    image={course.courseimage ? `http://localhost:4500${course.courseimage}` : '/placeholder-course.jpg'}
                    title={course.coursename}
                  />
                  <PriceChip label={`₹${course.price}`} />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.coursename}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      GST: {course.gst}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      aria-label="edit" 
                      color="primary"
                      onClick={() => handleEditClick(course)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete" 
                      color="error"
                      onClick={() => handleDelete(course._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            Edit Course
          </DialogTitle>
          <form onSubmit={handleUpdate}>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    name="coursename"
                    value={formData.coursename}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="GST (%)"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Button>
                </Grid>
                {previewImage && (
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
                      <Avatar
                        src={previewImage}
                        variant="rounded"
                        sx={{ width: 200, height: 200, margin: '0 auto' }}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpen(false)}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ ml: 2 }}
              >
                Update Course
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </>
  );
};

export default Courselist;