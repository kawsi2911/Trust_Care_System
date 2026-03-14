import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderDashboard.css";
import React, { useEffect, useState } from "react";

function ServiceProviderDashboard() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");

    useEffect(() => {
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const storedName = localStorage.getItem("FullName") || sessionStorage.getItem("FullName");

    if (!userId) return navigate("/serviceproviderlogin");

    if (storedName) {
        setFullName(storedName); // use stored name immediately
    } else {
        fetch(`http://localhost:5000/api/service/${userId}`)
            .then(res => res.json())
            .then(data => setFullName(data.FullName || data.fullName || ""))
            .catch(err => console.error(err));
    }
}, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        navigate("/"); 
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

                    <div className="job-group">
                        <div className="job1">
                            <div className="number">15</div>
                            <div className="text">Total Jobs</div>
                        </div>
                        <div className="job2">
                            <div className="number">3</div>
                            <div className="text">Active Now</div>
                        </div>
                        <div className="job3">
                            <div className="number">2</div>
                            <div className="text">Pending</div>
                        </div>
                    </div>

                    <div className="NewService">
                        <div className="service-content">
                            <div>
                                <p className="text">🔔 New Service Request!!</p>
                                <p className="Family">A Family in Galle needs elder care service</p>
                            </div>
                            <button className="views">View Request</button>
                        </div>
                    </div>

                    <div className="QuickService">
                        <div className="services">Quick Services</div>
                        <div className="QServices">
                            <button className="viewall" onClick={() => navigate("/notificationdashboard")}>
                                View All Requests
                            </button>
                            <button className="updates">Update Availability</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ServiceProviderDashboard;