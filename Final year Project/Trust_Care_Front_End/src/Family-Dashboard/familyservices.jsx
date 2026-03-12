import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./familyservices.css";

function familyservices(){

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

                    <div className = "button-section">
                        <button onClick={()=>navigate("/familyhome")}> Home </button>
                        <button onClick = {()=>navigate("/familyservice")}> Service </button>
                        <button onClick = {()=>navigate("/familynotification")}> Notifications </button>
                        <button onClick = { ()=>navigate("/familyactivity")}> Activity </button>
                        <button onClick = {()=>navigate("/familyprofiles")}> Profile </button>
                    </div>

                    <div className = 'User-bodys'>

                        <button className = 'Body11' onClick={() => navigate("/familyservicerequest")}>
                            <div className = 'emojis'>👴</div>
                            <p className = 'heads'>Elder Care</p>
                            <p className = 'smalls'>Professional care for the Elderly Family members </p>
                        </button>

                        <button className = 'Body21'onClick ={() =>navigate("/familyservicerequest")}>
                            <div className = 'emojis'>👶</div>
                            <p className = 'heads'>Child Care/Babysitting</p>
                            <p className = 'smalls'>Trusted Caregivers for your Childern</p>
                        </button>

                         <button className = 'Body3'onClick ={() =>navigate("/familyservicerequest")}>
                            <div className = 'emojis'>🏥</div>
                            <p className = 'heads'>Hospital Patient Care</p>
                            <p className = 'smalls'>Support for the patients in hospitals</p>
                        </button>

                         <button className = 'Body4'onClick ={() =>navigate("/familyservicerequest")}>
                            <div className = 'emojis'>🏠</div>
                            <p className = 'heads'>Home Patient Care</p>
                            <p className = 'smalls'>Care for the patients recovering at home</p>
                        </button>
                        
                    </div>



                </div>
            </div>
        </>
    )
}

export default familyservices;