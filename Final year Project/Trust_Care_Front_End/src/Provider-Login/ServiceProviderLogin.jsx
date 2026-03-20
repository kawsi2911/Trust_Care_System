import { useState } from "react";
import Header from "../Header/Header";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderLogin.css";

function ServiceProviderLoginWithOTP(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        createpassword: "",
        confirmpassword: "",
        check: false,
    });

    const [otpData, setOtpData] = useState({
        otpSent: false,
        otp: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({}); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
        }
        else if (formData.createpassword.length < 6){
            newErrors.createpassword = "Password must be at least 6 characters";
        }   
        if (!formData.confirmpassword.trim()) {
            newErrors.confirmpassword = "Please confirm your password";
        }   
        else if (formData.createpassword !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
        }   
        if (!formData.check) {
            newErrors.check = "You must agree to Terms & Conditions";
        }   
        
        setErrors(newErrors);
        return newErrors;
    }

    // Step 1: Send OTP
    const sendOTP = async () => {
        const previousData = JSON.parse(localStorage.getItem("serviceData"));
        if (!previousData || !previousData.email) {
            Swal.fire({
                icon: "error",
                title: "No Email Found",
                text: "Please complete the previous steps first",
            });
            navigate("/serviceprovider1");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/service/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: previousData.email })
            });

            const data = await res.json();
            if (res.ok) {
                setOtpData({ ...otpData, otpSent: true });
                Swal.fire({ icon: "success", title: "OTP Sent", text: `Check your email: ${previousData.email}` });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: data.message });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.message });
        }
    };

    // Step 2: Verify OTP
    const verifyOTPAndRegister = async () => {
        const previousData = JSON.parse(localStorage.getItem("serviceData"));
        if (!previousData || !previousData.email) return;

        try {
            const res = await fetch("http://localhost:5000/api/service/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: previousData.email, otp: otpData.otp })
            });

            const data = await res.json();
            if (!res.ok) {
                Swal.fire({ icon: "error", title: "OTP Verification Failed", text: data.message });
                return;
            }

            // OTP verified → submit registration
            await submitRegistration(previousData);

        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.message });
        }
    };

    // Step 3: Submit registration
    const submitRegistration = async (previousData) => {
        const combinedData = {
            ...previousData,
            username: formData.username,
            password: formData.createpassword,
        };

        try {
            const res = await fetch("http://localhost:5000/api/service/providerregister", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(combinedData),
            });

            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { data = { message: text }; }

            if (res.ok) {
                localStorage.removeItem("serviceData");
                Swal.fire({
                    icon: "success",
                    title: "Registration Complete 🎉",
                    text: "Your account has been created successfully",
                    confirmButtonText: "Go to Login"
                }).then(() => navigate("/serviceproviderloginpage"));
            } else {
                Swal.fire({ icon: "error", title: "Error", text: data.message || "Something went wrong" });
            }

        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.message });
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();

        setTouched({
            username: true,
            createpassword: true,
            confirmpassword: true,
            check: true,
        });

        const validationErrors = validate();
        if (Object.keys(validationErrors).length !== 0) return;

        if (!otpData.otpSent) {
            // Send OTP first
            await sendOTP();
        } else {
            // Verify OTP & register
            await verifyOTPAndRegister();
        }
    };

    return(
        <>
            <Header />
            <div className='Servicelogin'>
                <div className="login_Container">

                    <div className="First">
                        <p className="Head"> ✔️Registration Complete!</p>
                        <p className="Body">Create your login credentials & verify OTP</p>
                    </div>

                    <div className='form'>
                        <div className='form-fill'>

                            <div className='row'>
                                <label htmlFor='username'>Choose Username: <span className='star'>*</span></label>
                                <input type='text' id='username' name='username' placeholder='Enter your username' value={formData.username} onChange={handleChange} onBlur={handleBlur} className={touched.username && errors.username ? "input-error" : ""} />
                                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
                            </div>

                            <div className='row'>
                                <label>Create Password: <span className='star'>*</span></label>
                                <input type='password' name='createpassword' value={formData.createpassword} onChange={handleChange} onBlur={handleBlur} className={touched.createpassword && errors.createpassword ? "input-error" : ""} />
                                {touched.createpassword && errors.createpassword && <p className="error-text">{errors.createpassword}</p>}
                            </div>

                            <div className='row'>
                                <label>Confirm Password: <span className='star'>*</span></label>
                                <input type='password' name='confirmpassword' value={formData.confirmpassword} onChange={handleChange} onBlur={handleBlur} className={touched.confirmpassword && errors.confirmpassword ? "input-error" : ""} />
                                {touched.confirmpassword && errors.confirmpassword && <p className="error-text">{errors.confirmpassword}</p>}
                            </div>

                            <div className='row'>
                                <input type='checkbox' name='check' checked={formData.check} onChange={handleChange} /> I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a>
                                {touched.check && errors.check && <p className="error-text">{errors.check}</p>}
                            </div>

                            {/* OTP Input */}
                            {otpData.otpSent && (
                                <div className='row'>
                                    <label>Enter OTP: <span className='star'>*</span></label>
                                    <input type='text' name='otp' value={otpData.otp} onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })} placeholder='Enter the 6-digit OTP' />
                                </div>
                            )}

                            <button className='next' onClick={handleNext}>
                                {otpData.otpSent ? "Verify OTP & Complete Registration" : "Send OTP"}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProviderLoginWithOTP;