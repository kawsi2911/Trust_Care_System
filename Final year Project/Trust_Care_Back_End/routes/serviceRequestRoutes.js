import express from "express";
import serviceRequest from "../models/serviceRequestModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const newServiceRequest = new serviceRequest(req.body);
    await newServiceRequest.save();
    res.json({ message: "Service Request Submitted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;