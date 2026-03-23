import express from "express";
import Service from "../models/providerModel.js";
import crypto from "crypto";

const router = express.Router();

// ─── Safe email sender (won't crash if nodemailer fails) ──────────────────────
const sendEmailSafe = async (email, name, token, role) => {
  try {
    const { sendVerificationEmail } = await import("../utils/emailService.js");
    await sendVerificationEmail(email, name, token, role);
    console.log("✅ Verification email sent to:", email);
  } catch (err) {
    console.error("⚠️ Email send failed (non-critical):", err.message);
  }
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post("/providerregister", async (req, res) => {
  try {
    const existing = await Service.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newService = new Service({
      ...req.body,
      isVerified: false,
      verificationToken,
    });

    const saved = await newService.save();

    // Send email in background — won't block or crash registration
    sendEmailSafe(saved.email, saved.FullName, verificationToken, "provider");

    res.json({
      message: "Registration successful! Please check your email to verify your account.",
      userId: saved._id,
      FullName: saved.FullName,
    });

  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post("/providerlogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Service.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login success",
      userId: user._id,
      username: user.username,
      FullName: user.FullName,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET provider by ID ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await Service.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── UPDATE provider ──────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── NEARBY PROVIDERS (Active only) ──────────────────────────────────────────
router.post("/nearby-providers", async (req, res) => {
  try {
    const { userLocation } = req.body;
    console.log("Searching providers near:", userLocation);
    const providers = await Service.find({
      location: { $regex: new RegExp(userLocation, "i") },
      status: "Active",
    });
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
router.put("/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).json({ message: "Username and new password are required" });
    }
    const provider = await Service.findOne({ username });
    if (!provider) return res.status(404).json({ message: "No account found with that username" });
    provider.password = newPassword;
    await provider.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;