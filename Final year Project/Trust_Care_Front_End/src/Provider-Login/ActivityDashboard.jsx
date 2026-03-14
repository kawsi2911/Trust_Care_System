import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import "./ActivityDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ActivityDashboard() {

    const navigate = useNavigate();

    const [stats,    setStats]    = useState({ completed: 0, totalEarned: 0, avgRating: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading,  setLoading]  = useState(true);

    // ✅ FIXED: fetch real completed bookings for this provider
    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/serviceproviderloginpage");

        axios.get(`http://localhost:5000/api/service-request/provider-activity/${userId}`)
            .then(res => {
                setStats(res.data.stats   || { completed: 0, totalEarned: 0, avgRating: 0 });
                setBookings(res.data.bookings || []);
            })
            .catch(err => console.error("Activity fetch error:", err))
            .finally(() => setLoading(false));

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("FullName");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("FullName");
        navigate("/serviceproviderloginpage");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const formatRate = (rate) => {
        if (!rate) return "N/A";
        return Number(rate) >= 1000
            ? "Rs. " + (Number(rate) / 1000).toFixed(0) + "K"
            : "Rs. " + rate;
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

                    {/* ✅ FIXED: real stats from backend */}
                    <div className="job-group">
                        <div className="job11">
                            <div className="numbers">{stats.completed}</div>
                            <div className="texts">Completed</div>
                        </div>
                        <div className="job12">
                            <div className="numbers">{formatRate(stats.totalEarned)}</div>
                            <div className="texts">Total Earned</div>
                        </div>
                        <div className="job13">
                            <div className="numbers">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) + " ⭐" : "—"}</div>
                            <div className="texts">Avg Rating</div>
                        </div>
                    </div>

                    {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading activity...</p>}

                    {!loading && bookings.length === 0 && (
                        <div className="container">
                            <div className="containers">
                                <p className="service-title">No completed jobs yet.</p>
                                <p>Your completed services will appear here.</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ FIXED: real booking cards */}
                    {bookings.map(booking => (
                        <div className="container" key={booking._id}>
                            <div className="containers">
                                <p className="service-title">
                                    ✔️ Completed – {booking.serviceRequestId?.PatientType || booking.patientType || "Service"}
                                </p>
                                <p><strong>Client:</strong> {booking.familyId?.familyFullName || "N/A"}</p>
                                <p><strong>Location:</strong> {booking.location || "N/A"}</p>
                                <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                <p><strong>Completed:</strong> {formatDate(booking.updatedAt)}</p>
                                <p><strong>Payment:</strong> Rs. {booking.rate || "N/A"} ({booking.paymentStatus === "paid" ? "Received ✅" : "Pending ⏳"})</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}

export default ActivityDashboard;