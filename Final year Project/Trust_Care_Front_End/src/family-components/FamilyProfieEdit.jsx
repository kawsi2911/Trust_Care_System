import Header from "../Header/Header.jsx";
import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";



function FamilyProfieEdit(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        familyFullName: "",
        familynic: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
        city: "",
        username: "",
        createpassword: "",
        confirmpassword: "",
        check: false,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Update form state
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Mark field as touched
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validate();
    };

    // Validation logic
    const validate = () => {
        let newErrors = {};

        if (!formData.familyFullName.trim()) newErrors.familyFullName = "Full Name is required";
        if (!formData.familynic.trim()) newErrors.familynic = "NIC is required";

        if (!formData.phone.trim()) {
            newErrors.phone = "Contact Number is required";
        } else if (!/^(\+94|0)\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid phone number";
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

        if (!formData.username.trim()){
            newErrors.username = "Username is required";
         } 

        if (!formData.createpassword.trim()) {
            newErrors.createpassword = "Password is required";
        }
        else if (formData.createpassword.length < 6){
            newErrors.createpassword = "Password must be at least 6 characters";
        }
     
        if (!formData.confirmpassword.trim()) {
            newErrors.confirmpassword = "Please confirm your password";
        } 
        else if (formData.createpassword !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
        }

        if (!formData.check) {
            newErrors.check = "You must agree to Terms & Conditions";
        }

        setErrors(newErrors);
        return newErrors;
    };


    const [user, setUser] = useState({});

   useEffect(() => {

    const userId =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId");

    if (!userId) {
        navigate("/familylogin");
        return;
    }

    fetch(`http://localhost:5000/api/family/${userId}`)
        .then(res => res.json())
       .then(data => {
  if (data.success && data.user) {
    setUser(data.user);

    setFormData({
      familyFullName: data.user.familyFullName || "",
      familynic: data.user.familynic || "",
      phone: data.user.phone || "",
      email: data.user.email || "",
      gender: data.user.gender || "",
      address: data.user.address || "",
      city: data.user.city || "",
      username: data.user.username || "",
      createpassword: "",
      confirmpassword: "",
      check: true
    });
  }
})
        .catch(err => console.log(err));

}, [navigate]);
    
    

const handlelogout = async (e) => {

    e.preventDefault();

    setTouched({
        familyFullName: true,
        familynic: true,
        phone: true,
        email: true,
        gender: true,
        address: true,
        city: true,
        username: true,
        createpassword: true,
        confirmpassword: true
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    const userId =
        localStorage.getItem("userId") ||
        sessionStorage.getItem("userId");

    try {

        const res = await fetch(`http://localhost:5000/api/family/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                username: formData.username,
                password: formData.createpassword
            })
        });

        const data = await res.json();

        if (res.ok) {

            Swal.fire({
                icon: "success",
                title: "Profile Updated 🎉",
                text: "Your profile has been updated successfully!",
            }).then(() => navigate("/familyhome"));

        } else {

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: data.message
            });

        }

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: error.message
        });

    }

};
    

    return(
        <div>
            <Header/>
             <div className = 'ServiceSection'>
                <div className = 'Service_container'>

                    <p className = 'para'>Service Taker Edit Details </p>

                    <div className = 'form'>
                        <div className = 'form-fill'>

                            <div className = 'row'>
                                <label htmlFor = 'Family-FullName'> Full Name : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-FullName' name = 'Family-FullName' placeholder = 'Enter your Full Name' value={user.familyFullName} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-NIC'>NIC Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-NIC' name = 'Family-NIC' placeholder = 'Enter the NIC (123456789V / 122344112555)' value={user.familynic} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-Phone'>Contact Number : <label className='star'> * </label> </label>
                                <input type = 'text' disabled id = 'Family-Phone' name = 'Family-Phone' placeholder = '+94 77 123 4567' value={user.phone} />
                            </div>

                            <div className = 'row'>
                                <label htmlFor = 'Family-Email'>Email Address : <label className='star'> * </label> </label>
                                <input type = 'email' disabled id = 'Family-Email' name = 'Family-Email' placeholder = 'example@gmail.com' value={user.email} />
                            </div>

                            {/* Gender */}
                            <div className='row'>
                                <label>Gender : <span className='star'>*</span></label>
                                <div className={`gender-options ${touched.gender && errors.gender ? "input-error" : ""}`}>
                                    <input type='radio' id='male' name='gender' value='Male' checked={formData.gender === "Male"} onChange={handleChange} /><label htmlFor='male'>Male</label>
                                    <input type='radio' id='female' name='gender' value='Female' checked={formData.gender === "Female"} onChange={handleChange} /><label htmlFor='female'>Female</label>
                                    <input type='radio' id='other' name='gender' value='Other' checked={formData.gender === "Other"} onChange={handleChange} /><label htmlFor='other'>Other</label>
                                </div>
                                {touched.gender && errors.gender && (
                                    <p className="error-text">{errors.gender}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className='row'>
                                <label htmlFor='address'>Full Address : <span className='star'>*</span></label>
                                <textarea id='address'  name='address'  placeholder='Enter your Full Address' value={formData.address} onChange={handleChange}onBlur={handleBlur} className={touched.address && errors.address ? 'input-error' : ''} ></textarea>
                                {touched.address && errors.address && <p className="error-text">{errors.address}</p>}
                            </div>

                            {/* City */}
                            <div className='row'>
                                <label htmlFor='city'>City / Location : <span className='star'>*</span></label>
                                <input type='text' id='city'name='city'placeholder='Enter the City' value={formData.city} onChange={handleChange}onBlur={handleBlur} className={touched.city && errors.city ? 'input-error' : ''}/>
                                {touched.city && errors.city && <p className="error-text">{errors.city}</p>}
                            </div>

                              {/* Username */}
              <div className="row">
                <label htmlFor="username">
                  Username : <span className="star">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.username && errors.username ? "input-error" : ""}
                />
                {touched.username && errors.username && <p className="error-text">{errors.username}</p>}
              </div>

                            {/* Create Password */}
              <div className="row">
                <label htmlFor="create_password">
                  Create Password : <span className="star">*</span>
                </label>
                <input
                  type="password"
                  id="create_password"
                  name="createpassword"
                  placeholder="Enter a strong password"
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
                <label htmlFor="confirmpassword">
                  Confirm Password : <span className="star">*</span>
                </label>
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="Re-enter password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.confirmpassword && errors.confirmpassword ? "input-error" : ""}
                />
                {touched.confirmpassword && errors.confirmpassword && (
                  <p className="error-text">{errors.confirmpassword}</p>
                )}
              </div>



                            <button className = 'next' onClick={handlelogout} > Completed </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FamilyProfieEdit;