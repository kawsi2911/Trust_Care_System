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


    return (
        <>
            <Header />

            <div className="ServiceProviderSection">

                <div className="ServiceProviderSection2">

                    <div className="name">

                        <div className="heading-head">
                            <p className="Head">
                                Service Provider Dashboard
                            </p>
                        </div>

                        <div className="Logout">
                            <button onClick={handleLogout}>
                                ➜ Logout
                            </button>
                        </div>

                    </div>


                    <div className="First">
                        <p className="Head">
                            Welcome, {fullName} 👋
                        </p>
                    </div>


                    <div className="button-section">

                        <button onClick={() => navigate("/serviceproviderdashboard")}>
                            Home
                        </button>

                        <button onClick={() => navigate("/servicesdashboard")}>
                            Service
                        </button>

                        <button onClick={() => navigate("/notificationdashboard")}>
                            Notifications
                        </button>

                        <button onClick={() => navigate("/activitydashboard")}>
                            Activity
                        </button>

                        <button onClick={() => navigate("/profiledashboard")}>
                            Profile
                        </button>

                    </div>



                    {/* JOB COUNT */}

                    <div className="job-group">

                        <div className="job1">
                            <div className="number">
                                {totalJobs}
                            </div>
                            <div className="text">
                                Total Jobs
                            </div>
                        </div>

                        <div className="job2">
                            <div className="number">
                                {activeJobs}
                            </div>
                            <div className="text">
                                Active Now
                            </div>
                        </div>

                        <div className="job3">
                            <div className="number">
                                {pendingJobs}
                            </div>
                            <div className="text">
                                Pending
                            </div>
                        </div>

                    </div>



                    {/* NEW REQUEST */}

                    {latestRequest && (

                        <div className="NewService">

                            <div className="service-content">

                                <div>

                                    <p className="text">
                                        🔔 New Service Request!!
                                    </p>

                                    <p className="Family">

                                        A Family in {latestRequest.SLocation}
                                        needs {latestRequest.Service}

                                    </p>

                                </div>

                                <button
                                    className="views"
                                    onClick={() =>
                                        navigate("/notificationdashboard")
                                    }
                                >
                                    View Request
                                </button>

                            </div>

                        </div>

                    )}



                    {/* QUICK */}

                    <div className="QuickService">

                        <div className="services">
                            Quick Services
                        </div>

                        <div className="QServices">

                            <button
                                className="viewall"
                                onClick={() =>
                                    navigate("/notificationdashboard")
                                }
                            >
                                View All Requests
                            </button>

                            <button className="updates">
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