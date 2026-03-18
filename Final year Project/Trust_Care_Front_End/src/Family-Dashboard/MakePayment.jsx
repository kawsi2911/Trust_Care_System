import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./MakePayment.css";
import { useState, useEffect } from "react";
import axios from "axios";

function MakePayment() {

    const navigate  = useNavigate();
    const location  = useLocation();

    const booking  = location.state || {};
    const provider = booking.providerId || {};

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        cardNumber: "", expiryDate: "", cvv: "", cardHolder: ""
    });
    const [errors, setErrors] = useState({});

    // ── Get family info from localStorage ────────────────────────────────────
    const familyId   = localStorage.getItem("userId");
    const familyName = localStorage.getItem("familyFullName") || "Family User";

    const handleCardChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const validateCard = () => {
        const newErrors = {};
        if (paymentMethod === "card") {
            if (!cardData.cardNumber.trim() || cardData.cardNumber.replace(/\s/g, "").length < 16)
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

    // ── Handle Pay button ─────────────────────────────────────────────────────
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
            // ── Step 1: Initiate payment on backend ───────────────────────────
            const res = await axios.post("http://localhost:5000/api/payments/initiate", {
                serviceId:    booking._id,
                familyId:     familyId,
                providerId:   provider._id,
                familyName:   familyName,
                providerName: provider.FullName || "Provider",
                serviceType:  booking.serviceRequestId?.PatientType || booking.patientType || "Care Service",
                amount:       booking.rate || 0,
                paymentMethod: paymentMethod === "card" ? "Card"
                             : paymentMethod === "online" ? "Bank Transfer"
                             : "Cash",
                familyEmail:  localStorage.getItem("familyEmail") || "customer@trustcare.lk",
                familyPhone:  localStorage.getItem("familyPhone") || "0771234567",
            });

            const { payhereData, checkoutUrl } = res.data;

            // ✅ Save booking ID so PaymentSuccess can mark it as paid
            localStorage.setItem("lastBookingId", booking._id);

            if (paymentMethod === "cash") {
                // ── Cash payment — mark directly as paid ─────────────────────
                await axios.put(
                    `http://localhost:5000/api/service-request/mark-paid/${booking._id}`
                );
                alert("Cash payment recorded! ✅");
                navigate("/familyactivity");
                return;
            }

            if (paymentMethod === "online") {
                // ── Bank transfer — show details and mark pending ─────────────
                alert("Please transfer Rs. " + booking.rate + " to:\nBank: People's Bank\nAccount: 0012345678\nReference: TRUSTCARE-" + booking._id?.slice(-6)?.toUpperCase());
                navigate("/familyactivity");
                return;
            }

            // ── Step 2: Redirect to PayHere (card payment) ───────────────────
            // Create a hidden form and submit to PayHere
            const form = document.createElement("form");
            form.method = "POST";
            form.action = checkoutUrl;

            // Add all PayHere fields as hidden inputs
            Object.entries(payhereData).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type  = "hidden";
                input.name  = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (err) {
            console.error("Payment error:", err);
            alert(err.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Service Summary */}
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

                    {/* Payment Method Selector */}
                    <div className="options">
                        <p className="heading-options">Select Payment Method</p>
                        <div className="card-options">
                            <input type="radio" id="card"   name="payment" value="card"
                                checked={paymentMethod === "card"}   onChange={() => setPaymentMethod("card")} />
                            <label htmlFor="card">Credit / Debit Card</label>

                            <input type="radio" id="online" name="payment" value="online"
                                checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                            <label htmlFor="online">Bank Transfer</label>

                            <input type="radio" id="cash"   name="payment" value="cash"
                                checked={paymentMethod === "cash"}   onChange={() => setPaymentMethod("cash")} />
                            <label htmlFor="cash">Cash on Service</label>
                        </div>
                    </div>

                    {/* Card Fields */}
                    {paymentMethod === "card" && (
                        <div className="options">
                            <div className="form-group">
                                <p className="heading-options">Card Number</p>
                                <input type="text" name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    value={cardData.cardNumber}
                                    onChange={handleCardChange}
                                    className={errors.cardNumber ? "input-error" : ""} />
                                {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                            </div>

                            <div className="form-groups">
                                <div className="firstgroup">
                                    <p className="heading-options">Expiry Date</p>
                                    <input type="text" name="expiryDate"
                                        placeholder="MM/YY" maxLength="5"
                                        value={cardData.expiryDate}
                                        onChange={handleCardChange}
                                        className={errors.expiryDate ? "input-error" : ""} />
                                    {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
                                </div>
                                <div className="secondgroup">
                                    <p className="heading-options">CVV</p>
                                    <input type="text" name="cvv"
                                        placeholder="123" maxLength={3}
                                        value={cardData.cvv}
                                        onChange={handleCardChange}
                                        className={errors.cvv ? "input-error" : ""} />
                                    {errors.cvv && <p className="error-text">{errors.cvv}</p>}
                                </div>
                            </div>

                            <div className="form-group">
                                <p className="heading-options">Card Holder Name</p>
                                <input type="text" name="cardHolder"
                                    placeholder="Name on card"
                                    value={cardData.cardHolder}
                                    onChange={handleCardChange}
                                    className={errors.cardHolder ? "input-error" : ""} />
                                {errors.cardHolder && <p className="error-text">{errors.cardHolder}</p>}
                            </div>

                            {/* Sandbox test card hint */}
                            <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "8px", marginTop: "8px", fontSize: "0.82rem", color: "#2e7d32" }}>
                                🧪 <strong>Test Card:</strong> 4916217501611292 | Expiry: 12/25 | CVV: 100
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