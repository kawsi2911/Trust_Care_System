// models/serviceRequestModel.js
import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family", required: true },
    PatientType: { type: String, required: true },
    PName: { type: String, required: true },
    relationship: { type: String, required: true },
    Page: { type: String, required: true },
    Service: { type: String, required: true },
    SLocation: { type: String, required: true },
    Address: { type: String, required: true },
    serviceOptions: { type: String, required: true },
    disabilityDetails: { type: String, default: "" },
    Gender: { type: String, required: true },
    additionalRequirement: { type: String, required: true }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;