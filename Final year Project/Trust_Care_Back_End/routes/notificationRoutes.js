import express from "express";
import Notification from "../models/notificationModel.js";

const router = express.Router();

/* Create Notification */
router.post("/create", async (req, res) => {

  try {

    const { familyId, title, message } = req.body;

    const notification = new Notification({
      familyId,
      title,
      message
    });

    await notification.save();

    res.json(notification);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* Get Notifications for Family */
router.get("/:familyId", async (req, res) => {

  try {

    const notifications = await Notification
      .find({ familyId: req.params.familyId })
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

export default router;