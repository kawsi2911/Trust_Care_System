import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';

function ServiceProviderProfileEdit(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        FullName:"",
        NIC:"",
        phone:"",
        email:"",
        gender:"",
        dob:"",
        fulladdress:"",
        serviceType:[],
        year:"",
        qualifications:"",
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
        if(type === "checkbox"){
            let updatedServices = [...formData.serviceType];
            if(checked){
                updatedServices.push(value);
            }else{
                updatedServices = updatedServices.filter(s => s !== value);
            }
            setFormData({...formData, serviceType: updatedServices});

            // live validate checkbox
            if(updatedServices.length > 0){
                setErrors({...errors, serviceType: undefined});
            } else {
                setErrors({...errors, serviceType: "Select the works"});
            }

        } else if(type === "file"){
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
    
            if(!formData.FullName.trim()){
                newErrors.FullName = "Full Name is Required";
            }

            if(!formData.NIC.trim()){
                newErrors.NIC = "NIC is Required";
            }

            if(!formData.available.trim()){
                newErrors.available = "Availabel is Required";
            }

            if(!formData.dob.trim()){
                newErrors.dob = "Date of Birth is Required";
            }

            if(!formData.email.trim()){
                newErrors.email = "Email is Required";
            }

            if(!formData.fulladdress.trim()){
                newErrors.fulladdress = "Address is Required";
            }

            if(!formData.gender){
                newErrors.gender = "Gender is Required";
            }

            if(!formData.hourlyRate.trim()){
                newErrors.hourlyRate = "Rate is Required";
            }

            if(!formData.location.trim()){
                newErrors.location = "Location is Required";
            }

            if(!formData.phone.trim()){
                newErrors.phone = "Phone is Required";
            }

            if(!formData.qualifications.trim()){
                newErrors.qualifications = "Qualitifications are Required";
            }

            if(formData.serviceType.length === 0){
                newErrors.serviceType = "Select the works";
            }

            if(!formData.uploadprofile){
                newErrors.uploadprofile = "Upload the profile image";
            }

            if(!formData.workRadius.trim()){
                newErrors.workRadius = "Work Radius is Required";
            }

            if(!formData.year.trim()){
                newErrors.year = "Years of Experience is required";
            }
    
            
            setErrors(newErrors);
            return newErrors;
        };
    
        const handleNext = () =>{
            const validationErrors = validate();
    
            setTouched({
                FullName:true,
                NIC:true,
                phone:true,
                email:true,
                gender:true,
                dob:true,
                fulladdress:true,
                serviceType:true,
                year:true,
                qualifications:true,
                uploadprofile:true,
                location:true,
                workRadius:true,
                available:true,
                hourlyRate:true
            });
    
            if(Object.keys(validationErrors).length === 0){
               navigate("/ServiceProviderDashboard")
            }
        }

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Provider Edit Details </p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'FullName'> Full Name : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'FullName' name = 'FullName' placeholder = 'Enter your Full Name' value={formData.FullName} onChange = {handleChange} onBlur={handleBlur} className = {touched.FullName && errors.FullName ? 'input-error':''}/>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'NIC' name = 'NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)'  value={formData.NIC} onChange={handleChange} onBlur={handleBlur} className={touched.NIC && errors.NIC ? 'input-error':''} />
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
                                <div className = 'gender-options $ {touched.gender && errors.gender ?"input-error":""}'>
                                    <input type = 'radio'  id = 'Male' name = 'gender' value="male" checked = {formData.gender === 'male'} onChange={handleChange}/> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'gender' value ="female" checked = {formData.gender === 'female'} onChange={handleChange} /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'gender' value='others' checked = {formData.gender === 'others'} onChange={handleChange} /> <label htmlFor = 'Other'>Other</label>
                                </div>
                                {touched.gender && errors.gender && (
                                    <div className="error-text">{errors.gender}</div>
                                )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'DOB'> Date of Birth : <label className='star'> * </label>  </label>
                                <input type = 'date' disabled id = 'DOB' name = 'dob' placeholder = 'mm/dd/yyyy' value={formData.dob} onChange={handleChange} onBlur={handleBlur} className={touched.dob && errors.dob ? 'input-error':''} />
                            </div>

                            <div className='row'>
                                <label htmlFor = 'FullAddress'>Full Address : <label className='star'> * </label>  </label>
                                <textarea id = 'Address' name = 'fulladdress' placeholder='Enter your complete address with city and postal code' value={formData.fulladdress} onChange={handleChange} onBlur={handleBlur} className={touched.fulladdress && errors.fulladdress ? 'input-error':''}></textarea>
                            </div>

                            <div className='rows'>
                                <label htmlFor='selectType'>Service Type (Select all that apply) : <label className='star'> * </label> </label><br/><br/>
                                <div className = 'checkbox-options'>
                                    <label>
                                        <input type = 'checkbox' name = 'ServiceType'  value='ElderCare' checked={formData.serviceType.includes("ElderCare")} onChange={handleChange}/> Elder Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'ServiceType' value = 'ChildCare' checked={formData.serviceType.includes("ChildCare")} onChange={handleChange}/> Child Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'ServiceType' value = 'Hospital Patient Care' checked={formData.serviceType.includes("HospitalPatientCare")} onChange={handleChange}/> Hospital Patient Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'ServiceType' value = 'Home Patient Care' checked={formData.serviceType.includes("HomePatientCare")} onChange={handleChange}/> Home Patient Care
                                    </label>
                                    {touched.serviceType && errors.serviceType && (
                                        <p className="error-text">{errors.serviceType}</p>
                                    )}
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor = 'no_experience'>Years of Experiences : <label className='star'> * </label>  </label>
                                <input type = 'number' id = 'no_experience' name = 'year' placeholder = 'eg.5' value={formData.year} onChange={handleChange} onBlur={handleBlur} className={touched.year && errors.year ?'input-error':''}/>
                            </div>

                            <div className='row'>
                                <label htmlFor = 'Qualifications'> Qualifications / Certificates : <label className='star'> * </label>  </label>
                               <textarea id = 'Qualifications' name = 'qualifications' placeholder = 'List your qualifications, certificates, training programs...' rows = '4' value={formData.qualifications} onChange={handleChange} onBlur={handleBlur} className={touched.qualifications && errors.qualifications ?'input-error':''}></textarea>
                            </div>

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

                            <button className = 'complete' onClick={handleNext}> Submit</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default ServiceProviderProfileEdit;