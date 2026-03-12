import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./familyhome.css";


function familyhome(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <div className = "ServiceProviderSection">
                <div className = "ServiceProviderSection2">

                    <div className = "name">
                        <div className="heading-head">
                             <p className = "Head">Service Taker Dashboard</p>
                        </div>
                       
                         <div className = "Logout">
                            <button onClick = {()=>navigate("/")}>➜] Logout</button>
                        </div>
                    </div>

                    <div className = "First">
                        <p className = "Head"> Welcome, kawsi 👋</p>
                    </div>

                    <div className = "button-section">
                        <button onClick={()=>navigate("/familyhome")}> Home </button>
                        <button onClick = {()=>navigate("/familyservice")}> Service </button>
                        <button onClick = {()=>navigate("/familynotification")}> Notifications </button>
                        <button onClick = { ()=>navigate("/familyactivity")}> Activity </button>
                        <button onClick = {()=>navigate("/familyprofiles")}> Profile </button>
                    </div>

                    <div className = "container01">

                        <div className = "service-containers">
                            <p className="service-title">Need a Care Service?</p>
                            <p>Find the qualified caregivers near you in minutes</p>
                            <button className="requestnow" onClick = {()=>navigate("/familyservicerequest")}> Request Service Now </button>
                        </div>

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
                                <p className = "text">Total Jobs</p>
                            </p>

                        </div>

                    </div>

                     <div className = "container">

                        <div className = "containers">
                           <p className="service-title">Recent Activity</p>
                            <p>✔️ Elder Care - Completed (3 days ago)</p>
                            <p> ⌛Child Care - Inprogress</p>
                            <p> 📝Hospital Care - Scheduled</p>
                        </div>

                    </div>

                    
                </div>
            </div>
        </>

    )
       
}

export default familyhome;