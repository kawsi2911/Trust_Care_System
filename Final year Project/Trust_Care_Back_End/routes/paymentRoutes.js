import express from "express";
import {
  initiatePayment,
  payhereNotify,
  verifyPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
} from "../controllers/paymentController.js";
import { verifyAdminToken } from "../controllers/adminController.js";

const router = express.Router();

// ── Family Routes (no auth needed) ───────────────────────────────────────────
// POST /api/payments/initiate - Start a payment
router.post("/initiate", initiatePayment);

// POST /api/payments/notify - PayHere webhook (called by PayHere server)
router.post("/notify", payhereNotify);

// GET /api/payments/verify/:orderid - Verify payment after redirect
router.get("/verify/:orderid", verifyPayment);

// ── Admin Routes (protected) ──────────────────────────────────────────────────
// GET /api/payments - Get all payments
router.get("/", verifyAdminToken, getAllPayments);

// GET /api/payments/:id - Get single payment
router.get("/:id", verifyAdminToken, getPaymentById);

// PUT /api/payments/:id/status - Update payment status
router.put("/:id/status", verifyAdminToken, updatePaymentStatus);

export default router;