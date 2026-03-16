import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./MakePayment.css";
import { useState } from "react";
import axios from "axios";

function MakePayment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Booking & provider from navigation state
  const booking = location.state || {};
  const provider = booking.providerId || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });

  const [errors, setErrors] = useState({});

  const familyId = localStorage.getItem("userId");
  const familyName = localStorage.getItem("familyFullName") || "Family User";

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const validateCard = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      if (!cardData.cardNumber.trim() || cardData.cardNumber.replace(/\s/g, "").length < 16)
        newErrors.cardNumber = "Enter valid 16 digit card number";

      if (!cardData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate))
        newErrors.expiryDate = "Enter expiry as MM/YY";

      if (!cardData.cvv.trim() || cardData.cvv.length < 3)
        newErrors.cvv = "Enter valid CVV";

      if (!cardData.cardHolder.trim())
        newErrors.cardHolder = "Enter card holder name";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handlePay = async () => {
    if (!booking._id) {
      alert("Booking data missing");
      return;
    }

    if (paymentMethod === "card") {
      const validationErrors = validateCard();
      if (Object.keys(validationErrors).length > 0) return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "cash") {
        await axios.put(`http://localhost:5000/api/service-request/mark-paid/${booking._id}`);
        alert("Cash payment recorded ✅");
        navigate("/familyactivity");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/payments/initiate", {
        serviceId: booking._id,
        familyId,
        providerId: provider._id,
        familyName,
        providerName: provider.FullName || "Provider",
        serviceType: booking.serviceRequestId?.PatientType || booking.patientType || "Care Service",
        amount: booking.rate || 0,
        paymentMethod: paymentMethod === "card" ? "Card" : "Bank Transfer",
        familyEmail: localStorage.getItem("familyEmail") || "customer@trustcare.lk",
        familyPhone: localStorage.getItem("familyPhone") || "0771234567"
      });

      if (paymentMethod === "online") {
        localStorage.setItem("lastBookingId", booking._id);
        alert("Bank transfer initiated. Complete payment using the provided details.");
        navigate("/familyactivity");
        return;
      }

      // Card payment → redirect to PayHere
      const { payhereData, checkoutUrl } = res.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = checkoutUrl;

      Object.entries(payhereData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="ServiceProviderSection">
        <div className="ServiceProviderSection2">
          <div className="name">
            <div className="heading-head"><p className="Head">Make the Payment</p></div>
            <div className="Logout"><button onClick={handleLogout}>➜ Logout</button></div>
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

          {/* Payment Methods */}
          <div className="options">
            <p className="heading-options">Select Payment Method</p>
            <div className="card-options">
              <input type="radio" id="card" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <label htmlFor="card">Credit / Debit Card</label>

              <input type="radio" id="online" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
              <label htmlFor="online">Bank Transfer</label>

              <input type="radio" id="cash" name="payment" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
              <label htmlFor="cash">Cash on Service</label>
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === "card" && (
            <div className="options">
              <div className="form-group">
                <p className="heading-options">Card Number</p>
                <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" maxLength="19" value={cardData.cardNumber} onChange={handleCardChange} className={errors.cardNumber ? "input-error" : ""} />
                {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
              </div>
              <div className="form-groups">
                <div className="firstgroup">
                  <p className="heading-options">Expiry Date</p>
                  <input type="text" name="expiryDate" placeholder="MM/YY" maxLength="5" value={cardData.expiryDate} onChange={handleCardChange} className={errors.expiryDate ? "input-error" : ""} />
                  {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
                </div>
                <div className="secondgroup">
                  <p className="heading-options">CVV</p>
                  <input type="text" name="cvv" placeholder="123" maxLength={3} value={cardData.cvv} onChange={handleCardChange} className={errors.cvv ? "input-error" : ""} />
                  {errors.cvv && <p className="error-text">{errors.cvv}</p>}
                </div>
              </div>
              <div className="form-group">
                <p className="heading-options">Card Holder Name</p>
                <input type="text" name="cardHolder" placeholder="Name on card" value={cardData.cardHolder} onChange={handleCardChange} className={errors.cardHolder ? "input-error" : ""} />
                {errors.cardHolder && <p className="error-text">{errors.cardHolder}</p>}
              </div>
            </div>
          )}

          {/* Online */}
          {paymentMethod === "online" && (
            <div className="options">
              <p className="heading-options">Bank Transfer Details</p>
              <p>Bank: People's Bank</p>
              <p>Account: 0012345678</p>
              <p>Reference: TRUSTCARE-{booking._id?.slice(-6)?.toUpperCase()}</p>
            </div>
          )}

          {/* Cash */}
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