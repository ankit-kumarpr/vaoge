import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Logo from "../images/logo.png";
import BASE_URL from "../config";
import Footer from "./Footer";

const Login = () => {
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const url = `${BASE_URL}/admin/login`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = { email, password };

      const response = await axios.post(url, requestBody, { headers });

      if (response.status === 200) {
        if (response.data.role === "admin") {
          Swal.fire({
            icon: "success",
            title: "Login successful!",
            text: "Please enter the OTP sent to your email.",
          });
          setIsOtpStage(true);
        } else {
          handleUserRedirect(response.data);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      // console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please try again later.",
      });
    }
  };

  const verifyOtp = async () => {
    try {
      const url = `${BASE_URL}/admin/verify-otp`;
      const requestBody = { email, otp };

      const response = await axios.post(url, requestBody);

      if (response.status === 200) {
        handleUserRedirect(response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Verification failed",
          text: response.data.message || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      // console.error("Verify OTP Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleUserRedirect = (userData) => {
    sessionStorage.setItem("token", userData.token);
    sessionStorage.setItem("role", userData.role);
    sessionStorage.setItem("name", userData.name);

    Swal.fire({
      icon: "success",
      title: "Login successful!",
      text: `Welcome ${userData.name}!`,
    });

    switch (userData.role) {
      case "admin":
        navigate("/admindashboard");
        break;
      case "mentor":
        navigate("/franchisedashboard");
        break;
      case "educator":
        navigate("/educatordashboard");
        break;
      case "student":
        navigate("/student-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpStage) {
      verifyOtp();
    } else if (showForgotPassword) {
      handleForgotPassword();
    } else {
      login();
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/forgot-password`, {
        email,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password reset link sent!",
          text: "Please check your email for instructions to reset your password.",
        });
        setShowForgotPassword(false);
        setEmail("");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send reset link",
        "error"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={Logo} alt="Company-logo" className="logo" />
      </div>

      <div className="form-container mx-auto">
        <h1 className="login-title">
          {showForgotPassword 
            ? "Reset Password" 
            : isOtpStage 
              ? "Verify OTP" 
              : "Sign in to Voage Learning"}
        </h1>

        <form onSubmit={handleSubmit}>
          {showForgotPassword ? (
            <>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="formEmail">Email address</label>
                <input
                  type="email"
                  id="formEmail"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block w-100 mb-4"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(false);
                  }}
                  style={{ color: "#0d6efd" }}
                >
                  Back to login
                </a>
              </div>
            </>
          ) : isOtpStage ? (
            <>
              <div className="form-outline mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  readOnly
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="otpInput">OTP</label>
                <input
                  type="text"
                  id="otpInput"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block w-100 mb-4"
              >
                Verify OTP
              </button>
            </>
          ) : (
            <>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="formEmail">Email address</label>
                <input
                  type="email"
                  id="formEmail"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="formPassword">Password</label>
                <input
                  type="password"
                  id="formPassword"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                  style={{ color: "red" }}
                >
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block w-100 mb-4"
              >
                Sign in
              </button>
            </>
          )}
        </form>
      </div>

      <div className="container-fluid">
        <div className="row">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Login;