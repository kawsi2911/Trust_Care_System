import Header from "../Header/Header";
import "./Availableprovider.css";
import { useNavigate } from "react-router-dom";
import profile from '../assets/profile.png';

function Availableprovider(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Available Providers</p>

                    <div className = "First">
                        <p className = "Head"> 3 Available Caregivers Founded..........</p>
                    </div>

                    <div className = "container">

                        <div className = "containers001">

                            <img src = {profile} alt = 'profile' className = 'profiles' />

                            
                            <div className="sample">
                                <p><strong>Zain Fernando</strong></p>
                                <p><strong>⭐⭐⭐⭐⭐ 4.8/5 (145 reviews)</strong></p>
                                <p>Experience : 5 years </p>
                                <p>Distance : 2.5 km away </p>
                                <p>Rate : Rs. 500/hour</p>
                            </div>

                        </div>

                        <div className="button-rows">
                            <button className="viewFullFamily" onClick={()=>navigate("/caregiver")}> View Full Family</button>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers001">

                            <img src = {profile} alt = 'profile' className = 'profiles' />

                            
                            <div className="sample">
                                <p><strong>Zain Fernando</strong></p>
                                <p><strong>⭐⭐⭐⭐⭐ 4.8/5 (145 reviews)</strong></p>
                                <p>Experience : 5 years </p>
                                <p>Distance : 2.5 km away </p>
                                <p>Rate : Rs. 500/hour</p>
                            </div>

                        </div>

                        <div className="button-rows">
                            <button className="viewFullFamily" onClick={()=>navigate("/caregiver")}> View Full Family</button>
                        </div>

                    </div>

                    <div className = "container">

                        <div className = "containers001">

                            <img src = {profile} alt = 'profile' className = 'profiles' />

                            
                            <div className="sample">
                                <p><strong>Zain Fernando</strong></p>
                                <p><strong>⭐⭐⭐⭐⭐ 4.8/5 (145 reviews)</strong></p>
                                <p>Experience : 5 years </p>
                                <p>Distance : 2.5 km away </p>
                                <p>Rate : Rs. 500/hour</p>
                            </div>

                        </div>

                        <div className="button-rows">
                            <button className="viewFullFamily" onClick={()=>navigate("/caregiver")}> View Full Family</button>
                        </div>

                    </div>

                    


                </div>
            </div>
        </>
    )
}

export default Availableprovider;