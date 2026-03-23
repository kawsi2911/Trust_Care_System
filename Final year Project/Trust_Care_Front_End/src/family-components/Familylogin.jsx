import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Familylogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        username: "", 
        password: "", 
        check: false
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return newErrors;
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        setTouched({ username: true, password: true });

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await fetch("http://localhost:5000/api/family/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    }),
                });

                const data = await res.json();

                if (res.status === 200) {
                    setToken(data.token);
                    setShowOTP(true);

                    Swal.fire({
                        icon: "success",
                        title: "OTP Sent",
                        text: "Check your email",
                        timer: 1500,
                        showConfirmButton: false
                    });

                } else {
                    Swal.fire({ icon: 'error', title: 'Login Failed', text: data.message });
                }

            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Backend error!' });
            }
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/family/verify-login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    otp: otp
                }),
            });

            const data = await res.json();

            if (res.status === 200) {
                if (formData.check) localStorage.setItem("userId", data.userId);
                else sessionStorage.setItem("userId", data.userId);

                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/familyhome");

            } else {
                Swal.fire("Error", data.message, "error");
            }

        } catch (err) {
            Swal.fire("Error", "OTP verification failed", "error");
        }
    };

    return (
        <>
            <Header />
            <div className='ServiceProviderSection'>
                <div className='ServiceContainer'>
                    <div className='forms'>
                        <div className='forms-fill'>

                            <div className='Heading-row'>
                                <p className='Heading'>Service Taken Login</p>
                                <span className='Subbody'>Find Trusted Caregivers for Your Loved Ones</span>
                            </div>

                            {/* USERNAME FIELD with user icon */}
                            <div className='row'>
                                <label>User Name :</label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
            type='text' name='username' value={formData.username} onChange={handleChange}       onFocus={(e) => e.target.style.borderColor = "#86b7fe"}
            onBlur={(e) => {
                e.target.style.borderColor = "#ced4da"; // reset border
                handleBlur(e); // validation
            }}
            style={{
                width: "100%",
                paddingLeft: "40px",
                boxSizing: "border-box",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                height: "42px",
                fontSize: "1rem",
                transition: "border-color 0.2s"
            }}
        />
    </div>
    {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
</div>

{/* PASSWORD FIELD with lock icon + eye toggle */}
<div className='row'>
    <label>Password :</label>
    <div style={{ position: "relative", width: "100%" }}>
        <input
            type={showPassword ? "text" : "password"}
            name='password'
            value={formData.password}
            onChange={handleChange}
            onFocus={(e) => e.target.style.borderColor = "#86b7fe"}
            onBlur={(e) => {
                e.target.style.borderColor = "#ced4da"; // reset border
                handleBlur(e); // validation
            }}
            style={{
                width: "100%",
                paddingLeft: "40px",
                paddingRight: "40px",
                boxSizing: "border-box",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                height: "42px",
                fontSize: "1rem",
                transition: "border-color 0.2s"
            }}
        />
        <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.1rem",
                userSelect: "none",
                color: "#6c757d"
            }}
        >
            {showPassword ? "🙈" : "👁️"}
        </span>
    </div>
    {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
</div>


                            {/* REMEMBER ME */}
                            <div className='row checkbox-row1'>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type='checkbox' name='check' checked={formData.check} onChange={handleChange} /> Remember Me
                                </label>
                            </div>

                            {/* LOGIN BUTTON */}
                            {!showOTP && (
                                <button className='next' onClick={handleLogin}>
                                    Login
                                </button>
                            )}

                            {/* OTP SECTION */}
                            {showOTP && (
                                <div className='row'>
                                    <label>Enter OTP:</label>
                                    <input
                                        type='text'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder='Enter OTP'
                                    />
                                    <button className='next' onClick={handleVerifyOTP}>
                                        Verify OTP
                                    </button>
                                </div>
                            )}

                            <p className='forgotpassword'>
                                <Link to="/familyforget">Forgot Password?</Link>
                            </p>

                            <p className='account'>
                                Don't have an account? <Link to="/familyregister">Register</Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Familylogin;