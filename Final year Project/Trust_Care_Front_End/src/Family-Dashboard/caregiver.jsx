import React from "react";
import Header from "../Header/Header"; 
import {useNavigate} from "react-router-dom";
import profile from "../assets/profile.png";
import "./caregiver.css";

function caregiver(){

    const navigate = useNavigate();

    return(
        <>
            <Header />

            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Caregiver Profile</p>

                    

                    <div className = "containers-profile">

                        <div className = "container-profile">
                            
                            <img src = {profile} alt = 'profile' className = 'profilesimage' />
                            
                            <div className="profile-body">
                                <p className = "profile-name"><strong>Zain Fernando</strong></p>
                                <p className = "profile-star"><strong>⭐⭐⭐⭐⭐ 4.8/5</strong></p>
                                <p className = "profile-review">145 Review | Verified ✔️ </p>
                            </div>
                                
                        </div>
                    
                    </div>

                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title"> 🗒️Personal Information</p>
                            <p><strong>Age:</strong> 35</p>
                            <p><strong>Gender:</strong> Female</p>
                            <p><strong>Experience:</strong> 5years</p>
                            <p><strong>Location:</strong> Galle</p>
                            <p><strong>Distance:</strong> 2.5 Km from you</p>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                            <p className="service-title"> 💼 Service Provided</p>

                            <div className = "containers01">
                                <p className = "contain-text">Elder Care</p>
                                <p className = "contain-text">Hospital Patient Care</p>
                            </div>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                            <p className="service-title"> 🎓 Qualification</p>
                            <ul>
                                <li>Certified Professional Caregiver</li>
                                <li>First Aid & CPR Certified</li>
                                <li>5 years hands-on experience</li>
                                <li>Specialized in elderly care</li>
                            </ul>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                            <p className="service-title"> 💰Payment Details</p>
                            <p><strong>Hourly Rate :</strong> Rs. 500</p>
                            <p><strong>Daily Rate :</strong> Rs. 2500</p>
                            <p><strong>Monthly Rate :</strong> Rs. 4000</p>
                            
                            <div className = "containers01">
                                <p className = "contain-texts">💡Monthly Rates offer best value</p>
                            </div>

                        </div>

                       

                    </div>

                    <div className = "container">

                        <div className = "containers">
                            <p className = "service-title"> ⭐ Recent Reviews</p>

                            <div className ="ratings-viwers">
                                <p className = "rating-name"><strong>⭐⭐⭐⭐⭐Sarath</strong>2 week ago</p>
                                <p>"Excellent Services! Very Professional, caring and punctual. Highly recommended1</p>
                            </div>

                            <div className ="ratings-viwers">
                                <p className = "rating-name"><strong>⭐⭐⭐⭐⭐Sarath</strong>2 week ago</p>
                                <p>"Excellent Services! Very Professional, caring and punctual. Highly recommended1</p>
                            </div>
                            
                           
                        </div>
                    </div>

                    <button className = 'finishes' onClick={() => navigate("/booking")} > Select This Provider  </button>
                    <button className = 'previous' onClick={()=> navigate("/availableprovider")}> Back to the List </button>
                
                </div>

            </div>
        </>
    )

}

export default caregiver;