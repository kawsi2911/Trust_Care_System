import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import "./ServicesDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ServicesDashboard() {

    const navigate  = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [actionId, setActionId] = useState(null);

    // ✅ FIXED: fetch real active bookings for this provider
    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/serviceproviderloginpage");

        axios.get(`http://localhost:5000/api/service-request/provider-services/${userId}`)
            .then(res => setBookings(res.data))
            .catch(err => console.error("Services fetch error:", err))
            .finally(() => setLoading(false));

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("FullName");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("FullName");
        navigate("/serviceproviderloginpage");
    };

    // ✅ FIXED: "Mark Complete" calls backend to update booking status
    const handleMarkComplete = async (bookingId) => {
        setActionId(bookingId);
        try {
            await axios.put(
                `http://localhost:5000/api/service-request/complete/${bookingId}`
            );
            // Remove from active list after marking complete
            setBookings(prev => prev.filter(b => b._id !== bookingId));
            alert("Service marked as completed! ✅");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to mark complete");
        } finally {
            setActionId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric"
        });
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

                    {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading services...</p>}

                    {!loading && bookings.length === 0 && (
                        <div className="container">
                            <div className="containers">
                                <p className="service-title">No active services right now.</p>
                                <p>Accept a request from the Notifications tab to get started.</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ FIXED: real active booking cards */}
                    {bookings.map(booking => (
                        <div className="container" key={booking._id}>
                            <div className="containers">
                                <p className="service-title">
                                    ⚡ Active – {booking.serviceRequestId?.PatientType || booking.patientType || "Service"}
                                </p>
                                <p><strong>Client:</strong> {booking.familyId?.familyFullName || "N/A"}</p>
                                <p><strong>Location:</strong> {booking.location || "N/A"}</p>
                                <p><strong>Started:</strong> {formatDate(booking.startDate)}</p>
                                <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                <p><strong>Rate:</strong> Rs. {booking.rate || "N/A"}</p>
                                <button className="inProgress">In Progress</button>
                            </div>

                            <div className="button-row">
                                <button
                                    className="contactFamily"
                                    onClick={() => {
                                        const phone = booking.familyId?.phone;
                                        if (phone) {
                                            window.open(`tel:${phone}`);
                                        } else {
                                            alert("Family contact not available");
                                        }
                                    }}
                                >
                                    Contact Family
                                </button>
                                <button
                                    className="markComplete"
                                    disabled={actionId === booking._id}
                                    onClick={() => handleMarkComplete(booking._id)}
                                >
                                    {actionId === booking._id ? "Updating..." : "Mark Complete"}
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}

export default ServicesDashboard;