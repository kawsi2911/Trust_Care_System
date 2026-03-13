import Header from "../Header/Header";
import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import Swal from "sweetalert2";
import "./serviceTaken.css";

function ServiceTaken() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        createpassword: "",
        confirmpassword: "",
        check: false
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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
            newErrors.confirmpassword = "Please confirm your password";
        } else if (formData.createpassword !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
        }

        if (!formData.check) {
            newErrors.check = "You must agree to Terms & Conditions";
        }

        setErrors(newErrors);
        return newErrors;
    };

    const handleNext = async () => {

    const validationErrors = validate();

    setTouched({
        username: true,
        createpassword: true,
        confirmpassword: true,
        check: true
    });

    if (Object.keys(validationErrors).length !== 0) return;

    // get family form data
    const familyData = JSON.parse(localStorage.getItem("familyData"));

    // combine both forms
    const finalData = {
        ...familyData,
        username: formData.username,
        password: formData.createpassword

    };

    try {

        const res = await fetch("http://localhost:5000/api/family/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalData)
        });

            const data = await res.json();

            if (res.ok) {
                localStorage.removeItem("familyData");
            
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful 🎉",
                    text: "Your account has been created successfully!",
                    confirmButtonText: "Go to Login"
                }).then(() => {
                    navigate("/familylogin");
                });
            } else {
            alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header />
            <div className='Servicelogin'>
                <div className="login_Container">
                    <div className="First">
                        <p className="Head">✔️ Registration Complete!</p>
                        <p className="Body">Now Create your login credentials</p>
                    </div>

                    <div className='form'>
                        <div className='form-fill'>

                            {/* Username */}
                            <div className='row'>
                                <label htmlFor='username'>Username : <span className='star'>*</span></label>
                                <input type='text' id='username'name='username' placeholder='Enter your username' value={formData.username} onChange={handleChange}  onBlur={handleBlur} className={touched.username && errors.username ? 'input-error' : ''} />
                                {touched.username && errors.username && (
                                    <p className="error-text">{errors.username}</p>
                                )}
                            </div>

                            {/* Create Password */}
                            <div className='row'>
                                <label htmlFor='create_password'>Create Password : <span className='star'>*</span></label>
                                <input type='password' id='create_password' name='createpassword' placeholder='Enter a strong password' value={formData.createpassword} onChange={handleChange} onBlur={handleBlur} className={touched.createpassword && errors.createpassword ? 'input-error' : ''} />
                                {touched.createpassword && errors.createpassword && (
                                    <p className="error-text">{errors.createpassword}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className='row'>
                                <label htmlFor='confirmpassword'>Confirm Password : <span className='star'>*</span></label>
                                <input type='password' id='confirmpassword' name='confirmpassword' placeholder='Re-enter password' value={formData.confirmpassword} onChange={handleChange} onBlur={handleBlur} className={touched.confirmpassword && errors.confirmpassword ? 'input-error' : ''}/>
                                {touched.confirmpassword && errors.confirmpassword && (
                                    <p className="error-text">{errors.confirmpassword}</p>
                                )}
                            </div>

                            {/* Checkbox */}
                            <div className='row checkbox-row'>
                                <input type='checkbox' id='check' name='check' checked={formData.check}  onChange={handleChange}/>
                                <p className="checked">
                                    I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a>
                                </p>
                                {touched.check && errors.check && (
                                    <p className="error-text">{errors.check}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button className='next' onClick={handleNext}>
                                Create Account & Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceTaken;