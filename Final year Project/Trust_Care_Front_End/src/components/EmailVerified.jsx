import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function EmailVerified() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role");

    useEffect(() => {
        // Auto redirect after 4 seconds
        const timer = setTimeout(() => {
            if (role === "provider") {
                navigate("/serviceproviderloginpage");
            } else {
                navigate("/familylogin");
            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [navigate, role]);

    return (
        <div style={{
            minHeight: "100vh", background: "#f0f4f8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Segoe UI, sans-serif"
        }}>
            <div style={{
                background: "white", borderRadius: "12px", padding: "48px",
                textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                maxWidth: "440px", width: "90%"
            }}>
                <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
                <h2 style={{ color: "#1a237e", marginBottom: "12px" }}>Email Verified!</h2>
                <p style={{ color: "#555", marginBottom: "8px", fontSize: "1rem" }}>
                    Your account has been successfully verified.
                </p>
                <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "28px" }}>
                    {role === "provider"
                        ? "Your account is pending admin approval. You'll be notified once approved."
                        : "You can now login to your account."}
                </p>
                <button
                    onClick={() => navigate(role === "provider" ? "/serviceproviderloginpage" : "/familylogin")}
                    style={{
                        background: "#2196f3", color: "white", border: "none",
                        borderRadius: "8px", padding: "12px 32px",
                        fontSize: "1rem", fontWeight: "600", cursor: "pointer"
                    }}
                >
                    Go to Login
                </button>
                <p style={{ color: "#999", fontSize: "0.8rem", marginTop: "16px" }}>
                    Redirecting automatically in 4 seconds...
                </p>
            </div>
        </div>
    );
}

export default EmailVerified;