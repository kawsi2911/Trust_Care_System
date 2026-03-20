import express from "express";
import nodemailer from "nodemailer"; 
import Service from "../models/providerModel.js";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/sendEmail.js";


const router = express.Router();

// In-memory store for OTPs (use Redis or DB for production)
let otpStore = {};

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = otp;

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  if (otpStore[email] && parseInt(otp) === otpStore[email]) {
    delete otpStore[email]; // remove OTP after successful verification
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// ----------------------
// REGISTER SERVICE PROVIDER
// ----------------------
router.post("/providerregister", async (req, res) => {
  try {
    const existing = await Service.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newService = new Service(req.body);
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

// ----------------------
// LOGIN SERVICE PROVIDER
// ----------------------
router.post("/providerlogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Service.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Wrong password" });

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

// ----------------------
// RESET PASSWORD
// ----------------------
router.put("/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res
        .status(400)
        .json({ message: "Username and new password are required" });
    }

    const provider = await Service.findOne({ username });
    if (!provider)
      return res.status(404).json({ message: "No account found" });

    provider.password = newPassword;
    await provider.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// GET SERVICE PROVIDER BY ID
// ----------------------
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

// ----------------------
// UPDATE SERVICE PROVIDER
// ----------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;