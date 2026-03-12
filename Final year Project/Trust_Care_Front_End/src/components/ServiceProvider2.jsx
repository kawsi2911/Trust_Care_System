import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import './ServiceProvider2.css';

function ServiceProvider2(){

    const navigate = useNavigate();

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

                            <button className = 'next' onClick = {() => navigate ("/serviceprovider3")}> Next Step </button>
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