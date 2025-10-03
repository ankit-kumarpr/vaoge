import React, { useState } from 'react';
import PageTitle from '../../components/PageTitle';
import BASE_URL from '../../config';
import axios from 'axios';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Specific label formatting for known fields
const getFieldLabel = (fieldName) => {
  const labelMap = {
    addressline1: 'Address Line 1',
    addressline2: 'Address Line 2',
    city: 'City',
    state: 'State',
    country: 'Country',
    zip: 'ZIP Code',
    landmark: 'Landmark',
    bankname: 'Bank Name',
    branch: 'Branch',
    accountholder: 'Account Holder',
    accountnumber: 'Account Number',
    ifsc: 'IFSC Code'
  };

  return labelMap[fieldName] || fieldName;
};

const AddMentor = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    qualification: "",
    sameAddress: false,
    currentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      landmark: "",
    },
    permanentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      landmark: "",
    },
    Bank: {
      bankname: "",
      branch: "",
      accountholder: "",
      accountnumber: "",
      ifsc: "",
    },
    profile: null,
    adharimage: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = sessionStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        sameAddress: checked,
        permanentAddress: checked ? { ...prevData.currentAddress } : prevData.permanentAddress,
      }));
    } else if (type === 'file') {
      if (name === 'profile' && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addMentorAPI = async () => {
    setIsSubmitting(true);
    try {
      const url = `${BASE_URL}/admin/registermentor`;
      const formDataToSend = new FormData();

      // Append normal fields
      Object.keys(formData).forEach((key) => {
        if (key === 'profile' || key === 'adharimage') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (typeof formData[key] === 'object') {
          // Flatten and append nested objects
          Object.keys(formData[key]).forEach((nestedKey) => {
            formDataToSend.append(`${key}.${nestedKey}`, formData[key][nestedKey]);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(url, formDataToSend, { headers });
      if(response.data.error === false){
        Swal.fire({
          title: "Success!",
          text: "Mentor registered successfully.",
          icon: "success"
        });
        setFormData(initialState);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error adding mentor:", error.response?.data || error.message);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to register mentor",
        icon: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle page="Add New Mentor" />
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#01a2a6' }}>
            Mentor Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="First Name" 
                    name="firstname" 
                    value={formData.firstname} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Last Name" 
                    name="lastname" 
                    value={formData.lastname} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    fullWidth 
                    label="Qualification" 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Current Address Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Current Address
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(formData.currentAddress).map((field) => (
                    <Grid item xs={12} sm={4} key={`currentAddress.${field}`}>
                      <TextField
                        fullWidth
                        label={getFieldLabel(field)}
                        name={`currentAddress.${field}`}
                        value={formData.currentAddress[field]}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Same Address Checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="sameAddress" 
                    checked={formData.sameAddress} 
                    onChange={handleChange} 
                    color="primary"
                  />
                }
                label="Permanent Address same as Current Address"
              />
            </Grid>

            {/* Permanent Address Section */}
            {!formData.sameAddress && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Permanent Address
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.keys(formData.permanentAddress).map((field) => (
                      <Grid item xs={12} sm={4} key={`permanentAddress.${field}`}>
                        <TextField
                          fullWidth
                          label={getFieldLabel(field)}
                          name={`permanentAddress.${field}`}
                          value={formData.permanentAddress[field]}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Bank Details Section */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Bank Details
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(formData.Bank).map((field) => (
                    <Grid item xs={12} sm={4} key={field}>
                      <TextField
                        fullWidth
                        label={getFieldLabel(field)}
                        name={`Bank.${field}`}
                        value={formData.Bank[field]}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* File Uploads */}
            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Upload Aadhar Card
                <VisuallyHiddenInput 
                  type="file" 
                  name="adharimage" 
                  onChange={handleChange} 
                  accept="image/*" 
                />
              </Button>
              {formData.adharimage && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {formData.adharimage.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Upload Profile Picture
                <VisuallyHiddenInput 
                  type="file" 
                  name="profile" 
                  onChange={handleChange} 
                  accept="image/*" 
                />
              </Button>
              {formData.profile && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {formData.profile.name}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={addMentorAPI}
                  disabled={isSubmitting}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {isSubmitting ? 'Registering...' : 'Register Mentor'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default AddMentor;