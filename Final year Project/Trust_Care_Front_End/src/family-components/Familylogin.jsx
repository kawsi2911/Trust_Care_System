import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Familylogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "", check: false });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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
        setTouched({ username: true, password: true, check: true });

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await fetch("http://localhost:5000/api/family/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: formData.username, password: formData.password }),
                });

                const data = await res.json();

                if (res.status === 200) {
                    // Store _id
                    if (formData.check) localStorage.setItem("userId", data.userId);
                    else sessionStorage.setItem("userId", data.userId);

                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome back!',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => navigate("/familyhome"), 1500);
                } else {
                    Swal.fire({ icon: 'error', title: 'Login Failed', text: data.message });
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Check backend!', confirmButtonText: 'OK' });
            }
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

                            <div className='row'>
                                <label htmlFor='username'>User Name : <span className='star'>*</span></label>
                                <input type='text' id='username' name='username' placeholder='Enter your username' value={formData.username} onChange={handleChange} onBlur={handleBlur} className={touched.username && errors.username ? 'input-error' : ''} />
                                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='password'>Password : <span className='star'>*</span></label>
                                <input type='password' id='password' name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} onBlur={handleBlur} className={touched.password && errors.password ? 'input-error' : ''} />
                                {touched.password && errors.password && <p className="error-text">{errors.password}</p>}
                            </div>

                            <div className='row checkbox-row'>
                                <input type='checkbox' id='check' name='check' checked={formData.check} onChange={handleChange} />
                                <p className="checked">Remember Me</p>
                            </div>

                            <button className='next' onClick={handleLogin}>Login</button>

                            <p className='forgotpassword'>
                                <Link to="/familyforget">Forgot Password?</Link>
                            </p>
                            <p className='account'>
                                Don't have an account? <Link to="/familyregister">Register as Service Taker</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Familylogin;