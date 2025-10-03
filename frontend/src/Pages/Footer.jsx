import React from "react";
import "./footer.css";
import Logo from "../images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Logo & Description */}
          <div className="col-lg-4 col-md-12">
            <img
              src={Logo}
              alt="Language School Logo"
              className="mb-3"
              style={{ height: "80px" }}
            />
            <p>
              It's the perfect time to start investing your energy in learning
              new languages and expanding your horizons.
            </p>
          </div>

          {/* Useful Links */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h5>Useful Links</h5>
            <ul>
              <li>
                <a href="index">Home</a>
              </li>
              <li>
                <a href="about">About Us</a>
              </li>
              <li>
                <a href="course">Our Course</a>
              </li>
              <li>
                <a href="contact">Contact Us</a>
              </li>
              {/* <li><a href="#">Careers</a></li> */}
            </ul>
          </div>

          {/* Programmes */}
          <div className="col-lg-3 col-md-4 col-sm-6">
            <h5>Useful Links</h5>
            <ul>
              <li>
                <a href="https://voagelearning.com/contact" target="_blank">
                  Enquiry Now
                </a>
              </li>
              <li>
                <a href="https://voagelearning.com/free-class" target="_blank">
                  Book Free Demo
                </a>
              </li>
              <li>
                <a href="https://voagelearning.com/" target="_blank">
                  Language Course
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-4 col-sm-12">
            <h5>Contact Info</h5>
            <ul>
              <li>
                <a href="mailto:enquiry@voagelearning.com">
                  <i className="fa fa-envelope footer-icons"></i>
                  enquiry@voagelearning.com
                </a>
              </li>
              <li>
                <a href="tel:+919520311515">
                  <i className="fa fa-phone footer-icons"></i>
                  Call Us: +91 9520311515
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
