import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { jwtDecode } from 'jwt-decode';
import BASE_URL from '../../../config';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const YourhomeworkList = () => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const educator_id = decodedToken.userId;

  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Gethomeworklist();
  }, []);

  const Gethomeworklist = async () => {
    try {
      const url = `${BASE_URL}/common/educatorhomework/${educator_id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get(url, { headers: headers });
      // console.log("Response of Work list", response.data);
      // Transform data here to ensure all fields are properly defined
      const transformedData = response.data.data.map((item, index) => ({
        ...item,
        sr_no: index + 1,
        formattedDate: new Date(item.createdAt).toLocaleString(),
        batchDisplay: item.batchId ? 'Assigned' : 'Individual'
      }));
      setHomeworkList(transformedData);
    } catch (error) {
      console.error("Error fetching homework list:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'sr_no',
      headerName: 'Sr. No',
      width: 70,
    },
    { 
      field: 'homeworkname', 
      headerName: 'Homework Name', 
      width: 200 
    },
    { 
      field: 'homeworkdescription', 
      headerName: 'Description', 
      width: 300 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <Typography 
          color={params.row.status === 'Pending' ? 'error' : 'success'}
          fontWeight="bold"
        >
          {params.row.status}
        </Typography>
      )
    },
    { 
      field: 'formattedDate', 
      headerName: 'Created At', 
      width: 200
    },
    {
      field: 'batchDisplay',
      headerName: 'Batch',
      width: 150,
    },
    {
      field: 'homeworkfiles',
      headerName: 'Attachments',
      width: 250,
      renderCell: (params) => {
        const files = params.row.homeworkfiles || [];
        
        if (files.length === 0) {
          return <Typography variant="body2">No Attachment</Typography>;
        }

        return (
          <Box display="flex" gap={1}>
            {files.map((file, index) => {
              const fileUrl = `http://localhost:4500/${file.replace(/\\/g, '/')}`;
              return (
                <IconButton
                  key={index}
                  onClick={() => window.open(fileUrl, '_blank')}
                  size="small"
                  title="View PDF"
                >
                  <PictureAsPdfIcon color="error" />
                </IconButton>
              );
            })}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <PageTitle page={"Home Work List"} />
      <Box sx={{ height: '75vh', width: '100%', mt: 3 }}>
        <DataGrid
          rows={homeworkList}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      </Box>
    </>
  );
};

export default YourhomeworkList;