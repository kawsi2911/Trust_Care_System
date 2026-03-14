import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingConfirm.css";

function BookingConfirm() {

    const navigate = useNavigate();
    const location = useLocation();

    const provider = location.state || {};

    return (
        <>
            <Header />

            <div className='ServiceSection'>
                <div className='Service_container'>

                    <p className='para'>Booking Confirmed</p>

                    <div className="First">
                        <p className="Head">Success!</p>
                    </div>


                    <div className="noborder">

                        <div className="Emoji-image">✅</div>

                        <p className="Hired">
                            Caregiver Hired Successfully !!
                        </p>

                        <p>
                            {provider.FullName} has been notified and will contact you shortly
                        </p>

                    </div>



                    {/* Next step */}
                    <div className="callprovider">

                        <p className="provider-name">
                            <strong>🗒️ What Happens Next :</strong>
                        </p>

                        <div className="summary">

                            <ol>
                                <li>The Caregiver will contact you within 24 hours</li>
                                <li>Arrange meeting time</li>
                                <li>Service will begin as scheduled</li>
                                <li>You can track progress in Activity</li>
                            </ol>

                        </div>

                    </div>



                    {/* Contact info */}
                    <div className="booking-container">

                        <p className="provider-name">
                            <strong>📞 Caregiver Contact Information</strong>
                        </p>

                        <div className="summary">

                            <p>
                                <strong>Name :</strong> {provider.FullName}
                            </p>

                            <p>
                                <strong>Phone :</strong> {provider.phone}
                            </p>

                            <p>
                                <strong>Email :</strong> {provider.email}
                            </p>

                        </div>

                    </div>



                    <div className="QServices">

                        <button
                            className="viewall"
                            onClick={() => navigate("/familyhome")}
                        >
                            Go to Dashboard
                        </button>

                        <button
                            className="confirm"
                            onClick={() => navigate("/chat", { state: provider })}
                        >
                            ☁️ Chat with Provider
                        </button>

                        <button
                            className="updates"
                            onClick={() => navigate("/familynotification")}
                        >
                            View Booking Details
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}

export default BookingConfirm;