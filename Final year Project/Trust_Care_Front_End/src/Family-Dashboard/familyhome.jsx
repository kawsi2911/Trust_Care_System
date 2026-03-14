import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./familyhome.css";

function FamilyHome() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [totalJobs, setTotalJobs] = useState(0);
    const [activeNow, setActiveNow] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/familylogin");

        // Fetch family name
        fetch(`http://localhost:5000/api/family/${userId}`)
            .then(res => res.json())
            .then(data => setFullName(data.familyFullName))
            .catch(err => console.error("Name fetch error:", err));

        // ✅ FIXED: fetch real dashboard stats instead of hardcoded 15, 3, 2
        fetch(`http://localhost:5000/api/service-request/family-dashboard/${userId}`)
            .then(res => res.json())
            .then(data => {
                setTotalJobs(data.totalJobs || 0);
                setActiveNow(data.activeNow || 0);
                setCompleted(data.completed || 0);
                setRecentBookings(data.recentBookings || []);
            })
            .catch(err => console.error("Dashboard fetch error:", err));

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        navigate("/familylogin");
    };

    // Helper to get status label with icon
    const getStatusLabel = (status) => {
        if (status === "active") return "⌛ In Progress";
        if (status === "completed") return "✔️ Completed";
        if (status === "pending") return "📋 Scheduled";
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
                            {/* ✅ FIXED: was navigating to "/" — now properly logs out */}
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="First">
                        <p className="Head">Welcome, {fullName} 👋</p>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/familyhome")}>Home</button>
                        <button onClick={() => navigate("/familyservice")}>Service</button>
                        <button onClick={() => navigate("/familynotification")}>Notifications</button>
                        <button onClick={() => navigate("/familyactivity")}>Activity</button>
                        <button onClick={() => navigate("/familyprofiles")}>Profile</button>
                    </div>

                    <div className="container01">
                        <div className="service-containers">
                            <p className="service-title">Need a Care Service?</p>
                            <p>Find qualified caregivers near you in minutes</p>
                            <button className="requestnow" onClick={() => navigate("/familyservice")}>
                                Request Service Now
                            </button>
                        </div>
                    </div>

                    {/* ✅ FIXED: real numbers from backend */}
                    <div className="job-group">
                        <div className="job1">
                            <div className="number">{totalJobs}</div>
                            <div className="text">Total Jobs</div>
                        </div>
                        <div className="job2">
                            <div className="number">{activeNow}</div>
                            <div className="text">Active Now</div>
                        </div>
                        <div className="job3">
                            <div className="number">{completed}</div>
                            <div className="text">Completed</div>
                        </div>
                    </div>

                    {/* ✅ FIXED: real recent activity from backend */}
                    <div className="container">
                        <div className="containers">
                            <p className="service-title">Recent Activity</p>
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking, i) => (
                                    <p key={i}>
                                        {getStatusLabel(booking.status)}{" "}
                                        {booking.serviceRequestId?.PatientType || "Service"}
                                    </p>
                                ))
                            ) : (
                                <p>No recent activity yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default FamilyHome;