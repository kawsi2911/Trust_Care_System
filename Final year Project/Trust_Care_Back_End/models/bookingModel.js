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
    enum: ["pending", "active", "completed", "cancelled", "paid", "reviewed"],
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
  // ✅ Review fields
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
  },
  recommend: {
    type: String,
  },
  aspects: {
    professionalism: { type: Number, default: 0 },
    punctuality:     { type: Number, default: 0 },
    communication:   { type: Number, default: 0 },
    qualityOfCare:   { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;