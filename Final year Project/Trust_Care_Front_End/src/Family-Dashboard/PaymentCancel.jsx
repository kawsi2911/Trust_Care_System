import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function PaymentCancel() {
    const navigate = useNavigate();

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
                <div style={{ fontSize: "5rem", marginBottom: "20px" }}>❌</div>
                <h1 style={{ color: "#ef5350", fontSize: "2rem", marginBottom: "10px" }}>
                    Payment Cancelled
                </h1>
                <p style={{ color: "#666", fontSize: "1rem", marginBottom: "30px" }}>
                    Your payment was cancelled. No charges were made.
                </p>
                <div style={{ display: "flex", gap: "16px" }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: "12px 30px",
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate("/familyhome")}
                        style={{
                            padding: "12px 30px",
                            background: "#9e9e9e",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}

export default PaymentCancel;