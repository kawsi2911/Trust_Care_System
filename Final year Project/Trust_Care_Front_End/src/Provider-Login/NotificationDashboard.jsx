import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import "./NotificationDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function NotificationDashboard() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null); // track which card is loading

    // ✅ FIXED: fetch real pending requests near this provider's location
    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/serviceproviderloginpage");

        axios.get(`http://localhost:5000/api/service-request/provider-notifications/${userId}`)
            .then(res => setRequests(res.data))
            .catch(err => console.error("Notifications fetch error:", err))
            .finally(() => setLoading(false));

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("FullName");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("FullName");
        navigate("/serviceproviderloginpage");
    };

    // ✅ FIXED: "I Can Do" calls backend and updates UI
    const handleAccept = async (requestId) => {
        const providerId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        setActionLoadingId(requestId);
        try {
            await axios.post(`http://localhost:5000/api/service-request/accept/${requestId}`, {
                providerId
            });
            // Mark as accepted in UI
            setRequests(prev =>
                prev.map(r => r._id === requestId ? { ...r, providerStatus: "accepted" } : r)
            );
        } catch (err) {
            alert(err.response?.data?.error || "Failed to accept request");
        } finally {
            setActionLoadingId(null);
        }
    };

    // ✅ FIXED: "Decline" calls backend
    const handleDecline = async (requestId) => {
        const providerId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        setActionLoadingId(requestId);
        try {
            await axios.post(`http://localhost:5000/api/service-request/decline/${requestId}`, {
                providerId
            });
            // Remove from list
            setRequests(prev => prev.filter(r => r._id !== requestId));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to decline request");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Time ago helper
    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
        if (diff < 1)  return "Just now";
        if (diff < 60) return `${diff} minute${diff > 1 ? "s" : ""} ago`;
        const hrs = Math.floor(diff / 60);
        if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
        const days = Math.floor(hrs / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    return (
        <>
            <Header />
            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Provider Dashboard</p>
                        </div>
                        <div className="Logout">
                            {/* ✅ FIXED: was navigate("/") */}
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/serviceproviderdashboard")}>Home</button>
                        <button onClick={() => navigate("/servicesdashboard")}>Service</button>
                        <button onClick={() => navigate("/notificationdashboard")}>Notifications</button>
                        <button onClick={() => navigate("/activitydashboard")}>Activity</button>
                        <button onClick={() => navigate("/profiledashboard")}>Profile</button>
                    </div>

                    {/* Loading state */}
                    {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading notifications...</p>}

                    {/* No requests */}
                    {!loading && requests.length === 0 && (
                        <div className="container">
                            <div className="containers">
                                <p className="service-title">No new requests near your area.</p>
                                <p>Check back later or update your location in your profile.</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ FIXED: real request cards from backend */}
                    {requests.map(request => (
                        <div className="container" key={request._id}>
                            <div className="containers">
                                <p className="service-title">
                                    {request.providerStatus === "accepted"
                                        ? "⌛ Waiting – " + request.PatientType
                                        : "🔔 New Request – " + request.PatientType}
                                </p>

                                {request.providerStatus === "accepted" ? (
                                    <>
                                        <p><strong>Status:</strong> You clicked "I Can Do"</p>
                                        <p><strong>Location:</strong> {request.SLocation}</p>
                                        <p><strong>Waiting:</strong> Family is reviewing providers</p>
                                        <button className="pending">Pending Selection</button>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Location:</strong> {request.SLocation}</p>
                                        <p><strong>Patient Age:</strong> {request.Page} years old</p>
                                        <p><strong>Patient Gender:</strong> {request.Gender}</p>
                                        <p><strong>Duration:</strong> {request.Service}</p>
                                        <p><strong>Disability:</strong> {request.serviceOptions === "Yes" ? request.disabilityDetails || "Yes" : "None"}</p>
                                        <p><strong>Posted:</strong> {timeAgo(request.createdAt)}</p>
                                    </>
                                )}
                            </div>

                            {/* Only show buttons if not yet accepted */}
                            {request.providerStatus !== "accepted" && (
                                <div className="button-row">
                                    <button
                                        className="cando"
                                        disabled={actionLoadingId === request._id}
                                        onClick={() => handleAccept(request._id)}
                                    >
                                        {actionLoadingId === request._id ? "..." : "✔️  I Can Do"}
                                    </button>
                                    <button
                                        className="decline"
                                        disabled={actionLoadingId === request._id}
                                        onClick={() => handleDecline(request._id)}
                                    >
                                        ❌  Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}

export default NotificationDashboard;