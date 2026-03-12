import Header from "../Header/Header.jsx";
import {useNavigate} from "react-router-dom";

function FamilyProfileEdit(){
    const navigate = useNavigate();

    return(
        <div>
            <Header/>
             <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Taker Edit Details </p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'Family-FullName'> Full Name : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-FullName' name = 'Family-FullName' placeholder = 'Enter your Full Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-NIC' name = 'Family-NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-Phone'>Contact Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-Phone' name = 'Family-Phone' placeholder = '+94 77 123 4567' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-Email'>Email Address : <label className='star'> * </label> </label>
                                <input type = 'email' id = 'Family-Email' name = 'Family-Email' placeholder = 'example@gmail.com' />
                            </div>

                            <div className = 'row'>
                                <label> Gender : <label className='star'> * </label> </label>
                                <div className = 'gender-options'>
                                    <input type = 'radio' id = 'Male' name = 'Gender' /> <label htmlFor = 'Male'>Male</label>
                                    <input type = 'radio' id = 'Female' name = 'Gender' /> <label htmlFor = 'Female'>Female</label>
                                    <input type = 'radio' id = 'Other' name = 'Gender' /> <label htmlFor = 'Other'>Other</label>
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor = 'Family-FullAddress'>Full Address : <label className='star'> * </label>  </label>
                                <textarea id = 'Family-Address' name = 'Family-Address' placeholder='Enter your complete address with city and postal code'></textarea>
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-City/London'>City / Location : <label className='star'> * </label> </label>
                                <input type = 'text' id = 'Family-City' name = 'Family-City' placeholder = 'eg . Jaffna' />
                            </div>

                             <div className='row'>
                                <label htmlFor='username'> Choose User Name : <span className='star'>*</span></label>
                                <input type='text' disabled  id='username' name='username' placeholder='Enter your Full Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'create_password'>Change Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'create_password' name = 'create_password' placeholder = 'Enter Strong Password' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'confirm_password'>Confirm Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'confirm_password' name = 'confirm_password' placeholder = 'Re-enter password' />
                            </div>


                            <button className = 'next' onClick={() => navigate("/servicetaken")} > Completed </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FamilyProfileEdit;