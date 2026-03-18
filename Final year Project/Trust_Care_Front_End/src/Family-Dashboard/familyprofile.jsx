import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import profile from "../assets/profile.png";

function familyprofile(){

    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [stats, setStats] = useState({ totalServices: 0, completed: 0, reviewsGiven: 0 });

    useEffect(() => {
        const userId =
            localStorage.getItem("userId") ||
            sessionStorage.getItem("userId");

        if (!userId) {
            navigate("/familylogin");
            return;
        }

        // Fetch family profile
        fetch(`http://localhost:5000/api/family/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.log(err));

        // ✅ Fetch real stats from bookings
        fetch(`http://localhost:5000/api/service-request/family-bookings/${userId}`)
            .then(res => res.json())
            .then(data => {
                const bookings = data.bookings || [];
                const totalServices = bookings.length;
                const completed = bookings.filter(b =>
                    ["completed", "paid", "reviewed"].includes(b.status)
                ).length;
                const reviewsGiven = bookings.filter(b => b.status === "reviewed").length;
                setStats({ totalServices, completed, reviewsGiven });
            })
            .catch(err => console.log(err));

    }, [navigate]);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    };

    return(
        <>
            <Header/>
            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Service Taker Dashboard</p>
                        </div>
                        <div className="Logout">
                            <button onClick={() => navigate("/")}>➜] Logout</button>
                        </div>
                    </div>

                    <div className="button-section">
                        <button onClick={() => navigate("/familyhome")}> Home </button>
                        <button onClick={() => navigate("/familyservice")}> Service </button>
                        <button onClick={() => navigate("/familynotification")}> Notifications </button>
                        <button onClick={() => navigate("/familyactivity")}> Activity </button>
                        <button onClick={() => navigate("/familyprofiles")}> Profile </button>
                    </div>

                    <div className="container-image">
                        <div className="containers0012">
                            <img src={profile} alt="profile" className="profiles-image" />
                            <div className="Text-image">
                                <p className="provider-name"><strong>Personal Information</strong></p>
                                <p><strong>Name : </strong> {user.familyFullName}</p>
                                <p><strong>Email : </strong> {user.email}</p>
                                <p><strong>Phone : </strong> {user.phone}</p>
                                <p><strong>NIC : </strong>{user.familynic}</p>
                                <p><strong>Address : </strong>{user.address}</p>
                                <p><strong>Member since : </strong> {formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Real stats from MongoDB */}
                    <div className="job-group">
                        <div className="job12">
                            <p className="numbers">{stats.totalServices}
                                <p className="texts">Total Services</p>
                            </p>
                        </div>
                        <div className="job11">
                            <p className="numbers">{stats.completed}
                                <p className="texts">Completed</p>
                            </p>
                        </div>
                        <div className="job13">
                            <p className="numbers">{stats.reviewsGiven}
                                <p className="texts">Reviews Given</p>
                            </p>
                        </div>
                    </div>

                    {/* ✅ Removed extra Logout button */}
                    <div className="QServices">
                        <button className="viewall" onClick={() => navigate("/familyprofieedit")}>
                            Edit Profile
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default familyprofile;