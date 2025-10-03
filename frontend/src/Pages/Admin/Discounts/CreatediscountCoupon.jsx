import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import BASE_URL from '../../../config';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Modal, 
  Typography, 
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Badge,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon,
  Discount as DiscountIcon,
  Event as EventIcon,
  Code as CodeIcon,
  Percent as PercentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const CreatediscountCoupon = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = sessionStorage.getItem('token');
  const [couponData, setCouponData] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
    isActive: true
  });
  const [couponList, setCouponList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState({
    coupons: true,
    submitting: false
  });

  useEffect(() => {
    Getalldiscountcoupon();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({ ...couponData, [name]: value });
  };

  const CreatecouponAPI = async () => {
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const url = `${BASE_URL}/common/create-coupon`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.post(url, couponData, { headers });
      
      if (response.data.success === true) {
        Swal.fire({
          title: "Success!",
          text: "Discount coupon created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
        setCouponData({ 
          code: '', 
          discountPercentage: '', 
          expiryDate: '',
          isActive: true
        });
        setOpenModal(false);
        Getalldiscountcoupon();
      }
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create coupon",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const Getalldiscountcoupon = async () => {
    try {
      setLoading(prev => ({ ...prev, coupons: true }));
      const url = `${BASE_URL}/common/allcoupon`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers });
      if (response.data?.data) {
        const couponsWithSerial = response.data.data.map((coupon, index) => ({
          ...coupon,
          Sr_no: index + 1,
          formattedDate: format(parseISO(coupon.expiryDate), 'MMM dd, yyyy')
        }));
        setCouponList(couponsWithSerial);
      }
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load coupons",
        icon: "error",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      });
    } finally {
      setLoading(prev => ({ ...prev, coupons: false }));
    }
  };

  const handleDeleteCoupon = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.text.secondary,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/common/delete-coupon/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: "Deleted!",
          text: "Coupon has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
        Getalldiscountcoupon();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete coupon",
          icon: "error",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
      }
    }
  };

  const columns = [
    { 
      field: 'Sr_no', 
      headerName: '#', 
      width: 70,
      renderCell: (params) => (
        <Badge badgeContent={params.value} color="primary" />
      )
    },
    { 
      field: 'code', 
      headerName: 'Coupon Code', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
          icon={<CodeIcon />}
          size={isMobile ? "small" : "medium"}
        />
      )
    },
    { 
      field: 'discountPercentage', 
      headerName: 'Discount', 
      flex: 1,
      minWidth: 120,
      mt:5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PercentIcon sx={{ 
            mr: 1, 
            mt:1,
            color: theme.palette.success.main,
            fontSize: isMobile ? 'small' : 'medium'
          }} />
          <Typography fontWeight={500} fontSize={isMobile ? '0.875rem' : '1rem'}>
            {params.value}%
          </Typography>
        </Box>
      )
    },
    {
      field: 'formattedDate',
      headerName: 'Expiry',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ 
            mr: 1, 
            color: theme.palette.warning.main,
            fontSize: isMobile ? 'small' : 'medium'
          }} />
          <Typography variant="body2" fontSize={isMobile ? '0.75rem' : '0.875rem'}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size={isMobile ? "small" : "medium"}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setCouponData({
                  code: params.row.code,
                  discountPercentage: params.row.discountPercentage,
                  expiryDate: params.row.expiryDate.split('T')[0],
                  isActive: params.row.isActive
                });
                setOpenModal(true);
              }}
            >
              <EditIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteCoupon(params.row._id)}
            >
              <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <>
      <PageTitle page="Discount Coupons" />
      <Container maxWidth="xl" sx={{ 
        py: isMobile ? 2 : 4, 
        px: isMobile ? 0 : 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Paper elevation={3} sx={{ 
            p: isMobile ? 2 : 4, 
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header and Create Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <DiscountIcon sx={{ mr: 1, fontSize: isMobile ? '1.25rem' : '1.5rem' }} />
                Discount Coupons
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: isMobile ? '100%' : 'auto'
              }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setCouponData({
                      code: '',
                      discountPercentage: '',
                      expiryDate: '',
                      isActive: true
                    });
                    setOpenModal(true);
                  }}
                  fullWidth={isMobile}
                  sx={{
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  Create Coupon
                </Button>
                <Tooltip title="Refresh">
                  <IconButton
                    onClick={Getalldiscountcoupon}
                    sx={{ ml: isMobile ? 1 : 2 }}
                  >
                    <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Data Grid - Now properly scrollable */}
            <Box sx={{ 
              flex: 1,
              width: '100%',
              minHeight: '400px', // Ensures minimum height
              '& .MuiDataGrid-cell': {
                py: isMobile ? '8px' : '16px'
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: 'auto' // Allows horizontal scrolling
              },
              '& .MuiDataGrid-root': {
                display: 'flex',
                flexDirection: 'column',
                flex: 1
              },
              '& .MuiDataGrid-main': {
                flex: 1
              }
            }}>
              <DataGrid
                rows={couponList}
                columns={columns}
                loading={loading.coupons}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                getRowId={(row) => row._id}
                sx={{
                  flex: 1,
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.action.hover,
                    minHeight: '48px !important',
                    maxHeight: '48px !important'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 600
                  }
                }}
                density={isMobile ? "compact" : "standard"}
                components={{
                  Footer: () => null // Hide default footer if needed
                }}
              />
            </Box>

            {/* Create/Edit Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '95%' : '600px',
                maxWidth: '100%',
                maxHeight: '90vh',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: isMobile ? 2 : 4,
                borderRadius: 3,
                overflowY: 'auto',
                '&:focus': {
                  outline: 'none'
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Typography variant={isMobile ? "h6" : "h5"} component="h2" sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main
                  }}>
                    <DiscountIcon sx={{ 
                      mr: 1,
                      fontSize: isMobile ? '1.25rem' : '1.5rem'
                    }} />
                    {couponData._id ? 'Edit Coupon' : 'Create Coupon'}
                  </Typography>
                  <IconButton
                    onClick={() => setOpenModal(false)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Coupon Code"
                      name="code"
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      value={couponData.code}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <CodeIcon 
                            color="action" 
                            sx={{ mr: 1 }} 
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Discount Percentage"
                      name="discountPercentage"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      value={couponData.discountPercentage}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <PercentIcon 
                            color="action" 
                            sx={{ mr: 1 }} 
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        ),
                        endAdornment: (
                          <Typography 
                            color="text.secondary"
                            fontSize={isMobile ? "0.875rem" : "1rem"}
                          >
                            %
                          </Typography>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Expiry Date"
                      name="expiryDate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      InputLabelProps={{ shrink: true }}
                      value={couponData.expiryDate}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <EventIcon 
                            color="action" 
                            sx={{ mr: 1 }} 
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        name="isActive"
                        value={couponData.isActive}
                        onChange={handleChange}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={CreatecouponAPI}
                      disabled={loading.submitting}
                      size={isMobile ? "small" : "medium"}
                      startIcon={loading.submitting ? 
                        <CircularProgress size={isMobile ? 16 : 20} /> : 
                        <DiscountIcon fontSize={isMobile ? "small" : "medium"} />
                      }
                      sx={{
                        py: isMobile ? 1 : 1.5,
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.875rem' : '1rem'
                      }}
                    >
                      {couponData._id ? 'Update Coupon' : 'Create Coupon'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Paper>
        </motion.div>
      </Container>
    </>
  );
};

export default CreatediscountCoupon;