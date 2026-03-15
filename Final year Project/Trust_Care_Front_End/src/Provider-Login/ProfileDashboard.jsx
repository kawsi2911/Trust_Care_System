import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import profile from '../assets/profile.png';
import "./ProfileDashboard.css";
import React, { useEffect, useState } from "react";

function ProfileDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // store user data

    useEffect(() => {
        const providerId = localStorage.getItem("providerId") || sessionStorage.getItem("providerId");
        if (!providerId) return navigate("/serviceproviderloginpage"); // redirect if not logged in

        fetch(`http://localhost:5000/api/service/${providerId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Fetch error:", err));
    }, [navigate]);

    if (!user) return <p>Loading profile...</p>;

    return (
        <>
            <Header/>
            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Provider Dashboard</p>
                        </div>
                        <div className="Logout">
                            <button onClick={() => {
                                localStorage.removeItem("userId");
                                localStorage.removeItem("FullName");
                                sessionStorage.removeItem("userId");
                                sessionStorage.removeItem("FullName");
                                navigate("/serviceproviderlogin");
                            }}>➜ Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick={() => navigate("/servicesdashboard")}> Service </button>
                        <button onClick={() => navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={() => navigate("/activitydashboard")}> Activity </button>
                        <button onClick={() => navigate("/profiledashboard")}> Profile </button>
                    </div>

                    <div className="profileImage">
                        <img src={user.uploadprofile || profile} alt='profile' className='profile' />
                        <p className="profileText"><strong>{user.FullName}</strong></p>
                        <p className="ratings">⭐⭐⭐⭐⭐ 4.8/5.0</p>
                        <p className="rating-wording">145 Review | Members Since {new Date(user.createdAt).getFullYear()}</p>
                    </div>

                    <div className="container">
                        <div className="containers">
                            <p className="service-title">✔️ Completed – {user.serviceType?.join(", ")}</p>
                            <p><strong>Email :</strong> {user.email}</p>
                            <p><strong>Phone :</strong> {user.phone}</p>
                            <p><strong>NIC :</strong> {user.NIC}</p>
                            <p><strong>Age:</strong> {new Date().getFullYear() - new Date(user.dob).getFullYear()} years</p>
                            <p><strong>Gender:</strong> {user.gender}</p>
                            <p><strong>Address:</strong> {user.fulladdress}</p>
                        </div>
                    </div>

                    <div className="container">
                        <div className="containers">
                            <p className="service-title">Services & Experiences</p>
                            <p><strong>Services:</strong></p>
                            <div className="containers01">
                                {user.serviceType?.map((service, i) => (
                                    <p key={i} className="contain-text">{service}</p>
                                ))}
                            </div>
                            <p><strong>Experience:</strong> {user.year} years</p>
                            <p><strong>Work Area:</strong> {user.location}</p>
                            <p><strong>Hourly Rate:</strong> Rs.{user.hourlyRate} / Hour</p>
                        </div>
                    </div>

                    <div className="QServices">
                        <button className="viewall" onClick={() => navigate("/serviceproviderprofileedit")}> Edit Profile </button>
                        <button className="updates"> Update Availability </button>
                        <button className="logouts" onClick={() => {
                            localStorage.removeItem("userId");
                            sessionStorage.removeItem("userId");
                            navigate("/serviceproviderlogin");
                        }}> Logout</button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ProfileDashboard;