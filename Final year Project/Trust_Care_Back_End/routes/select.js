import express from "express";
import Notification from  "../models/notificationModel.js";

const router = express.Router();

router.post("/select", async (req, res) => {

  try {

    const { familyId, providerId, requestId, serviceType } = req.body;

    // notify provider
    await Notification.create({
      receiverId: providerId,
      providerId,
      familyId,
      requestId,
      serviceType: req.body.serviceType,
      role: "provider",
      title: "Booking Request",
      message: "Family selected you"
    });

    // notify family
    await Notification.create({
      receiverId: familyId,
      providerId,
      familyId,
      requestId,
      role: "family",
      title: "Provider Selected",
      message: "You selected caregiver"
    });

    res.json({ message: "Notification sent" });

  } catch (err) {
    res.status(500).json(err);
  }

});

export default router;