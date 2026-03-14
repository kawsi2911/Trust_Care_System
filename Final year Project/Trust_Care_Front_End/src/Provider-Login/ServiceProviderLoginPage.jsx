import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
import { useNavigate, Link } from "react-router-dom";
import "./ServiceProviderLoginPage.css";
import Swal from 'sweetalert2';

function ServiceProviderLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",   // match backend field
    check: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
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
    setTouched({ username: true, password: true, check: true });
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const response = await fetch("http://localhost:5000/api/service/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({ icon: "error", title: "Login Failed", text: data.message || data.error });
        return;
      }

      // Store user info in localStorage if needed
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("FullName", data.FullName);

      Swal.fire({ icon: "success", title: "Login Successful", text: `Welcome ${data.FullName}` });
      navigate("/serviceproviderdashboard");

    } catch (err) {
      Swal.fire({ icon: "error", title: "Server Error", text: err.message });
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
                <p className='Heading'> Service Provider Login</p>
                <span className='Subbody'>Access your Caregiver Dashboard</span>
              </div>

              <div className='row'>
                <label htmlFor='username'> User Name : <span className='star'>*</span></label>
                <input 
                  type='text' id='username' name='username' 
                  placeholder='Enter your username' 
                  value={formData.username} onChange={handleChange} onBlur={handleBlur} 
                  className={touched.username && errors.username ? 'input-error' : ''} 
                />
                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className='row'>
                <label htmlFor='password'> Password : <span className='star'>*</span></label>
                <input 
                  type='password' id='password' name='password' 
                  placeholder='Enter your password' 
                  value={formData.password} onChange={handleChange} onBlur={handleBlur} 
                  className={touched.password && errors.password ? 'input-error' : ''} 
                />
                {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className='row'>
                <input type='checkbox' id='check' name='check' checked={formData.check} onChange={handleChange}/> <p className="checked">Remember Me</p>
              </div>

              <button className='next' onClick={handleLogin}> Login </button>

              <p className='forgotpassword'><Link to="/serviceproviderforget">Forgot Password?</Link></p>
              <p className='account'> Don't have an account? <Link to="/serviceprovider1"> Register as Provider</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceProviderLoginPage;