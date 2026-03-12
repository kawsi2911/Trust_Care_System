import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderDashboard.css";

function ServiceProviderDashboard(){

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

                    <div className = "First">

                        <p className = "Head"> Welcome, kawsi 👋</p>


                    </div>

                    <div className = "button-section">
                        <button onClick={()=>navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick = {()=>navigate("/servicesdashboard")}> Service </button>
                        <button onClick = {()=>navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={()=>navigate("/activitydashboard")}> Activity </button>
                        <button onClick ={()=>navigate("/profiledashboard")}> Profile </button>
                    </div>

                    <div className = "job-group">

                        <div className = "job1">
                            <p className = "number">15 
                                <p className = "text">Total Jobs</p>
                            </p>
                        </div>

                        <div className = "job2">
                            <p className = "number">3 
                                <p className = "text">Active Now</p>
                            </p>
                        </div>

                        <div className = "job3">
                            <p className = "number">2 
                                <p className = "text">Pending</p>
                            </p>

                        </div>

                    </div>

                    <div className = "NewService">
                        <div className = "service-content">
                            <div>
                                <p className = "text">🔔 New Service Request!!</p>
                                <p className = "Family"> A Family in Galle needs elder care service</p>
                            </div>

                            <button className = "views"> View Request </button>
                        </div>
                    </div>


                    <div className = "QuickService">
                        <div className = "services">
                            Quick Services
                        </div>
                        <div className = "QServices">
                            <button className = "viewall" onClick = {()=>navigate("/notificationdashboard")}> View All Requests </button>
                            <button className = "updates"> Update Availability </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default ServiceProviderDashboard;