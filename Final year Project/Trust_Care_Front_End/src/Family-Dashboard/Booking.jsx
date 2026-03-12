import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking(){

    const navigate = useNavigate();

    return(
        <>
            <Header/>
              <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Confirm for your Booking</p>

                    <div className = "container-image">

                        <p className = "selected">Selected Caregiver</p>
                        
                        <div className = "containers0012">   
                    
                            <img src = {profile} alt = 'profile' className = 'profiles-image' />
                    
                            <div className = "Text-image">
                                <p className = "provider-name"><strong>Zain Fernando</strong></p>
                                <p><strong>⭐⭐⭐⭐⭐</strong></p>
                                <p>Experience : 5 years </p>
                                <p>Location : 2.5 km away </p>
                            </div>

                        </div>

                    </div>

                    <div className = "booking-container">
                            
                            <p className = "provider-name"><strong>Service Summary</strong></p>

                            <div className="summary">
                                <p><strong>Service Type : </strong>Elder Care</p>
                                <p><strong>Patient : </strong>Mother (75 years) </p>
                                <p><strong>Duration : </strong>Monthly </p>
                                <p><strong>Location : </strong>Galle</p>
                            </div>

                            <div className="cost">
                                <span>Estimated Cost:</span>
                                <span className="price">Rs. 75,000 / month</span>
                            </div>
                           
                    </div>

                    <div className = "callprovider">
                            <p className = "provider-name"><strong> 📞 Next Steps :</strong></p>

                            <div className="summary">
                                <p> After confirmation, the caregiver will contact you within 24 hours to arrange meeting time and discuss final details</p>
                            </div>
                    </div>


                    <div className = 'row'>
                        <input type = 'checkbox' id = 'check' name = 'check'/> <p className="checked">I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a></p>
                    </div>

                    <div className = "QServices">
                        <button className = "confirm" onClick={()=>navigate("/bookingconfirm")}> ✔️ Confirm & Hire </button>
                        <button className = "logout-btn" onClick = {()=>navigate("/availableprovider")}> Cancel</button>
                    </div>

                </div>
            </div>
        </>

    )

}

export default Booking;