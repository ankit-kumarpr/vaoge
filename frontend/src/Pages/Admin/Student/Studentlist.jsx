import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
// import { Box } from "@mui/material";
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Studentlist = () => {
  const token = sessionStorage.getItem("token");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    GetstudentAPI();
  }, []);

  const navigate=useNavigate();
  // get students
  const GetstudentAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      console.log("Response of student api", response.data);
      setStudents(response.data.data); // Assuming the data is in response.data.data
    } catch (error) {
      console.log(error);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "sr_no", headerName: "Sr. No", width: 50 },
    { field: "id", headerName: "ID", width: 90 },
    { field: "enrollmentnumber", headerName: "Enrollment Number", width: 150 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "fathername", headerName: "Father Name", width: 150 },
    { field: "mothername", headerName: "Mother Name", width: 150 },

    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "alternetphone", headerName: "Alternate Phone", width: 150 },
    { field: "qualification", headerName: "Qualification", width: 150 },
    { field: "currentAddress", headerName: "Current Address", width: 250 },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   renderCell: (params) => (
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       size="small"
    //       onClick={() => handleBuyClick(params.row)}
    //     >
    //       Buy
    //     </Button>
    //   ),
    // },
  ];

  const handleBuyClick = (row) => {
    // Navigate to another component and pass student data
    navigate("/buynow", {
      state: {
        studentId: row.id,
        studentName: `${row.firstname} ${row.lastname}`,
        enrollmentNumber: row.enrollmentnumber,
      },
    });
  };
  // Map the students data to the rows expected by the DataGrid
  const rows = students.map((student, index) => ({
    sr_no: index + 1,
    id: student._id,
    enrollmentnumber: student.enrollmentnumber,
    firstname: student.firstname,
    lastname: student.lastname,
    fathername: student.fathername,
    mothername: student.mothername,
    email: student.email,
    phone: student.phone,
    alternetphone: student.alternatephone,
    qualification: student.qualification,
    currentAddress: student.currentAddress
      ? `${student.currentAddress.addressline1}, ${student.currentAddress.addressline2}, ${student.currentAddress.city}, ${student.currentAddress.state}, ${student.currentAddress.country}`
      : "N/A",
  }));

  return (
    <>
      <PageTitle page={"Student List"} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </>
  );
};

export default Studentlist;
