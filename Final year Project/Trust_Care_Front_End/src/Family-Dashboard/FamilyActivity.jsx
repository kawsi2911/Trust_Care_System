import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./FamilyActivity.css"


function FamilyActivity(){

    const navigate = useNavigate();
    
    return(
        <>
            <Header/>

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


                    <div className = "button-section">
                        <button onClick={()=>navigate("/familyhome")}> Home </button>
                        <button onClick = {()=>navigate("/familyservice")}> Service </button>
                        <button onClick = {()=>navigate("/familynotification")}> Notifications </button>
                        <button onClick = { ()=>navigate("/familyactivity")}> Activity </button>
                        <button onClick = {()=>navigate("/familyprofiles")}> Profile </button>
                    </div>

                    <div className = "job-group">
                    
                        <div className = "job12">
                            <p className = "numbers"> Rs.450K
                                <p className = "texts">Total earned</p>
                            </p>
                        </div>
                        
                        <div className = "job11">
                            <p className = "numbers">12 
                                <p className = "texts">Completed</p>
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
                           <p className="service-title">⚡ Active – Elder Care</p>
                            <p><strong>Provider:</strong> Arun</p>
                            <p><strong>Started:</strong> Mar 4, 2026</p>
                            <p><strong>Duration:</strong> Monthly</p>
                            <p><strong>Status:</strong> In progress</p>

                            <button className = "inProgress"> Active </button>
                        </div>

                        <div className="button-row">
                             <button className="contactprovider"> Contact Provider</button>
                            <button className="markCompletes"> View Details</button>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">
                            
                            <p className="service-title">🔃 Pending Payment - Hospital Patient Care</p>
                            <p><strong>Provider:</strong> Arun</p>
                            <p><strong>Duration:</strong> 1 week</p>
                            <p><strong>Completed:</strong> jan 4, 2025</p>
                            <p><strong>Payment:</strong> Rs.24000 (Pending)</p>

                            <button className = "makepayment" onClick = {()=>navigate("/makepayment")}> 💰Make Payment </button>

                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers">

                            <p className="service-title">✔️ Completed - Child Care</p>
                            <p><strong>Provider:</strong> Ragul</p>
                            <p><strong>Duration:</strong> 2 week</p>
                            <p><strong>Completed:</strong> jan 4, 2025</p>
                            <p><strong>Payment:</strong> Rs.24000 (Paid)</p>

                            <button className = "makepayment" onClick = {()=>navigate("/rate")}> ⭐ Rate Service</button>

                        </div>

                    </div>
                
                </div>
                
            </div>
        
        
        </>

    )
}

export default FamilyActivity;