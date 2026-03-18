import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  familyFullName: {
    type: String,
    required: true,
  },

  familynic: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  // ✅ ADDED: status field for admin to activate/deactivate families
  status: {
    type: String,
    default: "Active"
  },

}, {
  timestamps: true  
});


const familyModel = mongoose.model("Family", userSchema);

export default familyModel;