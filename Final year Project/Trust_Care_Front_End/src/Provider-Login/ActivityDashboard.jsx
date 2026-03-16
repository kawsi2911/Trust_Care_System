import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ActivityDashboard.css";

function ActivityDashboard(){

    const navigate = useNavigate();
    const [stats, setStats] = useState({ completed: 0, totalEarned: 0, avgRating: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ FIXED: provider login saves as providerId not userId
    const providerId = localStorage.getItem("providerId") || sessionStorage.getItem("providerId");

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/service-request/provider-activity/${providerId}`
                );
                setStats(res.data.stats);
                setBookings(res.data.bookings);
            } catch (err) {
                console.error("Failed to fetch activity:", err);
            } finally {
                setLoading(false);
            }
        };

        if (providerId) fetchActivity();
        else setLoading(false);
    }, [providerId]);

    const formatEarned = (amount) => {
        if (amount >= 1000000) return `Rs.${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `Rs.${(amount / 1000).toFixed(0)}K`;
        return `Rs.${amount}`;
    };

    return(
        <>
            <Header/>
            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Provider Dashboard</p>
                        </div>
                        <div className="Logout">
                            <button onClick={() => navigate("/")}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick={() => navigate("/servicesdashboard")}> Service </button>
                        <button onClick={() => navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={() => navigate("/activitydashboard")}> Activity </button>
                        <button onClick={() => navigate("/profiledashboard")}> Profile </button>
                    </div>

                    {/* ✅ CHANGED: Real stats from MongoDB */}
                    <div className="job-group">
                        <div className="job11">
                            <p className="numbers">{stats.completed}
                                <p className="texts">Completed</p>
                            </p>
                        </div>
                        <div className="job12">
                            <p className="numbers">{formatEarned(stats.totalEarned)}
                                <p className="texts">Total Earned</p>
                            </p>
                        </div>
                        <div className="job13">
                            <p className="numbers">{stats.avgRating > 0 ? `${stats.avgRating} ⭐` : "N/A"}
                                <p className="texts">Avg Rating</p>
                            </p>
                        </div>
                    </div>

                    {/* ✅ CHANGED: Real completed bookings from MongoDB */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            Loading activity...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            No completed services yet.
                        </div>
                    ) : (
                        bookings.map((booking, idx) => (
                            <div className="container" key={idx}>
                                <div className="containers">
                                    <p className="service-title">
                                        ✔️ Completed – {booking.serviceRequestId?.PatientType || booking.patientType || "Care Service"}
                                    </p>
                                    <p><strong>Client:</strong> {booking.familyId?.familyFullName || "N/A"}</p>
                                    <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                    <p><strong>Completed:</strong> {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                    <p><strong>Payment:</strong> Rs. {booking.rate || 0} {booking.status === "paid" ? "(Received ✅)" : "(Pending)"}</p>
                                    {booking.rating > 0 && (
                                        <p><strong>Rating:</strong> {"⭐".repeat(booking.rating)} {booking.rating}.0</p>
                                    )}
                                    {booking.review && (
                                        <p className="wording">"{booking.review}"</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    );
}

export default ActivityDashboard;