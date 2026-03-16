import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./FamilyActivity.css";

function FamilyActivity() {

  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalServices: 0, activeNow: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  const familyData = JSON.parse(localStorage.getItem("familyData") || "{}");

  const familyId =
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    familyData._id ||
    familyData.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/service-request/family-bookings/${familyId}`
        );

        setBookings(res.data.bookings || []);

        setStats({
          totalServices: res.data.totalServices || 0,
          activeNow: res.data.activeNow || 0,
          completed: (res.data.bookings || []).filter(b =>
            ["completed", "paid", "reviewed"].includes(b.status)
          ).length
        });

      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (familyId) fetchBookings();
    else setLoading(false);

  }, [familyId]);

  const getStatusLabel = (status) => {
    if (status === "active") return "⚡ Active";
    if (status === "completed") return "✔️ Completed";
    if (status === "paid") return "✔️ Paid";
    if (status === "pending") return "🔃 Pending Payment";
    if (status === "cancelled") return "❌ Cancelled";
    return status;
  };

  return (
    <>
      <Header />

      {/* Contact Provider Modal */}
      {contactModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div style={{ fontSize: "3rem" }}>👨‍⚕️</div>

            <h3>Contact Provider</h3>

            <p><strong>Name:</strong> {contactModal.FullName}</p>

            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${contactModal.phone}`}>
                {contactModal.phone}
              </a>
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactModal.email}`}>
                {contactModal.email}
              </a>
            </p>

            <p><strong>Location:</strong> {contactModal.location}</p>

            <button onClick={() => setContactModal(null)}>
              Close
            </button>

          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3>Booking Details</h3>

            <p>
              <strong>Service:</strong>{" "}
              {detailsModal.serviceRequestId?.PatientType || detailsModal.patientType}
            </p>

            <p>
              <strong>Provider:</strong>{" "}
              {detailsModal.providerId?.FullName}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {detailsModal.location}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {detailsModal.duration}
            </p>

            <p>
              <strong>Rate:</strong> Rs. {detailsModal.rate}
            </p>

            <p>
              <strong>Status:</strong> {detailsModal.status}
            </p>

            <button onClick={() => setDetailsModal(null)}>
              Close
            </button>

          </div>
        </div>
      )}

      <div className="ServiceProviderSection">
        <div className="ServiceProviderSection2">

          <div className="name">

            <p className="Head">
              Service Taker Dashboard
            </p>

            <button onClick={() => navigate("/")}>
              Logout
            </button>

          </div>

          <div className="button-section">

            <button onClick={() => navigate("/familyhome")}>Home</button>

            <button onClick={() => navigate("/familyservice")}>Service</button>

            <button onClick={() => navigate("/familynotification")}>Notifications</button>

            <button onClick={() => navigate("/familyactivity")}>Activity</button>

            <button onClick={() => navigate("/familyprofiles")}>Profile</button>

          </div>

          {/* Stats */}

          <div className="job-group">

            <div className="job12">
              <p className="numbers">{stats.totalServices}</p>
              <p className="texts">Total Services</p>
            </div>

            <div className="job11">
              <p className="numbers">{stats.activeNow}</p>
              <p className="texts">Active Now</p>
            </div>

            <div className="job13">
              <p className="numbers">{stats.completed}</p>
              <p className="texts">Completed</p>
            </div>

          </div>

          {/* Booking List */}

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p style={{ textAlign: "center" }}>No bookings found.</p>
          ) : (
            bookings.map((booking, idx) => (

              <div className="container" key={idx}>

                <div className="containers">

                  <p className="service-title">
                    {getStatusLabel(booking.status)} – {booking.patientType}
                  </p>

                  <p><strong>Provider:</strong> {booking.providerId?.FullName}</p>

                  <p><strong>Location:</strong> {booking.location}</p>

                  <p><strong>Duration:</strong> {booking.duration}</p>

                  <p><strong>Rate:</strong> Rs. {booking.rate}</p>

                  {/* Active Booking */}

                  {booking.status === "active" && (
                    <div className="button-row">

                      <button
                        className="contactprovider"
                        onClick={() => setContactModal(booking.providerId)}
                      >
                        Contact Provider
                      </button>

                      <button
                        className="markCompletes"
                        onClick={() => setDetailsModal(booking)}
                      >
                        View Details
                      </button>

                    </div>
                  )}

                  {/* Payment */}

                  {booking.status === "completed" && (
                    <button
                      className="makepayment"
                      onClick={() => navigate("/makepayment", { state: booking })}
                    >
                      Make Payment
                    </button>
                  )}

                  {booking.status === "paid" && (
                    <button
                      className="makepayment"
                      onClick={() => navigate("/rate", { state: booking })}
                    >
                      Rate Service
                    </button>
                  )}

                </div>

              </div>

            ))
          )}

        </div>
      </div>
    </>
  );
}

export default FamilyActivity;