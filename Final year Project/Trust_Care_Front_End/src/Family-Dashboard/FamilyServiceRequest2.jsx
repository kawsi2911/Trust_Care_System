import { useState } from "react";
import Header from "../Header/Header";
import "./FamilyServiceRequest2.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function FamilyServiceRequest2() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    SLocation: "",
    Address: "",
    serviceOptions: "",
    disabilityDetails: "",
    Gender: "",
    additionalRequirement: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

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
    const newErrors = {};

    if (!formData.SLocation.trim()) newErrors.SLocation = "City is Required";
    if (!formData.Address.trim()) newErrors.Address = "Full Address is Required";
    if (!formData.serviceOptions.trim()) newErrors.serviceOptions = "Select the Services";
    if (!formData.Gender) newErrors.Gender = "Select the Gender";
    if (!formData.additionalRequirement.trim())
      newErrors.additionalRequirement = "Additional Requirements is Required";

    setErrors(newErrors);
    return newErrors;
  };
const handleNext = async () => {
  // Run validation
  const validationErrors = validate();
  setTouched({
    SLocation: true,
    Address: true,
    serviceOptions: true,
    Gender: true,
    additionalRequirement: true
  });

  // Stop if there are validation errors
  if (Object.keys(validationErrors).length > 0) return;

  setLoading(true);

  try {
    // Get form1 data
    const form1Data = JSON.parse(localStorage.getItem("form1Data")) || {};

    // Ensure familyId is included
    const familyId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!familyId) {
      alert("User not logged in or familyId missing");
      setLoading(false);
      return;
    }

    const combinedData = { ...form1Data, ...formData, familyId };

    // Send to backend
    const response = await axios.post(
      "http://localhost:5000/api/service-request/new-request",
      combinedData
    );

    console.log("Service Request Saved:", response.data);

    // Clear temp storage
    localStorage.removeItem("form1Data");

    // Navigate to caregiver page and pass the request data
    navigate("/findingcareprovider", { state: response.data });
  } catch (error) {
    console.error("Error saving request:", error);
    alert(error.response?.data?.error || "Failed to save request");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Header />
      <div className="ServiceSection">
        <div className="Service_container">
          <p className="para">Service Request Form (2/2)</p>
          <div className="form">
            <div className="form-fill">
              <div className="row">
                <label htmlFor="SLocation">
                  Service Location (City): <span className="star">*</span>
                </label>
                <input
                  type="text"
                  id="SLocation"
                  name="SLocation"
                  placeholder="Enter City"
                  value={formData.SLocation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={touched.SLocation && errors.SLocation ? "input-error" : ""}
                />
                {touched.SLocation && errors.SLocation && <p className="error-text">{errors.SLocation}</p>}
              </div>

              <div className="row">
                <label htmlFor="Address">
                  Full Address: <span className="star">*</span>
                </label>
                <textarea
                  id="Address"
                  name="Address"
                  placeholder="Enter full address"
                  value={formData.Address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={touched.Address && errors.Address ? "input-error" : ""}
                ></textarea>
                {touched.Address && errors.Address && <p className="error-text">{errors.Address}</p>}
              </div>

              <div className="row">
                <label>Any Disabilities: <span className="star">*</span></label>
                <div className={`Service-options ${touched.serviceOptions && errors.serviceOptions ? "input-error" : ""}`}>
                  <input type="radio" id="Yes" name="serviceOptions" value="Yes" checked={formData.serviceOptions === "Yes"} onChange={handleChange} />
                  <label htmlFor="Yes">Yes</label>
                  <input type="radio" id="No" name="serviceOptions" value="No" checked={formData.serviceOptions === "No"} onChange={handleChange} />
                  <label htmlFor="No">No</label>
                </div>
                {touched.serviceOptions && errors.serviceOptions && <p className="error-text">{errors.serviceOptions}</p>}
              </div>

              {formData.serviceOptions === "Yes" && (
  <div className="yess">
    <textarea
      name="disabilityDetails"
      rows="5"
      placeholder="Describe the disabilities or medical conditions"
      value={formData.disabilityDetails}
      onChange={handleChange}
    ></textarea>
  </div>
)}

              <div className="row">
                <label>Preferred Caregiver Gender: <span className="star">*</span></label>
                <div className={`gender-options ${touched.Gender && errors.Gender ? "input-error" : ""}`}>
                  <input type="radio" id="Male" name="Gender" value="Male" checked={formData.Gender === "Male"} onChange={handleChange} />
                  <label htmlFor="Male">Male</label>
                  <input type="radio" id="Female" name="Gender" value="Female" checked={formData.Gender === "Female"} onChange={handleChange} />
                  <label htmlFor="Female">Female</label>
                  <input type="radio" id="Other" name="Gender" value="Other" checked={formData.Gender === "Other"} onChange={handleChange} />
                  <label htmlFor="Other">No Preferences</label>
                </div>
                {touched.Gender && errors.Gender && <p className="error-text">{errors.Gender}</p>}
              </div>

              <div className="row">
                <label htmlFor="A-Requirements">Additional Requirements / Notes: <span className="star">*</span></label>
                <textarea
                  id="A-Requirements"
                  name="additionalRequirement"
                  placeholder="Additional Requirements / Notes"
                  value={formData.additionalRequirement}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.additionalRequirement && errors.additionalRequirement ? "input-error" : ""}
                ></textarea>
                {touched.additionalRequirement && errors.additionalRequirement && (
                  <p className="error-text">{errors.additionalRequirement}</p>
                )}
              </div>

              <button className="finishes" onClick={handleNext} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              <button className="previous" onClick={() => navigate("/familyservicerequest")}>Previous</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FamilyServiceRequest2;