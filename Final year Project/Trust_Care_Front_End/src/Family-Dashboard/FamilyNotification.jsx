import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./Familynotification.css";
import { useEffect, useState } from "react";
import axios from "axios";

function FamilyNotification() {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const fetchNotifications = async () => {

      const familyId =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId");

      if (!familyId) {
        console.log("No familyId found");
        return;
      }

      try {
        // ✅ CHANGED: use /family/ route to get all family notifications
        const response = await axios.get(
          `http://localhost:5000/api/notifications/family/${familyId}`
        );
        setNotifications(response.data);

      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();

    // auto refresh every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);

  }, []);

  const getIcon = (title) => {
    if (title?.includes("Booking")) return "🔔";
    if (title?.includes("Payment")) return "💳";
    if (title?.includes("Declined")) return "❌";
    if (title?.includes("Review")) return "⭐";
    if (title?.includes("Pending")) return "⏳";
    return "🔔";
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
              <button onClick={() => navigate("/")}>➜ Logout</button>
            </div>
          </div>

          <div className="button-section">
            <button onClick={() => navigate("/familyhome")}>Home</button>
            <button onClick={() => navigate("/familyservice")}>Service</button>
            <button onClick={() => navigate("/familynotification")}>Notifications</button>
            <button onClick={() => navigate("/familyactivity")}>Activity</button>
            <button onClick={() => navigate("/familyprofiles")}>Profile</button>
          </div>

          {notifications.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px", color: "#999" }}>
              No Notifications Yet
            </p>
<<<<<<< HEAD
          )}

          {/* Provider Accepted Section */}
          {notifications
            .filter(note => note.title === "Booking Confirmed")
            .map((note) => (

            <div className="booking-container" key={note._id}>

            <p className="provider-name">
              <strong>📞 Provider Accepted Your Request</strong>
            </p>

            <div className="summary">
              <p>{note.message}</p>

              {note.providerName && (
                <p><strong>Provider:</strong> {note.providerName}</p>
              )}

              {note.providerPhone && (
                <p><strong>Phone:</strong> {note.providerPhone}</p>
              )}

              {note.createdAt && (
                <p>{new Date(note.createdAt).toLocaleString()}</p>
              )}
            </div>

            {/* NEW BUTTON */}
            <div className="inprogress">

            <button
              className="confirm"
              onClick={() =>
                navigate("/familyactivity", { 
                  state:{
                      requestId: note.requestId
                    } 
                  })
                }
                >
                View Request
              </button>
          </div>
        </div>
      ))}
=======
          ) : (
            notifications.map((note) => (
              <div className="callprovider" key={note._id} style={{
                borderLeft: note.title?.includes("Declined") ? "4px solid #ef5350" :
                            note.title?.includes("Payment") ? "4px solid #4caf50" :
                            "4px solid #2196f3"
              }}>
                <p className="provider-name">
                  <strong>{getIcon(note.title)} {note.title}</strong>
                </p>
                <div className="summary">
                  <p>{note.message}</p>
                  {note.createdAt && (
                    <p style={{ color: "#999", fontSize: "0.82rem" }}>
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
>>>>>>> mumthaj

        </div>
      </div>
    </>
  );
}

export default FamilyNotification;