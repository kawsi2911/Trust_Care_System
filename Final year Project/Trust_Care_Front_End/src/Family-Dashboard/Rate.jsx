import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./Rate.css";
import { useState } from "react";
import axios from "axios";

function Rate() {

    const navigate  = useNavigate();
    const location  = useLocation();

    // ✅ FIXED: receives real provider + booking data from FamilyActivity
    const { booking, provider } = location.state || {};

    const [rating,      setRating]      = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review,      setReview]      = useState("");
    const [recommend,   setRecommend]   = useState("");
    const [aspects,     setAspects]     = useState({
        professionalism: 0,
        punctuality:     0,
        communication:   0,
        qualityOfCare:   0
    });
    const [loading, setLoading] = useState(false);

    // Star click handler
    const handleStar = (value) => setRating(value);

    // Aspect star handler
    const handleAspect = (aspect, value) => {
        setAspects({ ...aspects, [aspect]: value });
    };

    // Render stars row
    const StarRow = ({ value, onSet }) => (
        <span>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n}
                    style={{ cursor: "pointer", fontSize: "22px", color: n <= value ? "#f5a623" : "#ccc" }}
                    onClick={() => onSet(n)}>
                    ★
                </span>
            ))}
        </span>
    );

    // ✅ FIXED: calls backend to save review — was just navigating
    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a star rating before submitting.");
            return;
        }
        if (!review.trim()) {
            alert("Please write a review before submitting.");
            return;
        }
        if (!recommend) {
            alert("Please select a recommendation option.");
            return;
        }

        setLoading(true);
        try {
            const familyId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

            await axios.post("http://localhost:5000/api/service-request/submit-review", {
                bookingId:      booking?._id,
                providerId:     provider?._id,
                familyId,
                rating,
                review,
                recommend,
                aspects
            });

            alert("Review submitted successfully! ⭐");
            navigate("/familyactivity");

        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED: logout proper
    const handleLogout = () => {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        navigate("/familylogin");
    };

    return (
        <>
            <Header />

            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Rate your Experience</p>
                        </div>
                        <div className="Logout">
                            <button onClick={handleLogout}>➜ Logout</button>
                        </div>
                    </div>

                    {/* ✅ FIXED: shows real provider info */}
                    <div className="container-image">
                        <p className="selected">Caregiver</p>
                        <div className="containers0012">
                            <img
                                src={provider?.uploadprofile || profile}
                                alt='profile'
                                className='profiles-image'
                            />
                            <div className="Text-image">
                                <p className="provider-name"><strong>{provider?.FullName || "Provider"}</strong></p>
                                <p>{booking?.serviceRequestId?.PatientType || "Care Service"}</p>
                                <p>Experience: {provider?.year || "N/A"} years</p>
                                <p>Location: {provider?.location || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Overall rating */}
                    <div className="contain">
                        <p className="selected">How would you rate this service?</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "10px 0" }}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <span key={n}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "32px",
                                        color: n <= (hoverRating || rating) ? "#f5a623" : "#ccc"
                                    }}
                                    onClick={() => handleStar(n)}
                                    onMouseEnter={() => setHoverRating(n)}
                                    onMouseLeave={() => setHoverRating(0)}>
                                    ★
                                </span>
                            ))}
                        </div>
                        {rating > 0 && <p style={{ textAlign: "center" }}>{rating}/5 stars selected</p>}
                    </div>

                    <div className="container-image">

                        {/* Written review */}
                        <p className="heading-options">Write your review</p>
                        <div className='row'>
                            <textarea
                                rows="4"
                                placeholder='Share your experience with this caregiver. Your review helps other families make better decisions...'
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Recommend */}
                        <p className="heading-options">Would you recommend this caregiver?</p>
                        <div className='card-options'>
                            <input type='radio' id='yes'   name='recommend' value='yes'
                                checked={recommend === "yes"}   onChange={() => setRecommend("yes")} />
                            <label htmlFor='yes'>Yes, Definitely</label>

                            <input type='radio' id='maybe' name='recommend' value='maybe'
                                checked={recommend === "maybe"} onChange={() => setRecommend("maybe")} />
                            <label htmlFor='maybe'>Maybe</label>

                            <input type='radio' id='no'    name='recommend' value='no'
                                checked={recommend === "no"}    onChange={() => setRecommend("no")} />
                            <label htmlFor='no'>No</label>
                        </div>

                        {/* Specific aspect ratings */}
                        <p className="heading-options">Rate Specific Aspects</p>
                        <div className="ratings-category">
                            <p>Professionalism: <StarRow value={aspects.professionalism} onSet={(v) => handleAspect("professionalism", v)} /></p>
                            <p>Punctuality:     <StarRow value={aspects.punctuality}     onSet={(v) => handleAspect("punctuality",     v)} /></p>
                            <p>Communication:   <StarRow value={aspects.communication}   onSet={(v) => handleAspect("communication",   v)} /></p>
                            <p>Quality of Care: <StarRow value={aspects.qualityOfCare}   onSet={(v) => handleAspect("qualityOfCare",   v)} /></p>
                        </div>

                        <div className="QServices">
                            <button className="confirm" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                            <button className="logout-btn" onClick={() => navigate("/familyactivity")}>
                                Skip for Now
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Rate;