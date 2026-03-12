import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import './ServiceProvider3.css';

function ServiceProvider3(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        uploadprofile:"",
        location:"",
        workRadius:"",
        available:"",
        hourlyRate:""
    });
        
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
        
    const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
        if(type === "file"){
            setFormData({...formData, uploadprofile: files[0]});
            // live validate file
            if(files[0]){
                setErrors({...errors, uploadprofile: undefined});
            } else {
                setErrors({...errors, uploadprofile: "Upload the profile image"});
            }
    
        } else {
            setFormData({...formData,[name]: value});
            // live validate text/radio/number
            if(value.trim() !== ""){
                setErrors({...errors, [name]: undefined});
            }
        }
    };
        
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({...touched,[name]:true});
        validate();
    };
        
    const validate = () =>{
        let newErrors = {};

        if(!formData.available.trim()){
            newErrors.available = "Availabel is Required";
        }

        if(!formData.hourlyRate.trim()){
            newErrors.hourlyRate = "Rate is Required";
        }
    
        if(!formData.location.trim()){
            newErrors.location = "Location is Required";
        }
    
        if(!formData.uploadprofile){
            newErrors.uploadprofile = "Upload the profile image";
        }
    
        if(!formData.workRadius.trim()){
            newErrors.workRadius = "Work Radius is Required";
        }
   
        setErrors(newErrors);
        return newErrors;
    };
        
    const handleNext = () =>{
    const validationErrors = validate();
        setTouched({
            uploadprofile:true,
            location:true,
            workRadius:true,
            available:true,
            hourlyRate:true
        });
        
        if(Object.keys(validationErrors).length === 0){
            navigate("/serviceproviderlogin")
        }
    }
    

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Provider Registration (3/3)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                             <div className='row'>
                                <label htmlFor='Profile'> Upload your Image : <label className='star'> * </label> </label>
                                <div className="upload-icon" onClick={() => document.getElementById('uploadInput').click()} >
                                    {formData.uploadprofile ? (
                                        <img src={URL.createObjectURL(formData.uploadprofile)} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} /> ) : (
                                        <>
                                            📷<br/>
                                            <span>Click to upload photo</span>
                                            <small>JPG, PNG • max 5MB</small>
                                        </>
                                    )}
                                </div>

                                <input type="file" id="uploadInput" name="uploadprofile" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleChange}  onBlur={handleBlur} />

                                    {touched.uploadprofile && errors.uploadprofile && (
                                        <p className="error-text">{errors.uploadprofile}</p>
                                    )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Location'> Location able to Work : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Location' name = 'location' placeholder = 'You can add multiple locations separated by commas' value={formData.location} onChange={handleChange} onBlur={handleBlur} className={touched.location && errors.location ?'input-error':''} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Phone'> Work Radius(Km) : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Phone' name = 'workRadius' placeholder = 'How far are you willing to travel ? (e.g 10)' value={formData.workRadius} onChange={handleChange} onBlur={handleBlur} className={touched.workRadius && errors.workRadius ?'input-error':''} />
                            </div>

                            <div className = 'row'>
                                <label> Available Duration : <label className='star'> * </label> </label>
                                <div className='duration-options ${touched.available && errors.available ? "input-error":""}'>
                                    <input type = 'radio' id = 'Fulltime' name = 'available' value='Fulltime' checked={formData.available === "Fulltime"} onChange={handleChange}/> <label htmlFor = 'Fulltime'>Full Time</label>
                                    <input type = 'radio' id = 'Parttime' name = 'available'  value = 'Parttime' checked={formData.available === "Parttime"} onChange={handleChange}/> <label htmlFor = 'Parttime'>Part Time</label>
                                    <input type = 'radio' id = 'Flexible' name = 'available' value= 'Flexible' checked={formData.available === "Flexible"} onChange={handleChange}/> <label htmlFor = 'Flexible'>Flexible</label>
                                </div>
                                {touched.available && errors.available && (
                                    <div className="error-text">{errors.available}</div>
                                )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'HoursRate'> Hourly Rate (Rs) : <label className='star'> * </label>  </label>
                                <input type = 'Number' id = 'HourlyRate' name = 'hourlyRate' placeholder = 'e.g 500' value={formData.hourlyRate} onChange={handleChange} onBlur={handleBlur} className={touched.hourlyRate && errors.hourlyRate ? 'input-error':''}/>
                            </div>

                            <button className = 'complete' onClick={handleNext}> Compelete Registration </button>
                            <button className = 'previous' onClick={()=> navigate("/serviceprovider2")}> Previous </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProvider3;