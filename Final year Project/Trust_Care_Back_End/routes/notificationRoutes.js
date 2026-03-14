import express from "express"; 
import Notification from "../models/notificationModel.js"; 

const router = express.Router();

/* Create Notification 
router.post("/create", async (req, res) => {

  try {

    const { receiverId, title, message } = req.body;

    const notification = new Notification({
      receiverId,
      title,
      message
    });

    await notification.save();

    res.json(notification);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});*/

router.get("/:receiverId", async (req, res) => {

  try {

    const notifications = await Notification
      .find({ receiverId: req.params.receiverId })
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
export default router;