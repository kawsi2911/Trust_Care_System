import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceRequest",
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled", "paid"],
    default: "pending",
  },
  patientType: {
    type: String,
  },
  location: {
    type: String,
  },
  duration: {
    type: String,
  },
  rate: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;