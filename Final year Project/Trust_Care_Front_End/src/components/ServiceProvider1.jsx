import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import './ServiceProvider1.css';

function ServiceProvider1(){

    const navigate = useNavigate();

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
                                <input type = 'text' id = 'FullName' name = 'FullName' placeholder = 'Enter your Full Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'NIC' name = 'NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Phone'>Phone Number : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Phone' name = 'Phone' placeholder = '+94 77 123 4567' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Email'>Email Address : <label className='star'> * </label> </label>
                                <input type = 'email' id = 'Email' name = 'Email' placeholder = 'example@gmail.com' />
                            </div>

                            <div className = 'row'>
                                <label> Gender : <label className='star'> * </label> </label>
                                <div className = 'gender-options'>
                                    <input type = 'radio' id = 'Male' name = 'Gender' /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'Gender' /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'Gender' /> <label htmlFor = 'Other'>Other</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'DOB'> Date of Birth : <label className='star'> * </label>  </label>
                                <input type = 'date' id = 'DOB' name = 'DOB' placeholder = 'mm/dd/yyyy' />
                            </div>

                            <button className = 'next' onClick={() => navigate("/serviceprovider2")} > Next Step </button>
                            <p className = 'step'>Step 1 of 3</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProvider1;