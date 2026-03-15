import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  familyId: {
    type: mongoose.Schema.Types.ObjectId
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId
  },

  role: {
    type: String,
    enum: ["family","provider"],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  serviceType:{
    type:String
  },

  status:  { type: String, 
    enum: ["pending", "accepted", "declined"], 
    default: "pending" 
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;