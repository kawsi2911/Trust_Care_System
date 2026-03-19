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

  // ✅ Check Step 1 on page load
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
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
    if (!formData.confirmpassword.trim()) newErrors.confirmpassword = "Confirm password";
    else if (formData.createpassword !== formData.confirmpassword)
      newErrors.confirmpassword = "Passwords do not match";
    if (!formData.check) newErrors.check = "You must agree to terms";

    setErrors(newErrors);
    return newErrors;
  };

  // ============================
  // SEND OTP
  // ============================
  const sendOTP = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire("Complete Step 1 first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/family/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("OTP sent to your email");
        setOtpSent(true);
      } else {
        Swal.fire(data.message);
      }
    } catch (err) {
      Swal.fire("Error sending OTP");
      console.error(err);
    }
  };

  // ============================
  // VERIFY OTP
  // ============================
  const verifyOTP = async () => {
    const userId = localStorage.getItem("userId");
    if (!otp) {
      Swal.fire("Enter OTP first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/family/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("OTP verified successfully");
        setVerified(true);
      } else {
        Swal.fire(data.message);
      }
    } catch (err) {
      Swal.fire("Error verifying OTP");
      console.error(err);
    }
  };

  // ============================
  // REGISTER
  // ============================
  const handleNext = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    if (!verified) {
      Swal.fire("Verify OTP first");
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch("http://localhost:5000/api/family/providerregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username: formData.username,
          password: formData.createpassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("userId");
        Swal.fire("Registered successfully").then(() => navigate("/familylogin"));
      } else {
        Swal.fire(data.message);
      }
    } catch (err) {
      Swal.fire("Registration error");
      console.error(err);
    }
  };

 return (
  <>
    <Header />
    <div className="Servicelogin">
      <div className="login_Container">

        <div className="First">
          <p className="Head">✔️ Registration Step 2</p>
          <p className="Body">Create your login & verify OTP</p>
        </div>

        <form onSubmit={handleNext} className="form-fill">

          {/* Username */}
          <div className="row">
            <label>Username *</label>
            <input
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.username && errors.username ? "input-error" : ""}
            />
            {touched.username && errors.username && (
              <p className="error-text">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="row">
            <label>Password *</label>
            <input
              type="password"
              name="createpassword"
              placeholder="Enter password"
              value={formData.createpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.createpassword && errors.createpassword ? "input-error" : ""}
            />
            {touched.createpassword && errors.createpassword && (
              <p className="error-text">{errors.createpassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="row">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm password"
              value={formData.confirmpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmpassword && errors.confirmpassword ? "input-error" : ""}
            />
            {touched.confirmpassword && errors.confirmpassword && (
              <p className="error-text">{errors.confirmpassword}</p>
            )}
          </div>

          {/* Checkbox */}
          <div className="checkbox-row">
            <input
              type="checkbox"
              name="check"
              checked={formData.check}
              onChange={handleChange}
            />
            <label>I agree to Terms & Conditions</label>
          </div>
          {touched.check && errors.check && (
            <p className="error-text">{errors.check}</p>
          )}

          {/* Send OTP */}
          <button type="button" className="next" onClick={sendOTP}>
            Send OTP
          </button>

          {/* OTP Section */}
          {otpSent && (
            <div className="row">
              <label>Enter OTP</label>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="next" onClick={verifyOTP}>
                Verify OTP
              </button>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="next">
            Register
          </button>

        </form>
      </div>
    </div>
  </>
);
}

export default ServiceTaken;