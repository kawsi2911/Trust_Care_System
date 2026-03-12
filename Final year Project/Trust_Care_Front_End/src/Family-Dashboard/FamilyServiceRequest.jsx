import Header from "../Header/Header";
import "./FamilyServiceRequest.css";
import {useNavigate} from "react-router-dom";

function FamilyServiceRequest(){

    const navigate = useNavigate();

    return(
        <>
            <Header />

            <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Request Form (1/2)</p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'PatientType'> Patient Type : <label className='star'> * </label> </label>
                                <select className = "service-dropdown">
                                    <option value="">--Select the patient Type --</option>
                                    <option value="eldercare">Elder Care</option>
                                    <option value="childcare">Child Care/ Babysitter</option>
                                    <option value="hospitalcare">Hospital Patient Care</option>
                                    <option value="homecare">Home Patient Care</option>
                                </select>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'P-Name'>Patient Name : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'P-Name' name = 'P-Name' placeholder = 'Enter the Patient Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'relationship'>Relationship with Patient : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'relationship' name = 'relationship' placeholder = 'eg. Father/mother/grandparent' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'P-age'>Patient Age : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'P-age' name = 'P-age' placeholder = 'age in years' />
                            </div>

                            <div className = 'row'>
                                <label> Gender of Patient: <label className='star'> * </label> </label>
                                <div className = 'gender-options'>
                                    <input type = 'radio' id = 'Male' name = 'Gender' /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'Gender' /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'Gender' /> <label htmlFor = 'Other'>Other</label>
                                </div>
                            </div>

                            <div className = 'row'>
                                <label> Duration Service Wanted : <label className='star'> * </label> </label>
                                <div className = 'Service-options'>
                                    <input type = 'radio' id = 'Hourly' name = 'Service' /> <label htmlFor = 'Hourly'>Hourly</label>
                                    <input type = 'radio' id = 'Day'  name = 'Service' /> <label htmlFor = 'Day'>Day</label>
                                    <input type = 'radio' id = 'Weekly' name = 'Service' /> <label htmlFor = 'Weekly'>Weekly</label>
                                    <input type = 'radio' id = 'Monthly' name = 'Service' /> <label htmlFor = 'Monthly'>Monthly</label>
                                </div>
                            </div>


                            <button className = 'next' onClick={() => navigate("/familyservicerequest2")} > Next Step </button>
                            <p className = 'step'>Step 1 of 2</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FamilyServiceRequest;