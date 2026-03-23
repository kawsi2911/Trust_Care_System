import express from "express"; 
import Notification from "../models/notificationModel.js";
import providerModel from "../models/providerModel.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/notifications/family/:receiverId
// Fetch all notifications for a family
// ─────────────────────────────────────────
router.get("/family/:receiverId", async (req, res) => {
  try {
    const notifications = await Notification
      .find({ 
        receiverId: req.params.receiverId,
        role: "family"
      })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/notifications/:receiverId
// Fetch all notifications for a provider (only pending)
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// POST /api/notifications/create
// Create a new notification
// ─────────────────────────────────────────
router.post("/create", async (req, res) => {
  try {
    const { receiverId, title, message } = req.body;
    const notification = new Notification({
      receiverId,
      title,
      message,
      status: "pending"
    });
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/notifications/decline/:id
// Decline a notification — notifies family with provider name
// ─────────────────────────────────────────
router.put("/decline/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.status = "declined";
    await notification.save();

    // ✅ SAFE: Get provider name without crashing if providerId is null
    let providerName = "The provider";
    try {
      if (notification.providerId) {
        const provider = await providerModel.findById(notification.providerId);
        if (provider) {
          providerName = provider.FullName || provider.fullName || "The provider";
        }
      }
    } catch (e) {
      console.warn("Could not fetch provider name:", e.message);
    }

    // ✅ SAFE: Only create family notification if familyId exists
    if (notification.familyId) {
      await Notification.create({
        receiverId: notification.familyId,
        familyId: notification.familyId,
        role: "family",
        title: "❌ Request Declined",
        message: `${providerName} has declined your ${notification.serviceType || "care"} request. Please search for another provider.`,
        status: "pending",
      });
    } else {
      console.warn("⚠️ familyId is null on notification:", notification._id, " — family not notified");
    }

    res.json({ message: "Notification declined" });
  } catch (error) {
    console.error("Decline error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/notifications/accept/:id
// Accept a notification — creates booking + notifies family
// ─────────────────────────────────────────
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

    // Create booking in bookings collection
    const booking = await Booking.create({
      serviceRequestId: note.requestId,
      providerId: note.providerId,
      familyId: note.familyId,
      status: "active",
      patientType: note.serviceType,
      location: provider.location,
      duration: "Monthly",
      rate: provider.hourlyRate,
      startDate: new Date(),
    });

    // Send booking confirmation notification to family
    await Notification.create({
      receiverId: note.familyId,
      familyId: note.familyId,
      providerId: note.providerId,
      role: "family",
      title: "Booking Confirmed",
      message: `${provider.FullName} accepted your ${note.serviceType} request. She will contact you shortly.`,
      serviceType: note.serviceType,
      status: "pending",
    });

    res.json({ success: true, booking });

  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;