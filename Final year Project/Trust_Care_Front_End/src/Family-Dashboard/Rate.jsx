import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom";
import "./Rate.css";

function Rate(){

    const navigate = useNavigate();

    return(
        <>
            <Header/>

            <div className = "ServiceProviderSection">
                <div className = "ServiceProviderSection2">

                    <div className = "name">
                        
                        <div className = "heading-head">
                            <p className = "Head">Rate your Experience</p>
                        </div>
                        
                        
                        <div className = "Logout">
                            <button onClick = {()=>navigate("/")}>➜] Logout</button>
                        </div>
                    </div>

                    <div className = "container-image">
                        
                        <p className = "selected">Selected Caregiver</p>
                                            
                        <div className = "containers0012">   
                            
                            <img src = {profile} alt = 'profile' className = 'profiles-image' />
                                        
                            <div className = "Text-image">
                                <p className = "provider-name"><strong>Zain Fernando</strong></p>
                                <p><strong>⭐⭐⭐⭐⭐</strong></p>
                                <p>Experience : 5 years </p>
                                <p>Location : 2.5 km away </p>
                            </div>
                    
                        </div>
                    
                    </div>

                    <div className = "contain">
                        <p className = "selected">How would you rate this service?</p>
                        <p className = "starts"> ⭐⭐⭐⭐⭐</p>
                    </div>

                    <div className = "container-image">
                        
                        <p className = "heading-options">Write your reviews</p>
                        
                        <div className='row'>
                            <textarea id = 'Address' name = 'Address' rows="3" placeholder='Share your experience with this caregiver. your review helps other families make better decisions....'></textarea>
                        </div>

                        <p className = "heading-options">Would you like to recommend this caregiver?</p>

                        <div className = 'card-options'>
                            <input type = 'radio' id = 'yes' name = 'payment' /> <label htmlFor = 'yes'>Yes, Definitely</label>
                            <input type = 'radio' id = 'maybe' name = 'payment' /> <label htmlFor = 'maybe'>May be</label>
                            <input type = 'radio' id = 'no' name = 'payment' /> <label htmlFor = 'no'>No</label>
                        </div>

                        <p className = "heading-options">Rate Specific Aspects</p>
                        <div className="ratings-category">
                            <p>Professionalism : ⭐⭐⭐⭐⭐</p>
                        <p>Punctuality : ⭐⭐⭐⭐⭐</p>
                        <p>Communication : ⭐⭐⭐⭐⭐</p>
                        <p>Quality of Care : ⭐⭐⭐⭐⭐</p>
                        </div>

                        <div className = "QServices">
                            <button className = "confirm" onClick={()=>navigate("/familyhome")}> Submit Review </button>
                            <button className = "logout-btn" onClick = {()=>navigate("/availableprovider")}> Skips for now </button>
                        </div>
                        
                    </div>
                    

                </div>
            </div>
        </>
    )

}

export default Rate;