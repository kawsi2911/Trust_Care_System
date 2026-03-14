import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./MakePayment.css";
import { useState } from "react";
import axios from "axios";

function MakePayment() {

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ FIXED: receives real booking data passed from FamilyActivity
    const booking = location.state || {};
    const provider = booking.providerId || {};

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardData, setCardData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: ""
    });
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    // ✅ FIXED: validate card fields before submitting
    const validateCard = () => {
        const newErrors = {};
        if (paymentMethod === "card") {
            if (!cardData.cardNumber.trim() || cardData.cardNumber.replace(/\s/g,"").length < 16)
                newErrors.cardNumber = "Enter a valid 16-digit card number";
            if (!cardData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate))
                newErrors.expiryDate = "Enter valid expiry (MM/YY)";
            if (!cardData.cvv.trim() || cardData.cvv.length < 3)
                newErrors.cvv = "Enter valid CVV";
            if (!cardData.cardHolder.trim())
                newErrors.cardHolder = "Enter cardholder name";
        }
        setErrors(newErrors);
        return newErrors;
    };

    // ✅ FIXED: calls backend to mark booking as paid, then navigates
    const handlePay = async () => {
        if (paymentMethod === "card") {
            const validationErrors = validateCard();
            if (Object.keys(validationErrors).length > 0) return;
        }

        if (!booking._id) {
            alert("Booking data missing. Please go back and try again.");
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `http://localhost:5000/api/service-request/mark-paid/${booking._id}`
            );

            navigate("/familyactivity");
            alert("Payment successful! ✅");

        } catch (err) {
            alert(err.response?.data?.error || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED: logout proper
    const handleLogout = () => {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        navigate("/familylogin");
    };

    return (
        <>
            <Header />

            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Make the Payment</p>
                        </div>
                        <div className="Logout">
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    {/* ✅ FIXED: shows real booking data */}
                    <div className="booking-container">
                        <p className="provider-name"><strong>Service Summary</strong></p>
                        <div className="summary">
                            <p><strong>Service Type: </strong>{booking.serviceRequestId?.PatientType || booking.patientType || "N/A"}</p>
                            <p><strong>Provider: </strong>{provider.FullName || "N/A"}</p>
                            <p><strong>Duration: </strong>{booking.duration || "N/A"}</p>
                            <p><strong>Rate: </strong>Rs. {booking.rate || "N/A"}</p>
                        </div>
                        <div className="cost">
                            <span>Total Amount:</span>
                            <span className="price">Rs. {booking.rate || "0"}</span>
                        </div>
                    </div>

                    {/* Payment method selector */}
                    <div className="options">
                        <p className="heading-options">Select Payment Method</p>
                        <div className="card-options">
                            <input type='radio' id='card'   name='payment' value='card'
                                checked={paymentMethod === "card"}   onChange={() => setPaymentMethod("card")} />
                            <label htmlFor='card'>Credit / Debit Card</label>

                            <input type='radio' id='online' name='payment' value='online'
                                checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                            <label htmlFor='online'>Bank Transfer</label>

                            <input type='radio' id='cash'   name='payment' value='cash'
                                checked={paymentMethod === "cash"}   onChange={() => setPaymentMethod("cash")} />
                            <label htmlFor='cash'>Cash on Service</label>
                        </div>
                    </div>

                    {/* Card fields — only shown when card method selected */}
                    {paymentMethod === "card" && (
                        <div className="options">

                            <div className="form-group">
                                <p className="heading-options">Card Number</p>
                                <input type='text' name='cardNumber'
                                    placeholder='1234 5678 9012 3456'
                                    maxLength="19"
                                    value={cardData.cardNumber}
                                    onChange={handleCardChange}
                                    className={errors.cardNumber ? "input-error" : ""}/>
                                {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                            </div>

                            <div className="form-groups">
                                <div className="firstgroup">
                                    <p className="heading-options">Expiry Date</p>
                                    <input type="text" name="expiryDate"
                                        placeholder="MM/YY" maxLength="5"
                                        value={cardData.expiryDate}
                                        onChange={handleCardChange}
                                        className={errors.expiryDate ? "input-error" : ""}/>
                                    {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
                                </div>
                                <div className="secondgroup">
                                    <p className="heading-options">CVV</p>
                                    <input type="text" name="cvv"
                                        placeholder="123" maxLength={3}
                                        value={cardData.cvv}
                                        onChange={handleCardChange}
                                        className={errors.cvv ? "input-error" : ""}/>
                                    {errors.cvv && <p className="error-text">{errors.cvv}</p>}
                                </div>
                            </div>

                            <div className="form-group">
                                <p className="heading-options">Card Holder Name</p>
                                <input type='text' name='cardHolder'
                                    placeholder='Name on card'
                                    value={cardData.cardHolder}
                                    onChange={handleCardChange}
                                    className={errors.cardHolder ? "input-error" : ""}/>
                                {errors.cardHolder && <p className="error-text">{errors.cardHolder}</p>}
                            </div>

                        </div>
                    )}

                    {paymentMethod === "online" && (
                        <div className="options">
                            <p className="heading-options">Bank Transfer Details</p>
                            <p>Bank: People's Bank</p>
                            <p>Account: 0012345678</p>
                            <p>Reference: TRUSTCARE-{booking._id?.slice(-6)?.toUpperCase()}</p>
                        </div>
                    )}

                    {paymentMethod === "cash" && (
                        <div className="options">
                            <p className="heading-options">Cash on Service</p>
                            <p>Pay the caregiver directly at the time of service.</p>
                        </div>
                    )}

                    <div className="QServices">
                        <button className="confirms" onClick={handlePay} disabled={loading}>
                            {loading ? "Processing..." : `💳 Pay Rs. ${booking.rate || "0"}`}
                        </button>
                    </div>

                    <p className="paymenthead">🔒 Secure Payment Powered by PayHere</p>

                </div>
            </div>
        </>
    );
}

export default MakePayment;