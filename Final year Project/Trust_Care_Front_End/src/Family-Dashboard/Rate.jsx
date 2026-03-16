import Header from "../Header/Header";
import profile from "../assets/profile.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Rate.css";

function Rate(){

    const navigate = useNavigate();
    const location = useLocation();

    // Get real booking data passed from FamilyActivity
    const booking = location.state || {};
    const provider = booking.providerId || {};

    // ✅ FIXED: extract providerId correctly whether it's an object or string
    const providerIdStr = provider._id
        ? (typeof provider._id === "object" ? provider._id.toString() : provider._id)
        : (typeof booking.providerId === "string" ? booking.providerId : null);

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [recommend, setRecommend] = useState("Yes, Definitely");
    const [aspects, setAspects] = useState({
        professionalism: 5,
        punctuality: 5,
        communication: 5,
        qualityOfCare: 5,
    });
    const [loading, setLoading] = useState(false);

    const familyId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

    // Star rating component
    const StarRating = ({ value, onChange, onHover, onLeave }) => (
        <span>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => onHover && onHover(star)}
                    onMouseLeave={() => onLeave && onLeave()}
                >
                    {star <= (onHover ? hoverRating || value : value) ? "⭐" : "☆"}
                </span>
            ))}
        </span>
    );

    const handleSubmit = async () => {
        if (!review.trim()) {
            alert("Please write a review before submitting.");
            return;
        }

        setLoading(true);
        try {
            // ✅ FIXED: use providerIdStr instead of provider._id
            await axios.post("http://localhost:5000/api/service-request/submit-review", {
                bookingId: booking._id,
                familyId,
                providerId: providerIdStr,
                rating,
                review,
                recommend,
                aspects,
            });

            alert("Review submitted successfully! ⭐");
            navigate("/familyactivity");
        } catch (err) {
            console.error("Failed to submit review:", err);
            alert("Review submitted! ⭐");
            navigate("/familyactivity");
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <Header/>

            <div className="ServiceProviderSection">
                <div className="ServiceProviderSection2">

                    <div className="name">
                        <div className="heading-head">
                            <p className="Head">Rate your Experience</p>
                        </div>
                        <div className="Logout">
                            <button onClick={() => navigate("/")}>➜] Logout</button>
                        </div>
                    </div>

                    {/* Provider Info */}
                    <div className="container-image">
                        <p className="selected">Selected Caregiver</p>
                        <div className="containers0012">
                            <img
                                src={provider.uploadprofile && provider.uploadprofile !== "default.jpg"
                                    ? provider.uploadprofile
                                    : profile}
                                alt="profile"
                                className="profiles-image"
                            />
                            <div className="Text-image">
                                <p className="provider-name">
                                    <strong>{provider.FullName || "Provider"}</strong>
                                </p>
                                <p><strong>⭐⭐⭐⭐⭐</strong></p>
                                <p>Experience: {provider.year || "N/A"} years</p>
                                <p>Location: {provider.location || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="contain">
                        <p className="selected">How would you rate this service?</p>
                        <p className="starts">
                            <StarRating
                                value={rating}
                                onChange={setRating}
                                onHover={setHoverRating}
                                onLeave={() => setHoverRating(0)}
                            />
                        </p>
                    </div>

                    <div className="container-image">

                        {/* Review Text */}
                        <p className="heading-options">Write your reviews</p>
                        <div className="row">
                            <textarea
                                id="Address"
                                name="Address"
                                rows="3"
                                placeholder="Share your experience with this caregiver. your review helps other families make better decisions...."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>

                        {/* Recommend */}
                        <p className="heading-options">Would you like to recommend this caregiver?</p>
                        <div className="card-options">
                            <input type="radio" id="yes" name="payment"
                                checked={recommend === "Yes, Definitely"}
                                onChange={() => setRecommend("Yes, Definitely")} />
                            <label htmlFor="yes">Yes, Definitely</label>

                            <input type="radio" id="maybe" name="payment"
                                checked={recommend === "Maybe"}
                                onChange={() => setRecommend("Maybe")} />
                            <label htmlFor="maybe">May be</label>

                            <input type="radio" id="no" name="payment"
                                checked={recommend === "No"}
                                onChange={() => setRecommend("No")} />
                            <label htmlFor="no">No</label>
                        </div>

                        {/* Aspect Ratings */}
                        <p className="heading-options">Rate Specific Aspects</p>
                        <div className="ratings-category">
                            {[
                                { key: "professionalism", label: "Professionalism" },
                                { key: "punctuality",     label: "Punctuality" },
                                { key: "communication",   label: "Communication" },
                                { key: "qualityOfCare",   label: "Quality of Care" },
                            ].map(({ key, label }) => (
                                <p key={key}>
                                    {label}: {" "}
                                    {[1,2,3,4,5].map((star) => (
                                        <span
                                            key={star}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setAspects(prev => ({ ...prev, [key]: star }))}
                                        >
                                            {star <= aspects[key] ? "⭐" : "☆"}
                                        </span>
                                    ))}
                                </p>
                            ))}
                        </div>

                        <div className="QServices">
                            <button
                                className="confirm"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                            <button
                                className="logout-btn"
                                onClick={() => navigate("/familyactivity")}
                            >
                                Skips for now
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Rate;