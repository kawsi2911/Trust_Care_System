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
    // Live validation if field has been touched
    if (touched[name]) validate(newData);
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(formData);
  };

  // Handle login
  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({ username: true, password: true, check: true });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const response = await fetch("http://localhost:5000/api/service/providerlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });

      // Safe parsing of response
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (!response.ok) {
        Swal.fire({ icon: "error", title: "Login Failed", text: data.message || data.error });
        return;
      }

      // Store user info depending on "Remember Me"
      if (formData.check) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("FullName", data.FullName);
      } else {
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("FullName", data.FullName);
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.FullName}`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => navigate("/serviceproviderdashboard"));

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
                <p className='Heading'>Service Provider Login</p>
                <span className='Subbody'>Access your Caregiver Dashboard</span>
              </div>

              <div className='row'>
                <label htmlFor='username'>Username : <span className='star'>*</span></label>
                <input
                  type='text' id='username' name='username'
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
                  type='password' id='password' name='password'
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

              <p className='forgotpassword'><Link to="/serviceproviderforget">Forgot Password?</Link></p>
              <p className='account'>Don't have an account? <Link to="/serviceprovider1">Register as Provider</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceProviderLoginPage;