import express from "express";
import Family from "../models/familyModel.js";

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
    const newFamily = new Family(req.body);
    await newFamily.save();
    res.json({ message: "Family Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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

    res.json({
      message: "Login successful",
      userId: user._id,
      familyFullName: user.familyFullName
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



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


router.put("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const updatedUser = await Family.findByIdAndUpdate(
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

export default router;