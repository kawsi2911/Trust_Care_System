import express from "express";
import Family from "../models/familyModel.js";

const router = express.Router();

// Save family data
router.post("/register", async (req, res) => {
  try {
    const newFamily = new Family(req.body);
    await newFamily.save();
    res.json({ message: "Family Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;