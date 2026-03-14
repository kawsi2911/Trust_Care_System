import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Notification from "../models/notificationModel.js";
import Provider from "../models/providerModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {

  try {

    const newServiceRequest = new ServiceRequest({
      ...req.body,
      familyId: req.body.familyId
    });

    await newServiceRequest.save();

    /* notification for family */
    const familyNotification = new Notification({
      receiverId: req.body.familyId,
      role: "family",
      title: "Request Sent",
      message: `Your service request in ${req.body.SLocation} has been sent to nearby caregivers`
    });

    await familyNotification.save();


    /* find providers in same location */
    const providers = await Provider.find({
      city: req.body.SLocation
    });

    /* notify providers */
    for (const provider of providers) {

      const notification = new Notification({
        receiverId: provider._id,
        role: "provider",
        title: "New Service Request",
        message: `New request in ${req.body.SLocation}. Click to view request`
      });

      await notification.save();
    }

    res.json({
      message: "Service Request Submitted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({ error: error.message });

  }

});

export default router;