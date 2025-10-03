import React, { useState, useRef } from "react";


import axios from "axios";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Container,
  Input,
} from "@mui/material";

import Swal from "sweetalert2";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";

const Registerstudentmentor = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    qualification:"",
    alternatephone:"",
    mothername:"",
    fathername:"",
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
   
    profile: null,
    adharimage: null,
   
  };

  const [formData, setFormData] = useState(initialState);
  const token = sessionStorage.getItem("token");
  const profileRef = useRef(null);
  const adharRef = useRef(null);
 

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        sameAddress: checked,
        permanentAddress: checked
          ? { ...prevData.currentAddress }
          : prevData.permanentAddress,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
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
    try {
      const url = `${BASE_URL}/admin/registerstudent`;
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (["profile", "adharimage"].includes(key)) {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (typeof formData[key] === "object") {
          Object.keys(formData[key]).forEach((nestedKey) => {
            formDataToSend.append(
              `${key}.${nestedKey}`,
              formData[key][nestedKey]
            );
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

     const response= await axios.post(url, formDataToSend, { headers });

      setFormData(initialState);
      if (profileRef.current) profileRef.current.value = "";
      if (adharRef.current) adharRef.current.value = "";
      
      // console.log("Mentor registered successfully",response.data);
      if(response.data.error==false){
        Swal.fire({
            title: "Good job!",
            text: "Student Register successfully",
            icon: "success"
          });
      }
    } catch (error) {
      // console.error(
      //   "Error adding mentor:",
      //   error.response?.data || error.message
      // );
    }
  };

  return (
    <>
      <PageTitle page="Register Student" />
      <Container>
        <Grid container spacing={3}>
          {["firstname", "lastname", "email", "phone", "password","qualification","alternatephone","mothername","fathername"].map(
            (field) => (
              <Grid item xs={12} sm={4} key={field}>
                <TextField
                  fullWidth
                  label={field.replace(/^\w/, (c) => c.toUpperCase())}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )
          )}

          {/* Current Address Heading */}
          <Grid item xs={12}>
            <h2>Current Address</h2>
          </Grid>

          {/* Current Address Fields */}
          {Object.keys(formData.currentAddress).map((field) => (
            <Grid item xs={12} sm={4} key={`currentAddress.${field}`}>
              <TextField
                fullWidth
                label={field.replace(/^\w/, (c) => c.toUpperCase())}
                name={`currentAddress.${field}`}
                value={formData.currentAddress[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}

          {/* Same Address Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="sameAddress"
                  checked={formData.sameAddress}
                  onChange={handleChange}
                />
              }
              label="Permanent Address same as Current Address"
            />
          </Grid>

          {/* Permanent Address Heading */}
          {!formData.sameAddress && (
            <Grid item xs={12}>
              <h2>Permanent Address</h2>
            </Grid>
          )}

          {/* Permanent Address Fields */}
          {!formData.sameAddress &&
            Object.keys(formData.permanentAddress).map((field) => (
              <Grid item xs={12} sm={4} key={`permanentAddress.${field}`}>
                <TextField
                  fullWidth
                  label={field.replace(/^\w/, (c) => c.toUpperCase())}
                  name={`permanentAddress.${field}`}
                  value={formData.permanentAddress[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

          {/* Bank Details */}
          
          {/* File Uploads */}
          {["profile", "adharimage"].map((fileField) => (
            <Grid item xs={12} sm={4} key={fileField}>
              <Input
                type="file"
                name={fileField}
                onChange={handleChange}
                inputProps={{ accept: "image/*" }}
              />
              <label style={{ marginTop: "8px", display: "block" }}>
                {fileField === "profile"
                  ? "Profile Picture"
                  : fileField === "adharimage"
                   ?"Aadhar Image"
                :""
                  }
              </label>
            </Grid>
          ))}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addMentorAPI}>
              Register Mentor
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Registerstudentmentor;