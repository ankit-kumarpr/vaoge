import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PageTitle from "../../components/PageTitle";
import BASE_URL from "../../config";
import axios from "axios";

const Mentorlist = () => {
  const token = sessionStorage.getItem("token");
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    Getmentorlist();
  }, []);

  const Getmentorlist = async () => {
    try {
      const url = `${BASE_URL}/admin/getallmentor`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      // console.log("Response of Mentor List API", response.data.data);
      setMentors(response.data.data); // Store data in state
    } catch (error) {
      // console.log(error);
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: "sr_no", headerName: "Sr.No", width: 50 },
    { field: "id", headerName: "ID", width: 250 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    // {
    //   field: "profile",
    //   headerName: "Profile",
    //   width: 150,
    //   renderCell: (params) => (
    //     <img
    //       src={`${BASE_URL}/${params.value}`}
    //       alt="Profile"
    //       style={{ width: 50, height: 50, borderRadius: "50%" }}
    //     />
    //   ),
    // },
    { field: "bankname", headerName: "Bank Name", width: 150 },
    { field: "accountnumber", headerName: "Account No.", width: 180 },
    { field: "ifsc", headerName: "IFSC Code", width: 150 },
    { field: "currentAddress", headerName: "Current Address", width: 250 },
  ];

  // Map mentor data and set unique ID
  const rows = mentors.map((mentor, index) => ({
    sr_no: index + 1,
    id: mentor._id,
    firstname: mentor.firstname,
    lastname: mentor.lastname,
    email: mentor.email,
    phone: mentor.phone,
    // profile: mentor.profile,
    bankname: mentor.Bank?.bankname || "N/A",
    accountnumber: mentor.Bank?.accountnumber || "N/A",
    ifsc: mentor.Bank?.ifsc || "N/A",
    currentAddress: mentor.currentAddress
      ? `${mentor.currentAddress.addressline1}, ${mentor.currentAddress.addressline2}, ${mentor.currentAddress.city}, ${mentor.currentAddress.state}, ${mentor.currentAddress.country}`
      : "N/A",
  }));

  return (
    <>
      <PageTitle page={"Mentor List"} />
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        
        <DataGrid rows={rows} columns={columns} pageSize={5} 
         rowsPerPageOptions={[5]}
         checkboxSelection
        />
      </div>
    </>
  );
};

export default Mentorlist;
