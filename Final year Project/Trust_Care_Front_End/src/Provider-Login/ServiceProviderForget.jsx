import Header from "../Header/Header";
import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import "./ServiceProviderLogin.css";

function ServiceProviderForget(){
    
    const navigate = useNavigate();

    // ✅ NEW: show/hide password states
    const [showCreate, setShowCreate] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return(
        <>
            <Header />
            <div className='Servicelogin'>
                <div className="login_Container">

                    <div className="name">
                        <p className="Head" style={{ textAlign: "center" }}>Forget Password Credentials</p>
                    </div>

                    <div className='form'>
                        <div className='form-fill'>

                            <div className='row'>
                                <label htmlFor='username'>Choose User Name : <span className='star'>*</span></label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='Enter your Full Name'
                                />
                            </div>

                            {/* ✅ CHANGED: Create Password with eye toggle */}
                            <div className='row'>
                                <label htmlFor='create_password'>Create Password : <span className='star'>*</span></label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={showCreate ? "text" : "password"}
                                        id='create_password'
                                        name='create_password'
                                        placeholder='Enter Strong Password'
                                        style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
                                    />
                                    <span
                                        onClick={() => setShowCreate(!showCreate)}
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "1.1rem",
                                            userSelect: "none"
                                        }}
                                    >
                                        {showCreate ? "🙈" : "👁️"}
                                    </span>
                                </div>
                            </div>

                            {/* ✅ CHANGED: Confirm Password with eye toggle */}
                            <div className='row'>
                                <label htmlFor='confirm_password'>Confirm Password : <span className='star'>*</span></label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        id='confirm_password'
                                        name='confirm_password'
                                        placeholder='Re-enter password'
                                        style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
                                    />
                                    <span
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "1.1rem",
                                            userSelect: "none"
                                        }}
                                    >
                                        {showConfirm ? "🙈" : "👁️"}
                                    </span>
                                </div>
                            </div>

                            <button className='next' onClick={() => navigate("/serviceproviderloginpage")}>
                                Submit & Login
                            </button>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    );
}

export default ServiceProviderForget;