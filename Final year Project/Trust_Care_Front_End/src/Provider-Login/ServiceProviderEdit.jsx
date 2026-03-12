import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';

function ServiceProviderProfileEdit(){

    const navigate = useNavigate();

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
                                <input type = 'text' disabled id = 'FullName' name = 'FullName' placeholder = 'Enter your Full Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'NIC' name = 'NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)' />
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
                                    <input type = 'radio'  id = 'Male' name = 'Gender' /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'Gender' /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'Gender' /> <label htmlFor = 'Other'>Other</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'DOB'> Date of Birth : <label className='star'> * </label>  </label>
                                <input type = 'date' disabled id = 'DOB' name = 'DOB' placeholder = 'mm/dd/yyyy' />
                            </div>

                            <div className='row'>
                                <label htmlFor = 'FullAddress'>Full Address : <label className='star'> * </label>  </label>
                                <textarea id = 'Address' name = 'Address' placeholder='Enter your complete address with city and postal code'></textarea>
                            </div>

                            <div className='rows'>
                                <label htmlFor='selectType'>Service Type (Select all that apply) : <label className='star'> * </label> </label><br/><br/>
                                <div className = 'checkbox-options'>
                                    <label>
                                        <input type = 'checkbox' name = 'Services' value = 'ElderCare'/> Elder Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'Services' value = 'ChildCare'/> Child Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'Services' value = 'Hospital Patient Care'/> Hospital Patient Care
                                    </label>
                                    <label>
                                        <input type = 'checkbox' name = 'Services' value = 'Home Patient Care '/> Home Patient Care
                                    </label>
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor = 'no_experience'>Years of Experiences : <label className='star'> * </label>  </label>
                                <input type = 'number' id = 'no_experience' name = 'no_experience' placeholder = 'eg.5' />
                            </div>

                            <div className='row'>
                                <label htmlFor = 'Qualifications'> Qualifications / Certificates : <label className='star'> * </label>  </label>
                               <textarea id = 'Qualifications' name = 'Qualifications' placeholder = 'List your qualifications, certificates, training programs...' rows = '4'></textarea>
                            </div>

                             <div className = 'row'>
                                <label htmlFor = 'Profile'> Upload your Image : <label className='star'> * </label> </label>
                                <div className="upload-icon">📷<br/>
                                    <span>Click to upload photo</span>
                                    <small>JPG, PNG • max 5MB</small>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Location'> Location able to Work : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Location' name = 'Location' placeholder = 'You can add multiple locations separated by commas' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Phone'> Work Radius(Km) : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Phone' name = 'Phone' placeholder = 'How far are you willing to travel ? (e.g 10)' />
                            </div>

                            <div className = 'row'>
                                <label> Available Duration : <label className='star'> * </label> </label>
                                <div className='duration-options'>
                                    <input type = 'radio' id = 'Fulltime' name = 'duration' /> <label htmlFor = 'Fulltime'>Full Time</label>
                                    <input type = 'radio' id = 'Parttime' name = 'duration' /> <label htmlFor = 'Parttime'>Part Time</label>
                                    <input type = 'radio' id = 'Flexible' name = 'duration' /> <label htmlFor = 'Flexible'>Flexible</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'HoursRate'> Hourly Rate (Rs) : <label className='star'> * </label>  </label>
                                <input type = 'Number' id = 'HoursRate' name = 'HoursRate' placeholder = 'e.g 500' />
                            </div>

                            <button className = 'complete' onClick={()=>navigate("/ServiceProviderDashboard")}> Submit</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default ServiceProviderProfileEdit;