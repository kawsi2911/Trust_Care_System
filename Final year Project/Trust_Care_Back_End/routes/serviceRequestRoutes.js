// routes/serviceRequest.js
import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";

const router = express.Router();

router.post("/new-request", async (req, res) => {
  try {
    const familyId = req.body.familyId || req.userId;
    if (!familyId) return res.status(400).json({ error: "familyId is required" });

    // Validate required fields
    const requiredFields = [
      "PatientType","PName","relationship","Page","Service","SLocation",
      "Address","serviceOptions","Gender","additionalRequirement"
    ];
    for (const field of requiredFields) {
      if (!req.body[field] || !req.body[field].toString().trim()) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const newRequest = new ServiceRequest({ familyId, ...req.body });
    const savedRequest = await newRequest.save();

    if (req.io) {
      req.io.to(familyId).emit("notification", {
        type: "request_sent",
        message: "Your service request has been sent to nearby providers",
        requestId: savedRequest._id,
        createdAt: savedRequest.createdAt
      });
    }

    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Error saving service request:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;