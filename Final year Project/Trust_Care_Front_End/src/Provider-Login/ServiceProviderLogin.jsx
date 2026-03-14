import { useState } from "react";
import Header from "../Header/Header";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom"; 
import "./ServiceProviderLogin.css";

function ServiceProviderLogin(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        createpassword: "",
        confirmpassword: "",
        check: false,
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

   const handleNext = async (e) => {
    e.preventDefault();

    setTouched({ 
        username: true, 
        createpassword: true, 
        confirmpassword: true, 
        check: true 
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    const previousData = JSON.parse(localStorage.getItem("serviceData"));
    if(!previousData){ 
        Swal.fire({
            icon: 'error',
            title: 'No Service Data Found',
            text: 'Please complete the previous steps before creating login credentials'
        });
        navigate("/serviceprovider1");
        return;
    }

    const combinedData = { 
        ...previousData, 
        username: formData.username,
        password: formData.createpassword    
    };

    console.log("Sending to backend:", combinedData); // check data

    try{
        const res = await fetch("http://localhost:5000/api/service/providerregister", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(combinedData)
        });

        const data = await res.json();

        if(res.ok){
            localStorage.removeItem("serviceData");
            Swal.fire({
                icon: "success",
                title: "Registration Successful 🎉",
                text: "Your account has been created successfully!",
                confirmButtonText: "Go to Login"
            }).then(() => navigate("/serviceproviderloginpage"));
        } else {
            Swal.fire({ icon: "error", title: "Error", text: data.message });
        }
    } catch (error) {
        Swal.fire({ 
            icon: "error", 
            title: "Error", 
            text: error.message || "Something went wrong" 
        });
        console.error(error);
    }
};

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
                                <input type='text' id='username' name='username' placeholder='Enter your Full Name' value={formData.username} onChange={handleChange} onBlur={handleBlur} className={touched.username && errors.username ? "input-error" : ""} />
                                {touched.username && errors.username && (
                                    <p className="error-text">{errors.username}</p>
                                )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'createpassword'>Create Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'createpassword' name = 'createpassword' placeholder = 'Enter Strong Password' value={formData.createpassword} onChange={handleChange} onBlur={handleBlur} className={touched.createpassword && errors.createpassword ? "input-error" : ""} />
                                {touched.createpassword && errors.createpassword && (
                                    <p className="error-text">{errors.createpassword}</p>
                                )}
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'confirmpassword'>Confirm Password : <label className='star'> * </label> </label>
                                <input type = 'password' id = 'confirmpassword' name = 'confirmpassword' placeholder = 'Re-enter password' value={formData.confirmpassword} onChange={handleChange} onBlur={handleBlur} className={touched.confirmpassword && errors.confirmpassword ? "input-error" : ""} />
                                {touched.confirmpassword && errors.confirmpassword && (
                                    <p className="error-text">{errors.confirmpassword}</p>
                                )}
                            </div>

                            <div className = 'row'>
                                <input type = 'checkbox' id = 'check' name = 'check' checked={formData.check} onChange={handleChange}/> <p className="checked">I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a></p>
                                {touched.check && errors.check && (
                                    <p className="error-text">{errors.check}</p>
                                )}
                            </div>

                            <button className = 'next' onClick = { handleNext}> Create Account & Login </button>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    )
}

export default ServiceProviderLogin;