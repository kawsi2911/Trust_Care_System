import Header from "../Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
        city: ""
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

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
        let newErrors = {};

        if (!formData.familyFullName.trim()) {
            newErrors.familyFullName = "Full Name is required";
        }

        if (!formData.familynic.trim()) {
            newErrors.familynic = "NIC is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Contact Number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit number";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        setErrors(newErrors);
        return newErrors;
    };

    const handleNext = () => {
        const validationErrors = validate();

        setTouched({
            familyFullName: true,
            familynic: true,
            phone: true,
            email: true,
            gender: true,
            address: true,
            city: true
        });

        if (Object.keys(validationErrors).length === 0) {
            navigate("/servicetaken");
        }
    };

    return (
        <>
            <Header />
            <div className='ServiceSection'>
                <div className='Service_container'>
                    <p className='para'>Service Taker Registration</p>
                    <div className='form'>
                        <div className='form-fill'>

                            {/* Full Name */}
                            <div className='row'>
                                <label htmlFor='familyFullName'>
                                    Full Name : <span className='star'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='familyFullName'
                                    name='familyFullName'
                                    placeholder='Enter your Full Name'
                                    value={formData.familyFullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.familyFullName && errors.familyFullName ? 'input-error' : ''}
                                />
                                {touched.familyFullName && errors.familyFullName && (
                                    <p className="error-text">{errors.familyFullName}</p>
                                )}
                            </div>

                            {/* NIC */}
                            <div className='row'>
                                <label htmlFor='family-nic'>
                                    NIC Number : <span className='star'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='family-nic'
                                    name='familynic'
                                    placeholder='Enter your NIC'
                                    value={formData.familynic}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.familynic && errors.familynic ? 'input-error' : ''}
                                />
                                {touched.familynic && errors.familynic && (
                                    <p className="error-text">{errors.familynic}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className='row'>
                                <label htmlFor='Family-Phone'>
                                    Contact Number : <span className='star'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='Family-Phone'
                                    name='phone'
                                    placeholder='Enter your Contact Number'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.phone && errors.phone ? 'input-error' : ''}
                                />
                                {touched.phone && errors.phone && (
                                    <p className="error-text">{errors.phone}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className='row'>
                                <label htmlFor='Family-Email'>
                                    Email Address : <span className='star'>*</span>
                                </label>
                                <input
                                    type='email'
                                    id='Family-Email'
                                    name='email'
                                    placeholder='Enter your Email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.email && errors.email ? 'input-error' : ''}
                                />
                                {touched.email && errors.email && (
                                    <p className="error-text">{errors.email}</p>
                                )}
                            </div>

                           {/* Gender */}
                            <div className='row'>
                                <label>Gender : <span className='star'>*</span></label>
                                <div className={`gender-options ${touched.gender && errors.gender ? "input-error" : ""}`}>
                                    <input type='radio' id='male' name='gender' value='Male' checked={formData.gender === "Male"} onChange={handleChange} /><label htmlFor='male'>Male</label>
                                    <input type='radio' id='female' name='gender' value='Female' checked={formData.gender === "Female"} onChange={handleChange} /> <label htmlFor='female'>Female</label>
                                    <input type='radio' id='other' name='gender' value='Other' checked={formData.gender === "Other"} onChange={handleChange} /><label htmlFor='other'>Other</label>
                                </div>
                                    {touched.gender && errors.gender && (
                                        <p className="error-text">{errors.gender}</p>
                                    )}
                            </div>

                            {/* Address */}
                            <div className='row'>
                                <label htmlFor='Family-Address'>
                                    Full Address : <span className='star'>*</span>
                                </label>
                                <textarea
                                    id='Family-Address'
                                    name='address'
                                    placeholder='Enter your Full Address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.address && errors.address ? 'input-error' : ''}
                                ></textarea>
                                {touched.address && errors.address && <p className="error-text">{errors.address}</p>}
                            </div>

                            {/* City */}
                            <div className='row'>
                                <label htmlFor='Family-City'>
                                    City / Location : <span className='star'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='Family-City'
                                    name='city'
                                    placeholder='Enter the City'
                                    value={formData.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.city && errors.city ? 'input-error' : ''}
                                />
                                {touched.city && errors.city && <p className="error-text">{errors.city}</p>}
                            </div>

                            {/* Next Button */}
                            <button className='next' onClick={handleNext}>
                                Next Step
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FamilyRegister;