import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
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

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;