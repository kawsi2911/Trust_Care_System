import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./familyhome.css";

function FamilyHome() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [stats, setStats] = useState({ totalJobs: 0, activeNow: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) return navigate("/familylogin");

    // Fetch family name
    fetch(`http://localhost:5000/api/family/${userId}`)
      .then(res => res.json())
      .then(data => setFullName(data.familyFullName))
      .catch(err => console.error(err));

    // Fetch real dashboard stats + recent activity
    fetch(`http://localhost:5000/api/service-request/family-dashboard/${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats({
          totalJobs: data.totalJobs || 0,
          activeNow: data.activeNow || 0,
          completed: data.completed || 0,
        });
        setRecentBookings(data.recentBookings || []);
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    sessionStorage.removeItem("userId");
    navigate("/familylogin");
  };

  const getActivityIcon = (status) => {
    if (status === "completed" || status === "paid" || status === "reviewed") return "✔️";
    if (status === "active") return "⌛";
    if (status === "pending") return "📝";
    if (status === "cancelled") return "❌";
    return "📋";
  };

  const getActivityLabel = (status) => {
    if (status === "completed") return "Completed";
    if (status === "paid") return "Paid";
    if (status === "reviewed") return "Reviewed";
    if (status === "active") return "In Progress";
    if (status === "pending") return "Scheduled";
    if (status === "cancelled") return "Cancelled";
    return status;
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
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

          <div className="First">
            <p className="Head">Welcome, {fullName} 👋</p>
          </div>

          <div className="button-section">
            <button onClick={() => navigate("/familyhome")}> Home </button>
            <button onClick={() => navigate("/familyservice")}> Service </button>
            <button onClick={() => navigate("/familynotification")}> Notifications </button>
            <button onClick={() => navigate("/familyactivity")}> Activity </button>
            <button onClick={() => navigate("/familyprofiles")}> Profile </button>
          </div>

          <div className="container01">
            <div className="service-containers">
              <p className="service-title">Need a Care Service?</p>
              <p>Find the qualified caregivers near you in minutes</p>
              <button className="requestnow" onClick={() => navigate("/familyservice")}>
                Request Service Now
              </button>
            </div>
          </div>

          {/* ✅ Real stats from MongoDB */}
          <div className="job-group">
            <div className="job1">
              <p className="number">
                {stats.totalJobs} <p className="text">Total Jobs</p>
              </p>
            </div>
            <div className="job2">
              <p className="number">
                {stats.activeNow} <p className="text">Active Now</p>
              </p>
            </div>
            <div className="job3">
              <p className="number">
                {stats.completed} <p className="text">Completed</p>
              </p>
            </div>
          </div>

          {/* ✅ Real recent activity from MongoDB */}
          <div className="container">
            <div className="containers">
              <p className="service-title">Recent Activity</p>
              {recentBookings.length === 0 ? (
                <p style={{ color: "#999" }}>No recent activity found.</p>
              ) : (
                recentBookings.map((booking, idx) => (
                  <p key={idx}>
                    {getActivityIcon(booking.status)}{" "}
                    {booking.serviceRequestId?.PatientType || booking.patientType || "Care Service"} -{" "}
                    {getActivityLabel(booking.status)}{" "}
                    ({getTimeAgo(booking.createdAt)})
                  </p>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default FamilyHome;