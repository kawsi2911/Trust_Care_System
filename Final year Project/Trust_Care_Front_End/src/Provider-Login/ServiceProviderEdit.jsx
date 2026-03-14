import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import axios from 'axios';

function ServiceProviderProfileEdit() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        FullName: "",
        NIC: "",
        phone: "",
        email: "",
        gender: "",
        dob: "",
        fulladdress: "",
        serviceType: [],
        year: "",
        qualifications: "",
        uploadprofile: "",
        location: "",
        workRadius: "",
        available: "",
        hourlyRate: ""
    });

    const [errors, setErrors]   = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // ✅ FIXED Bug 6: pre-load existing profile data when page opens
    useEffect(() => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!userId) return navigate("/serviceproviderloginpage");

        fetch(`http://localhost:5000/api/service/${userId}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    FullName:      data.FullName      || "",
                    NIC:           data.NIC           || "",
                    phone:         data.phone         || "",
                    email:         data.email         || "",
                    gender:        data.gender        || "",
                    dob:           data.dob           || "",
                    fulladdress:   data.fulladdress   || "",
                    serviceType:   data.serviceType   || [],
                    year:          data.year          || "",
                    qualifications:data.qualifications|| "",
                    uploadprofile: data.uploadprofile || "",
                    location:      data.location      || "",
                    workRadius:    data.workRadius    || "",
                    available:     data.available     || "",
                    hourlyRate:    data.hourlyRate    || ""
                });
                if (data.uploadprofile) setPreviewImage(data.uploadprofile);
            })
            .catch(err => console.error("Profile fetch error:", err));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            // ✅ FIXED Bug 4: was name='ServiceType' — now all checkboxes use name='serviceType'
            let updatedServices = [...formData.serviceType];
            if (checked) {
                updatedServices.push(value);
            } else {
                updatedServices = updatedServices.filter(s => s !== value);
            }
            setFormData({ ...formData, serviceType: updatedServices });
            if (updatedServices.length > 0) {
                setErrors({ ...errors, serviceType: undefined });
            } else {
                setErrors({ ...errors, serviceType: "Select at least one service" });
            }

        } else if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, uploadprofile: file });
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
                setErrors({ ...errors, uploadprofile: undefined });
            } else {
                setErrors({ ...errors, uploadprofile: "Upload the profile image" });
            }

        } else {
            setFormData({ ...formData, [name]: value });
            if (value.trim() !== "") {
                setErrors({ ...errors, [name]: undefined });
            }
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.FullName.trim())      newErrors.FullName      = "Full Name is Required";
        if (!formData.NIC.trim())           newErrors.NIC           = "NIC is Required";
        if (!formData.phone.trim())         newErrors.phone         = "Phone is Required";
        if (!formData.email.trim())         newErrors.email         = "Email is Required";
        if (!formData.gender)               newErrors.gender        = "Gender is Required";
        if (!formData.dob.trim())           newErrors.dob           = "Date of Birth is Required";
        if (!formData.fulladdress.trim())   newErrors.fulladdress   = "Address is Required";
        if (formData.serviceType.length === 0) newErrors.serviceType = "Select at least one service";
        if (!formData.year.trim())          newErrors.year          = "Years of Experience is Required";
        if (!formData.qualifications.trim())newErrors.qualifications = "Qualifications are Required";
        if (!formData.uploadprofile)        newErrors.uploadprofile = "Upload the profile image";
        if (!formData.location.trim())      newErrors.location      = "Location is Required";
        if (!formData.workRadius.trim())    newErrors.workRadius    = "Work Radius is Required";
        if (!formData.available)            newErrors.available     = "Availability is Required";
        if (!formData.hourlyRate.toString().trim()) newErrors.hourlyRate = "Rate is Required";
        setErrors(newErrors);
        return newErrors;
    };

    // ✅ FIXED Bug 1: handleNext now sends PUT request to backend
    const handleNext = async () => {
        const validationErrors = validate();
        setTouched({
            FullName: true, NIC: true, phone: true, email: true,
            gender: true, dob: true, fulladdress: true, serviceType: true,
            year: true, qualifications: true, uploadprofile: true,
            location: true, workRadius: true, available: true, hourlyRate: true
        });

        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);

        try {
            const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

            // Use FormData to support file upload
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === "serviceType") {
                    formData.serviceType.forEach(s => data.append("serviceType", s));
                } else {
                    data.append(key, formData[key]);
                }
            });

            await axios.put(`http://localhost:5000/api/service/${userId}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Profile updated successfully!");
            navigate("/profiledashboard");

        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className='ServiceSection'>
                <div className='Service_container'>

                    <p className='para'>Service Provider Edit Details</p>

                    <div className='form'>
                        <div className='form-fill'>

                            <div className='row'>
                                <label htmlFor='FullName'>Full Name : <span className='star'>*</span></label>
                                <input type='text' disabled id='FullName' name='FullName'
                                    placeholder='Enter your Full Name'
                                    value={formData.FullName} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.FullName && errors.FullName ? 'input-error' : ''} />
                                {touched.FullName && errors.FullName && <p className="error-text">{errors.FullName}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='NIC'>NIC Number : <span className='star'>*</span></label>
                                <input type='text' disabled id='NIC' name='NIC'
                                    placeholder='Enter the NIC (123456789V / 122344112555)'
                                    value={formData.NIC} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.NIC && errors.NIC ? 'input-error' : ''} />
                                {touched.NIC && errors.NIC && <p className="error-text">{errors.NIC}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='Phone'>Phone Number : <span className='star'>*</span></label>
                                <input type='text' id='Phone' name='phone'
                                    placeholder='+94 77 123 4567'
                                    value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.phone && errors.phone ? 'input-error' : ''} />
                                {touched.phone && errors.phone && <p className="error-text">{errors.phone}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='Email'>Email Address : <span className='star'>*</span></label>
                                <input type='email' id='Email' name='email'
                                    placeholder='example@gmail.com'
                                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.email && errors.email ? 'input-error' : ''} />
                                {touched.email && errors.email && <p className="error-text">{errors.email}</p>}
                            </div>

                            <div className='row'>
                                <label>Gender : <span className='star'>*</span></label>
                                {/* ✅ FIXED Bug 2: was broken string, now proper template literal */}
                                <div className={`gender-options ${touched.gender && errors.gender ? "input-error" : ""}`}>
                                    <input type='radio' id='Male'   name='gender' value='male'   checked={formData.gender === 'male'}   onChange={handleChange} /> <label htmlFor='Male'>Male</label>
                                    <input type='radio' id='Female' name='gender' value='female' checked={formData.gender === 'female'} onChange={handleChange} /> <label htmlFor='Female'>Female</label>
                                    <input type='radio' id='Other'  name='gender' value='others' checked={formData.gender === 'others'} onChange={handleChange} /> <label htmlFor='Other'>Other</label>
                                </div>
                                {touched.gender && errors.gender && <p className="error-text">{errors.gender}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='DOB'>Date of Birth : <span className='star'>*</span></label>
                                <input type='date' disabled id='DOB' name='dob'
                                    value={formData.dob} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.dob && errors.dob ? 'input-error' : ''} />
                                {touched.dob && errors.dob && <p className="error-text">{errors.dob}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='FullAddress'>Full Address : <span className='star'>*</span></label>
                                <textarea id='Address' name='fulladdress'
                                    placeholder='Enter your complete address with city and postal code'
                                    value={formData.fulladdress} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.fulladdress && errors.fulladdress ? 'input-error' : ''}></textarea>
                                {touched.fulladdress && errors.fulladdress && <p className="error-text">{errors.fulladdress}</p>}
                            </div>

                            <div className='rows'>
                                <label>Service Type (Select all that apply) : <span className='star'>*</span></label><br /><br />
                                <div className='checkbox-options'>
                                    {/* ✅ FIXED Bug 4 & 5: name='serviceType' and values match includes() check */}
                                    <label>
                                        <input type='checkbox' name='serviceType' value='ElderCare'
                                            checked={formData.serviceType.includes("ElderCare")} onChange={handleChange} /> Elder Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='ChildCare'
                                            checked={formData.serviceType.includes("ChildCare")} onChange={handleChange} /> Child Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='HospitalPatientCare'
                                            checked={formData.serviceType.includes("HospitalPatientCare")} onChange={handleChange} /> Hospital Patient Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='HomePatientCare'
                                            checked={formData.serviceType.includes("HomePatientCare")} onChange={handleChange} /> Home Patient Care
                                    </label>
                                    {touched.serviceType && errors.serviceType && (
                                        <p className="error-text">{errors.serviceType}</p>
                                    )}
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor='no_experience'>Years of Experience : <span className='star'>*</span></label>
                                <input type='number' id='no_experience' name='year'
                                    placeholder='e.g. 5'
                                    value={formData.year} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.year && errors.year ? 'input-error' : ''} />
                                {touched.year && errors.year && <p className="error-text">{errors.year}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='Qualifications'>Qualifications / Certificates : <span className='star'>*</span></label>
                                <textarea id='Qualifications' name='qualifications' rows='4'
                                    placeholder='List your qualifications, certificates, training programs...'
                                    value={formData.qualifications} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.qualifications && errors.qualifications ? 'input-error' : ''}></textarea>
                                {touched.qualifications && errors.qualifications && <p className="error-text">{errors.qualifications}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='Profile'>Upload your Image : <span className='star'>*</span></label>
                                <div className="upload-icon" onClick={() => document.getElementById('uploadInput').click()}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                    ) : (
                                        <>📷<br /><span>Click to upload photo</span><small>JPG, PNG • max 5MB</small></>
                                    )}
                                </div>
                                <input type="file" id="uploadInput" name="uploadprofile"
                                    accept="image/png, image/jpeg"
                                    style={{ display: 'none' }}
                                    onChange={handleChange} onBlur={handleBlur} />
                                {touched.uploadprofile && errors.uploadprofile && (
                                    <p className="error-text">{errors.uploadprofile}</p>
                                )}
                            </div>

                            <div className='row'>
                                <label htmlFor='Location'>Location able to Work : <span className='star'>*</span></label>
                                <input type='text' id='Location' name='location'
                                    placeholder='You can add multiple locations separated by commas'
                                    value={formData.location} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.location && errors.location ? 'input-error' : ''} />
                                {touched.location && errors.location && <p className="error-text">{errors.location}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='WorkRadius'>Work Radius (Km) : <span className='star'>*</span></label>
                                <input type='text' id='WorkRadius' name='workRadius'
                                    placeholder='How far are you willing to travel? (e.g. 10)'
                                    value={formData.workRadius} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.workRadius && errors.workRadius ? 'input-error' : ''} />
                                {touched.workRadius && errors.workRadius && <p className="error-text">{errors.workRadius}</p>}
                            </div>

                            <div className='row'>
                                <label>Available Duration : <span className='star'>*</span></label>
                                {/* ✅ FIXED Bug 3: was broken string, now proper template literal */}
                                <div className={`duration-options ${touched.available && errors.available ? "input-error" : ""}`}>
                                    <input type='radio' id='Fulltime'  name='available' value='Fulltime'  checked={formData.available === "Fulltime"}  onChange={handleChange} /> <label htmlFor='Fulltime'>Full Time</label>
                                    <input type='radio' id='Parttime'  name='available' value='Parttime'  checked={formData.available === "Parttime"}  onChange={handleChange} /> <label htmlFor='Parttime'>Part Time</label>
                                    <input type='radio' id='Flexible'  name='available' value='Flexible'  checked={formData.available === "Flexible"}  onChange={handleChange} /> <label htmlFor='Flexible'>Flexible</label>
                                </div>
                                {touched.available && errors.available && <p className="error-text">{errors.available}</p>}
                            </div>

                            <div className='row'>
                                <label htmlFor='HourlyRate'>Hourly Rate (Rs) : <span className='star'>*</span></label>
                                <input type='number' id='HourlyRate' name='hourlyRate'
                                    placeholder='e.g. 500'
                                    value={formData.hourlyRate} onChange={handleChange} onBlur={handleBlur}
                                    className={touched.hourlyRate && errors.hourlyRate ? 'input-error' : ''} />
                                {touched.hourlyRate && errors.hourlyRate && <p className="error-text">{errors.hourlyRate}</p>}
                            </div>

                            <button className='complete' onClick={handleNext} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceProviderProfileEdit;