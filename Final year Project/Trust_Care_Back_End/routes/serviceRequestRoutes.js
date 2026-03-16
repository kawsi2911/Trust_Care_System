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

   const savedRequest = await newServiceRequest.save(); 

    /* notification for family */
    const familyNotification = new Notification({
      receiverId: req.body.familyId,
      familyId: req.body.familyId,
      requestId: savedRequest._id,
      role: "family",
      title: "Request Sent",
      message: `Your service request in ${req.body.SLocation} has been sent to nearby caregivers`
    });

    await familyNotification.save();


    /* find providers in same location */
    const providers = await Provider.find({
      location: req.body.SLocation
    });

    /* notify providers */
    for (const provider of providers) {

      const notification = new Notification({
        receiverId: provider._id,
        providerId: provider._id,
        familyId: req.body.familyId,
        requestId: savedRequest._id,
        role: "provider",
        title: "New Service Request",
        message: `New request in ${req.body.SLocation}. Click to view request`
      });

      await notification.save();
    }

    res.json({
      message: "Service Request Submitted Successfully",
      requestId: savedRequest._id
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({ error: error.message });

  }

});

router.get("/provider/:providerId", async (req, res) => {

  try {

    const notifications = await Notification.find({
      providerId: req.params.providerId
    }).populate("requestId");

    res.json(notifications);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.get("/service-request/:id", async (req, res) => {

  try {

    const request = await ServiceRequest
      .findById(req.params.id)
      .populate("providerId");   // provider details load

    res.json(request);
    console.log("Request details sent for ID:", req.params.id);
    console.log("Provider details included:", !!request.providerId);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

router.get("/dashboard/:providerId", async (req, res) => {
  try {

    const requests = await ServiceRequest
      .find({ providerId: req.params.providerId })
      .populate("familyId");

    res.json(requests);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});

router.put("/accept/:requestId", async (req, res) => {

  try {

    const request = await ServiceRequest.findById(req.params.requestId);

    if (request.status === "Accepted") {
      return res.json({ message: "Already accepted" });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.requestId,
      {
        providerId: req.body.providerId,
        status: "Accepted"
      },
      { returnDocument: "after" }
    );

    res.json(updatedRequest);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});



export default router;