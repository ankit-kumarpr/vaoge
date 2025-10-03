import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { CheckCircle, Cancel } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const Homerequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    Getallhomerequest();
  }, []);

  const Getallhomerequest = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/common/homeworkrequest`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      // console.log("Response for homework request:", response.data);
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching homework requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (homeworkId, newStatus) => {
    try {
     const url=`${BASE_URL}/common/update-status`;
     const headers = {
         'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const requestBody={
             
                homeworkId: homeworkId, 
                status: newStatus
            }
        
        const response = await axios.put(url, requestBody, { headers });
      // console.log("Response after updating status:", response.data);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.homeworkId === homeworkId ? { ...request, status: newStatus } : request
        )
      );
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={"Home Work Request"} />

      <Grid container spacing={3} sx={{ p: 3 }}>
        {requests.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="textSecondary">
              No homework requests found
            </Typography>
          </Grid>
        ) : (
          requests.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request.homeworkId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 3 }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" component="div">
                      {request.homeworkname}
                    </Typography>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'Approved'
                          ? 'success'
                          : request.status === 'Rejected'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {request.homeworkdescription}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {request.homeworkfiles?.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" color="textSecondary" gutterBottom>
                        Attachments:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {request.homeworkfiles.map((file, index) => {
                          const fileURL = `${BASE_URL}/${file.replace(/\\/g, '/')}`;
                          return (
                            <Tooltip key={index} title={file.split('/').pop()} arrow>
                              <IconButton
                                color="error"
                                component="a"
                                href={fileURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  p: 1,
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                  }
                                }}
                              >
                                <PictureAsPdfIcon sx={{ fontSize: 32 }} />
                              </IconButton>
                            </Tooltip>
                          );
                        })}
                      </Box>
                    </Box>
                  )}

                  <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      size="small"
                      disabled={request.status === 'Approved'}
                      onClick={() => handleStatusChange(request.homeworkId, 'Approved')}
                      sx={{ textTransform: 'none' }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Cancel />}
                      size="small"
                      disabled={request.status === 'Rejected'}
                      onClick={() => handleStatusChange(request.homeworkId, 'Rejected')}
                      sx={{ textTransform: 'none' }}
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default Homerequest;
