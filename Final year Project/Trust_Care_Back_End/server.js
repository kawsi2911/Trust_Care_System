import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ── Teammate's routes ─────────────────────────────────────────────────────────
import familyRoutes from "./routes/familyRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";

// ── Admin routes ──────────────────────────────────────────────────────────────
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ── Teammate's API routes ─────────────────────────────────────────────────────
app.use("/api/family", familyRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/service-request", serviceRequestRoutes);

// ── Admin API routes ──────────────────────────────────────────────────────────
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));