import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import profile from "../assets/profile.png";

function familyprofile(){

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

                    <div className = "container-image">
                                        
                        <div className = "containers0012">   
                            
                            <img src = {profile} alt = 'profile' className = 'profiles-image' />
                                                            
                            <div className = "Text-image">
                                <p className = "provider-name"><strong>Personal Information</strong></p>
                                <p><strong>Name : </strong> Zarah Mehar</p>
                                <p><strong>Email : </strong> Zarah.mehar@gmail.com </p>
                                <p><strong>Phone : </strong> +94 71 234 5678</p>
                                <p><strong>NIC : </strong>923340750V</p>
                                <p><strong>Address : </strong>456, Galle Fort, Galle</p>
                                <p><strong>Member since : </strong> Jan 2025</p>
                            </div>
          
                        </div>                    

                    </div>

                    <div className = "job-group">
                    
                        <div className = "job12">
                            <p className = "numbers"> 8
                                <p className = "texts">Services</p>
                            </p>
                        </div>
                        
                        <div className = "job11">
                            <p className = "numbers">Rs.350K
                                <p className = "texts">Active Now</p>
                            </p>
                        </div>

                        <div className = "job13">
                            <p className = "numbers">5
                                <p className = "texts">Reviews Given</p>
                            </p>
                        </div>
                    
                    </div>

                    <div className = "QServices">
                        <button className = "viewall" onClick = {()=>navigate("/familyhome")}> Edit Profile </button>
                        <button className = "updates" onClick = {()=>navigate("/familyhome")}>Change Password </button>
                        <button className = "confirm" onClick={()=>navigate("/")}> Privacy Settings </button>
                        <button className = "logout-btn" onClick = {()=>navigate("/")}> Logout </button>
                    </div>

                </div>
            </div>
        </>
    )

}

export default familyprofile;