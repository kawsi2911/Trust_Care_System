import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import "./familyRegister.css";

function FamilyRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    familyFullName: "",
    familynic: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate();
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.familyFullName.trim()) newErrors.familyFullName = "Full Name is required";
    if (!formData.familynic.trim()) newErrors.familynic = "NIC is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();

    setTouched({
      familyFullName: true,
      familynic: true,
      phone: true,
      email: true,
      gender: true,
      address: true,
      city: true,
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    // Save Step 1 data in localStorage
    localStorage.setItem("familyData", JSON.stringify(formData));

    Swal.fire({
      icon: "success",
      title: "Step 1 Completed",
      text: "Proceed to next step",
    }).then(() => navigate("/servicetaken"));
  };

  return (
    <>
      <Header />
      <div className="ServiceSection">
        <div className="Service_container">
          <p className="para">Service Taker Registration - Step 1</p>
          <form className="form" onSubmit={handleNext}>
            {/* Full Name */}
            <div className="row">
              <label htmlFor="familyFullName">Full Name *</label>
              <input
                type="text"
                id="familyFullName"
                name="familyFullName"
                placeholder="Enter your full name"
                value={formData.familyFullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.familyFullName && errors.familyFullName ? "input-error" : ""}
              />
              {touched.familyFullName && errors.familyFullName && (
                <p className="error-text">{errors.familyFullName}</p>
              )}
            </div>

            {/* NIC */}
            <div className="row">
              <label htmlFor="familynic">NIC *</label>
              <input
                type="text"
                id="familynic"
                name="familynic"
                placeholder="Enter NIC"
                value={formData.familynic}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.familynic && errors.familynic ? "input-error" : ""}
              />
              {touched.familynic && errors.familynic && (
                <p className="error-text">{errors.familynic}</p>
              )}
            </div>

            {/* Phone */}
            <div className="row">
              <label htmlFor="phone">Phone *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? "input-error" : ""}
              />
              {touched.phone && errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="row">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? "input-error" : ""}
              />
              {touched.email && errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Gender */}
            <div className="row">
              <label>Gender *</label>
              <div className={`gender-options ${touched.gender && errors.gender ? "input-error" : ""}`}>
                <input type="radio" id="male" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />
                <label htmlFor="male">Male</label>
                <input type="radio" id="female" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />
                <label htmlFor="female">Female</label>
                <input type="radio" id="other" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} />
                <label htmlFor="other">Other</label>
              </div>
              {touched.gender && errors.gender && <p className="error-text">{errors.gender}</p>}
            </div>

            {/* Address */}
            <div className="row">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.address && errors.address ? "input-error" : ""}
              />
              {touched.address && errors.address && <p className="error-text">{errors.address}</p>}
            </div>

            {/* City */}
            <div className="row">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.city && errors.city ? "input-error" : ""}
              />
              {touched.city && errors.city && <p className="error-text">{errors.city}</p>}
            </div>

            <button type="submit" className="next">
              Next Step
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default FamilyRegister;
