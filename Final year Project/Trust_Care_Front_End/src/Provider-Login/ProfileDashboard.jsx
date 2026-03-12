import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import profile from '../assets/profile.png';
import "./ProfileDashboard.css";


function ProfileDashboard(){

    const navigate = useNavigate();
    return(
        <>
            <Header/>
            <div className = "ServiceProviderSection">
                <div className = "ServiceProviderSection2">

                    <div className = "name">
                        <div className="heading-head">
                             <p className = "Head">Service Provider Dashboard</p>
                        </div>
                       
                         <div className = "Logout">
                            <button onClick = {()=>navigate("/")}>➜] Logout</button>
                        </div>
                    </div>


                    <div className = "button-section">
                        <button onClick={() => navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick = {() => navigate("/servicesdashboard")}> Service </button>
                        <button onClick={()=>navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={()=>navigate("/activitydashboard")}> Activity </button>
                        <button onClick={()=>navigate("/profiledashboard")}> Profile </button>
                    </div>

                    <div className = "profileImage">
                        <img src = {profile} alt = 'profile' className = 'profile' />
                        <p className = "profileText"><stong>Kawsi</stong></p>
                        <p className="ratings">⭐⭐⭐⭐⭐ 4.8/5.0 </p>
                        <p className="rating-wording">145 Review | Members Since 2025</p>
                    </div>

                    
                    <div className = "container">
                        
                        <div className = "containers">
                           <p className="service-title">✔️ Completed – Elder Care</p>
                            <p><strong>Email :</strong> Kawsi@gmail.com</p>
                            <p><strong>Phone :</strong> +94 77 123 4567</p>
                            <p><strong>NIC :</strong> 123456789V(Monthly)</p>
                            <p><strong>Age:</strong> 25 years</p>
                            <p><strong>Gender:</strong> Female</p>
                            <p><strong>Address:</strong> 123, Main Street, Galle</p>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title">Services & Experiences</p>
                            <p><strong>Services:</strong></p>

                            <div className = "containers01">
                                <p className = "contain-text">Elder Care</p>
                                <p className = "contain-text">Hospital Patient Care</p>
                            </div>

                            <p><strong>Experience:</strong> 5 years</p>
                            <p><strong>Work Area:</strong> Galle, Matara, Camera</p>
                            <p><strong>Hoursly Rate:</strong> Rs.500 / Hour</p>

                        </div>

                    </div>

                    <div className = "QServices">
                        <button className = "viewall" onClick = {()=>navigate("/serviceproviderprofileedit")}> Edit Profile </button>
                        <button className = "updates"> Update Availability </button>
                        <button className = "logouts" onClick = {()=>navigate("/")}> Logout</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfileDashboard;