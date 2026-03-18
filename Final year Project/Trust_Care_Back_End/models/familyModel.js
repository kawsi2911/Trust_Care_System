import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  familyFullName: { type: String, required: true },
  familynic: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  gender: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },

  username: { type: String, unique: true, sparse: true }, 
  password: { type: String },

  status: { type: String, default: "Active" },

  // ✅ NEW
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpire: { type: Date }

}, { timestamps: true });

export default mongoose.model("Family", userSchema);