import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationDashboard.css";

function NotificationDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

 useEffect(() => {

 const providerId =
   localStorage.getItem("userId") ||
   sessionStorage.getItem("userId");

 if (!providerId) return;

 axios.get(`http://localhost:5000/api/notifications/${providerId}`)
   .then(res => setNotifications(res.data))
   .catch(err => console.log(err));

}, []);


  // Mark notification as accepted
const handleAccept = async (note) => {

  const providerId =
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId");

  try {

    await axios.put(
      `http://localhost:5000/api/service-request/accept/${note.requestId}`,
      { providerId }
    );

    // remove notification from UI
    setNotifications(notifications.filter(n => n._id !== note._id));

  } catch (err) {
    console.error("Error accepting request:", err);
  }
};
  // Decline notification
 const handleDecline = async (noteId) => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/decline/${noteId}`);
    
    setNotifications(notifications.filter(n => n._id !== noteId));

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
            <div className="heading-head">
              <p className="Head">Service Provider Dashboard</p>
            </div>
            <div className="Logout">
              <button onClick={() => navigate("/")}>➜] Logout</button>
            </div>
          </div>

          <div className="button-section">
            <button onClick={() => navigate("/serviceproviderdashboard")}>Home</button>
            <button onClick={() => navigate("/servicesdashboard")}>Service</button>
            <button onClick={() => navigate("/notificationdashboard")}>Notifications</button>
            <button onClick={() => navigate("/activitydashboard")}>Activity</button>
            <button onClick={() => navigate("/profiledashboard")}>Profile</button>
          </div>

          {/* Dynamic Notifications */}
          {notifications.length === 0 && <p>No new notifications.</p>}

          {notifications.map((note) => (
            <div className="container" key={note._id}>
              <div className="containers">
                <p className="service-title">🔔 {note.title}</p>
                <p>{note.message}</p>
                <p><strong>Posted:</strong> {new Date(note.createdAt).toLocaleString()}</p>
              </div>

              <div className="button-row">
                <button className="cando" onClick={() => handleAccept(note)}>✔️ I Can Do</button>
                <button className="decline" onClick={() => handleDecline(note._id)}>❌ Decline</button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}

export default NotificationDashboard;