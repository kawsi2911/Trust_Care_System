import Header from "../Header/Header";
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderLogin.css";

function ServiceProviderLogin(){

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <div className = 'Servicelogin'>
                <div className = "login_Container">

                    <div className = "First">
                        <p className = "Head"> ✔️Registration Complete!</p>
                        <p className = "Body">Now Create your login credentials</p>
                    </div>

                      <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className='row'>
                                <label htmlFor='username'> Choose User Name : <span className='star'>*</span></label>
                                <input type='text' id='username' name='username' placeholder='Enter your Full Name' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'create_password'>Create Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'create_password' name = 'create_password' placeholder = 'Enter Strong Password' />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'confirm_password'>Confirm Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'confirm_password' name = 'confirm_password' placeholder = 'Re-enter password' />
                            </div>

                            <div className = 'row'>
                                <input type = 'checkbox' id = 'check' name = 'check'/> <p className="checked">I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a></p>
                            </div>

                            <button className = 'next' onClick = { ()=>navigate("/serviceproviderloginpage")}> Create Account & Login </button>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    )
}

export default ServiceProviderLogin;