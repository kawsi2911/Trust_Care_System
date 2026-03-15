
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

        const response = await axios.get(
          `http://localhost:5000/api/notifications/${familyId}`
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

          {/* General Notifications */}

          {notifications.length > 0 ? (
            notifications.map((note) => (

              <div className="callprovider" key={note._id}>

                <p className="provider-name">
                  <strong>🔔 {note.title}</strong>
                </p>

                <div className="summary">
                  <p>{note.message}</p>

                  {note.createdAt && (
                    <p>{new Date(note.createdAt).toLocaleString()}</p>
                  )}
                </div>

              </div>

            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No Notifications Yet
            </p>
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
                    navigate("/booking", { 
                      state:{
                        providerId: note.providerId,
                      } 
                    })
                  }
                > View Request
              </button>
          </div>
        </div>
      ))}

        </div>
      </div>

    </>
  );
}

export default FamilyNotification;
