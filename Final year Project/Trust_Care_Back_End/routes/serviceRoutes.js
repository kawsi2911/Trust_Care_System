import express from "express";
import Service from "../models/providerModel.js";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// In-memory OTP store (use Redis/DB for production)
let otpStore = {};

// ----------------------
// SEND OTP (Optional extra)
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  otpStore[email] = otp;

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ----------------------
// REGISTER SERVICE PROVIDER
router.post("/providerregister", async (req, res) => {
  try {
    const { username, FullName, email, password } = req.body;

    if (!username || !FullName || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await Service.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already taken" });

    const newService = new Service(req.body);
    const saved = await newService.save();

    res.json({
      message: "Service Provider Registered Successfully",
      userId: saved._id,
      fullName: saved.FullName,  // send fullName here too
    });
  } catch (error) {
    console.log("SAVE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// LOGIN SERVICE PROVIDER
const JWT_SECRET = "YOUR_JWT_SECRET_HERE";

router.post("/providerlogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Service.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password) return res.status(400).json({ message: "Wrong password" });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Create JWT
    const token = jwt.sign({ username, otp }, JWT_SECRET, { expiresIn: "5m" });

    // Send OTP email
    await sendOTP(user.email, otp);

    res.json({
      success: true,
      message: "OTP sent",
      token,
      userId: user._id,
      fullName: user.FullName,  // send fullName for frontend storage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// VERIFY LOGIN OTP
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { token, otp } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const user = await Service.findOne({ username: decoded.username });
    if (!user) return res.status(400).json({ message: "User not found" });

    res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      fullName: user.FullName,  // always send fullName
    });
  } catch (err) {
    res.status(400).json({ message: "OTP expired or invalid" });
  }
});

// ----------------------
// RESET PASSWORD
router.put("/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) return res.status(400).json({ message: "Required" });

    const provider = await Service.findOne({ username });
    if (!provider) return res.status(404).json({ message: "No account found" });

    provider.password = newPassword;
    await provider.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// GET SERVICE PROVIDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Service.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// UPDATE SERVICE PROVIDER
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;