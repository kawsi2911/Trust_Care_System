import React from 'react';
import { useState } from 'react';
import Header from '../Header/Header.jsx';
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import "./ServiceProviderLoginPage.css"

function ServiceProviderLoginPage(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            username: "",
            passwords: "",
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
            if (!formData.passwords.trim()) {
                newErrors.passwords = "Password is required";
            } else if (formData.passwords.length < 6) {
                newErrors.passwords = "Password must be at least 6 characters";
            }
            setErrors(newErrors);
            return newErrors;
        };
    
        const handleLogin = () => {
            const validationErrors = validate();
            setTouched({
                username: true,
                passwords: true,
                check: true
            });
            if (Object.keys(validationErrors).length === 0) {
                navigate("/serviceproviderdashboard");
            }
        };
    
    

    return(
        <>
            <Header/>
        
            <div className='ServiceProviderSection'>
                <div className='ServiceContainer'>

                      <div className = 'forms'>
                        <div className = 'forms-fill'>

                            <div className='Heading-row'>
                                <p className='Heading'> Service Provider Login</p>
                                <span className='Subbody'>Access your Cargiver Dashboard</span>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'username'> User Name : <span className = 'star'>*</span></label>
                                <input type = 'text' id = 'username' name = 'username' placeholder = 'Enter your username' value={formData.username} onChange={handleChange} onBlur={handleBlur} className={touched.username && errors.username ? 'input-error' : ''} />
                                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'passwords'> Password : <label className = 'star'> * </label> </label>
                                <input type = 'password' id = 'passwords' name = 'passwords' placeholder = 'Enter your password' value={formData.passwords}  onChange={handleChange} onBlur={handleBlur} className={touched.passwords && errors.passwords ? 'input-error' : ''} />
                                {touched.passwords && errors.passwords && <p className="error-text">{errors.passwords}</p>}
                            </div>

                            <div className = 'row'>
                                <input type = 'checkbox' id = 'check' name = 'check' checked={formData.check} onChange={handleChange}/> <p className="checked">Remeber Me</p>
                            </div>

                            <button className = 'next' onClick={handleLogin}> Login </button>

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