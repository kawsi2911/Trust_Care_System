import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import "./ActivityDashboard.css";


function ActivityDashboard(){

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

                    <div className = "job-group">

                        <div className = "job11">
                            <p className = "numbers">12 
                                <p className = "texts">Completed</p>
                            </p>
                        </div>

                        <div className = "job12">
                            <p className = "numbers"> Rs.450K
                                <p className = "texts">Total earned</p>
                            </p>
                        </div>

                        <div className = "job13">
                            <p className = "numbers">4.8 ⭐
                                <p className = "texts">Avg Ratings</p>
                            </p>

                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title"> ✔️ Completed – Elder Care</p>
                            <p><strong>Client:</strong> Arun</p>
                            <p><strong>Duration:</strong> 1 month</p>
                            <p><strong>Completed:</strong> Mar 4, 2026</p>
                            <p><strong>Payment:</strong> Rs.75000 (Received)</p>
                            <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ 5.0 </p>

                            <p className = "wording">"Excellent service! Very professional and caring"</p>
                        </div>

                    </div>
                    
                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title"> ✔️ Completed – Hospital Patient Care</p>
                            <p><strong>Client:</strong> Arun</p>
                            <p><strong>Duration:</strong> Galle</p>
                            <p><strong>Completed:</strong> Mar 4, 2026</p>
                            <p><strong>Payment:</strong> Part time (Daily)</p>
                            <p><strong>Rating:</strong> ⭐⭐⭐⭐4.5 </p>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default ActivityDashboard;