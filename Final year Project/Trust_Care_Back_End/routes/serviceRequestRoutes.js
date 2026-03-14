import express from "express";
import serviceRequest from "../models/serviceRequestModel.js";
import Notification from "../models/notificationModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {

  try {

    // Save service request
    const newServiceRequest = new serviceRequest(req.body);
    await newServiceRequest.save();

    // Create notification
    const notification = new Notification({
      familyId: req.body.familyId,
      title: "Request Sent",
      message: `Your service request in ${req.body.SLocation} has been sent to nearby caregivers`
    });

    await notification.save();

    res.json({
      message: "Service Request Submitted Successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

export default router;