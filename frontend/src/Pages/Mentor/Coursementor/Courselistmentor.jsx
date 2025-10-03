import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";

const Courselistmentor = () => {
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
        const coursesWithSrNo = response.data.data.map((course, index) => ({
          ...course,
          srNo: index + 1,
        }));
        setCourses(coursesWithSrNo);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDelete = async (id) => {
    // console.log("_id in delete is",id);
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
          Getcourselist();
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

  const TextAreaCell = ({ value }) => (
    <TextField
      multiline
      fullWidth
      variant="outlined"
      value={value}
      InputProps={{
        readOnly: true,
        style: {
          fontSize: "0.875rem",
          padding: "8px",
          cursor: "default",
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "none" },
        },
      }}
    />
  );

  const columns = [
    { field: "srNo", headerName: "Sr. No", width: 80 },
    { field: "_id", headerName: "ID", width: 220 },
    { field: "coursename", headerName: "Course Name", width: 180 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "duration", headerName: "Duration", width: 120 },
    { field: "gst", headerName: "GST (%)", width: 100 },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      renderCell: (params) => <TextAreaCell value={params.value} />,
    },
    {
      field: "courseimage",
      headerName: "Image",
      width: 150,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`http://localhost:4500${params.value}`}
            alt="Course"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        ) : (
          "No image"
        ),
    },
    { field: "createdAt", headerName: "Created At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <FaEdit
            className="text-primary cursor-pointer"
            onClick={() => handleEditClick(params.row)}
          />
          <FaTrash
            className="text-danger cursor-pointer"
            onClick={() => handleDelete(params.row._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageTitle page={"Course List"} />
      <div className="container">
        <Box sx={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={courses}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>

        {/* Edit Modal */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Course</DialogTitle>
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                margin="dense"
                label="Course Name"
                name="coursename"
                value={formData.coursename}
                onChange={handleChange}
                fullWidth
                required
              />
              <div className="row">
                <div className="col-md-6">
                  <TextField
                    margin="dense"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    margin="dense"
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </div>
              </div>
              <TextField
                margin="dense"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
              <div className="row">
                <div className="col-md-6">
                  <TextField
                    margin="dense"
                    label="GST (%)"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="form-control mt-2"
                  />
                </div>
              </div>
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
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

export default Courselistmentor;
