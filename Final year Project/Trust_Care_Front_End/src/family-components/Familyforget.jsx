import Header from "../Header/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 


function Familyforget(){
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        createpassword: "",
        confirmpassword:""
    });
    
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    // ✅ NEW: show/hide password states
    const [showCreate, setShowCreate] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };
    
    const validate = () => {
        let newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }
        if (!formData.createpassword.trim()) {
            newErrors.createpassword = "Password is required";
        } else if (formData.createpassword.length < 6) {
            newErrors.createpassword = "Password must be at least 6 characters";
        }
        if (!formData.confirmpassword.trim()) {
            newErrors.confirmpassword = "Confirm password is required";
        } else if (formData.createpassword !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return newErrors;
    };
    
    const handleLogin = () => {
        const validationErrors = validate();
        setTouched({
            username: true,
            createpassword: true,
            confirmpassword: true,
            check: true
        });
        if (Object.keys(validationErrors).length === 0) {
            navigate("/familylogin");
        }
    };
    
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
                                <label htmlFor='username'>Choose user Name : <span className='star'>*</span></label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='Enter your Full Name'
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.username && errors.username ? 'input-error' : ''}
                                />
                                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
                            </div>

                            {/* ✅ CHANGED: Create Password with eye toggle */}
                            <div className='row'>
                                <label htmlFor='create_password'>Create Password : <span className='star'>*</span></label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={showCreate ? "text" : "password"}
                                        id='create_password'
                                        name='createpassword'
                                        placeholder='Enter Strong Password'
                                        value={formData.createpassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={touched.createpassword && errors.createpassword ? 'input-error' : ''}
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
                                {touched.createpassword && errors.createpassword && <p className="error-text">{errors.createpassword}</p>}
                            </div>

                            {/* ✅ CHANGED: Confirm Password with eye toggle */}
                            <div className='row'>
                                <label htmlFor='confirm_password'>Confirm Password : <span className='star'>*</span></label>
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        id='confirm_password'
                                        name='confirmpassword'
                                        placeholder='Re-enter password'
                                        value={formData.confirmpassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={touched.confirmpassword && errors.confirmpassword ? 'input-error' : ''}
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
                                {touched.confirmpassword && errors.confirmpassword && <p className="error-text">{errors.confirmpassword}</p>}
                            </div>

                            <button className='next' onClick={handleLogin}>Submit & Login</button>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    );
}

export default Familyforget;