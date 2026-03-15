import Payment from "../models/paymentModel.js";
import Service from "../models/serviceModel.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const PAYHERE_MERCHANT_ID  = process.env.PAYHERE_MERCHANT_ID  || "1234478";
const PAYHERE_SECRET       = process.env.PAYHERE_SECRET        || "MjY1MTg3MDI3NDEwMTM3MjkyODAyMTMyMjg0MjgwMzQ1MDM0NTA0MA==";
const PAYHERE_SANDBOX      = process.env.PAYHERE_SANDBOX === "false" ? false : true;
const PAYHERE_URL          = PAYHERE_SANDBOX
  ? "https://sandbox.payhere.lk/pay/checkout"
  : "https://www.payhere.lk/pay/checkout";

// ── Generate PayHere Hash ─────────────────────────────────────────────────────
const generateHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const hashStr = `${merchantId}${orderId}${amount}${currency}${hashedSecret}`;
  return crypto.createHash("md5").update(hashStr).digest("hex").toUpperCase();
};

// ── Initiate Payment ──────────────────────────────────────────────────────────
export const initiatePayment = async (req, res) => {
  try {
    const {
      serviceId,
      familyId,
      providerId,
      familyName,
      providerName,
      serviceType,
      amount,
      paymentMethod,
      familyEmail,
      familyPhone,
    } = req.body;

    // Create payment record in DB
    const payment = new Payment({
      serviceId,
      familyId,
      providerId,
      familyName,
      providerName,
      serviceType,
      amount,
      paymentMethod: paymentMethod || "Card",
      status: "Pending",
    });
    await payment.save();

    // Generate PayHere hash
    const amountFormatted = parseFloat(amount).toFixed(2);
    const currency        = "LKR";
    const hash = generateHash(
      PAYHERE_MERCHANT_ID,
      payment.paymentNumber,
      amountFormatted,
      currency,
      PAYHERE_SECRET
    );

    // PayHere payment data to send to frontend
    const payhereData = {
      sandbox:      PAYHERE_SANDBOX,
      merchant_id:  PAYHERE_MERCHANT_ID,
      return_url:   `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success`,
      cancel_url:   `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
      notify_url:   `${process.env.BACKEND_URL  || "http://localhost:5000"}/api/payments/notify`,
      order_id:     payment.paymentNumber,
      items:        `${serviceType} Service`,
      amount:       amountFormatted,
      currency,
      hash,
      first_name:   familyName.split(" ")[0] || familyName,
      last_name:    familyName.split(" ")[1] || "",
      email:        familyEmail || "customer@trustcare.lk",
      phone:        familyPhone || "0771234567",
      address:      "Sri Lanka",
      city:         "Colombo",
      country:      "Sri Lanka",
    };

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      paymentId: payment._id,
      paymentNumber: payment.paymentNumber,
      checkoutUrl: PAYHERE_URL,
      payhereData,
    });
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── PayHere Notify (Webhook) ──────────────────────────────────────────────────
// PayHere calls this URL after payment is completed
export const payhereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    // Verify the hash from PayHere
    const hashedSecret = crypto
      .createHash("md5")
      .update(PAYHERE_SECRET)
      .digest("hex")
      .toUpperCase();

    const hashStr = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const localHash = crypto.createHash("md5").update(hashStr).digest("hex").toUpperCase();

    if (localHash !== md5sig) {
      return res.status(400).json({ success: false, message: "Invalid hash" });
    }

    // Find payment by order_id (paymentNumber)
    const payment = await Payment.findOne({ paymentNumber: order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // Update payment status based on PayHere status code
    // 2 = Success, 0 = Pending, -1 = Cancelled, -2 = Failed, -3 = Chargedback
    if (status_code === "2") {
      payment.status          = "Paid";
      payment.payherePaymentId = payment_id;
      payment.payhereOrderId  = order_id;
      payment.paymentDate     = new Date();

      // Also update service isPaid
      await Service.findByIdAndUpdate(payment.serviceId, { isPaid: true });

    } else if (status_code === "-1" || status_code === "-2") {
      payment.status = "Failed";
    } else if (status_code === "-3") {
      payment.status = "Refunded";
    }

    await payment.save();
    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Verify Payment (frontend calls after redirect) ───────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentNumber: req.params.orderid });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Get All Payments (Admin) ──────────────────────────────────────────────────
export const getAllPayments = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { paymentNumber: { $regex: search, $options: "i" } },
        { familyName:    { $regex: search, $options: "i" } },
        { providerName:  { $regex: search, $options: "i" } },
        { serviceType:   { $regex: search, $options: "i" } },
      ];
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });

    // Calculate totals
    const totalRevenue     = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
    const totalCommission  = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.commission, 0);
    const totalPayout      = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.providerPayout, 0);

    res.status(200).json({
      success: true,
      count: payments.length,
      totals: { totalRevenue, totalCommission, totalPayout },
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Get Single Payment ────────────────────────────────────────────────────────
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── Update Payment Status (Admin manual override) ────────────────────────────
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status, paymentDate: status === "Paid" ? new Date() : undefined },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // If marked paid, update service too
    if (status === "Paid") {
      await Service.findByIdAndUpdate(payment.serviceId, { isPaid: true });
    }

    res.status(200).json({ success: true, message: `Payment marked as ${status}`, payment });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};