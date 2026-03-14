import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./FamilyActivity.css";
import { useEffect, useState } from "react";
import axios from "axios";

function FamilyActivity() {

    const navigate = useNavigate();

    const [stats,    setStats]    = useState({ totalServices: 0, activeNow: 0, completed: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading,  setLoading]  = useState(true);

    // ✅ FIXED: fetch real bookings from backend instead of hardcoded data
    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/familylogin");

        axios.get(`http://localhost:5000/api/service-request/family-bookings/${userId}`)
            .then(res => {
                setStats({
                    totalServices: res.data.totalServices || 0,
                    activeNow:     res.data.activeNow     || 0,
                    completed:     res.data.completed     || 0
                });
                setBookings(res.data.bookings || []);
            })
            .catch(err => console.error("Activity fetch error:", err))
            .finally(() => setLoading(false));

    }, [navigate]);

    // ✅ FIXED: proper logout
    const handleLogout = () => {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        navigate("/familylogin");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    // Get icon + label based on booking status
    const getStatusLabel = (status, paymentStatus) => {
        if (status === "active")    return "⚡ Active";
        if (status === "completed" && paymentStatus === "unpaid") return "🔃 Pending Payment";
        if (status === "completed" && paymentStatus === "paid")   return "✔️ Completed";
        return "📋 " + status;
    };

    return (
        <>
            <Header />

            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Taker Dashboard</p>
                        </div>
                        <div className="Logout">
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/familyhome")}>Home</button>
                        <button onClick={() => navigate("/familyservice")}>Service</button>
                        <button onClick={() => navigate("/familynotification")}>Notifications</button>
                        <button onClick={() => navigate("/familyactivity")}>Activity</button>
                        <button onClick={() => navigate("/familyprofiles")}>Profile</button>
                    </div>

                    {/* ✅ FIXED: real stats from backend */}
                    <div className="job-group">
                        <div className="job11">
                            <div className="numbers">{stats.totalServices}</div>
                            <div className="texts">Total Services</div>
                        </div>
                        <div className="job12">
                            <div className="numbers">{stats.activeNow}</div>
                            <div className="texts">Active Now</div>
                        </div>
                        <div className="job13">
                            <div className="numbers">{stats.completed}</div>
                            <div className="texts">Completed</div>
                        </div>
                    </div>

                    {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading activity...</p>}

                    {!loading && bookings.length === 0 && (
                        <div className="container">
                            <div className="containers">
                                <p className="service-title">No activity yet.</p>
                                <p>Your service bookings will appear here.</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ FIXED: real booking cards with correct status logic */}
                    {bookings.map(booking => (
                        <div className="container" key={booking._id}>
                            <div className="containers">

                                <p className="service-title">
                                    {getStatusLabel(booking.status, booking.paymentStatus)} –{" "}
                                    {booking.serviceRequestId?.PatientType || booking.patientType || "Service"}
                                </p>

                                <p><strong>Provider:</strong> {booking.providerId?.FullName || "N/A"}</p>
                                <p><strong>Location:</strong> {booking.location || "N/A"}</p>
                                <p><strong>Started:</strong> {formatDate(booking.startDate)}</p>
                                <p><strong>Duration:</strong> {booking.duration || "N/A"}</p>
                                <p><strong>Payment:</strong> Rs. {booking.rate || "N/A"} ({booking.paymentStatus === "paid" ? "Paid ✅" : "Pending ⏳"})</p>

                                {/* Active booking badge */}
                                {booking.status === "active" && (
                                    <button className="inProgress">Active</button>
                                )}

                                {/* Pending payment button */}
                                {booking.status === "completed" && booking.paymentStatus === "unpaid" && (
                                    // ✅ FIXED: passes booking data to MakePayment so it shows real info
                                    <button className="makepayment"
                                        onClick={() => navigate("/makepayment", { state: booking })}>
                                        💰 Make Payment
                                    </button>
                                )}

                                {/* Rate button for paid completed bookings */}
                                {booking.status === "completed" && booking.paymentStatus === "paid" && (
                                    // ✅ FIXED: passes provider data to Rate page
                                    <button className="makepayment"
                                        onClick={() => navigate("/rate", { state: { booking, provider: booking.providerId } })}>
                                        ⭐ Rate Service
                                    </button>
                                )}

                            </div>

                            {/* Contact provider button for active bookings */}
                            {booking.status === "active" && (
                                <div className="button-row">
                                    <button className="contactprovider"
                                        onClick={() => {
                                            const phone = booking.providerId?.phone;
                                            phone ? window.open(`tel:${phone}`) : alert("Provider contact not available");
                                        }}>
                                        Contact Provider
                                    </button>
                                    <button className="markCompletes">View Details</button>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}

export default FamilyActivity;