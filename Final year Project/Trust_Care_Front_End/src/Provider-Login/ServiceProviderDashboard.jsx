import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import "./ServiceProviderDashboard.css";
import React, { useEffect, useState } from "react";

function ServiceProviderDashboard() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState();
    const [totalJobs, setTotalJobs] = useState(0);
    const [activeJobs, setActiveJobs] = useState(0);
    const [pendingJobs, setPendingJobs] = useState(0);
    const [latestRequest, setLatestRequest] = useState(null);

    useEffect(() => {

        const providerId =
            localStorage.getItem("providerId") ||
            sessionStorage.getItem("providerId");

        const name =
            localStorage.getItem("FullName") ||
            sessionStorage.getItem("FullName");

        setFullName(name);

        if (!providerId) {
            navigate("/serviceproviderlogin");
            return;
        }

        fetch(`http://localhost:5000/api/service-request/dashboard/${providerId}`)
            .then(res => res.json())
            .then(data => {
                setTotalJobs(data.totalJobs || 0);
                setActiveJobs(data.activeJobs || 0);
                setPendingJobs(data.pendingJobs || 0);
                setLatestRequest(data.latestRequest || null);
            })
            .catch(err => console.log(err));

    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    // ✅ NEW: Update Availability function
    const handleUpdateAvailability = async () => {
        const providerId =
            localStorage.getItem("providerId") ||
            sessionStorage.getItem("providerId");

        const isAvailable = window.confirm(
            "Update your availability:\n\nClick OK → Available for new services\nClick Cancel → Not available"
        );

        try {
            const res = await fetch(`http://localhost:5000/api/service/${providerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ available: isAvailable ? "true" : "false" })
            });

            if (res.ok) {
                alert(isAvailable
                    ? "✅ You are now Available for new services!"
                    : "❌ You are now set as Unavailable."
                );
            } else {
                alert("Failed to update availability. Please try again.");
            }
        } catch (err) {
            console.error("Update availability error:", err);
            alert("Failed to update availability. Please try again.");
        }
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
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="First">
                        <p className="Head">Welcome, {fullName} 👋</p>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/serviceproviderdashboard")}>Home</button>
                        <button onClick={() => navigate("/servicesdashboard")}>Service</button>
                        <button onClick={() => navigate("/notificationdashboard")}>Notifications</button>
                        <button onClick={() => navigate("/activitydashboard")}>Activity</button>
                        <button onClick={() => navigate("/profiledashboard")}>Profile</button>
                    </div>

                    {/* JOB COUNT */}
                    <div className="job-group">
                        <div className="job1">
                            <div className="number">{totalJobs}</div>
                            <div className="text">Total Jobs</div>
                        </div>
                        <div className="job2">
                            <div className="number">{activeJobs}</div>
                            <div className="text">Active Now</div>
                        </div>
                        <div className="job3">
                            <div className="number">{pendingJobs}</div>
                            <div className="text">Pending</div>
                        </div>
                    </div>

                    {/* NEW REQUEST */}
                    {latestRequest && (
                        <div className="NewService">
                            <div className="service-content">
                                <div>
                                    <p className="text">🔔 New Service Request!!</p>
                                    <p className="Family">
                                        A Family in {latestRequest.location} needs {latestRequest.service}
                                    </p>
                                </div>
                                <button
                                    className="views"
                                    onClick={() => navigate("/notificationdashboard")}
                                >
                                    View Request
                                </button>
                            </div>
                        </div>
                    )}

                    {/* QUICK SERVICES */}
                    <div className="QuickService">
                        <div className="services">Quick Services</div>
                        <div className="QServices">
                            <button
                                className="viewall"
                                onClick={() => navigate("/notificationdashboard")}
                            >
                                View All Requests
                            </button>

                            {/* ✅ CHANGED: Update Availability now works */}
                            <button
                                className="updates"
                                onClick={handleUpdateAvailability}
                            >
                                Update Availability
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ServiceProviderDashboard;