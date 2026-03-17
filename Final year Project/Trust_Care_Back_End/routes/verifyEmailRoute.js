import express from "express";
import Family from "../models/familyModel.js";
import Provider from "../models/providerModel.js";

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/verify-email
// Verify email token from link
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
    try {
        const { token, role } = req.query;

        if (!token || !role) {
            return res.status(400).json({ success: false, message: "Invalid verification link." });
        }

        let user = null;

        if (role === "family") {
            user = await Family.findOne({ verificationToken: token });
            if (user) {
                user.isVerified = true;
                user.verificationToken = null;
                await user.save();
            }
        } else if (role === "provider") {
            user = await Provider.findOne({ verificationToken: token });
            if (user) {
                user.isVerified = true;
                user.verificationToken = null;
                await user.save();
            }
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification link." });
        }

        // ✅ Redirect to frontend with success
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(`${frontendUrl}/email-verified?role=${role}`);

    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

export default router;