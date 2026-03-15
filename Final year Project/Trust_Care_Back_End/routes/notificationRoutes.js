import express from "express"; 
import Notification from "../models/notificationModel.js";
import providerModel from "../models/providerModel.js";

const router = express.Router();

// Fetch all notifications for a provider (only pending)
router.get("/:receiverId", async (req, res) => {
  try {
    const notifications = await Notification
      .find({ receiverId: req.params.receiverId, status: "pending" })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new notification
router.post("/create", async (req, res) => {
  try {
    const { receiverId, title, message } = req.body;

    const notification = new Notification({
      receiverId,
      title,
      message,
      status: "pending" // new field
    });

    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Decline a notification
router.put("/decline/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.status = "declined";
    await notification.save();
    res.json({ message: "Notification declined" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a notification
router.put("/accept/:id", async (req, res) => {
  try {

    const note = await Notification.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Notification not found" });
    }

    note.status = "accepted";
    await note.save();

    // Get provider details
    const provider = await providerModel.findById(note.providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Create booking confirmation notification for family
    await Notification.create({
      receiverId: note.familyId,
      role: "family",
      title: "Booking Confirmed",
      message: `${provider.FullName} accepted your ${note.serviceType} request`,
      status: "pending"
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;