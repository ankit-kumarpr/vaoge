import React, { useEffect, useState } from "react";
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
  Grid,
  Chip,
  Divider,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  AccountBalance as BankIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import BASE_URL from "../../config";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const MentorProfile = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const educator_id = decodedToken.userId;
  const role = decodedToken.role;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    const Getprofile = async () => {
      try {
        const url = `${BASE_URL}/admin/profile/${educator_id}/${role}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        // console.log("Profile response",response.data);
        setProfileData(response.data.data);
        setEditData({
          fullName: `${response.data.data.firstname} ${response.data.data.lastname}`,
          email: response.data.data.email,
          phone: response.data.data.phone,
        });
      } catch (error) {
        // console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    Getprofile();
  }, [educator_id, role, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading profile data...</Typography>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">Failed to load profile data</Typography>
      </Box>
    );
  }
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const UpdateYourProfile = async () => {
    if (!editData.fullName || !editData.email || !editData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill all fields before submitting.",
      });
      return;
    }

    try {
      const url = `${BASE_URL}/admin/updateprofile/${role}/${educator_id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Prepare request body according to backend expectations
      const requestBody = {
        fullName: editData.fullName,
        email: editData.email,
        phone: editData.phone,
      };

      const response = await axios.put(url, requestBody, { headers });

      if (response.data.error === false) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        Getprofile(); // Refresh profile data
        handleCloseModal();
      }
    } catch (error) {
      // console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  return (
    <>
      <PageTitle page={"Mentor Profile"} />

      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Edit Profile Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenModal}
            sx={{ textTransform: "none" }}
          >
            Edit Profile
          </Button>
        </Box>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: "20px",
            }}
          >
            {/* Left Column - Profile Card */}
            <Box sx={{ flex: 1, minWidth: "300px" }}>
              <Card sx={{ marginBottom: "20px", boxShadow: 3 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Avatar
                    src={`http://localhost:4500/${profileData.profile}`}
                    alt="Profile"
                    sx={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      margin: "0 auto 10px",
                      border: "4px solid #fff",
                      objectFit: "cover",
                      backgroundColor: "#f0f0f0",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <Typography variant="h5" gutterBottom color="primary">
                    {profileData.firstname} {profileData.lastname}
                  </Typography>
                  <Chip
                    label={
                      profileData.role.charAt(0).toUpperCase() +
                      profileData.role.slice(1)
                    }
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Mentor ID: {profileData.mentorId}
                  </Typography>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={profileData.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={profileData.email}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Address Information */}
            </Box>

            {/* Right Column - Detailed Information */}
            <Box sx={{ flex: 2 }}>
              {/* Bank Information */}
              <Card sx={{ marginBottom: "20px", boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <BankIcon color="primary" sx={{ mr: 1 }} />
                    Bank Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Bank Name:</strong>{" "}
                        {profileData.Bank?.bankname || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Branch:</strong>{" "}
                        {profileData.Bank?.branch || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Account Holder:</strong>{" "}
                        {profileData.Bank?.accountholder || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Account Number:</strong>{" "}
                        {profileData.Bank?.accountnumber || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>IFSC Code:</strong>{" "}
                        {profileData.Bank?.ifsc || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card sx={{ marginBottom: "20px", boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Aadhar Card
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          window.open(
                            `http://localhost:4500/${profileData.adharimage}`,
                            "_blank"
                          )
                        }
                        sx={{ mr: 2 }}
                      >
                        View Aadhar
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Current Address"
                        secondary={`${profileData.currentAddress.addressline1}, 
                        ${profileData.currentAddress.addressline2 || ""}, 
                        ${profileData.currentAddress.city}, 
                        ${profileData.currentAddress.state}, 
                        ${profileData.currentAddress.country} - 
                        ${profileData.currentAddress.zip}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Permanent Address"
                        secondary={`${
                          profileData.permanentAddress.addressline1
                        }, 
                        ${profileData.permanentAddress.addressline2 || ""}, 
                        ${profileData.permanentAddress.city}, 
                        ${profileData.permanentAddress.state}, 
                        ${profileData.permanentAddress.country} - 
                        ${profileData.permanentAddress.zip}`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
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

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={UpdateYourProfile}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MentorProfile;
