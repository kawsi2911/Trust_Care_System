import express from "express";
import Family from "../models/familyModel.js";

const router = express.Router();

router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    try {

        const user = await Family.findOne({ username: username });

        if (!user) {
            return res.status(400).json({
                message: "Username not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        res.json({
            message: "Login success",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

export default router;