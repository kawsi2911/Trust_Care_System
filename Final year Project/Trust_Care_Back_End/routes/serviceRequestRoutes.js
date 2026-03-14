import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";

const router = express.Router();

// Create new service request
router.post("/new-request", async (req, res) => {
  try {
    const data = req.body;

    // Only save disabilityDetails if serviceOptions === 'Yes'
    if (data.serviceOptions !== "Yes") {
      data.disabilityDetails = "";
    }

    const request = new ServiceRequest(data);
    const saved = await request.save();

    res.status(200).json({ message: "Request saved", requestId: saved._id });
  } catch (err) {
    console.error("Error saving request:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;