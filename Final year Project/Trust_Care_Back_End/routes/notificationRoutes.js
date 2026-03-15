import express from "express"; 
import Notification from "../models/notificationModel.js"; 

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

// Accept a notification
router.put("/accept/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.status = "accepted";
    await notification.save();
    res.json({ message: "Notification accepted" });
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

// Accept notification and notify family
router.put("/accept/:id", async (req, res) => {
  try {
    // 1. Find provider notification
    const providerNotif = await Notification.findById(req.params.id);
    if (!providerNotif) return res.status(404).json({ message: "Notification not found" });

    providerNotif.status = "accepted";
    await providerNotif.save();

    // 2. Create a notification for the family
    const familyNotification = new Notification({
      receiverId: providerNotif.familyId, // make sure your notification has a familyId
      title: "Provider Accepted Your Request",
      message: `Provider ${providerNotif.providerName} has accepted your service request.`,
      status: "pending"
    });
    await familyNotification.save();

    res.json({ message: "Notification accepted and family notified!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;