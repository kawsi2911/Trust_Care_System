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

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Notification", NotificationSchema);