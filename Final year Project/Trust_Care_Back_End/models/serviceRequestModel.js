import mongoose from "mongoose";

const ServiceRequestSchema = new mongoose.Schema({

    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },

    // Form 1
    PatientType: {
        type: String,
        required: true
    },

    PName: {
        type: String,
        required: true
    },

    relationship: {
        type: String,
        required: true
    },

    Page: {
        type: Number,
        required: true
    },

    Gender: {
        type: String,
        required: true
    },

    Service: {
        type: String,
        required: true
    },

    // Form 2

    SLocation: {
        type: String,
        required: true
    },

    Address: {
        type: String,
        required: true
    },

    serviceOptions: {
        type: String,
        required: true
    },

    disabilityDetails: {
        type: String
    },

    preferredGender: {
        type: String,
        required: true
    },

    additionalRequirement: {
        type: String,
        required: true
    },

}, { timestamps: true });

export default mongoose.model("ServiceRequest", ServiceRequestSchema);