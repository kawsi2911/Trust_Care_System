import { useState } from "react";
import Header from "../Header/Header";
import "./FamilyServiceRequest2.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function FamilyServiceRequest2() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    SLocation: "",
    Address: "",
    serviceOptions: "",
    disabilityDetails: "",
    preferredGender: "",
    additionalRequirement: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate();
  };

  const validate = () => {

    const newErrors = {};

    if (!formData.SLocation.trim())
      newErrors.SLocation = "City is Required";

    if (!formData.Address.trim())
      newErrors.Address = "Full Address is Required";

    if (!formData.serviceOptions)
      newErrors.serviceOptions = "Select the Services";

    if (!formData.preferredGender)
      newErrors.preferredGender = "Select preferred caregiver gender";

    if (!formData.additionalRequirement.trim())
      newErrors.additionalRequirement = "Additional Requirements is Required";

    setErrors(newErrors);
    return newErrors;
  };


  const handleNext = async () => {

    const validationErrors = validate();

    setTouched({
      SLocation: true,
      Address: true,
      serviceOptions: true,
      preferredGender: true,
      additionalRequirement: true
    });

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {

      const form1Data = JSON.parse(localStorage.getItem("form1Data")) || {};

      const familyId =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId");

      if (!familyId) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      const combinedData = {
        ...form1Data,
        ...formData,
        familyId
      };

      console.log("Sending Data:", combinedData);

      const response = await axios.post(
        "http://localhost:5000/api/service-request/new-request",
        combinedData
      );

      console.log("Service Request Saved:", response.data);

      // ✅ CHANGED: was response.data.requestId (undefined), now response.data._id
      localStorage.setItem("requestId", response.data._id);

      localStorage.removeItem("form1Data");

      navigate("/findingcareprovider", { state: combinedData });

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

              {/* City */}
              <div className="row">
                <label>Service Location (City) *</label>

                <input
                  type="text"
                  name="SLocation"
                  placeholder="Enter City"
                  value={formData.SLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.SLocation && errors.SLocation ? "input-error" : ""}
                />

                {touched.SLocation && errors.SLocation && (
                  <p className="error-text">{errors.SLocation}</p>
                )}
              </div>

              {/* Address */}
              <div className="row">
                <label>Full Address *</label>

                <textarea
                  name="Address"
                  placeholder="Enter full address"
                  value={formData.Address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.Address && errors.Address ? "input-error" : ""}
                />

                {touched.Address && errors.Address && (
                  <p className="error-text">{errors.Address}</p>
                )}
              </div>

              {/* Disabilities */}
              <div className="row">
                <label>Any Disabilities *</label>

                <div className={`Service-options ${touched.serviceOptions && errors.serviceOptions ? "input-error" : ""}`}>

                  <input
                    type="radio"
                    name="serviceOptions"
                    value="Yes"
                    checked={formData.serviceOptions === "Yes"}
                    onChange={handleChange}
                  />
                  <label>Yes</label>

                  <input
                    type="radio"
                    name="serviceOptions"
                    value="No"
                    checked={formData.serviceOptions === "No"}
                    onChange={handleChange}
                  />
                  <label>No</label>

                </div>

                {touched.serviceOptions && errors.serviceOptions && (
                  <p className="error-text">{errors.serviceOptions}</p>
                )}
              </div>

              {/* Disability Details */}
              {formData.serviceOptions === "Yes" && (
                <div className="row">
                  <textarea
                    name="disabilityDetails"
                    rows="4"
                    placeholder="Describe the disabilities"
                    value={formData.disabilityDetails}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Preferred Gender */}
              <div className="row">

                <label>Preferred Caregiver Gender *</label>

                <div className={`gender-options ${touched.preferredGender && errors.preferredGender ? "input-error" : ""}`}>

                  <input
                    type="radio"
                    name="preferredGender"
                    value="Male"
                    checked={formData.preferredGender === "Male"}
                    onChange={handleChange}
                  />
                  <label>Male</label>

                  <input
                    type="radio"
                    name="preferredGender"
                    value="Female"
                    checked={formData.preferredGender === "Female"}
                    onChange={handleChange}
                  />
                  <label>Female</label>

                  <input
                    type="radio"
                    name="preferredGender"
                    value="Other"
                    checked={formData.preferredGender === "Other"}
                    onChange={handleChange}
                  />
                  <label>No Preference</label>

                </div>

                {touched.preferredGender && errors.preferredGender && (
                  <p className="error-text">{errors.preferredGender}</p>
                )}

              </div>

              {/* Additional Requirements */}
              <div className="row">

                <label>Additional Requirements *</label>

                <textarea
                  name="additionalRequirement"
                  placeholder="Additional notes"
                  value={formData.additionalRequirement}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.additionalRequirement && errors.additionalRequirement ? "input-error" : ""}
                />

                {touched.additionalRequirement && errors.additionalRequirement && (
                  <p className="error-text">{errors.additionalRequirement}</p>
                )}

              </div>

              <button
                className="finishes"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>

              <button
                className="previous"
                onClick={() => navigate("/familyservicerequest")}
              >
                Previous
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FamilyServiceRequest2;