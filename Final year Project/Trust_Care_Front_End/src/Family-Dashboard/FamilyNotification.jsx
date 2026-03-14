import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./Familynotification.css";
import { useEffect, useState } from "react";
import axios from "axios";

function FamilyNotification(){

    const navigate = useNavigate();
    const [notifications,setNotifications] = useState([]);

    useEffect(()=>{

        const fetchNotifications = async () => {

            try{

                const familyId =
                  localStorage.getItem("userId") ||
                  sessionStorage.getItem("userId");

                const response = await axios.get(
                  `http://localhost:5000/api/notifications/${familyId}`
                );

                // latest notification first
                setNotifications(response.data);

            }catch(error){
                console.error("Error fetching notifications",error);
            }

        };

        fetchNotifications();

    },[]);


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

                    <div className = "button-section">
                        <button onClick={()=>navigate("/familyhome")}> Home </button>
                        <button onClick = {()=>navigate("/familyservice")}> Service </button>
                        <button onClick = {()=>navigate("/familynotification")}> Notifications </button>
                        <button onClick = { ()=>navigate("/familyactivity")}> Activity </button>
                        <button onClick = {()=>navigate("/familyprofiles")}> Profile </button>
                    </div>

                    
                    {/* Dynamic Notifications */}

                    {notifications.map((note)=>(
                        <div className="callprovider" key={note._id}>

                            <p className="provider-name">
                                <strong>🔔 {note.title}</strong>
                            </p>

                            <div className="summary">
                                <p>{note.message}</p>
                                <p>{new Date(note.createdAt).toLocaleString()}</p>
                            </div>

                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <p style={{textAlign:"center",marginTop:"20px"}}>
                            No Notifications Yet
                        </p>
                    )}


                    <div className = "NewService">
                        <div className = "service-content">
                            <div>
                                <p className = "text">🔔Providers Available!!</p>
                                <p> 4 caregivers have responded to your request</p>
                                <button className = "view-providers" onClick={()=>navigate("/caregiver")}> View Available Providers </button>
                                <p>2 minutes ago</p>
                            </div>

                        </div>
                    </div>

                    <div className = "callprovider">
                        <p className = "provider-name"><strong> 🎉Booking Confirmed !</strong></p>

                            <div className="summary">
                                <p>Zain Ferenando has been hired for Elder Care Service</p>
                                <button className = "view-details" onClick = {()=>navigate("/familyactivity")}> View Details </button>
                                <p>Just Now</p>
                            </div>
                    </div>

                    <div className = "booking-container">
                            
                            <p className = "provider-name"><strong>✉️ Message from Provider</strong></p>

                            <div className="summary">
                                <p>Zain Fernando: "Thank you for choosing me. I'LL contact you tommorrow morning"</p>
                                <p>yesterday</p>
                            </div>

                    </div>


                </div>
            </div>

        </>
    )
}

export default FamilyNotification;