import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
  providerId:       { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
  familyId:         { type: mongoose.Schema.Types.ObjectId, ref: "Family", required: true },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  },
  patientType:  { type: String },
  location:     { type: String },
  duration:     { type: String },
  rate:         { type: Number },
  startDate:    { type: Date },
  endDate:      { type: Date },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);