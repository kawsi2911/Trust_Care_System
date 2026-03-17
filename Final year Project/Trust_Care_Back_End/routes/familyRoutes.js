import express from "express";
import Family from "../models/familyModel.js";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/sendEmail.js";

const router = express.Router();

/* ── Send OTP ── */
router.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Family.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Complete registration step 1 first" });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const expire = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = expire;
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// family routes
router.post("/create-temp", async (req, res) => {
  try {
    const { familyFullName, familynic, phone, email, gender, address, city } = req.body;

    const existing = await Family.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const tempUser = new Family({ familyFullName, familynic, phone, email, gender, address, city });
    await tempUser.save();

    res.json({ message: "Step 1 completed", userId: tempUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ── Verify OTP ── */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await Family.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ success: false, message: "Wrong OTP" });
    if (user.otpExpire < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── Register Family ── */
router.post("/register", async (req, res) => {
  try {
    const { email, password, familyFullName, phone } = req.body;

    const user = await Family.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ success: false, message: "Email not verified" });
    }

    // Update user details
    user.familyFullName = familyFullName;
    user.password = password; // Later: hash password
    user.phone = phone;
    await user.save();

    res.json({ success: true, message: "Family registered successfully", userId: user._id });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── Login ── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Family.findOne({ email });
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