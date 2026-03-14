import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";

function Booking() {

    const navigate = useNavigate();
    const location = useLocation();

    const provider = location.state || {};

    return (
        <>
            <Header />

            <div className='ServiceSection'>
                <div className='Service_container'>

                    <p className='para'>Confirm for your Booking</p>

                    {/* Selected caregiver */}
                    <div className="container-image">

                        <p className="selected">Selected Caregiver</p>

                        <div className="containers0012">

                            <img
                                src={provider.uploadprofile || profile}
                                alt="profile"
                                className="profiles-image"
                            />

                            <div className="Text-image">

                                <p className="provider-name">
                                    <strong>{provider.FullName}</strong>
                                </p>

                                <p>⭐⭐⭐⭐⭐</p>

                                <p>
                                    Experience : {provider.year} years
                                </p>

                                <p>
                                    Location : {provider.location}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Service summary */}
                    <div className="booking-container">

                        <p className="provider-name">
                            <strong>Service Summary</strong>
                        </p>

                        <div className="summary">

                            <p>
                                <strong>Service Type : </strong>
                                {provider.serviceType?.join(", ")}
                            </p>

                            <p>
                                <strong>Location : </strong>
                                {provider.location}
                            </p>

                        </div>

                        <div className="cost">

                            <span>Estimated Cost:</span>

                            <span className="price">
                                Rs. {provider.hourlyRate} / hour
                            </span>

                        </div>

                    </div>


                    {/* Next step */}
                    <div className="callprovider">

                        <p className="provider-name">
                            <strong>📞 Next Steps :</strong>
                        </p>

                        <div className="summary">

                            <p>
                                After confirmation, the caregiver will contact you
                                within 24 hours
                            </p>

                        </div>

                    </div>


                    <div className='row'>

                        <input type='checkbox' />

                        <p className="checked">
                            I agree to Terms & Conditions
                        </p>

                    </div>


                    <div className="QServices">

                        <button
                            className="confirm"
                            onClick={() => navigate("/bookingconfirm", { state: provider })}
                        >
                            ✔️ Confirm & Hire
                        </button>

                        <button
                            className="logout-btn"
                            onClick={() => navigate("/availableprovider")}
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Booking;