import Header from "../Header/Header";
import "./Availableprovider.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import profile from "../assets/profile.png";

function Availableprovider() {

  const navigate = useNavigate();
  const location = useLocation();

  const { userLocation } = location.state || {};

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProviders = async () => {

      try {

        if (!userLocation) {
          console.log("No location received");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/service/nearby-providers",
          { userLocation }
        );

        setProviders(response.data.providers || []);

      } catch (error) {

        console.error("Error fetching providers:", error);

      } finally {
        setLoading(false);
      }

    };

    fetchProviders();

  }, [userLocation]);

  return (
    <>
      <Header />

      <div className="ServiceSection">
        <div className="Service_container">

          <p className="para">Available Providers</p>

          <div className="First">
            <p className="Head">
              {providers.length} Available Caregivers Found
            </p>
          </div>

          {loading && <p>Loading caregivers...</p>}

          {!loading && providers.length === 0 && (
            <p>No providers found in your area.</p>
          )}

          {providers.map((provider) => (

            <div className="container" key={provider._id}>

              <div className="containers001">

                <img
                  src={provider.uploadprofile || profile}
                  alt="profile"
                  className="profiles"
                />

                <div className="sample">

                  <p><strong>{provider.FullName}</strong></p>

                  <p>
                    Experience : {provider.year || 0} years
                  </p>

                  <p>
                    Service Type :
                    {provider.serviceType?.join(", ")}
                  </p>

                  <p>
                    Location : {provider.location}
                  </p>

                  <p>
                    Rate : Rs. {provider.hourlyRate}/hour
                  </p>

                </div>

              </div>

              <div className="button-rows">

                <button
                  className="viewFullFamily"
                  onClick={() =>
                    navigate("/caregiver", { state: provider })
                  }
                >
                  View Full Profile
                </button>

              </div>

            </div>

          ))}

        </div>
      </div>
    </>
  );
}

export default Availableprovider;