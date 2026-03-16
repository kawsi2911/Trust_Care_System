import express from "express";
import Service from "../models/providerModel.js";

const router = express.Router();

// Registration
router.post("/providerregister", async (req, res) => {
  try {
<<<<<<< HEAD
    const {
      FullName,
      NIC,
      phone,
      email,
      gender,
      dob,
      fulladdress,
      serviceType,
      year,
      qualifications,
      uploadprofile,
      location,
      workRadius,
      available,
      hourlyRate,
      username,
      password
    } = req.body;

    const existing = await Service.findOne({ username });
=======
    const existing = await Service.findOne({ username: req.body.username });
>>>>>>> mumthaj
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

<<<<<<< HEAD
    const newService = new Service({
      FullName,
      NIC,
      phone,
      email,
      gender,
      dob,
      fulladdress,
      serviceType,
      year,
      qualifications,
      uploadprofile,
      location,
      workRadius,
      available,
      hourlyRate,
      username,
      password
    });

=======
    const newService = new Service(req.body);
>>>>>>> mumthaj
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
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ✅ CHANGED: only show Active (admin-approved) providers to families
router.post("/nearby-providers", async (req, res) => {
  try {
    const { userLocation } = req.body; // e.g., "jaffna"
    console.log("Searching providers near:", userLocation);
    const providers = await Service.find({
<<<<<<< HEAD
      location: { $regex: new RegExp(userLocation, "i") } // case-insensitive match
=======
      location: { $regex: new RegExp(userLocation, "i") },
      status: "Active"  // ✅ ADDED: only admin-approved providers visible
>>>>>>> mumthaj
    });
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
=======

// ─────────────────────────────────────────
// PUT /api/service/reset-password
// ─────────────────────────────────────────
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

>>>>>>> mumthaj
export default router;