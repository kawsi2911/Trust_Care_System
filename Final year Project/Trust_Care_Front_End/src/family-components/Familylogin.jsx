import React, { useState } from 'react';
import Header from '../Header/Header.jsx';
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return newErrors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        setTouched({
            username: true,
            password: true,
            check: true
        });
        if (Object.keys(validationErrors).length === 0) {
            navigate("/familyhome");
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

                            {/* Username */}
                            <div className='row'>
                                <label htmlFor='username'>User Name : <span className='star'>*</span></label>
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

                            {/* Password */}
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

                            {/* Remember Me */}
                            <div className='row checkbox-row'>
                                <input
                                    type='checkbox'
                                    id='check'
                                    name='check'
                                    checked={formData.check}
                                    onChange={handleChange}
                                />
                                <p className="checked">Remember Me</p>
                            </div>

                            <button className='next' onClick={handleLogin}>Login</button>

                            <p className='forgotpassword'>
                                <Link to="/familyprofileedit">Forgot Password?</Link>
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