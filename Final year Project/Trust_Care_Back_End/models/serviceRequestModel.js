import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({

  Page: String,
  PName: String,
  relationship: String,
  Gender: String,
  Service: String,
  PatientType: String,

  SLocation: String,
  Address: String,
  serviceOptions: String,
  disabilityDetails: String,
  preferredGender: String,
  additionalRequirement: String,

  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("ServiceRequest", serviceRequestSchema);
