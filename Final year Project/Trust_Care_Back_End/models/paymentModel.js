import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    unique: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  familyName: {
    type: String,
    required: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
  providerPayout: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "Bank Transfer", "Cash"],
    default: "Card",
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  // PayHere specific fields
  payhereOrderId: {
    type: String,
  },
  payherePaymentId: {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto generate payment number
paymentSchema.pre("save", async function () {
  if (!this.paymentNumber) {
    const count = await mongoose.model("Payment").countDocuments();
    this.paymentNumber = `PAY${String(count + 1).padStart(4, "0")}`;
  }
  // Auto calculate commission (10%) and provider payout
  if (this.amount) {
    this.commission    = this.amount * 0.10;
    this.providerPayout = this.amount * 0.90;
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;