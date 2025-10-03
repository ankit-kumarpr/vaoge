import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  TextField,
  Modal,
  CircularProgress
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import PageTitle from '../../components/PageTitle';
import BASE_URL from '../../config';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';

const Educatorprofile = () => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const educator_id = decodedToken.userId;
  const role = 'educator'; // Force the role to be 'educator' to match backend expectations

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    Getprofile();
  }, []);

  // Fetch profile data
  const Getprofile = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/admin/profile/${educator_id}/${role}`;
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      setProfileData(response.data.data);
      
      // Initialize edit data with current profile data
      setEditData({
        fullName: `${response.data.data.firstname} ${response.data.data.lastname}`,
        email: response.data.data.email,
        phone: response.data.data.phone
      });
      
      // console.log('Response of profile', response.data);
    } catch (error) {
      // console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const UpdateYourProfile = async () => {
    if (!editData.fullName || !editData.email || !editData.phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all fields before submitting.'
      });
      return;
    }

    try {
      const url = `${BASE_URL}/admin/updateprofile/${role}/${educator_id}`;
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      };

      // Prepare request body according to backend expectations
      const requestBody = {
        fullName: editData.fullName,
        email: editData.email,
        phone: editData.phone
      };

      const response = await axios.put(url, requestBody, { headers });
      
      if (response.data.error === false) {
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
        Getprofile(); // Refresh profile data
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
    }
  };
  
  

  if (!profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={'Profile'} />

      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Edit Profile Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenModal}
            sx={{ textTransform: 'none' }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Profile Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '20px' }}>
          {/* Left Column */}
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={`http://localhost:4500/${profileData.profile}`}
                  alt="Profile"
                  sx={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    margin: '0 auto 10px',
                    border: '4px solid #fff',
                    objectFit: 'contain',
                    backgroundColor: '#f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: 'primary.main' }}>
                  {profileData.firstname} {profileData.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                  Educator
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
                  {profileData.currentAddress.city}, {profileData.currentAddress.state}, {profileData.currentAddress.country}
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent sx={{ padding: 0 }}>
                <List sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <ListItem sx={{ padding: '16px' }}>
                    <ListItemIcon>
                      <LocationIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Current Address"
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondary={`${profileData.currentAddress.addressline1}, ${profileData.currentAddress.city}, ${profileData.currentAddress.state}, ${profileData.currentAddress.country}`}
                    />
                  </ListItem>
                  <ListItem sx={{ padding: '16px' }}>
                    <ListItemIcon>
                      <HomeIcon sx={{ color: 'secondary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Permanent Address"
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondary={`${profileData.permanentAddress.addressline1}, ${profileData.permanentAddress.city}, ${profileData.permanentAddress.state}, ${profileData.permanentAddress.country}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 2 }}>
            <Card
              sx={{
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold', color: 'primary.main' }}>
                  Personal Information
                </Typography>
                <Box sx={{ marginBottom: '10px' }}>
                  <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Full Name</Typography>
                    <Typography sx={{ flex: 2, color: 'text.secondary' }}>
                      {profileData.firstname} {profileData.lastname}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Email</Typography>
                    <Typography sx={{ flex: 2, color: 'text.secondary' }}>{profileData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Phone</Typography>
                    <Typography sx={{ flex: 2, color: 'text.secondary' }}>{profileData.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', marginBottom: '16px' }}>
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Address</Typography>
                    <Typography sx={{ flex: 2, color: 'text.secondary' }}>
                      {profileData.currentAddress.addressline1}, {profileData.currentAddress.city}, {profileData.currentAddress.state}, {profileData.currentAddress.country}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', md: 'row' } }}>
              <Card
                sx={{
                  flex: 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold', color: 'primary.main' }}>
                    Bank Details
                  </Typography>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      Bank Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {profileData.Bank.bankname}
                    </Typography>
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      Account Holder
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {profileData.Bank.accountholder}
                    </Typography>
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      Account Number
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {profileData.Bank.accountnumber}
                    </Typography>
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      IFSC Code
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {profileData.Bank.ifsc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold', color: 'primary.main' }}>
                    Documents
                  </Typography>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      Aadhar Image
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: 'none' }}
                      onClick={() => window.open(`http://localhost:4500/${profileData.adharimage}`, '_blank')}
                    >
                      View Aadhar
                    </Button>
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      PAN Image
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: 'none' }}
                      onClick={() => window.open(`http://localhost:4500/${profileData.panimage}`, '_blank')}
                    >
                      View PAN
                    </Button>
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="body2" sx={{ fontSize: '1rem', marginBottom: '5px', fontWeight: 'bold' }}>
                      Degree
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ textTransform: 'none' }}
                      onClick={() => window.open(`http://localhost:4500/${profileData.degree}`, '_blank')}
                    >
                      View Degree
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <EditIcon color="primary" /> Edit Profile
          </Typography>
          
          <TextField
            label="Full Name"
            name="fullName"
            value={editData.fullName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Email"
            name="email"
            value={editData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          
          <TextField
            label="Phone"
            name="phone"
            value={editData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleCloseModal} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={UpdateYourProfile} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Educatorprofile;