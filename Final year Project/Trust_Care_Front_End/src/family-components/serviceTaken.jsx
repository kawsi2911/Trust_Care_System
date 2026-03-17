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

  // ✅ Ensure Step 1 exists
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

  // ============================
  // SEND OTP
  // ============================
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

  // ============================
  // VERIFY OTP
  // ============================
  const verifyOTP = async () => {
    const familyData = JSON.parse(localStorage.getItem("familyData"));
    if (!familyData) return;

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

  // ============================
  // REGISTER
  // ============================
  const handleNext = async (e) => {
    e.preventDefault();

    setTouched({ username: true, createpassword: true, confirmpassword: true, check: true });
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    if (!verified) {
      Swal.fire("Verify email first");
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
        Swal.fire(data.message);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Registration failed");
    }
  };

  return (
    <>
      <Header />
      <div className="Servicelogin">
        <div className="login_Container">
          <p>Registration Step 2</p>
          <form onSubmit={handleNext}>
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <input
              type="password"
              name="createpassword"
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label>
              <input type="checkbox" name="check" onChange={handleChange} /> Agree to terms
            </label>

            {/* OTP / Send OTP / Verify */}
            {!verified ? (
              otpSent ? (
                <>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button type="button" onClick={verifyOTP}>
                    Verify OTP
                  </button>
                </>
              ) : (
                <button type="button" onClick={sendOTP}>
                  Send OTP
                </button>
              )
            ) : (
              <p style={{ color: "green" }}>Email verified ✅</p>
            )}

            {/* Register button only enabled if verified */}
            <button type="submit" disabled={!verified}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ServiceTaken;