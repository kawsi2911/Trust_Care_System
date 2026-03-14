import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./FindingCaregiver.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function FindingCaregiver() {

  const navigate = useNavigate();
  const location = useLocation();

  const requestData = location.state || {};

  useEffect(() => {

    const timer = setTimeout(() => {

      navigate("/availableprovider", {
        state: {
          userLocation: requestData.SLocation
        }
      });

    }, 60000); // 1 minute

    return () => clearTimeout(timer);

  }, [navigate, requestData]);

  return (
    <>
      <Header />

      <div className="ServiceSection">
        <div className="Service_container">

          <p className="para">Finding Caregivers...</p>

          <div className="body01">

            <p className = "refresh">🔃</p>

            <p className="paragraph">
              Searching for providers near you...
            </p>

            <div className="details">

              <p>
                <strong>Location :</strong>{" "}
                {requestData.SLocation || "N/A"}
              </p>

              <p>
                <strong>Service Type :</strong>{" "}
                {requestData.Service || "N/A"}
              </p>

              <p>
                <strong>Search Radius :</strong> 10 km
              </p>

            </div>

          </div>

          <div className="body022">

            <p className="title">
              ✔️ Request sent to nearest providers
            </p>

            <p className="body-title">
              ✔️ Waiting for responses...
            </p>

            <p className="footer-body">
              This may take 1–3 minutes
            </p>

          </div>

        </div>
      </div>
    </>
  );
}

export default FindingCaregiver;