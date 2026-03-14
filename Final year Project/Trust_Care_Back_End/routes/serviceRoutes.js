import express from "express";
import Service from "../models/providerModel.js";

const router = express.Router();

// Registration
router.post("/providerregister", async (req, res) => {
  try {
    const { username, password, FullName, email, phone } = req.body;

    const existing = await Service.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newService = new Service({ username, password, FullName, email, phone });
    const saved = await newService.save();

    res.json({
      message: "Service Provider Registered Successfully",
      userId: saved._id,
      FullName: saved.FullName,
    });

  } catch (error) {
    console.log("SAVE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/providerlogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Service.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password) return res.status(400).json({ message: "Wrong password" });

    res.json({
      message: "Login success",
      userId: user._id,
      username: user.username,
      FullName: user.FullName,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;