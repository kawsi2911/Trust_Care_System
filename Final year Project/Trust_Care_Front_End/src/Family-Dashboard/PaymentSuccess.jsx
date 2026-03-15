import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Header/Header";
import axios from "axios";

function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const markPaid = async () => {
            try {
                // Get order_id from PayHere redirect params
                const orderId = searchParams.get("order_id");

                if (orderId) {
                    // Verify and update payment status
                    await axios.get(
                        `http://localhost:5000/api/payments/verify/${orderId}`
                    );
                }

                // Also mark the booking as paid using last booking ID
                const lastBookingId = localStorage.getItem("lastBookingId");
                if (lastBookingId) {
                    await axios.put(
                        `http://localhost:5000/api/service-request/mark-paid/${lastBookingId}`
                    );
                    localStorage.removeItem("lastBookingId");
                }
            } catch (err) {
                console.error("Error marking payment:", err);
            }
        };

        markPaid();

        // Auto redirect to family home after 3 seconds
        const timer = setTimeout(() => {
            navigate("/familyactivity");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <Header />
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                padding: "40px"
            }}>
                <div style={{ fontSize: "5rem", marginBottom: "20px" }}>✅</div>
                <h1 style={{ color: "#4caf50", fontSize: "2rem", marginBottom: "10px" }}>
                    Payment Successful!
                </h1>
                <p style={{ color: "#666", fontSize: "1rem", marginBottom: "20px" }}>
                    Your payment has been processed successfully.
                </p>
                <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "30px" }}>
                    Redirecting to activity page in 3 seconds...
                </p>
                <button
                    onClick={() => navigate("/familyactivity")}
                    style={{
                        padding: "12px 30px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "700",
                        cursor: "pointer"
                    }}
                >
                    Go to Activity
                </button>
            </div>
        </>
    );
}

export default PaymentSuccess;