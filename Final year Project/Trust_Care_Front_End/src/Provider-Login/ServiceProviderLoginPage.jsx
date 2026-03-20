import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
import { useNavigate, Link } from "react-router-dom";
import "./ServiceProviderLoginPage.css";
import Swal from 'sweetalert2';

function ServiceProviderLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    check: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");

  // Validation function
  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.username.trim()) newErrors.username = "Username is required";
    if (!data.password.trim()) newErrors.password = "Password is required";
    else if (data.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = { ...formData, [name]: type === "checkbox" ? checked : value };
    setFormData(newData);
    if (touched[name]) validate(newData);
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(formData);
  };

  // Handle login (send OTP)
  const handleLogin = async () => {
    const validationErrors = validate();
    setTouched({ username: true, password: true });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/service/providerlogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setToken(data.token);    // save JWT token
          setShowOTP(true);        // show OTP input

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

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Swal.fire("Error", "Please enter OTP", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/service/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Save userId based on Remember Me
      if (formData.check) {
        localStorage.setItem("providerId", data.userId);
        localStorage.setItem("FullName", data.fullName);
      } else {
        sessionStorage.setItem("providerId", data.userId);
        sessionStorage.setItem("FullName", data.fullName);
      }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false
        });

        navigate("/serviceproviderdashboard");
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
                <p className='Heading'>Service Provider Login</p>
                <span className='Subbody'>Access your Caregiver Dashboard</span>
              </div>

              {/* LOGIN FORM - always visible */}
              <div className='row'>
                <label htmlFor='username'>Username : <span className='star'>*</span></label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Enter your username'
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.username && errors.username ? 'input-error' : ''}
                />
                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className='row'>
                <label htmlFor='password'>Password : <span className='star'>*</span></label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.password && errors.password ? 'input-error' : ''}
                />
                {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className='row checkbox-row'>
                <input
                  type='checkbox'
                  id='check'
                  name='check'
                  checked={formData.check}
                  onChange={handleChange}
                />
                <label htmlFor='check' className="checked">Remember Me</label>
              </div>

              <button className='next' onClick={handleLogin}>Login</button>

              {/* OTP INPUT - shows only after login */}
              {showOTP && (
                <div className='row otp-row'>
                  <label htmlFor='otp'>Enter OTP : <span className='star'>*</span></label>
                  <input
                    type='text'
                    id='otp'
                    name='otp'
                    placeholder='Enter OTP sent to your email'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button className='next' onClick={handleVerifyOTP}>Verify OTP</button>
                </div>
              )}

              <p className='forgotpassword'><Link to="/serviceproviderforget">Forgot Password?</Link></p>
              <p className='account'>Don't have an account? <Link to="/serviceprovider1">Register as Provider</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceProviderLoginPage;