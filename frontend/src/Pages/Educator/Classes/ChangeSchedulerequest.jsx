import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { jwtDecode } from 'jwt-decode';
import BASE_URL from '../../../config';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid'; // Import MUI DataGrid
import { Box, Chip } from '@mui/material'; // Import MUI Box and Chip for layout and styling

const ChangeSchedulerequest = () => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  // console.log("token data",decodedToken);
  const educator_id = decodedToken.userId;
  const [requests, setRequests] = useState([]); // State to store schedule change requests

  // Fetch schedule change requests on component mount
  useEffect(() => {
    Getownrequests();
  }, []);

  // Fetch schedule change requests
  const Getownrequests = async () => {
    try {
      const url = `${BASE_URL}/admin/yourrequest/${educator_id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      // console.log("Response of own request", response.data);
      setRequests(response.data.data); // Set the fetched requests to state
    } catch (error) {
      // console.log(error);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: 'sr_no', headerName: 'Sr. No', width: 50 },
    { field: 'id', headerName: 'Class Id', width: 200 },
    { field: 'className', headerName: 'Class Name', width: 200 },
    {
      field: 'proposedSchedule',
      headerName: 'Proposed Schedule',
      width: 250,
      renderCell: (params) => {

       return (
    <div>
      <strong>Days:</strong> {params.row.proposedSchedule.days.join(', ')} &nbsp;
      <strong>Time:</strong> {params.row.proposedSchedule.time}
    </div>
       )
    },
    },
    { field: 'reason', headerName: 'Reason', width: 300 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        let color = 'default'; // Default color
        if (params.row.status === 'Pending') {
          color = 'warning'; // Yellow for Pending
        } else if (params.row.status === 'Approved') {
          color = 'success'; // Green for Approved
        } else if (params.row.status === 'Rejected') {
          color = 'error'; // Red for Rejected
        }
        return (
          <Chip
            label={params.row.status}
            color={color}
            variant="contained"
          />
        );
      },
    },
    { field: 'createdAt', headerName: 'Requested On', width: 150 },
  ];

  // Map the API data to the DataGrid format
  const rows = requests.map((request, index) => ({
    sr_no: index + 1,
    id: request._id, // Unique ID for each row
    status: request.status,
    className: request.classId.classname,
    proposedSchedule: {
      days: request.proposedSchedule.days,
      time: request.proposedSchedule.time,
    },
    reason: request.reason,
    createdAt: new Date(request.createdAt).toLocaleDateString(), // Format date
  }));

  return (
    <>
      <PageTitle page={"Schedule Change Requests"} />
      <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          
        />
      </Box>
    </>
  );
};

export default ChangeSchedulerequest;