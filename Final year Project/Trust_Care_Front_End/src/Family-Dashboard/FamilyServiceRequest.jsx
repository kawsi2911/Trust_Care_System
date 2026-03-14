import { useState } from "react";
import Header from "../Header/Header";
import "./FamilyServiceRequest.css";
import {useNavigate} from "react-router-dom";

function FamilyServiceRequest(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            Page:"",
            PName:"",
            relationship:"",
            Gender:"",
            Service:"",
            PatientType:""
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

        if(!formData.Page.trim()){
            newErrors.Page = "Age is Required";
        }

        if(!formData.PName.trim()){
            newErrors.PName = "Patient Name is Required";
        }

        if(!formData.relationship.trim()){
            newErrors.relationship = "Relationship is Required";
        }
        
        if(!formData.Gender){
            newErrors.Gender = "Gender is Required";
        }

        if(!formData.Service){
            newErrors.Service = "Service is Required";
        }

        if(!formData.PatientType){
            newErrors.PatientType = "Select the Type";
        }

        setErrors(newErrors);
        return newErrors;
    };

    // FamilyServiceRequest.jsx (form1)
const handleNext = () => {
    const validationErrors = validate();
    setTouched({Page:true, PName:true, relationship:true, Gender:true, Service:true, PatientType:true});

    if(Object.keys(validationErrors).length === 0){
        // Save form1 data to localStorage
        localStorage.setItem("form1Data", JSON.stringify(formData));
        navigate("/familyservicerequest2");
    }
};

    return(
        <>
            <Header />

            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Request Form (1/2)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className='row'>
                                <label htmlFor='PatientType'>Patient Type : <span className='star'>*</span></label> 
                                <select id='PatientType' name='PatientType' value={formData.PatientType} onChange={handleChange} className={`service-dropdown ${touched.PatientType && errors.PatientType ? "input-error" : ""}`}>
                                    <option value="">--Select the Patient Type--</option>
                                    <option value="eldercare">Elder Care</option>
                                    <option value="childcare">Child Care/ Babysitter</option>
                                    <option value="hospitalcare">Hospital Patient Care</option>
                                    <option value="homecare">Home Patient Care</option>
                                </select>
                                    {touched.PatientType && errors.PatientType && (
                                        <p className='error-text'>{errors.PatientType}</p>
                                    )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'P-Name'>Patient Name : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'P-Name' name = 'PName' placeholder = 'Enter the Patient Name' value={formData.PName} onChange={handleChange} onBlur={handleBlur} className = {touched.PName && errors.PName?'input-error':''} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'relationship'>Relationship with Patient : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'relationship' name = 'relationship' placeholder = 'eg. Father/mother/grandparent' value = {formData.relationship} onChange = {handleChange} onBlur = {handleBlur} className = {touched.relationship && errors.relationship? 'input-error':''}/>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Page'>Patient Age : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Page' name = 'Page' placeholder = 'age in years' value = {formData.Page} onChange = {handleChange} onBlur = {handleBlur} className = {touched.Page && errors.Page? 'input-error':''} />
                            </div>

                            <div className='row'>
                                <label>Gender : <span className='star'>*</span></label>
                                <div className={`gender-options ${touched.Gender && errors.Gender ? "input-error" : ""}`}>
                                    <input type='radio'  id='Male' name='Gender' value='Male' checked={formData.Gender === "Male"} onChange={handleChange} /> <label htmlFor='Male'>Male</label>
                                    <input type='radio' id='Female' name='Gender' value='Female' checked={formData.Gender === "Female"} onChange={handleChange} /> <label htmlFor='Female'>Female</label>
                                    <input type='radio' id='Other' name='Gender' value='Other' checked={formData.Gender === "Other"} onChange={handleChange} /> <label htmlFor='Other'>Other</label>
                                </div>
                                {touched.Gender && errors.Gender && (
                                    <p className="error-text">{errors.Gender}</p>
                                )}
                            </div>

                            <div className='row'>
                                <label> Duration Service Wanted : <label className='star'> * </label> </label>
                                <div className={`Service-options ${touched.Service && errors.Service ? 'input-error' : ''}`}>
                                    <input type='radio' id='Hourly' name='Service' value='Hourly' checked={formData.Service === 'Hourly'} onChange={handleChange} /> <label htmlFor='Hourly'>Hourly</label>
                                    <input type='radio' id='Day' name='Service' value='Day' checked={formData.Service === 'Day'} onChange={handleChange} /> <label htmlFor='Day'>Day</label>
                                    <input  type='radio' id='Weekly' name='Service' value='Weekly' checked={formData.Service === 'Weekly'} onChange={handleChange} /> <label htmlFor='Weekly'>Weekly</label>
                                    <input type='radio' id='Monthly' name='Service' value='Monthly' checked={formData.Service === 'Monthly'} onChange={handleChange} /> <label htmlFor='Monthly'>Monthly</label>
                                </div>
                                {touched.Service && errors.Service && (
                                    <span className='error-text'>{errors.Service}</span>
                                )}
                            </div>


                            <button className = 'next' onClick={handleNext} > Next Step </button>
                            <p className = 'step'>Step 1 of 2</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FamilyServiceRequest;