import Header from "../Header/Header";
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderLogin.css";

function ServiceProviderForget(){
    
    const navigate = useNavigate();
    

    return(
        <>
            <Header />
            <div className = 'Servicelogin'>
                <div className = "login_Container">

                     <div className = "name">
                        <p className = "Head" style={{ textAlign: "center" }}>Forget Password Credentials</p>
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


                            <button className = 'next' onClick = { ()=>navigate("/serviceproviderloginpage")}> Submit & Login </button>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    )

}

export default ServiceProviderForget;