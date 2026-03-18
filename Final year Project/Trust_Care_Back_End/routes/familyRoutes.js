import express from "express";
import Family from "../models/familyModel.js";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/sendEmail.js";

const router = express.Router();

/* ── Step 1: Create Temp Family ── */
router.post("/create-temp", async (req, res) => {
  try {
    const { familyFullName, familynic, phone, email, gender, address, city } = req.body;

    const existing = await Family.findOne({ familynic });
    if (existing) return res.status(400).json({ message: "NIC already exists" });

    const tempUser = new Family({ familyFullName, familynic, phone, email, gender, address, city });
    await tempUser.save();

    res.json({ message: "Step 1 completed", userId: tempUser._id });
  } catch (err) {
    console.error("Step1 Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ── Send OTP using userId ── */
router.post("/sendotp", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await Family.findById(userId);
    if (!user) return res.status(400).json({ message: "Complete Step 1 first" });

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const expire = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = expire;
    await user.save();

    await sendOTP(user.email, otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ── Verify OTP using userId ── */
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await Family.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Wrong OTP" });
    if (user.otpExpire < new Date()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ── Step 2: Register Family ── */
router.post("/providerregister", async (req, res) => {
  try {
    const { userId, username, password } = req.body;
    const user = await Family.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });

    const existingUsername = await Family.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already exists" });

    user.username = username;
    user.password = password; // hash later
    await user.save();

    res.json({ message: "Registration completed successfully", userId: user._id });
  } catch (err) {
    console.error("Register Step2 Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ── Login ── */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; // use username
    const user = await Family.findOne({ username }); // search by username
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    if (user.password !== password) return res.status(400).json({ success: false, message: "Wrong password" });

    res.json({ success: true, message: "Login successful", userId: user._id, familyFullName: user.familyFullName });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── Get Profile ── */
router.get("/:id", async (req, res) => {
  try {
    const user = await Family.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── Update Profile ── */
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Family.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;