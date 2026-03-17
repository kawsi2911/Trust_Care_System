import express from "express";
import Family from "../models/familyModel.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

/* Register Family */
router.post("/register", async (req, res) => {
  try {
    // ✅ NEW: generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newFamily = new Family({
      ...req.body,
      isVerified: false,
      verificationToken,
    });
    await newFamily.save();

    // ✅ NEW: send verification email
    try {
      await sendVerificationEmail(
        req.body.email,
        req.body.familyFullName,
        verificationToken,
        "family"
      );
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
      // Don't fail registration if email fails
    }

    res.json({
      message: "Registration successful! Please check your email to verify your account.",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Login */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Family.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ✅ NEW: check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email before logging in. Check your inbox!" 
      });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      familyFullName: user.familyFullName
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Get Profile */
router.get("/:id", async (req, res) => {
  try {
    const user = await Family.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Update Profile */
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Family.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;