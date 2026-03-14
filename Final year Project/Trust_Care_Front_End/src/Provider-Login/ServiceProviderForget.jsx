import { useState } from "react";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./ServiceProviderLogin.css";
import Swal from "sweetalert2";

function ServiceProviderForget() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        create_password: "",
        confirm_password: ""
    });

    const [errors, setErrors]   = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        if (!formData.create_password.trim()) {
            newErrors.create_password = "New password is required";
        } else if (formData.create_password.length < 6) {
            newErrors.create_password = "Password must be at least 6 characters";
        }
        if (!formData.confirm_password.trim()) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (formData.create_password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        setErrors(newErrors);
        return newErrors;
    };

    // ✅ FIXED: was just navigating — now calls backend to reset password
    const handleSubmit = async () => {
        setTouched({ username: true, create_password: true, confirm_password: true });

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/service/reset-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    newPassword: formData.create_password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                Swal.fire({ icon: "error", title: "Failed", text: data.message || "User not found" });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Password Reset Successful",
                text: "You can now login with your new password.",
                timer: 1800,
                showConfirmButton: false
            }).then(() => navigate("/serviceproviderloginpage"));

        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className='Servicelogin'>
                <div className="login_Container">

                    <div className="name">
                        <p className="Head" style={{ textAlign: "center" }}>Reset Password</p>
                        <p style={{ textAlign: "center", color: "#666" }}>Enter your username and a new password</p>
                    </div>

                    <div className='form'>
                        <div className='form-fill'>

                            <div className='row'>
                                <label htmlFor='username'>Username : <span className='star'>*</span></label>
                                <input
                                    type='text' id='username' name='username'
                                    placeholder='Enter your username'
                                    value={formData.username}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={touched.username && errors.username ? "input-error" : ""}
                                />
                                {touched.username && errors.username && (
                                    <p className="error-text">{errors.username}</p>
                                )}
                            </div>

                            <div className='row'>
                                <label htmlFor='create_password'>New Password : <span className='star'>*</span></label>
                                <input
                                    type='password' id='create_password' name='create_password'
                                    placeholder='Enter new strong password'
                                    value={formData.create_password}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={touched.create_password && errors.create_password ? "input-error" : ""}
                                />
                                {touched.create_password && errors.create_password && (
                                    <p className="error-text">{errors.create_password}</p>
                                )}
                            </div>

                            <div className='row'>
                                <label htmlFor='confirm_password'>Confirm Password : <span className='star'>*</span></label>
                                <input
                                    type='password' id='confirm_password' name='confirm_password'
                                    placeholder='Re-enter new password'
                                    value={formData.confirm_password}
                                    onChange={handleChange} onBlur={handleBlur}
                                    className={touched.confirm_password && errors.confirm_password ? "input-error" : ""}
                                />
                                {touched.confirm_password && errors.confirm_password && (
                                    <p className="error-text">{errors.confirm_password}</p>
                                )}
                            </div>

                            <button className='next' onClick={handleSubmit} disabled={loading}>
                                {loading ? "Resetting..." : "Submit & Login"}
                            </button>

                            <p style={{ textAlign: "center", marginTop: "12px" }}>
                                <span
                                    style={{ color: "#007bff", cursor: "pointer" }}
                                    onClick={() => navigate("/serviceproviderloginpage")}
                                >
                                    Back to Login
                                </span>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ServiceProviderForget;