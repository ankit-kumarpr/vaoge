import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        sessionStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      sessionStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  return <Component />;
};

export default Protected;