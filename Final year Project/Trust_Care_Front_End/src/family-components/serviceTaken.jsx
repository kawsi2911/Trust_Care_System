import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./serviceTaken.css";

function ServiceTaken() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    createpassword: "",
    confirmpassword: "",
    check: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  // Check if step 1 is completed
  useEffect(() => {
    const familyData = JSON.parse(localStorage.getItem("familyData"));
    if (!familyData) {
      Swal.fire("Complete registration step 1 first").then(() => {
        navigate("/familyregister");
      });
    }
  }, [navigate]);

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
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username required";
    if (!formData.createpassword.trim()) newErrors.createpassword = "Password required";
    else if (formData.createpassword.length < 6) newErrors.createpassword = "Min 6 characters";
    if (!formData.confirmpassword.trim()) newErrors.confirmpassword = "Confirm password required";
    else if (formData.createpassword !== formData.confirmpassword)
      newErrors.confirmpassword = "Passwords do not match";
    if (!formData.check) newErrors.check = "Agree to terms";

    setErrors(newErrors);
    return newErrors;
  };

  // SEND OTP
  const sendOTP = async () => {
    const familyData = JSON.parse(localStorage.getItem("familyData"));
    if (!familyData) return;

    try {
      const res = await fetch("http://localhost:5000/api/family/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: familyData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("OTP sent to email");
        setOtpSent(true);
      } else {
        Swal.fire("Error sending OTP: " + (data.error || data.message));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Network/server error");
    }
  };

  // VERIFY OTP
  const verifyOTP = async () => {
    const familyData = JSON.parse(localStorage.getItem("familyData"));
    if (!familyData) return;

    if (!otp.trim()) {
      Swal.fire("Enter OTP first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/family/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: familyData.email, otp }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        Swal.fire("Email verified successfully");
        setVerified(true);
        setOtpSent(false); // hide OTP input
      } else {
        Swal.fire("OTP verification failed: " + (data.error || data.message));
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Network or server error");
    }
  };

  // REGISTER
  const handleNext = async (e) => {
    e.preventDefault();

    // mark all fields as touched
    setTouched({ username: true, createpassword: true, confirmpassword: true, check: true });

    // validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      Swal.fire("Please fix the errors before proceeding");
      return;
    }

    if (!verified) {
      Swal.fire("Verify your email first");
      return;
    }

    const familyData = JSON.parse(localStorage.getItem("familyData"));
    if (!familyData) return;

    const finalData = {
      email: familyData.email,
      username: formData.username,
      password: formData.createpassword,
    };

    try {
      const res = await fetch("http://localhost:5000/api/family/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("familyData");
        Swal.fire({ icon: "success", title: "Registered successfully" }).then(() =>
          navigate("/familylogin")
        );
      } else {
        Swal.fire(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Registration failed, try again");
    }
  };

  return (
    <>
      <Header />
      <div className='Servicelogin'>
        <div className="login_Container">

          {/* Header */}
          <div className="First">
            <p className="Head">✔️ Registration Complete!</p>
            <p className="Body">Now create your login credentials</p>
          </div>

          <form onSubmit={handleNext} className='form-fill'>

            {/* Username */}
            <div className='row'>
              <label htmlFor='username'>Username : <span className='star'>*</span></label>
              <input 
                type='text' 
                id='username'
                name='username' 
                placeholder='Enter your username' 
                value={formData.username} 
                onChange={handleChange}  
                onBlur={handleBlur} 
                className={touched.username && errors.username ? 'input-error' : ''}
              />
              {touched.username && errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            {/* Create Password */}
            <div className='row'>
              <label htmlFor='create_password'>Create Password : <span className='star'>*</span></label>
              <input 
                type='password' 
                id='create_password' 
                name='createpassword' 
                placeholder='Enter a strong password' 
                value={formData.createpassword} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className={touched.createpassword && errors.createpassword ? 'input-error' : ''}
              />
              {touched.createpassword && errors.createpassword && (
                <p className="error-text">{errors.createpassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='row'>
              <label htmlFor='confirmpassword'>Confirm Password : <span className='star'>*</span></label>
              <input 
                type='password' 
                id='confirmpassword' 
                name='confirmpassword' 
                placeholder='Re-enter password' 
                value={formData.confirmpassword} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className={touched.confirmpassword && errors.confirmpassword ? 'input-error' : ''}
              />
              {touched.confirmpassword && errors.confirmpassword && (
                <p className="error-text">{errors.confirmpassword}</p>
              )}
            </div>

            {/* Checkbox */}
            <div className='row'>
              <input 
                type='checkbox' 
                id='check' 
                name='check' 
                checked={formData.check}  
                onChange={handleChange}
              />
              <p className="checked">
                I agree to <a href="">Terms & Conditions</a> and <a href="">Privacy Policy</a>
              </p>
              {touched.check && errors.check && (
                <p className="error-text">{errors.check}</p>
              )}
            </div>

            {/* OTP */}
            <div className='row otp-row'>
              {!verified ? (
                otpSent ? (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button type="button" onClick={verifyOTP} className="otp-btn">
                      Verify OTP
                    </button>
                  </>
                ) : (
                  <button type="button"  onClick={sendOTP} className="otp-btn">
                    Send OTP
                  </button>
                )
              ) : (
                <p className="verified">Email verified ✅</p>
              )}
            </div>

            <button type="submit" className='next'>
              Create Account & Login
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default ServiceTaken;