import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./FindingCaregiver.css";
import { useEffect } from "react";

function FindingCaregiver(){

    const navigate = useNavigate();

    useEffect(() =>{
        const timer = setTimeout(()=>{
            navigate("/availableprovider");
        },60000);

        return() =>clearTimeout(timer);
    }, [navigate]);

    return(
        <>
            <Header/>
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Finding Caregivers........</p>

                    

                    <div className = "body01">
                        
                        <p className = "refresh">🔃</p>
                        
                        <p className = "paragraph">Searching for provider near you.............</p>

                        <div className="details">
                            <p><strong>Location :</strong> Jaffna</p>
                            <p><strong>Service Type :</strong> Elder Care</p>
                            <p><strong>Search Radius :</strong> 10 km</p>
                        </div>
                    
                    </div>

                    <div className = "body022">
                        <p className ="title"> ✔️ Request sent by nearest providers</p>
                        <p className ="body-title"> ✔️ Waiting for the responses....</p>
                        <p className = "footer-body">This is Takes 1 - 3 Minutes</p>
                    </div>

                </div>
            </div>
        </>
    )

}
export default FindingCaregiver;