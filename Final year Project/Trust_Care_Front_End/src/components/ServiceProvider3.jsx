import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Swal from 'sweetalert2';
import './ServiceProvider3.css';

function ServiceProvider3() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uploadprofile: '',  // store as base64 string
    location: '',
    workRadius: '',
    available: '',
    hourlyRate: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fullAddress, setFullAddress] = useState(''); // Step 2 address

  // Load fullAddress from localStorage (Step 2)
  useEffect(() => {
    const step2Data = JSON.parse(localStorage.getItem("serviceData")) || {};
    if (step2Data.fulladdress) setFullAddress(step2Data.fulladdress);
  }, []);

  // Placeholder distance calculation
  const calculateDistance = (addr1, addr2) => {
    return Math.abs(addr1.length - addr2.length) + 5;
  };

  // Handle text and number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto calculate workRadius if location changes
    if (name === "location" && fullAddress) {
      const locationsArray = value.split(',').map(loc => loc.trim()).filter(Boolean);
      const distances = locationsArray.map(loc => calculateDistance(fullAddress, loc));
      const maxDistance = distances.length > 0 ? Math.max(...distances) : 0;
      setFormData(prev => ({ ...prev, workRadius: maxDistance.toFixed(2) }));
    }

    if (value.trim() !== "") setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Handle file input (convert to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, uploadprofile: reader.result }));
      setErrors(prev => ({ ...prev, uploadprofile: undefined }));
    };
    reader.readAsDataURL(file); // convert file to base64
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate();
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.uploadprofile) newErrors.uploadprofile = "Upload the profile image";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.workRadius.trim()) newErrors.workRadius = "Work radius is required";
    if (!formData.available.trim()) newErrors.available = "Availability is required";
    if (!formData.hourlyRate.trim()) newErrors.hourlyRate = "Hourly rate is required";
    setErrors(newErrors);
    return newErrors;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setTouched({
      uploadprofile: true,
      location: true,
      workRadius: true,
      available: true,
      hourlyRate: true
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    const data3 = JSON.parse(localStorage.getItem("serviceData")) || {};
    const dataToStore = { ...data3, ...formData };
    localStorage.setItem("serviceData", JSON.stringify(dataToStore));

    Swal.fire({
      icon: 'success',
      title: 'Step 3 Completed',
      text: 'You can now sign up your username and password for your account'
    });

    navigate("/serviceproviderlogin");
  };

  return (
    <>
      <Header />
      <div className='ServiceSection'>
        <div className='Service_container'>
          <p className='para'>Service Provider Registration (3/3)</p>
          <div className='form'>
            <div className='form-fill'>

              {/* Profile Upload */}
              <div className='row'>
                <label htmlFor='Profile'> Upload your Image : <label className='star'> * </label> </label>
                <div className="upload-icon" onClick={() => document.getElementById('uploadInput').click()}>
                  {formData.uploadprofile ? (
                    <img 
                      src={formData.uploadprofile} 
                      alt="Profile Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  ) : (
                    <>
                      📷<br />
                      <span>Click to upload photo</span>
                      <small>JPG, PNG • max 5MB</small>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  id="uploadInput" 
                  name="uploadprofile" 
                  accept="image/png, image/jpeg" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                  onBlur={handleBlur} 
                />
                {touched.uploadprofile && errors.uploadprofile && <p className="error-text">{errors.uploadprofile}</p>}
              </div>

              {/* Locations */}
              <div className='row'>
                <label htmlFor='Location'> Location able to Work : <label className='star'> * </label> </label>
                <input 
                  type='text' 
                  id='Location' 
                  name='location' 
                  placeholder='Add multiple locations separated by commas' 
                  value={formData.location} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={touched.location && errors.location ? 'input-error' : ''} 
                />
              </div>

              {/* Work Radius (Read-only) */}
              <div className='row'>
                <label htmlFor='WorkRadius'> Work Radius (Km) : <label className='star'> * </label> </label>
                <input 
                  type='text' 
                  id='WorkRadius' 
                  name='workRadius' 
                  value={formData.workRadius} 
                  readOnly 
                  className={touched.workRadius && errors.workRadius ? 'input-error' : ''} 
                />
              </div>

              {/* Availability */}
              <div className='row'>
                <label> Available Duration : <label className='star'> * </label> </label>
                <div className={`duration-options ${touched.available && errors.available ? "input-error" : ""}`}>
                  <input type='radio' id='Fulltime' name='available' value='Fulltime' checked={formData.available === "Fulltime"} onChange={handleChange} /> <label htmlFor='Fulltime'>Full Time</label>
                  <input type='radio' id='Parttime' name='available' value='Parttime' checked={formData.available === "Parttime"} onChange={handleChange} /> <label htmlFor='Parttime'>Part Time</label>
                  <input type='radio' id='Flexible' name='available' value='Flexible' checked={formData.available === "Flexible"} onChange={handleChange} /> <label htmlFor='Flexible'>Flexible</label>
                </div>
                {touched.available && errors.available && <div className="error-text">{errors.available}</div>}
              </div>

              {/* Hourly Rate */}
              <div className='row'>
                <label htmlFor='HourlyRate'> Hourly Rate (Rs) : <label className='star'> * </label> </label>
                <input 
                  type='number' 
                  id='HourlyRate' 
                  name='hourlyRate' 
                  placeholder='e.g 500' 
                  value={formData.hourlyRate} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={touched.hourlyRate && errors.hourlyRate ? 'input-error' : ''} 
                />
              </div>

              <button className='complete' onClick={handleNext}> Complete Registration </button>
              <button className='previous' onClick={() => navigate("/serviceprovider2")}> Previous </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceProvider3;