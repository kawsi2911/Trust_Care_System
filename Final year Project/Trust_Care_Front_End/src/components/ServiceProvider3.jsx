import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import './ServiceProvider3.css';

function ServiceProvider3(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Provider Registration (3/3)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

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

                            <button className = 'complete' onClick={()=>navigate("/serviceproviderlogin")}> Compelete Registration </button>
                            <button className = 'previous' onClick={()=> navigate("/serviceprovider2")}> Previous </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProvider3;