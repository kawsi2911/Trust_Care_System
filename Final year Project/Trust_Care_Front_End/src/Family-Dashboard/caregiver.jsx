import React from "react";
import Header from "../Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import profile from "../assets/profile.png";
import axios from "axios";
import "./caregiver.css";

function Caregiver() {

    const navigate = useNavigate();
    const location = useLocation();

    const provider = location.state || {}; // <-- get provider data

    return (
        <>
            <Header />

            <div className='ServiceSection'>
                <div className='Service_container'>

                    <p className='para'>Caregiver Profile</p>

                    <div className="containers-profile">

                        <div className="container-profile">

                            <img
                                src={provider.uploadprofile || profile}
                                alt='profile'
                                className='profilesimage'
                            />

                            <div className="profile-body">
                                <p className="profile-name">
                                    <strong>{provider.FullName}</strong>
                                </p>

                                <p className="profile-star">
                                    ⭐⭐⭐⭐⭐ 5/5
                                </p>

                                <p className="profile-review">
                                    Verified ✔️
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Personal Info */}
                    <div className="container">
                        <div className="containers">

                            <p className="service-title">🗒️ Personal Information</p>

                            <p><strong>Gender:</strong> {provider.gender}</p>
                            <p><strong>Experience:</strong> {provider.year} years</p>
                            <p><strong>Location:</strong> {provider.location}</p>

                        </div>
                    </div>


                    {/* Service */}
                    <div className="container">
                        <div className="containers">

                            <p className="service-title">💼 Service Provided</p>

                            <div className="containers01">

                                {provider.serviceType?.map((s, i) => (
                                    <p key={i} className="contain-text">{s}</p>
                                ))}

                            </div>

                        </div>
                    </div>


                    {/* Qualification */}
                    <div className="container">
                        <div className="containers">

                            <p className="service-title">🎓 Qualification</p>

                            <p>{provider.qualifications}</p>

                        </div>
                    </div>


                    {/* Payment */}
                    <div className="container">
                        <div className="containers">

                            <p className="service-title">💰 Payment Details</p>

                            <p><strong>Hourly Rate :</strong> Rs. {provider.hourlyRate}</p>

                        </div>
                    </div>


                   <button
  className='finishes'
  onClick={async () => {

    const familyId =
      localStorage.getItem("userId") ||
      sessionStorage.getItem("userId");

    const requestId =
      localStorage.getItem("requestId");

    await axios.post(
      "http://localhost:5000/api/select/select",
      {
        familyId,
        providerId: provider._id,
        requestId
      }
    );

    navigate("/booking", { state: provider });
  }}
>
  Select This Provider
</button>

                    <button
                        className='previous'
                        onClick={() => navigate("/availableprovider")}
                    >
                        Back to the List
                    </button>

                </div>
            </div>
        </>
    );
}

export default Caregiver;