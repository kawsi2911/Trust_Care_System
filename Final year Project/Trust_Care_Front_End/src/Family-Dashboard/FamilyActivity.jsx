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
    const [contactModal, setContactModal] = useState(null);
    const [detailsModal, setDetailsModal] = useState(null);

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
                    completed: res.data.bookings.filter(b => 
                        ["completed", "paid", "reviewed"].includes(b.status)
                    ).length,
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

            {/* ── Contact Provider Modal ── */}
            {contactModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", zIndex: 1000,
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "white", borderRadius: "12px",
                        padding: "30px", width: "340px", textAlign: "center",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👨‍⚕️</div>
                        <h3 style={{ color: "#2196f3", marginBottom: "16px" }}>Contact Provider</h3>
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Name:</strong> {contactModal.FullName || "N/A"}
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>📞 Phone:</strong>{" "}
                                <a href={`tel:${contactModal.phone}`} style={{ color: "#2196f3" }}>
                                    {contactModal.phone || "N/A"}
                                </a>
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>✉️ Email:</strong>{" "}
                                <a href={`mailto:${contactModal.email}`} style={{ color: "#2196f3" }}>
                                    {contactModal.email || "N/A"}
                                </a>
                            </p>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>📍 Location:</strong> {contactModal.location || "N/A"}
                            </p>
                        </div>
                        <button
                            onClick={() => setContactModal(null)}
                            style={{
                                padding: "10px 30px", background: "#2196f3",
                                color: "white", border: "none", borderRadius: "8px",
                                fontSize: "1rem", fontWeight: "600", cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ── View Details Modal ── */}
            {detailsModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", zIndex: 1000,
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "white", borderRadius: "12px",
                        padding: "30px", width: "360px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}>
                        <h3 style={{ color: "#2196f3", marginBottom: "16px", textAlign: "center" }}>
                            📋 Booking Details
                        </h3>
                        <div style={{ marginBottom: "20px" }}>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Service:</strong> {detailsModal.serviceRequestId?.PatientType || detailsModal.patientType || "N/A"}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Provider:</strong> {detailsModal.providerId?.FullName || "N/A"}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Location:</strong> {detailsModal.location || "N/A"}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Duration:</strong> {detailsModal.duration || "N/A"}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Rate:</strong> Rs. {detailsModal.rate || "N/A"}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Started:</strong> {new Date(detailsModal.startDate || detailsModal.createdAt).toLocaleDateString()}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Status:</strong>{" "}
                                <span style={{
                                    padding: "3px 10px", borderRadius: "20px",
                                    background: detailsModal.status === "active" ? "#4caf50" : "#2196f3",
                                    color: "white", fontSize: "0.85rem"
                                }}>
                                    {detailsModal.status}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={() => setDetailsModal(null)}
                            style={{
                                width: "100%", padding: "10px",
                                background: "#2196f3", color: "white",
                                border: "none", borderRadius: "8px",
                                fontSize: "1rem", fontWeight: "600", cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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
                                            <button className="contactprovider"
                                                onClick={() => setContactModal(booking.providerId)}>
                                                Contact Provider
                                            </button>
                                            <button className="markCompletes"
                                                onClick={() => setDetailsModal(booking)}>
                                                View Details
                                            </button>
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

                                    {/* Already paid */}
                                    {booking.status === "paid" && (
                                        <button className="makepayment" onClick={() => navigate("/rate", {
                                            state: booking
                                        })}>
                                            ⭐ Rate Service
                                        </button>
                                    )}

                                    {/* Already reviewed */}
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