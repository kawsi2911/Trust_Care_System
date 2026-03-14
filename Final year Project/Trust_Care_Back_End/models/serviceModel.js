import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceNumber: {
    type: String,
    unique: true,
  },
  serviceType: {
    type: String,
    enum: ["Elder Care", "Child Care", "Home Patient Care", "Hospital Patient Care"],
    required: true,
  },
  provider: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  client: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Completed", "Cancelled", "Issue Reported"],
    default: "Active",
  },
  amount: {
    type: Number,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  issueDescription: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto generate service number before saving
serviceSchema.pre("save", async function () {
  if (!this.serviceNumber) {
    const count = await mongoose.model("Service").countDocuments();
    this.serviceNumber = `SRV${String(count + 1).padStart(4, "0")}`;
  }
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;