import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import './ServiceProvider2.css';

function ServiceProvider2(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fulladdress:"",
        serviceType:[],
        year:"",
        qualifications:"",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            let updatedServices = [...formData.serviceType];
            if (checked) {
                updatedServices.push(value);
            } else {
                updatedServices = updatedServices.filter(s => s !== value);
            }
            setFormData({ ...formData, serviceType: updatedServices });
            setTouched(prev => ({ ...prev, serviceType: true }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const validate = () =>{
        let newErrors = {};
        
        if(!formData.fulladdress.trim()){
            newErrors.fulladdress = "Address is Required";
        }
        
        if(!formData.qualifications.trim()){
            newErrors.qualifications = "Qualitifications are Required";
        }
        
        if(formData.serviceType.length === 0){
            newErrors.serviceType = "Select the works";
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
                fulladdress:true,
                serviceType:true,
                year:true,
                qualifications:true,
 
            });
    
            if(Object.keys(validationErrors).length === 0){
               navigate("/serviceprovider3")
            }
     }
    

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>

                <div className = 'Service_container'>

                    <p className = 'para'>Service Provider Registration (2/3)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className='row'>
                                <label htmlFor = 'FullAddress'>Full Address : <label className='star'> * </label>  </label>
                                <textarea id = 'Address' name = 'Address' placeholder='Enter your complete address with city and postal code'value={formData.fulladdress} onChange={handleChange} onBlur={handleBlur} className={touched.fulladdress && errors.fulladdress ? 'input-error':''}></textarea>
                            </div>

                            <div className='rows'>
                                <label htmlFor='selectType'>Service Type (Select all that apply) : <label className='star'> * </label> </label><br/><br/>
                                <div className = 'checkbox-options'>
                                   <label>
                                        <input type = 'checkbox' name = 'serviceType'  value='ElderCare' checked={formData.serviceType.includes("ElderCare")} onChange={handleChange}/> Elder Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'serviceType' value = 'ChildCare' checked={formData.serviceType.includes("ChildCare")} onChange={handleChange}/> Child Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'serviceType' value = 'Hospital Patient Care' checked={formData.serviceType.includes("HospitalPatientCare")} onChange={handleChange}/> Hospital Patient Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'serviceType' value = 'Home Patient Care' checked={formData.serviceType.includes("HomePatientCare")} onChange={handleChange}/> Home Patient Care
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

                            <button className = 'next' onClick = {handleNext}> Next Step </button>
                            <button className = 'previous' onClick={()=> navigate("/serviceprovider1")}> Previous </button>
                            <p className = 'step' >Step 2 of 3</p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProvider2;