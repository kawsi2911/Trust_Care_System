import Header from "../Header/Header";
import "./FamilyServiceRequest2.css";
import { useNavigate } from "react-router-dom";

function FamilyServiceRequest2(){

    const navigate = useNavigate();
    
    return(
         <>
            <Header />

            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Request Form (2/2)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'S-Location'>Service Location (City): <label className='star'> * </label> </label>
                                <input type = 'text' id = 'S-Location' name = 'S-Location' placeholder = 'Enter the Patient Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Full-Address'>Full Address : <label className='star'> * </label> </label>
                                <textarea id = 'Address' name = 'Address' placeholder='Enter your complete address where is needed'></textarea>
                            </div>

                            <div className = 'row'>
                                <label>Any Disabilities : <label className='star'> * </label> </label>
                                <div className = 'Service-options'>
                                    <input type = 'radio' id = 'Yes' name = 'Yes' /> <label htmlFor = 'Yes'>Yes</label>
                                    <input type = 'radio' id = 'No'  name = 'No' /> <label htmlFor = 'No'>No</label>
                                </div>
                            </div>
                            
                            <div className = "yess">
                                <textarea id = 'Address' name = 'Address' cols="118"  rows ="5" placeholder = 'Any special requirements, timing preferences, or additional information'></textarea>
                            </div>
                 

                            <div className = 'row'>
                                <label> Preferred Caregiver Gender : <label className='star'> * </label> </label>
                                <div className = 'gender-options'>
                                    <input type = 'radio' id = 'Male' name = 'Gender' /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'Gender' /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'Gender' /> <label htmlFor = 'Other'>No Preferences</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'A-Requirements'>Additional Requirements / Notes : <label className='star'> * </label> </label>
                                <textarea id = 'Address' name = 'additionalRequirement' placeholder='If yes, Describe the Disabilities or medical conditions'></textarea>
                            </div>

    
                           

                            <button className = 'finishes' onClick={() => navigate("/findingcareprovider")} > Submit Request </button>
                            <button className = 'previous' onClick={()=> navigate("/familyservicerequest")}> Previous </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FamilyServiceRequest2;