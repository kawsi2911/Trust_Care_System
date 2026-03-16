import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../Header/Header.jsx';
import Swal from 'sweetalert2';

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

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(true);

    const providerId = localStorage.getItem("providerId") || sessionStorage.getItem("providerId");

    // Fetch user data on mount
    useEffect(() => {
        if (!providerId) return navigate("/serviceproviderloginpage");

        fetch(`http://localhost:5000/api/service/${providerId}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    FullName: data.FullName || "",
                    NIC: data.NIC || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    gender: data.gender || "",
                    dob: data.dob ? data.dob.split("T")[0] : "", // yyyy-mm-dd format
                    fulladdress: data.fulladdress || "",
                    serviceType: data.serviceType || [],
                    year: data.year || "",
                    qualifications: data.qualifications || "",
                    uploadprofile: data.uploadprofile || "", // URL from backend
                    location: data.location || "",
                    workRadius: data.workRadius || "",
                    available: data.available || "",
                    hourlyRate: data.hourlyRate || ""
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [navigate, providerId]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            let updatedServices = [...formData.serviceType];
            if (checked) {
                updatedServices.push(value);
            } else {
                updatedServices = updatedServices.filter(s => s !== value);
            }
            setFormData({ ...formData, serviceType: updatedServices });
            setErrors({ ...errors, serviceType: updatedServices.length === 0 ? "Select the works" : undefined });

        } else if (type === "file") {
            setFormData({ ...formData, uploadprofile: files[0] });
            setErrors({ ...errors, uploadprofile: files[0] ? undefined : "Upload the profile image" });

        } else {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: value.trim() !== "" ? undefined : errors[name] });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.FullName.trim()) newErrors.FullName = "Full Name is Required";
        if (!formData.NIC.trim()) newErrors.NIC = "NIC is Required";
        if (!formData.available.trim()) newErrors.available = "Available Duration is Required";
        if (!formData.dob.trim()) newErrors.dob = "Date of Birth is Required";
        if (!formData.email.trim()) newErrors.email = "Email is Required";
        if (!formData.fulladdress.trim()) newErrors.fulladdress = "Address is Required";
        if (!formData.gender) newErrors.gender = "Gender is Required";
        if (!formData.hourlyRate.trim()) newErrors.hourlyRate = "Rate is Required";
        if (!formData.location.trim()) newErrors.location = "Location is Required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is Required";
        if (!formData.qualifications.trim()) newErrors.qualifications = "Qualifications are Required";
        if (formData.serviceType.length === 0) newErrors.serviceType = "Select the works";
        if (!formData.workRadius.trim()) newErrors.workRadius = "Work Radius is Required";
        if (!formData.year.trim()) newErrors.year = "Years of Experience is Required";
        if (!formData.uploadprofile) newErrors.uploadprofile = "Upload the profile image";

        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async () => {

    const validationErrors = validate();

    setTouched({
        FullName: true,
        NIC: true,
        phone: true,
        email: true,
        gender: true,
        dob: true,
        fulladdress: true,
        serviceType: true,
        year: true,
        qualifications: true,
        uploadprofile: true,
        location: true,
        workRadius: true,
        available: true,
        hourlyRate: true
    });

    if (Object.keys(validationErrors).length > 0) return;

    try {

        const response = await fetch(`http://localhost:5000/api/service/${providerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {

            Swal.fire({
                icon: "success",
                title: "Profile Updated!",
                text: "Your profile has been successfully updated.",
                confirmButtonText: "OK"
            }).then(() => {
                navigate("/profiledashboard");
            });

        } else {

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: result.message || "Something went wrong",
                confirmButtonText: "OK"
            });

        }

    } catch (err) {

        console.error("Update error:", err);

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Something went wrong, please try again."
        });

    }
};

    if (loading) return <p>Loading profile...</p>;

    return (
        <>
            <Header />
            <div className='ServiceSection'>
                <div className='Service_container'>
                    <p className='para'>Service Provider Edit Details </p>
                    <div className='form'>
                        <div className='form-fill'>
                            {/* Full Name */}
                            <div className='row'>
                                <label>Full Name: <span className='star'>*</span></label>
                                <input type='text' name='FullName' value={formData.FullName} disabled onChange={handleChange} onBlur={handleBlur} className={touched.FullName && errors.FullName ? 'input-error' : ''} />
                            </div>

                            {/* NIC */}
                            <div className='row'>
                                <label>NIC: <span className='star'>*</span></label>
                                <input type='text' name='NIC' value={formData.NIC} disabled onChange={handleChange} onBlur={handleBlur} className={touched.NIC && errors.NIC ? 'input-error' : ''} />
                            </div>

                            {/* Phone */}
                            <div className='row'>
                                <label>Phone: <span className='star'>*</span></label>
                                <input type='text' name='phone' value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={touched.phone && errors.phone ? 'input-error' : ''} />
                            </div>

                            {/* Email */}
                            <div className='row'>
                                <label>Email: <span className='star'>*</span></label>
                                <input type='email' name='email' value={formData.email} onChange={handleChange} onBlur={handleBlur} className={touched.email && errors.email ? 'input-error' : ''} />
                            </div>

                            {/* Gender */}
                            <div className='row'>
                                <label>Gender: <span className='star'>*</span></label>
                                <div className={`gender-options ${touched.gender && errors.gender ? "input-error" : ""}`}>
                                    <input type='radio' id='Male' name='gender' value='male' checked={formData.gender === 'male'} onChange={handleChange} /> <label htmlFor='Male'>Male</label>
                                    <input type='radio' id='Female' name='gender' value='female' checked={formData.gender === 'female'} onChange={handleChange} /> <label htmlFor='Female'>Female</label>
                                    <input type='radio' id='Other' name='gender' value='others' checked={formData.gender === 'others'} onChange={handleChange} /> <label htmlFor='Other'>Other</label>
                                </div>
                                {touched.gender && errors.gender && <div className="error-text">{errors.gender}</div>}
                            </div>

                            {/* DOB */}
                            <div className='row'>
                                <label>DOB: <span className='star'>*</span></label>
                                <input type='date' name='dob' value={formData.dob} disabled onChange={handleChange} onBlur={handleBlur} className={touched.dob && errors.dob ? 'input-error' : ''} />
                            </div>

                            {/* Address */}
                            <div className='row'>
                                <label>Address: <span className='star'>*</span></label>
                                <textarea name='fulladdress' value={formData.fulladdress} onChange={handleChange} onBlur={handleBlur} className={touched.fulladdress && errors.fulladdress ? 'input-error' : ''}></textarea>
                            </div>

                            {/* Services */}
                            <div className='rows'>
                                <label>Service Type: <span className='star'>*</span></label>
                                <div className='checkbox-options'>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='ElderCare' checked={formData.serviceType.includes("ElderCare")} onChange={handleChange} /> Elder Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='ChildCare' checked={formData.serviceType.includes("ChildCare")} onChange={handleChange} /> Child Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='HospitalPatientCare' checked={formData.serviceType.includes("HospitalPatientCare")} onChange={handleChange} /> Hospital Patient Care
                                    </label>
                                    <label>
                                        <input type='checkbox' name='serviceType' value='HomePatientCare' checked={formData.serviceType.includes("HomePatientCare")} onChange={handleChange} /> Home Patient Care
                                    </label>
                                </div>
                                {touched.serviceType && errors.serviceType && <p className="error-text">{errors.serviceType}</p>}
                            </div>

                            {/* Experience */}
                            <div className='row'>
                                <label>Years of Experience: <span className='star'>*</span></label>
                                <input type='number' name='year' value={formData.year} onChange={handleChange} onBlur={handleBlur} className={touched.year && errors.year ? 'input-error' : ''} />
                            </div>

                            {/* Qualifications */}
                            <div className='row'>
                                <label>Qualifications: <span className='star'>*</span></label>
                                <textarea name='qualifications' value={formData.qualifications} onChange={handleChange} onBlur={handleBlur} className={touched.qualifications && errors.qualifications ? 'input-error' : ''}></textarea>
                            </div>

                            {/* Profile Image */}
                            <div className='row'>
                                <label>Profile Image: <span className='star'>*</span></label>
                                <div className="upload-icon" onClick={() => document.getElementById('uploadInput').click()}>
                                    {formData.uploadprofile ? (
                                        typeof formData.uploadprofile === "string" ? (
                                            <img src={formData.uploadprofile} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                        ) : (
                                            <img src={URL.createObjectURL(formData.uploadprofile)} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                        )
                                    ) : (
                                        <>
                                            📷<br />
                                            <span>Click to upload photo</span>
                                            <small>JPG, PNG • max 5MB</small>
                                        </>
                                    )}
                                </div>
                                <input type="file" id="uploadInput" name="uploadprofile" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleChange} />
                                {touched.uploadprofile && errors.uploadprofile && <p className="error-text">{errors.uploadprofile}</p>}
                            </div>

                            {/* Location */}
                            <div className='row'>
                                <label>Location: <span className='star'>*</span></label>
                                <input type='text' name='location' value={formData.location} onChange={handleChange} onBlur={handleBlur} className={touched.location && errors.location ? 'input-error' : ''} />
                            </div>

                            {/* Work Radius */}
                            <div className='row'>
                                <label>Work Radius (Km): <span className='star'>*</span></label>
                                <input type='text' name='workRadius' value={formData.workRadius} onChange={handleChange} onBlur={handleBlur} className={touched.workRadius && errors.workRadius ? 'input-error' : ''} />
                            </div>

                            {/* Availability */}
                            <div className='row'>
                                <label>Available Duration: <span className='star'>*</span></label>
                                <div className={`duration-options ${touched.available && errors.available ? "input-error" : ""}`}>
                                    <input type='radio' id='Fulltime' name='available' value='Fulltime' checked={formData.available === "Fulltime"} onChange={handleChange} /> <label htmlFor='Fulltime'>Full Time</label>
                                    <input type='radio' id='Parttime' name='available' value='Parttime' checked={formData.available === "Parttime"} onChange={handleChange} /> <label htmlFor='Parttime'>Part Time</label>
                                    <input type='radio' id='Flexible' name='available' value='Flexible' checked={formData.available === "Flexible"} onChange={handleChange} /> <label htmlFor='Flexible'>Flexible</label>
                                </div>
                                {touched.available && errors.available && <div className="error-text">{errors.available}</div>}
                            </div>

                            {/* Hourly Rate */}
                            <div className='row'>
                                <label>Hourly Rate (Rs): <span className='star'>*</span></label>
                                <input type='number' name='hourlyRate' value={formData.hourlyRate} onChange={handleChange} onBlur={handleBlur} className={touched.hourlyRate && errors.hourlyRate ? 'input-error' : ''} />
                            </div>

                            <button className='complete' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceProviderProfileEdit;