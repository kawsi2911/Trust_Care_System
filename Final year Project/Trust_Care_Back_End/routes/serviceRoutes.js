import express from "express";
import Service from "../models/providerModel.js";

const router = express.Router();

router.post("/providerregister", async (req, res) => {
  try {

    console.log("Incoming data:", req.body);

    const newService = new Service(req.body);

    const saved = await newService.save();

    console.log("Saved:", saved._id);

    res.json({
      message: "Service Provider Registered Successfully",
      id: saved._id
    });

  } catch (error) {

    console.log("SAVE ERROR:", error);   // IMPORTANT

    res.status(500).json({
      error: error.message
    });
  }
});

export default router;