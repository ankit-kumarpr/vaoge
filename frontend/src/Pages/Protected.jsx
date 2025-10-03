import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected = (props) => {
    useEffect(() => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    navigate('/');
    return;
  }

  try {
    // Split the token and decode the payload part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));


    // console.log("Decoded JWT payload:", payload);

    const currentTime = Math.floor(Date.now() / 1000); 

    if (payload.exp < currentTime) {
      // console.log("Token expired");
      sessionStorage.removeItem("token");
      navigate('/');
    }
  } catch (err) {
    // console.error("Invalid token", err);
    sessionStorage.removeItem("token");
    navigate('/');
  }
}, [navigate]);
  return (
    <>
    
    <Component />
    </>
  )
}

export default Protected