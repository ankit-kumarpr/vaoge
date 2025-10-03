import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import {
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
  Paper,
  Button,
  IconButton,
  FormControl,
  InputLabel ,
  Select ,
  Tooltip
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Description as DescriptionIcon,
  Class as ClassIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const Allmaterial = () => {
  const theme = useTheme();
  const token = sessionStorage.getItem('token');

  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [practiceMaterials, setPracticeMaterials] = useState([]);
  const [loading, setLoading] = useState({
    batches: true,
    materials: false
  });

  useEffect(() => {
    GetAllBatchList();
  }, []);

  const GetAllBatchList = async () => {
    try {
      setLoading(prev => ({ ...prev, batches: true }));
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
      Swal.fire({
        title: "Error!",
        text: "Failed to load batches",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  const GetPracticeMaterial = async (batchId) => {
    try {
      setLoading(prev => ({ ...prev, materials: true }));
      const url = `${BASE_URL}/admin/getpractice/${batchId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      // console.log("Practice material",response.data);
      setPracticeMaterials(response.data?.data || []);
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load practice materials",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
      setPracticeMaterials([]);
    } finally {
      setLoading(prev => ({ ...prev, materials: false }));
    }
  };

  const handleBatchChange = (event) => {
    const batchId = event.target.value;
    setSelectedBatch(batchId);
    if (batchId) {
      GetPracticeMaterial(batchId);
    } else {
      setPracticeMaterials([]);
    }
  };

  const handleRefresh = () => {
    if (selectedBatch) {
      GetPracticeMaterial(selectedBatch);
    }
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'pdf':
        return <PdfIcon fontSize="large" color="error" />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon fontSize="large" color="primary" />;
      default:
        return <DescriptionIcon fontSize="large" />;
    }
  };

  return (
    <>
      <PageTitle page="Practice Materials" />
      {/* <Container maxWidth="xl" sx={{ py: 4 }}> */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper
          }}>
            {/* Header and Batch Selection */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <ClassIcon sx={{ mr: 1 }} />
                Practice Materials
              </Typography>
              <Tooltip title="Refresh Materials">
                <IconButton
                  onClick={handleRefresh}
                  disabled={!selectedBatch || loading.materials}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Batch Selection */}
            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Select Batch</InputLabel>
                <Select
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  label="Select Batch"
                  variant="outlined"
                  disabled={loading.batches}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select a batch</em>
                  </MenuItem>
                  {batchList.map((batch) => (
                    <MenuItem key={batch._id} value={batch.batchId}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 30, 
                            height: 30, 
                            mr: 2,
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText
                          }}
                        >
                          {batch.batchname.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography>{batch.batchname}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {batch.schedule?.days?.join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Materials Grid */}
            {loading.materials ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : practiceMaterials.length > 0 ? (
              <Grid container spacing={3}>
                {practiceMaterials.map((material) => (
                  <Grid item xs={12} sm={6} md={4} key={material._id}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        boxShadow: theme.shadows[3],
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: theme.shadows[6]
                        }
                      }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                          }}>
                            {getFileTypeIcon(material.materialimages[0])}
                            <Typography 
                              variant="h6" 
                              component="div" 
                              sx={{ 
                                ml: 2,
                                fontWeight: 600,
                                color: theme.palette.primary.main
                              }}
                            >
                              {material.materialname}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 3 }}
                          >
                            {material.materialdescription}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <Box sx={{ 
                          p: 2,
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                          {material.materialimages.length > 0 && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DownloadIcon />}
                              href={`http://localhost:4500/${material.materialimages[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                              }}
                            >
                              Download
                            </Button>
                          )}
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: theme.palette.background.default
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {selectedBatch 
                    ? "No practice materials available for this batch" 
                    : "Please select a batch to view materials"}
                </Typography>
              </Paper>
            )}
          </Paper>
        </motion.div>
      {/* </Container> */}
    </>
  );
};

export default Allmaterial;