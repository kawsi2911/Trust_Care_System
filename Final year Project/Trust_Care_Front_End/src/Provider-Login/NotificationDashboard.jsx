import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationDashboard.css";

function NotificationDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const providerId = localStorage.getItem("providerId") || sessionStorage.getItem("providerId");

  useEffect(() => {
    if (!providerId) return;

    axios.get(`http://localhost:5000/api/notifications/${providerId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  }, [providerId]);

  const handleAccept = async (note) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/accept/${note._id}`);
      await axios.put(`http://localhost:5000/api/service-request/accept/${note.requestId}`, { providerId });
      setNotifications(notifications.filter(n => n._id !== note._id));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleDecline = async (note) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/decline/${note._id}`);
      setNotifications(notifications.filter(n => n._id !== note._id));
    } catch (err) {
      console.error("Error declining notification:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="ServiceProviderSection">
        <div className="ServiceProviderSection2">
          <div className="name">
            <div className="heading-head"><p className="Head">Service Provider Dashboard</p></div>
            <div className="Logout"><button onClick={() => navigate("/")}>➜ Logout</button></div>
          </div>

          <div className="button-section">
            <button onClick={() => navigate("/serviceproviderdashboard")}>Home</button>
            <button onClick={() => navigate("/servicesdashboard")}>Service</button>
            <button onClick={() => navigate("/notificationdashboard")}>Notifications</button>
            <button onClick={() => navigate("/activitydashboard")}>Activity</button>
            <button onClick={() => navigate("/profiledashboard")}>Profile</button>
          </div>

          {notifications.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px", color: "#999" }}>
              No new notifications.
            </p>
          )}

          {notifications.map(note => (
            <div className="container" key={note._id}>
              <div className="containers">
                <p className="service-title">🔔 {note.title}</p>
                <p>{note.message}</p>
                {note.serviceType && <p><strong>Service:</strong> {note.serviceType}</p>}
                <p><strong>Posted:</strong> {new Date(note.createdAt).toLocaleString()}</p>
              </div>

              {note.title === "New Service Request!" && (
                <div className="button-row">
                  <button className="cando" onClick={() => handleAccept(note)}>✔️ I Can Do</button>
                  <button className="decline" onClick={() => handleDecline(note)}>❌ Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default NotificationDashboard;