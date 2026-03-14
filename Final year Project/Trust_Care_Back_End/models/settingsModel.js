import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: "Trust Care",
  },
  supportEmail: {
    type: String,
    default: "support@trustcare.lk",
  },
  supportPhone: {
    type: String,
    default: "+94 11 234 5678",
  },
  commission: {
    type: Number,
    default: 10,
  },
  serviceFee: {
    type: Number,
    default: 500,
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms:   { type: Boolean, default: true },
    push:  { type: Boolean, default: true },
    daily: { type: Boolean, default: false },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;