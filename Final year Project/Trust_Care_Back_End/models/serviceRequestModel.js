import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({

    // Form 1 fields
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },

    Page: { type: String, required: true },           // patient age
    PName: { type: String, required: true },          // patient name
    relationship: { type: String, required: true },
    Gender: { type: String, required: true },         // patient gender
    Service: { type: String, required: true },        // duration: Hourly/Daily/Weekly/Monthly
    PatientType: { type: String, required: true },    // eldercare/childcare/etc

    // Form 2 fields
    SLocation: { type: String, required: true },
    Address: { type: String, required: true },
    serviceOptions: { type: String, required: true }, // Yes/No disabilities
    disabilityDetails: { type: String },              // optional
    additionalRequirement: { type: String, required: true },
    preferredGender: { type: String },                // preferred caregiver gender

    // ✅ FIXED: added status field — was missing, caused dashboard queries to fail
    status: {
        type: String,
        enum: ["pending", "matched", "completed", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.model("ServiceRequest", serviceRequestSchema);