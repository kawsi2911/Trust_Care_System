import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({

    FullName: {
        type: String,
        required: true,
    },

    NIC: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    dob: {
        type: String,
        required: true
    },

    fulladdress: {
        type: String,
        required: true
    },

    // ✅ FIXED: was type: ["ElderCare", ...] which is invalid mongoose syntax
    serviceType: {
        type: [String],
        required: true
    },

    year: {
        type: String,
        required: true
    },

    qualifications: {
        type: String,
        required: true
    },

    uploadprofile: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    workRadius: {
        type: String,
        required: true
    },

    available: {
        type: String,
        required: true
    },

    hourlyRate: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

const providerModel = mongoose.model("ServiceProvider", providerSchema);

export default providerModel;