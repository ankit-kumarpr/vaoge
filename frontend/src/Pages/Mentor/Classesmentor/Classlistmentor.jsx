import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Box, TextField, Typography, Link, Modal, Button, Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";

const Classlistmentor = () => {
  const token = sessionStorage.getItem("token");
  const [classList, setClassList] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState({
    _id: "",
    classname: "",
    batchId: "",
    classShedule: { days: [], time: "" }, // Use `classShedule` (single "d")
    classlink: "",
    classDate: "",
  });
  const [batchList, setBatchList] = useState([]);

  // Days dropdown options
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    GetAllClassList();
    GetAllBatchList();
  }, []);

  const GetAllClassList = async () => {
    try {
      const url = `${BASE_URL}/admin/getclass`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      // console.log("Response of class list", response.data);
      if (response.data?.data) {
        setClassList(response.data.data);
        setFilteredClasses(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching class list:", error);
    }
  };

  const GetAllBatchList = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      if (response.data?.data) {
        setBatchList(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching batch list:", error);
    }
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setFilteredClasses(
      date ? classList.filter(cls => 
        new Date(cls.classDate).toISOString().split("T")[0] === date
      ) : classList
    );
  };

  const handleEditClick = (cls) => {
    setSelectedClass({
      _id: cls.id,
      classname: cls.classname,
      batchId: cls.batchId?._id || "",
      classShedule: cls.classShedule || { days: [], time: "" }, // Use `classShedule`
      classlink: cls.classlink,
      classDate: cls.classDate?.split('T')[0] || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    // console.log("id in delete",id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/admin/deleteclass/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire("Deleted!", "Class removed successfully.", "success");
        GetAllClassList();
      } catch (error) {
        Swal.fire("Error!", "Deletion failed.", "error");
      }
    }
  };

  const handleUpdateClass = async () => {
    try {
      const response= await axios.put(
        `${BASE_URL}/admin/updateclass/${selectedClass._id}`,
        {
          classname: selectedClass.classname,
          batchId: selectedClass.batchId,
          classShedule: { // Use `classShedule`
            days: selectedClass.classShedule.days,
            time: selectedClass.classShedule.time
          },
          classlink: selectedClass.classlink,
          classDate: selectedClass.classDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("Response of the update api",response);
      Swal.fire("Success!", "Class updated successfully.", "success");
      setEditModalOpen(false);
      GetAllClassList();
    } catch (error) {
      Swal.fire("Error!", "Update failed.", "error");
    }
  };

  const columns = [
    { field: "Sr_no", headerName: "Sr.No", flex: 1 },
    { field: "id", headerName: "Class ID", flex: 1 },
    { field: "classname", headerName: "Class Name", flex: 1 },
    { 
      field: "batchname", 
      headerName: "Batch Name", 
      flex: 1,
      renderCell: (params) => params.row.batchId?.batchname || "N/A"
    },
    {
      field: "classDate",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "N/A"
    },
    {
      field: "classShedule", 
      headerName: "Schedule",
      flex: 2,
      renderCell: (params) => 
       
       params.row.classShedule?.days.join(", ") + " @ " + params.row.classShedule?.time || "N/A"
    },
    {
      field: "classlink",
      headerName: "Link",
      flex: 1,
      renderCell: (params) => params.value ? (
        <Link href={params.value} target="_blank">Join Class</Link>
      ) : "N/A"
    },
    {
      field: "mentor",
      headerName: "Mentor",
      flex: 1,
      renderCell: (params) => 
     
      params.row.mentorId 
          ? `${params.row.mentorId?.firstname || ""} ${params.row.mentorId?.lastname || ""}`
          : "N/A"
    },
    {
      field: "studentsCount",
      headerName: "Students",
      flex: 1,
      renderCell: (params) => params.row.students?.length || 0
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (

        
        <Box>
          <FaEdit
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => handleEditClick(params.row)}
          />
          <FaTrash
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteClick(params.row.id)}
          />
        </Box>
      )
    }
  ];

  const rows = filteredClasses.map((cls, index) => ({
    Sr_no: index + 1,
    id: cls._id,
    classname: cls.classname,
    batchname: cls.batchId,
    classDate: cls.classDate,
    classShedule: cls.classShedule, // Use `classShedule`
    classlink: cls.classlink,
    mentorId: cls.mentorId,
    students: cls.students,
  }));

  return (
    <>
      <PageTitle page="All Classes" />
      <Container>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>

        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>Edit Class</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Name"
                  value={selectedClass.classname}
                  onChange={(e) => setSelectedClass({...selectedClass, classname: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Batch</InputLabel>
                  <Select
                    value={selectedClass.batchId}
                    onChange={(e) => setSelectedClass({...selectedClass, batchId: e.target.value})}
                    label="Batch"
                  >
                    {batchList.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        {batch.batchname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Link"
                  value={selectedClass.classlink}
                  onChange={(e) => setSelectedClass({...selectedClass, classlink: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Class Date"
                  value={selectedClass.classDate}
                  onChange={(e) => setSelectedClass({...selectedClass, classDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Days</InputLabel>
                  <Select
                    multiple
                    value={selectedClass.classShedule.days}
                    onChange={(e) => setSelectedClass({
                      ...selectedClass,
                      classShedule: {
                        ...selectedClass.classShedule,
                        days: e.target.value
                      }
                    })}
                    label="Days"
                  >
                    {daysOptions.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Time"
                  value={selectedClass.classShedule.time || ""}
                  onChange={(e) => setSelectedClass({
                    ...selectedClass,
                    classShedule: {
                      ...selectedClass.classShedule,
                      time: e.target.value
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleUpdateClass}
                >
                  Update Class
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default Classlistmentor;