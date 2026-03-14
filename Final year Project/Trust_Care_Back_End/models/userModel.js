import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  nic: {
    type: String,
    trim: true,
  },
  userType: {
    type: String,
    enum: ["Family", "ServiceProvider"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Pending", "Inactive", "Verified"],
    default: "Pending",
  },
  services: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;