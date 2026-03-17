import express from "express";
import Service from "../models/providerModel.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// Registration
router.post("/providerregister", async (req, res) => {
  try {
    const existing = await Service.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // ✅ NEW: generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newService = new Service({
      ...req.body,
      isVerified: false,
      verificationToken,
      status: "Pending", // pending admin approval
    });
    const saved = await newService.save();

    // ✅ NEW: send verification email
    try {
      await sendVerificationEmail(
        req.body.email,
        req.body.FullName,
        verificationToken,
        "provider"
      );
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    res.json({
      message: "Registration successful! Please check your email to verify your account.",
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

    // ✅ NEW: check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email before logging in. Check your inbox!" 
      });
    }

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

router.get("/:id", async (req, res) => {
  try {
    const user = await Service.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ only show Active (admin-approved) providers to families
router.post("/nearby-providers", async (req, res) => {
  try {
    const { userLocation } = req.body;
    console.log("Searching providers near:", userLocation);
    const providers = await Service.find({
      location: { $regex: new RegExp(userLocation, "i") },
      status: "Active"
    });
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/service/reset-password
router.put("/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).json({ message: "Username and new password are required" });
    }
    const provider = await Service.findOne({ username });
    if (!provider) {
      return res.status(404).json({ message: "No account found with that username" });
    }
    provider.password = newPassword;
    await provider.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;