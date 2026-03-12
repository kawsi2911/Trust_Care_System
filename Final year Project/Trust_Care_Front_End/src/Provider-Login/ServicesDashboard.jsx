import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom"; 
import "./ServicesDashboard.css";

function ServicesDashboard(){

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
                        <button onClick={() => navigate("/serviceproviderdashboard")}> Home </button>
                        <button onClick = {() => navigate("/servicesdashboard")}> Service </button>
                        <button onClick={()=>navigate("/notificationdashboard")}> Notifications </button>
                        <button onClick={()=>navigate("/activitydashboard")}> Activity </button>
                        <button onClick={()=>navigate("/profiledashboard")}> Profile </button>
                    </div>

                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title">⚡ Active – Elder Care</p>
                            <p><strong>Client:</strong> Arun</p>
                            <p><strong>Location:</strong> Galle</p>
                            <p><strong>Started:</strong> Mar 4, 2026</p>
                            <p><strong>Duration:</strong> Monthly</p>
                            <p><strong>Rate:</strong> Rs. 75,000/month</p>

                            <button className = "inProgress"> In Progress </button>
                        </div>

                        <div className="button-row">
                             <button className="contactFamily"> Contact Family</button>
                            <button className="markComplete"> Mark Complete</button>
                        </div>

                    </div>
                    
                    <div className = "container">

                        <div className = "containers">
                           <p className="service-title">⚡ Active – Child Care</p>
                            <p><strong>Client:</strong> Arun</p>
                            <p><strong>Location:</strong> Galle</p>
                            <p><strong>Started:</strong> Mar 4, 2026</p>
                            <p><strong>Duration:</strong> Part time (Daily)</p>
                            <p><strong>Rate:</strong> Rs. 75,000/month</p>

                            <button className = "inProgress"> In Progress </button>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default ServicesDashboard;