import express from "express";
import {
  adminLogin, createAdmin, verifyAdminToken,
  getAllUsers, getUserById, updateUserStatus, deleteUser,
  getDashboardStats,
  getAllServices, getServiceById, updateServiceStatus, createService, deleteService, getServiceStats,
  generateReport,
  getFinanceStats,
  getSettings, updateGeneralSettings, updateFeeSettings, updateNotificationSettings,
} from "../controllers/adminController.js";

const router = express.Router();

// ── Auth Routes ──────────────────────────────────────────────────────────────
router.post("/login", adminLogin);
router.post("/create", createAdmin);
router.get("/verify", verifyAdminToken, (req, res) => {
  res.json({ success: true, message: "Token is valid", admin: req.admin });
});

// ── Stats Routes ─────────────────────────────────────────────────────────────
router.get("/stats", verifyAdminToken, getDashboardStats);
router.get("/services/stats", verifyAdminToken, getServiceStats);

// ── User Routes ──────────────────────────────────────────────────────────────
router.get("/users", verifyAdminToken, getAllUsers);
router.get("/users/:id", verifyAdminToken, getUserById);
router.put("/users/:id/status", verifyAdminToken, updateUserStatus);
router.delete("/users/:id", verifyAdminToken, deleteUser);

// ── Service Routes ───────────────────────────────────────────────────────────
router.get("/services", verifyAdminToken, getAllServices);
router.get("/services/:id", verifyAdminToken, getServiceById);
router.post("/services", verifyAdminToken, createService);
router.put("/services/:id/status", verifyAdminToken, updateServiceStatus);
router.delete("/services/:id", verifyAdminToken, deleteService);

// ── Report Routes ────────────────────────────────────────────────────────────
router.get("/reports", verifyAdminToken, generateReport);

// ── Finance Routes ───────────────────────────────────────────────────────────
router.get("/finance", verifyAdminToken, getFinanceStats);

// ── Settings Routes ──────────────────────────────────────────────────────────
router.get("/settings", verifyAdminToken, getSettings);
router.put("/settings/general", verifyAdminToken, updateGeneralSettings);
router.put("/settings/fees", verifyAdminToken, updateFeeSettings);
router.put("/settings/notifications", verifyAdminToken, updateNotificationSettings);

export default router;