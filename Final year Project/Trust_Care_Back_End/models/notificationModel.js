import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

  familyId: {
    type: String,
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