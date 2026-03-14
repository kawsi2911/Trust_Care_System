import express from "express";
import Service from "../models/providerModel.js";

const router = express.Router();

router.post("/providerregister", async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.json({ message: "Service Provider Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
