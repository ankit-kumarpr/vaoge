import React, { useEffect, useState } from 'react'

import { DataGrid } from "@mui/x-data-grid";

import axios from 'axios';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const Educatorlistmentor = () => {
const token=sessionStorage.getItem("token");
const [educators,seteducators]=useState([]);

  useEffect(()=>{
    Geteducators();
  },[])

  const Geteducators=async()=>{
    try{
      const url=`${BASE_URL}/admin/getalleducator`;

      const headers={
        "Content-Type":"application/json",
        Accept:"application/json",
        Authorization:`Bearer ${token}`
      }

      const response=await axios.get(url,{headers:headers});
      // console.log("Response of educator list",response);
      seteducators(response.data.data);

    }
    catch(error){
      // console.log(error);
    }
  }

  const columns=[
    { field: "sr_no", headerName: "Sr.No", width: 50 },
    {field:"id",headerName:"ID",width:250},
    {field:"firstname",headerName:"First Name",width:250},
    {field:"lastname",headerName:"Last Name",width:250},
    {field:"email",headerName:"Email",width:250},
    {field:"phone",headerName:"Phone",width:250},
    { field: "bankname", headerName: "Bank Name", width: 150 },
    { field: "accountnumber", headerName: "Account No.", width: 180 },
    { field: "ifsc", headerName: "IFSC Code", width: 150 },
    { field: "currentAddress", headerName: "Current Address", width: 250 },
  ];

  const rows= educators.map((educator,index)=>({
    sr_no: index + 1,
    id:educator._id,
    firstname:educator.firstname,
    lastname:educator.lastname,
    email:educator.email,
    phone:educator.phone,
    bankname: educator.Bank?.bankname || "N/A",
    accountnumber: educator.Bank?.accountnumber || "N/A",
    ifsc: educator.Bank?.ifsc || "N/A",
    currentAddress: educator.currentAddress
      ? `${educator.currentAddress.addressline1}, ${educator.currentAddress.addressline2}, ${educator.currentAddress.city}, ${educator.currentAddress.state}, ${educator.currentAddress.country}`
      : "N/A",
  }))

  return (
    <>
    <PageTitle page={"Educator List"} />
     <div style={{ height: 400, width: "100%", marginTop: 20 }}>
           
           <DataGrid rows={rows} columns={columns} pageSize={5} 
            rowsPerPageOptions={[5]}
            checkboxSelection
           />
         </div>
    </>
  )
}

export default Educatorlistmentor