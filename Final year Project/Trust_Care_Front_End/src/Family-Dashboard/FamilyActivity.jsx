import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./FamilyActivity.css"


function FamilyActivity(){

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalServices: 0, activeNow: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    const familyData = JSON.parse(localStorage.getItem("familyData") || "{}");
    const familyId = localStorage.getItem("userId") || 
                     sessionStorage.getItem("userId") || 
                     familyData._id || 
                     familyData.id;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/service-request/family-bookings/${familyId}`
                );
                setBookings(res.data.bookings);
                setStats({
                    totalServices: res.data.totalServices,
                    activeNow: res.data.activeNow,
                    completed: res.data.completed,
                });
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        if (familyId) fetchBookings();
        else setLoading(false);
    }, [familyId]);

    const getStatusLabel = (status) => {
        if (status === "active")    return "⚡ Active";
        if (status === "completed") return "✔️ Completed";
        if (status === "paid")      return "✔️ Paid";
        if (status === "pending")   return "🔃 Pending Payment";
        if (status === "cancelled") return "❌ Cancelled";
        return status;
    };

    return(
        <>
            <Header/>

            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Taker Dashboard</p>
                        </div>
                        <div className="Logout">
                            <button onClick={() => navigate("/")}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/familyhome")}> Home </button>
                        <button onClick={() => navigate("/familyservice")}> Service </button>
                        <button onClick={() => navigate("/familynotification")}> Notifications </button>
                        <button onClick={() => navigate("/familyactivity")}> Activity </button>
                        <button onClick={() => navigate("/familyprofiles")}> Profile </button>
                    </div>

                    {/* Stats */}
                    <div className="job-group">
                        <div className="job12">
                            <p className="numbers">{stats.totalServices}
                                <p className="texts">Total Services</p>
                            </p>
                        </div>
                        <div className="job11">
                            <p className="numbers">{stats.activeNow}
                                <p className="texts">Active Now</p>
                            </p>
                        </div>
                        <div className="job13">
                            <p className="numbers">{stats.completed}
                                <p className="texts">Completed</p>
                            </p>
                        </div>
                    </div>

                    {/* Bookings */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            Loading bookings...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            No bookings found.
                        </div>
                    ) : (
                        bookings.map((booking, idx) => (
                            <div className="container" key={idx}>
                                <div className="containers">
                                    <p className="service-title">
                                        {getStatusLabel(booking.status)} – {booking.serviceRequestId?.PatientType || booking.patientType || "Care Service"}
                                    </p>
                                    <p><strong>Provider:</strong> {booking.providerId?.FullName || "N/A"}</p>
                                    <p><strong>Location:</strong> {booking.location || "N/A"}</p>
                                    <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                    <p><strong>Rate:</strong> Rs. {booking.rate || "N/A"}</p>
                                    <p><strong>Started:</strong> {new Date(booking.startDate || booking.createdAt).toLocaleDateString()}</p>

                                    {/* Active booking */}
                                    {booking.status === "active" && (
                                        <div className="button-row">
                                            <button className="contactprovider">Contact Provider</button>
                                            <button className="markCompletes">View Details</button>
                                        </div>
                                    )}

                                    {/* Pending payment */}
                                    {booking.status === "completed" && (
                                        <button className="makepayment" onClick={() => navigate("/makepayment", {
                                            state: booking
                                        })}>
                                            💰 Make Payment
                                        </button>
                                    )}

                                    {/* Already paid - show rate button */}
                                    {booking.status === "paid" && (
                                        <button className="makepayment" onClick={() => navigate("/rate", {
                                            state: booking
                                        })}>
                                            ⭐ Rate Service
                                        </button>
                                    )}

                                    {/* Already reviewed - show completed */}
                                    {booking.status === "reviewed" && (
                                        <p style={{ color: "#4caf50", fontWeight: "600" }}>
                                            ✅ Review Submitted
                                        </p>
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

export default FamilyActivity;