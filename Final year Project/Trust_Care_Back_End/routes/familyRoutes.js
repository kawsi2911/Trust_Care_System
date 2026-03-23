import express from "express";
import Family from "../models/familyModel.js";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";


const router = express.Router();

//create a temporary user with basic details before OTP verification
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

//send OTP to user's email
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

//verify the otp and mark user as verified
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

//register the family user with username and password after OTP verification
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

//login the user and send OTP
const JWT_SECRET = "57201a3808e5f4a71e3cc87c96667ac6e6cb9cc68a69b9fc976f719831ca26d9eb0fc356bec4255dc3d0008fae09e1f3e2fbb6124f165a743e680d0cf891efe5";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Family.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Wrong password" });

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    //Create JWT with OTP
    const token = jwt.sign(
      { username, otp },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    //Send OTP via email
    await sendOTP(user.email, otp);

    res.json({
      success: true,
      message: "OTP sent",
      token 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//verify the otp for login
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { token, otp } = req.body;

    // 🔹 Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await Family.findOne({ username: decoded.username });

    res.json({
      success: true,
      message: "Login successful",
      userId: user._id
    });

  } catch (err) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }
});

//get family user by id
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

//update family user
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