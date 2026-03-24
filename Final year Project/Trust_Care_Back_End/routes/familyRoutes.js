import express from "express";
import Family from "../models/familyModel.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const existing = await Family.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newFamily = new Family({
      ...req.body,
      isVerified: false,
      verificationToken,
    });

    const saved = await newFamily.save();

    // Send verification email (non-blocking)
    sendVerificationEmail(saved.email, saved.familyFullName, verificationToken, "family")
      .catch(err => console.error("Email send failed:", err.message));

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      userId: saved._id,
      familyFullName: saved.familyFullName,
    });

  } catch (error) {
    console.error("FAMILY REGISTER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── LOGIN — NO block, all users can login ────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Family.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ✅ No email verification block — all users can login
    res.json({
      message: "Login success",
      userId: user._id,
      familyFullName: user.familyFullName,
      familynic: user.familynic,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      address: user.address,
      city: user.city,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    });

  } catch (error) {
    console.error("FAMILY LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET family by ID ─────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await Family.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── UPDATE family ────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updated = await Family.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user: updated });
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
    const family = await Family.findOne({ username });
    if (!family) return res.status(404).json({ message: "No account found with that username" });
    family.password = newPassword;
    await family.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;