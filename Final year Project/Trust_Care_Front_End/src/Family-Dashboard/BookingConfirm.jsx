import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./BookingConfirm.css";

function BookingConfirm(){

    const navigate = useNavigate();

    return(
        <>
            <Header/>
             <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Booking Confirmed</p>

                    <div className = "First">
                        <p className = "Head"> Success!.</p>
                    </div>

                    <div className = "noborder">
                        <div className = "Emoji-image">✅</div>
                        <p className = "Hired">Caregiver Hired Successfully!!</p>
                        <p>Zain Fernanado has been notified and will contact you shortly</p>
                    </div>

                    <div className = "callprovider">
                            <p className = "provider-name"><strong> 🗒️ What Happens Next : </strong></p>

                            <div className="summary">
                                <ol>
                                    <li>The Caregiver will contact you within 24 hours</li>
                                    <li>Arrange meeeting time and discuss details</li>
                                    <li>Service will begin as scheduled</li>
                                    <li>You can track progress in Activity section</li>
                                </ol>
                            </div>
                    </div>

                    <div className = "booking-container">
                            
                            <p className = "provider-name"><strong>📞Caregiver Contact Information</strong></p>

                            <div className="summary">
                                <p><strong>Name : </strong>Zain Fernando</p>
                                <p><strong>Phone : </strong> +94 77 123 4567</p>
                                <p><strong>Email : </strong>Zainfer12@gmail.com </p>
                            </div>

                    </div>

                    <div className = "QServices">
                        <button className = "viewall" onClick = {()=>navigate("/familyhome")}> Go to Dashboard </button>
                        <button className = "confirm" onClick = {()=>navigate("/bookingconfirm")}> ☁️Chat with Provider</button>
                        <button className = "updates" onClick = {()=>navigate("/familynotification")}>View Booking Details Update Availability </button>
                    </div>


                </div>
            </div>
        </>
    )
}

export default BookingConfirm;