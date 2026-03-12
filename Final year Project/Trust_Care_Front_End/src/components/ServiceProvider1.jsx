import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import './ServiceProvider1.css';

function ServiceProvider1(){

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FullName:"",
        NIC:"",
        phone:"",
        email:"",
        gender:"",
        dob:"",
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
    
        if(!formData.FullName.trim()){
            newErrors.FullName = "Full Name is Required";
        }

        if(!formData.NIC.trim()){
            newErrors.NIC = "NIC is Required";
        }

        if(!formData.phone.trim()){
            newErrors.phone = "Phone is Required";
        }

        if(!formData.email.trim()){
            newErrors.email = "Email is Required";
        }

        if(!formData.gender){
            newErrors.gender = "Gender is Required";
        }
        
        if(!formData.dob.trim()){
            newErrors.dob = "Date of Birth is Required";
        }
        
        setErrors(newErrors);
        return newErrors;
    }

    const handleNext = () =>{
        const validationErrors = validate();
    
        setTouched({
            FullName:true,
            NIC:true,
            phone:true,
            email:true,
            gender:true,
            dob:true,     
        });
    
        if(Object.keys(validationErrors).length === 0){
            navigate("/serviceprovider2")
        }
    }

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Provider Registration (1/3)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'FullName'> Full Name : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'FullName' name = 'FullName' placeholder = 'Enter your Full Name' value={formData.FullName} onChange = {handleChange} onBlur={handleBlur} className = {touched.FullName && errors.FullName ? 'input-error':''}/>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'NIC' name = 'NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)' value={formData.NIC} onChange={handleChange} onBlur={handleBlur} className={touched.NIC && errors.NIC ? 'input-error':''} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Phone'>Phone Number : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Phone' name = 'phone' placeholder = '+94 77 123 4567' value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={touched.phone && errors.phone ? 'input-error':''}/>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Email'>Email Address : <label className='star'> * </label> </label>
                                <input type = 'email' id = 'Email' name = 'email' placeholder = 'example@gmail.com' value={formData.email} onChange={handleChange} onBlur={handleBlur} className={touched.email && errors.email ? 'input-error':''}/>
                            </div>

                            <div className = 'row'>
                                <label> Gender : <label className='star'> * </label> </label>
                                <div className = 'gender-options'>
                                    <input type = 'radio' id = 'Male' name = 'gender' value='male' checked = {formData.gender === 'male'} onChange={handleChange} /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'gender' value='female' checked = {formData.gender === 'female'} onChange={handleChange}/> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'gender' value='other' checked = {formData.gender === 'other'} onChange={handleChange}/> <label htmlFor = 'Other'>Other</label>
                                </div>
                                {touched.gender && errors.gender && (
                                    <div className="error-text">{errors.gender}</div>
                                )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'DOB'> Date of Birth : <label className='star'> * </label>  </label>
                                <input type = 'date' id = 'DOB' name = 'dob' placeholder = 'mm/dd/yyyy' value={formData.dob} onChange={handleChange} onBlur={handleBlur} className={touched.dob && errors.dob ? 'input-error':''} />
                            </div>

                            <button className = 'next' onClick={handleNext} > Next Step </button>
                            <p className = 'step'>Step 1 of 3</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProvider1;