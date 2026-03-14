import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";
import { useState } from "react";
import axios from "axios";

function Booking() {
    const navigate = useNavigate();
    const location = useLocation();
    const provider = location.state || {};

    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ FIXED: was just navigating — now actually saves booking to database
    const handleConfirm = async () => {
        if (!agreed) {
            alert("Please agree to Terms & Conditions before confirming.");
            return;
        }

        setLoading(true);

        try {
            const familyId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
            const requestId = localStorage.getItem("serviceRequestId");

            if (!familyId) {
                alert("Session expired. Please login again.");
                setLoading(false);
                return;
            }

            if (!requestId) {
                alert("Service request not found. Please submit a new request.");
                setLoading(false);
                return;
            }

            await axios.post(
                `http://localhost:5000/api/service-request/accept/${requestId}`,
                {
                    providerId: provider._id,
                    familyId
                }
            );

            // Clear requestId after successful booking
            localStorage.removeItem("serviceRequestId");

            navigate("/bookingconfirm", { state: provider });

        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.error || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="ServiceSection">
                <div className="Service_container">

                    <p className="para">Confirm your Booking</p>

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
                                <p>Experience: {provider.year} years</p>
                                <p>Location: {provider.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Service summary */}
                    <div className="booking-container">
                        <p className="provider-name"><strong>Service Summary</strong></p>
                        <div className="summary">
                            <p><strong>Service Type: </strong>{provider.serviceType?.join(", ")}</p>
                            <p><strong>Location: </strong>{provider.location}</p>
                        </div>
                        <div className="cost">
                            <span>Estimated Cost:</span>
                            <span className="price">Rs. {provider.hourlyRate} / hour</span>
                        </div>
                    </div>

                    {/* Next steps */}
                    <div className="callprovider">
                        <p className="provider-name"><strong>📞 Next Steps:</strong></p>
                        <div className="summary">
                            <p>After confirmation, the caregiver will contact you within 24 hours</p>
                        </div>
                    </div>

                    {/* ✅ FIXED: checkbox now controls agreed state */}
                    <div className="row">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms" className="checked">
                            I agree to Terms & Conditions
                        </label>
                    </div>

                    <div className="QServices">
                        <button
                            className="confirm"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? "Confirming..." : "✔️ Confirm & Hire"}
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