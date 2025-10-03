import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../src/components/PageTitle';
import { useLocation } from 'react-router-dom';
import BASE_URL from '../../../config';
import axios from 'axios';
import Swal from "sweetalert2";

const Buycourse = () => {
    const token = sessionStorage.getItem('token');
    const location = useLocation();
    const { studentId, studentName, enrollmentNumber } = location.state || {};
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCoursePrice, setSelectedCoursePrice] = useState(0);  
    const [couponCode, setCouponCode] = useState(''); 
    const [subtotal, setSubtotal] = useState(0); 
    const [discount, setDiscount] = useState(0); 
    const [priceAfterDiscount, setPriceAfterDiscount] = useState(0); 
    const [gstAmount, setGstAmount] = useState(0); 
    const [totalAmountWithGST, setTotalAmountWithGST] = useState(0); // Track total amount with GST
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false); // Track checkout success
    const [checkoutId, setCheckoutId] = useState(null); 
    const [buyid, setBuyid] = useState(""); // Track checkout ID from checkout API response
    const [isConfirmSuccess, setIsConfirmSuccess] = useState(false); // Track confirm success

    useEffect(() => {
        Getcourselist();
    }, []);

    const Getcourselist = async () => {
        try {
            const url = `${BASE_URL}/admin/getcourse`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(url, { headers: headers });
            setCourses(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    };

    // Checkout API
    const checkoutAPI = async () => {
        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }

        try {
            const url = `${BASE_URL}/common/buycourse`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };

            // Get selected course details
            const selectedCourseDetails = courses.find(course => course._id === selectedCourse);

            // Prepare request body
            const requestBody = {
                studentId: studentId, 
                courseId: selectedCourse, 
                couponCode: couponCode,
                courseprice: selectedCourseDetails.price, 
                gstPercentage: selectedCourseDetails.gst 
            };
            // console.log("Request body", requestBody);

            const response = await axios.post(url, requestBody, { headers: headers });
            // console.log("Response of checkout API", response.data);
            setBuyid(response.data.data._id);
            // Update state with API response data
            if (response.data.success) {
                setDiscount(response.data.data.totalDiscount);
                setPriceAfterDiscount(response.data.data.totalAmountAfterDiscount);
                setGstAmount(response.data.data.gstAmount);
                setTotalAmountWithGST(response.data.data.totalAmountWithGST);
                 
                setIsCheckoutSuccess(true); // Set checkout success to true
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const handleBuyClick = (courseId, coursePrice) => {
        if (selectedCourse === courseId) {
            // Deselect the course
            setSelectedCourse(null);
            setSelectedCoursePrice(0);
            setSubtotal(0); // Reset subtotal
            setDiscount(0); // Reset discount
            setPriceAfterDiscount(0); // Reset price after discount
            setGstAmount(0); // Reset GST amount
            setTotalAmountWithGST(0); // Reset total amount with GST
            setIsCheckoutSuccess(false); // Reset checkout success
            setIsConfirmSuccess(false); // Reset confirm success
        } else {
            // Select the course
            setSelectedCourse(courseId);
            setSelectedCoursePrice(coursePrice);
            setSubtotal(coursePrice); // Set subtotal to the selected course price
            setDiscount(0); // Reset discount
            setGstAmount(0); // Reset GST amount
            setTotalAmountWithGST(0); // Reset total amount with GST
            setIsCheckoutSuccess(false); // Reset checkout success
            setIsConfirmSuccess(false); // Reset confirm success
        }
    };

    // Confirm Order API
    const confirmorderAPI = async (razorpayResponse) => {
        if (!buyid) {
            alert("Please complete the checkout process first.");
            return;
        }

        try {
            const url = `${BASE_URL}/common/confirmpay`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            };

            // Prepare request body
            const requestBody = {
                id: buyid, // Pass checkout ID from checkout API response
                razorpayResponse: razorpayResponse // Pass Razorpay response
            };
            // console.log("Request body of confirm pay", requestBody);

            const response = await axios.post(url, requestBody, { headers: headers });
            // console.log("Response of confirm pay API", response.data);
            if(response.data.success==true){
                Swal.fire({
                    title: "Good job!",
                    text: "Your Order Placed SuccessFully",
                    icon: "success"
                  });
            }

            // Update state if confirm API is successful
            if (response.data.success) {
                setIsConfirmSuccess(true); // Set confirm success to true
            }
        } catch (error) {
            // console.log(error);
        }
    };

    // Payment gateway
    const handleOpenRazorpay = (data) => {
        try {
            const options = {
                key: "rzp_test_mcwl3oaRQerrOW",
                amount: Number(data.amount) * 100,
                currency: "INR",
                name: "Voage Learning",
                description: "",
                order_id: data.id,
                handler: async function (response) {
                    // console.log("Payment Successful:", response);
                    // Call confirmorderAPI with Razorpay response
                    await confirmorderAPI(response);
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error opening Razorpay:", error);
            throw error;
        }
    };

    const handlePayment = async () => {
        try {
            const finalamount=totalAmountWithGST.toFixed(2);
            const _data = { TotalAmount: finalamount };
            // console.log("Final amount in handle payment", _data);
            const res = await axios.post(`${BASE_URL}/common/orders`, _data);
            // console.log("Response handle payment", res);
            handleOpenRazorpay(res.data.data);
        } catch (error) {
            // console.log("Error handling payment", error);
        }
    };

    return (
        <>
            <PageTitle page={"Buy Course"} />
            <div className="container-fluid">
                <div className="row">
                    {/* Cards Section - col-md-8 */}
                    <div className="col-md-8">
                        <div className="row">
                            {courses.map((course) => (
                                <div className="col-12 col-sm-6 col-md-4 mb-4" key={course._id}>
                                    <div className="card h-100">
                                        <div style={{ height: '100px', overflow: 'hidden', paddingTop: "10px" }}>
                                            <img
                                                src={`http://localhost:4500${course.courseimage}`}
                                                className="card-img-top img-fluid"
                                                alt={course.coursename}
                                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                            />
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{course.coursename}</h5>
                                            <p className="card-text">Price: ₹{course.price}</p>
                                            <p className="card-text">Duration: {course.duration}</p>
                                            <button
                                                className={`btn ${selectedCourse === course._id ? "btn-danger" : "btn-primary"} w-100 mt-auto`}
                                                onClick={() => handleBuyClick(course._id, course.price)}
                                            >
                                                {selectedCourse === course._id ? "Remove" : "Buy Now"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Section - col-md-4 */}
                    <div className="col-md-4">
                        <h4>Order Summary</h4>
                        <div className="border p-3 rounded">
                            {/* Discount Section */}
                            <div className="mb-3">
                                <label htmlFor="discount" className="form-label">
                                    Apply Discount Code
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="discount"
                                        placeholder="Enter discount code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-3">
                                <p className="d-flex justify-content-between">
                                    <span>Subtotal:</span>
                                    <span>₹ {subtotal}</span>
                                </p>
                                <p className="d-flex justify-content-between">
                                    <span>Total Discount:</span>
                                    <span>₹ {discount}</span> {/* Display total discount */}
                                </p>
                                <p className="d-flex justify-content-between">
                                    <span>Total After Discount:</span>
                                    <span>₹ {priceAfterDiscount}</span> {/* Display total after discount */}
                                </p>
                                <p className="d-flex justify-content-between">
                                    <span>GST Amount:</span>
                                    <span>₹ {gstAmount.toFixed(2)}</span> 
                                </p>
                                <hr />
                                <p className="d-flex justify-content-between">
                                    <strong>Total Price:</strong>
                                    <strong>₹ {totalAmountWithGST.toFixed(2)}</strong> {/* Display total price with GST */}
                                </p>
                            </div>

                            {/* Checkout/Confirm Button */}
                            <button
                                className={`btn ${
                                    isConfirmSuccess ? "btn-success" : 
                                    isCheckoutSuccess ? "btn-warning" : "btn-primary"
                                } w-100`}
                                onClick={isCheckoutSuccess ? handlePayment : checkoutAPI}
                                disabled={isConfirmSuccess} // Disable button after successful confirmation
                            >
                                {isConfirmSuccess ? "Confirmed" : 
                                 isCheckoutSuccess ? "Confirm" : "Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Buycourse;