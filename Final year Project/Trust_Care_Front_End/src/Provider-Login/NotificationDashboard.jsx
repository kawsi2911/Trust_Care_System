import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import "./NotificationDashboard.css";

function NotificationDashboard(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
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
                        <button onClick={()=>navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick = {()=>navigate("/servicesdashboard")}> Service </button>
                        <button onClick = {()=>navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={()=>navigate("/activitydashboard")}> Activity </button>
                        <button onClick={()=>navigate("/profiledashboard")}> Profile </button>
                    </div>

                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title">🔔 New Request – Elder Care</p>
                            <p><strong>Location :</strong> Galle</p>
                            <p><strong>Patient :</strong> 75 years old</p>
                            <p><strong>Duration :</strong> Full time (Monthly)</p>
                            <p><strong>Rate Offered:</strong> Rs.75000/month</p>
                            <p><strong>Posted:</strong> 2 hours ago</p>
                        </div>

                        <div className="button-row">
                            <button className="cando">✔️ &nbsp; I Can Do </button>
                            <button className="decline">❌ &nbsp; Decline </button>
                        </div>

                    </div>
                    
                    <div className = "container">

                        <div className = "containers">
                            <p className="service-title">⌛ Waiting – Child Care</p>
                            <p><strong>Status:</strong> You Clicked "I can Do"</p>
                            <p><strong>Location:</strong> Galle</p>
                            <p><strong>Waiting:</strong> Family is reviewing providers</p>
                            <p><strong>Accepted:</strong> 1 day ago</p>

                            <button className = "pending"> Pending Selection </button>
                        </div>

                    </div>

                    <div className = "notifications">
                        
                        <div className = "containers">
                            <p className="service-title">🎉You're Hired !</p>
                            <p>Family selected you for Hospital Patient Care Service Galle</p>
                        </div>

                        <div className="button-row">
                            <button className="can"> View Full Details </button>
                        </div>

                    </div>


                </div>
            </div>
        </>
    )
}

export default NotificationDashboard;