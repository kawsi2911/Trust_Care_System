import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import "./MakePayment.css";
import { useState } from "react";
import axios from "axios";

function MakePayment() {

  const navigate = useNavigate();
  const location = useLocation();

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

    if (paymentMethod === "card") {
      const validationErrors = validateCard();
      if (Object.keys(validationErrors).length > 0) return;
    }

    if (!booking._id) {
      alert("Booking data missing");
      return;
    }

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/payments/initiate",
        {
          serviceId: booking._id,
          familyId: familyId,
          providerId: provider._id,
          familyName: familyName,
          providerName: provider.FullName || "Provider",
          serviceType: booking.serviceRequestId?.PatientType || "Care Service",
          amount: booking.rate || 0,
          paymentMethod:
            paymentMethod === "card"
              ? "Card"
              : paymentMethod === "online"
              ? "Bank Transfer"
              : "Cash",
          familyEmail: localStorage.getItem("familyEmail") || "customer@trustcare.lk",
          familyPhone: localStorage.getItem("familyPhone") || "0771234567"
        }
      );

      const { payhereData, checkoutUrl } = res.data;

      if (paymentMethod === "cash") {

        await axios.put(
          `http://localhost:5000/api/service-request/mark-paid/${booking._id}`
        );

        alert("Cash payment recorded ✅");
        navigate("/familyactivity");
        return;
      }

      if (paymentMethod === "online") {

        alert(
          "Transfer Rs." +
            booking.rate +
            "\nBank: People's Bank\nAccount: 0012345678\nReference: TRUSTCARE-" +
            booking._id.slice(-6).toUpperCase()
        );

        navigate("/familyactivity");
        return;
      }

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
      alert("Payment failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="ServiceProviderSection">
        <div className="ServiceProviderSection2">

          <p className="Head">Make Payment</p>

          <div className="booking-container">

            <p className="provider-name"><strong>Service Summary</strong></p>

            <div className="summary">
              <p><strong>Service :</strong> Hospital Patient Care</p>
              <p><strong>Provider :</strong> {provider.FullName}</p>
              <p><strong>Rate :</strong> Rs. {booking.rate}</p>
            </div>

          </div>

          <div className="options">

            <p className="heading-options">Select Payment Method</p>

            <div className="card-options">

              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <label>Credit / Debit Card</label>

              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <label>Bank Transfer</label>

              <input
                type="radio"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <label>Cash on Service</label>

            </div>

          </div>

          {paymentMethod === "card" && (

            <div className="options">

              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardData.cardNumber}
                onChange={handleCardChange}
              />

              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={handleCardChange}
              />

              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={handleCardChange}
              />

              <input
                type="text"
                name="cardHolder"
                placeholder="Card Holder Name"
                value={cardData.cardHolder}
                onChange={handleCardChange}
              />

            </div>

          )}

          <div className="QServices">

            <button
              className="confirms"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "Processing..." : `💳 Pay Rs.${booking.rate || 0}`}
            </button>

          </div>

          <p className="paymenthead">
            🔒 Secure Payment Powered by PayHere
          </p>

        </div>
      </div>
    </>
  );
}

export default MakePayment;