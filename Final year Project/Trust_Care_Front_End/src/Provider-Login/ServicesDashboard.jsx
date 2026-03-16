import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ServicesDashboard.css";

function ServicesDashboard(){

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contactModal, setContactModal] = useState(null);

    // ✅ FIXED: provider login saves as providerId not userId
    const providerId = localStorage.getItem("providerId") || sessionStorage.getItem("providerId");

    useEffect(() => {
        const fetchServices = async () => {
            if (!providerId) { setLoading(false); return; }
            try {
                // Fetch active bookings
                const activeRes = await axios.get(
                    `http://localhost:5000/api/service-request/provider-services/${providerId}`
                );
                // Fetch completed bookings
                const completedRes = await axios.get(
                    `http://localhost:5000/api/service-request/provider-activity/${providerId}`
                );

                const activeBookings = (activeRes.data || []).map(b => ({ ...b, status: "active" }));
                const completedBookings = (completedRes.data?.bookings || []);

                // Show all bookings together
                setBookings([...activeBookings, ...completedBookings]);
            } catch (err) {
                console.error("Failed to fetch services:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [providerId]);

    const handleMarkComplete = async (bookingId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/service-request/complete/${bookingId}`
            );
            // ✅ CHANGED: update badge from "In Progress" to "Completed" — stays in list
            setBookings(prev => prev.map(b =>
                b._id === bookingId ? { ...b, status: "completed" } : b
            ));
            alert("Service marked as complete! Family has been notified. ✅");
        } catch (err) {
            console.error("Failed to mark complete:", err);
            alert("Failed to mark complete. Please try again.");
        }
    };

    return(
        <>
            <Header />

            {/* Contact Family Modal */}
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
                        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👨‍👩‍👧‍👦</div>
                        <h3 style={{ color: "#2196f3", marginBottom: "16px" }}>Contact Family</h3>
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <p style={{ marginBottom: "10px" }}>
                                <strong>Name:</strong> {contactModal.familyFullName || "N/A"}
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
                        </div>
                        <button onClick={() => setContactModal(null)} style={{
                            padding: "10px 30px", background: "#2196f3",
                            color: "white", border: "none", borderRadius: "8px",
                            fontSize: "1rem", fontWeight: "600", cursor: "pointer"
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

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

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            Loading services...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                            No services found.
                        </div>
                    ) : (
                        bookings.map((booking, idx) => (
                            <div className="container" key={idx}>
                                <div className="containers">
                                    <p className="service-title">
                                        {booking.status === "active" ? "⚡" : "✔️"} {booking.status === "active" ? "Active" : "Completed"} – {booking.serviceRequestId?.PatientType || booking.patientType || "Care Service"}
                                    </p>
                                    <p><strong>Client:</strong> {booking.familyId?.familyFullName || "N/A"}</p>
                                    <p><strong>Location:</strong> {booking.location || "N/A"}</p>
                                    <p><strong>Started:</strong> {new Date(booking.startDate || booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                    <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                    <p><strong>Rate:</strong> Rs. {booking.rate || "N/A"}/month</p>

                                    {/* ✅ Badge changes based on status */}
                                    {booking.status === "active" && (
                                        <button className="inProgress">In Progress</button>
                                    )}
                                    {["completed", "paid", "reviewed"].includes(booking.status) && (
                                        <button className="inProgress" style={{
                                            background: "#4caf50", cursor: "default"
                                        }}>
                                            ✔️ Completed
                                        </button>
                                    )}
                                </div>

                                {/* Action buttons only for active bookings */}
                                {booking.status === "active" && (
                                    <div className="button-row">
                                        <button
                                            className="contactFamily"
                                            onClick={() => setContactModal(booking.familyId)}
                                        >
                                            Contact Family
                                        </button>
                                        <button
                                            className="markComplete"
                                            onClick={() => handleMarkComplete(booking._id)}
                                        >
                                            Mark Complete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    );
}

export default ServicesDashboard;