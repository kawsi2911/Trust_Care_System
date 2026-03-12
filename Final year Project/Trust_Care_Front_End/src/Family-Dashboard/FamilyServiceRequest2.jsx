import { useState } from "react";
import React from "react";
import Header from "../Header/Header";
import "./FamilyServiceRequest2.css";
import { useNavigate } from "react-router-dom";

function FamilyServiceRequest2(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        SLocation:"",
        Address:"",
        serviceOptions:"",
        disabilityDetails:"",
        Gender:"",
        additionalRequirement:""
    });
    
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
            setFormData({
            ...formData,
            [name]:type === "checkbox" ? checked : value
        });
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({...touched,[name]:true});
        validate();
    };
    
    const validate = () =>{

        let newErrors = {};
        
        if(!formData.SLocation.trim()){
            newErrors.SLocation = "City is Required";
        }

        if(!formData.Address.trim()){
            newErrors.Address = "Full Address is Required";
        }

        if(!formData.serviceOptions.trim()){
            newErrors.serviceOptions = "Select the Services";
        }

        if(!formData.Gender){
            newErrors.Gender = "Selec the Gender";
        }

        if(!formData.additionalRequirement.trim()){
            newErrors.additionalRequirement = "Additional Requirements is Required";
        }
        
        setErrors(newErrors);
            return newErrors;
    };
    
    const handleNext = () =>{
        const validationErrors = validate();
        
        setTouched({
            SLocation:true,
            Address:true,
            serviceOptions:true,
            Gender:true,
            additionalRequirement:true
           
        });
    
        if(Object.keys(validationErrors).length === 0){
            navigate("/findingcareprovider")
        }
    }
    

    
    return(
         <>
            <Header />

            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Request Form (2/2)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'SLocation'>Service Location (City): <label className='star'> * </label> </label>
                                <input type = 'text' id = 'SLocation' name = 'SLocation' placeholder = 'Enter the Patient Name' value  ={formData.SLocation} onBlur={handleBlur} onChange ={handleChange} className={touched.SLocation && errors.SLocation ? "input-error" : ""} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Full-Address'>Full Address : <label className='star'> * </label> </label>
                                <textarea id = 'Address' name = 'Address' placeholder='Enter your complete address where is needed' value={formData.Address} onBlur={handleBlur} onChange={handleChange} className={touched.Address && errors.Address ?'input-error':""}></textarea>
                            </div>

                            <div className='row'>
                                <label>
                                    Any Disabilities : <span className='star'>*</span>
                                </label>

                                <div className={`Service-options ${touched.serviceOptions && errors.serviceOptions ? "input-error" : ""}`}>
                                    <input type='radio' id='Yes' name='serviceOptions' value='Yes' checked={formData.serviceOptions === "Yes"} onChange={handleChange} /> <label htmlFor='Yes'>Yes</label>
                                    <input type='radio' id='No'name='serviceOptions' value='No' checked={formData.serviceOptions === "No"} onChange={handleChange} /><label htmlFor='No'>No</label>
                                </div>
                            </div>

                            {formData.serviceOptions === "Yes" && (
                                <div className="yess">
                                    <textarea
                                        name="disabilityDetails"
                                        rows="5"
                                        placeholder="Describe the disabilities or medical conditions"
                                        value={formData.disabilityDetails}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            )}
                 

                            <div className='row'>
                                <label> Preferred Caregiver Gender : <span className='star'>*</span> </label>
                                <div className={`gender-options ${touched.Gender && errors.Gender ? "input-error" : ""}`}>
                                    <input type='radio' id='Male' name='Gender' value='Male' checked={formData.Gender === "Male"} onChange={handleChange} /> <label htmlFor='Male'>Male</label>
                                    <input type='radio' id='Female' name='Gender' value='Female' checked={formData.Gender === "Female"} onChange={handleChange} /><label htmlFor='Female'>Female</label>
                                    <input type='radio' id='Other' name='Gender' value='Other' checked={formData.Gender === "Other"} onChange={handleChange} /> <label htmlFor='Other'>No Preferences</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'A-Requirements'>Additional Requirements / Notes : <label className='star'> * </label> </label>
                                <textarea id = 'Address' name = 'additionalRequirement' placeholder='If yes, Describe the Disabilities or medical conditions' value= {formData.additionalRequirement} onChange={handleChange} onBlur={handleBlur} className ={touched.Address && errors.Address ? 'input-error':""}></textarea>
                            </div>


                            <button className = 'finishes' onClick={handleNext} > Submit Request </button>
                            <button className = 'previous' onClick={()=> navigate("/familyservicerequest")}> Previous </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FamilyServiceRequest2;