import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Booking from "../models/bookingModel.js";
import ServiceProvider from "../models/providerModel.js";
import Notification from "../models/notificationModel.js";

const router = express.Router();


// ─────────────────────────────────────────
// POST /api/service-request/new-request
// Family submits a new service request
// ─────────────────────────────────────────
router.post("/new-request", async (req, res) => {
    try {
        const familyId = req.body.familyId || req.userId;
        if (!familyId) return res.status(400).json({ error: "familyId is required" });

        const requiredFields = [
            "PatientType", "PName", "relationship", "Page", "Service",
            "SLocation", "Address", "serviceOptions", "Gender", "additionalRequirement"
        ];

        for (const field of requiredFields) {
            if (!req.body[field] || !req.body[field].toString().trim()) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        const newRequest = new ServiceRequest({ familyId, ...req.body });
        const savedRequest = await newRequest.save();

        // ✅ Send notification to all providers in same location
        const providers = await ServiceProvider.find({
            location: { $regex: new RegExp(req.body.SLocation, "i") },
            status: "Active"
        });

        for (const provider of providers) {
            await Notification.create({
                receiverId: provider._id,
                role: "provider",
                title: "New Service Request!",
                message: `A family in ${req.body.SLocation} needs ${req.body.PatientType} service.`,
                serviceType: req.body.PatientType,
                requestId: savedRequest._id,
                status: "pending",
            });
        }

        res.status(201).json(savedRequest);

    } catch (err) {
        console.error("Error saving service request:", err);
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/dashboard/:userId
// Provider dashboard — job counts + latest request
// ─────────────────────────────────────────
router.get("/dashboard/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const provider = await ServiceProvider.findById(userId);
        if (!provider) return res.status(404).json({ error: "Provider not found" });

        const totalJobs   = await Booking.countDocuments({ providerId: userId });
        const activeJobs  = await Booking.countDocuments({ providerId: userId, status: "active" });
        const pendingJobs = await Booking.countDocuments({ providerId: userId, status: "pending" });

        const latestRequest = await ServiceRequest.findOne({
            SLocation: { $regex: new RegExp(provider.location, "i") },
            status: "pending"
        }).sort({ createdAt: -1 });

        res.json({
            FullName: provider.FullName,
            totalJobs,
            activeJobs,
            pendingJobs,
            latestRequest: latestRequest ? {
                location: latestRequest.SLocation,
                service: latestRequest.PatientType
            } : null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/provider-notifications/:providerId
// ─────────────────────────────────────────
router.get("/provider-notifications/:providerId", async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.providerId);
        if (!provider) return res.status(404).json({ error: "Provider not found" });

        const requests = await ServiceRequest.find({
            SLocation: { $regex: new RegExp(provider.location, "i") },
            status: "pending"
        })
        .populate("familyId", "familyFullName phone")
        .sort({ createdAt: -1 });

        res.json(requests);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// POST /api/service-request/accept/:requestId
// ─────────────────────────────────────────
router.post("/accept/:requestId", async (req, res) => {
    try {
        const { providerId, familyId } = req.body;

        const request = await ServiceRequest.findById(req.params.requestId);
        if (!request) return res.status(404).json({ error: "Request not found" });

        const provider = await ServiceProvider.findById(providerId);
        if (!provider) return res.status(404).json({ error: "Provider not found" });

        const booking = new Booking({
            serviceRequestId: request._id,
            providerId,
            familyId: familyId || request.familyId,
            status: "active",
            patientType: request.PatientType,
            location: request.SLocation,
            duration: request.Service,
            rate: provider.hourlyRate,
            startDate: new Date()
        });

        await booking.save();

        // ✅ Send notification to family - booking confirmed
        await Notification.create({
            receiverId: familyId || request.familyId,
            familyId: familyId || request.familyId,
            providerId: providerId,
            role: "family",
            title: "Booking Confirmed",
            message: `Your service request has been confirmed with ${provider.FullName}. They will contact you shortly.`,
            serviceType: request.PatientType,
            requestId: request._id,
            status: "accepted",
        });

        await ServiceRequest.findByIdAndUpdate(req.params.requestId, {
            status: "matched"
        });

        res.status(201).json({ message: "Booking confirmed successfully", booking });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// POST /api/service-request/decline/:requestId
// ─────────────────────────────────────────
router.post("/decline/:requestId", async (req, res) => {
    try {
        const { providerId, familyId } = req.body;

        const provider = await ServiceProvider.findById(providerId);

        // ✅ Send declined notification to family
        if (familyId) {
            await Notification.create({
                receiverId: familyId,
                familyId: familyId,
                providerId: providerId,
                role: "family",
                title: "Request Declined",
                message: `${provider?.FullName || "A provider"} has declined your service request. Don't worry, other providers may still accept it.`,
                status: "declined",
            });
        }

        res.json({ message: "Request declined" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/family-bookings/:familyId
// ─────────────────────────────────────────
router.get("/family-bookings/:familyId", async (req, res) => {
    try {
        const bookings = await Booking.find({ familyId: req.params.familyId })
            .populate("providerId", "FullName phone email location hourlyRate uploadprofile")
            .populate("serviceRequestId", "PatientType SLocation Service PName")
            .sort({ createdAt: -1 });

        const totalServices  = bookings.length;
        const activeNow      = bookings.filter(b => b.status === "active").length;
        const completed      = bookings.filter(b => ["completed", "paid", "reviewed"].includes(b.status)).length;

        res.json({ bookings, totalServices, activeNow, completed });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/family-dashboard/:familyId
// ─────────────────────────────────────────
router.get("/family-dashboard/:familyId", async (req, res) => {
    try {
        const totalJobs   = await Booking.countDocuments({ familyId: req.params.familyId });
        const activeNow   = await Booking.countDocuments({ familyId: req.params.familyId, status: "active" });
        const completed   = await Booking.countDocuments({ 
            familyId: req.params.familyId, 
            status: { $in: ["completed", "paid", "reviewed"] }
        });

        const recentBookings = await Booking.find({ familyId: req.params.familyId })
            .populate("serviceRequestId", "PatientType")
            .sort({ createdAt: -1 })
            .limit(3);

        res.json({ totalJobs, activeNow, completed, recentBookings });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/provider-services/:providerId
// ─────────────────────────────────────────
router.get("/provider-services/:providerId", async (req, res) => {
    try {
        const bookings = await Booking.find({
            providerId: req.params.providerId,
            status: "active"
        })
        .populate("familyId", "familyFullName phone email")
        .populate("serviceRequestId", "PatientType SLocation Service")
        .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// PUT /api/service-request/complete/:bookingId
// ─────────────────────────────────────────
router.put("/complete/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            { status: "completed" },
            { new: true }
        );
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        res.json({ message: "Booking marked as completed", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/provider-activity/:providerId
// ─────────────────────────────────────────
router.get("/provider-activity/:providerId", async (req, res) => {
    try {
        const bookings = await Booking.find({
            providerId: req.params.providerId,
            status: "completed"
        })
        .populate("familyId", "familyFullName")
        .populate("serviceRequestId", "PatientType")
        .sort({ updatedAt: -1 });

        const completed   = bookings.length;
        const totalEarned = bookings.reduce((sum, b) => sum + (Number(b.rate) || 0), 0);
        const avgRating   = 0;

        res.json({
            stats: { completed, totalEarned, avgRating },
            bookings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// PUT /api/service-request/mark-paid/:bookingId  ← NEW
// MakePayment — mark booking as paid (cash/bank)
// ─────────────────────────────────────────
router.put("/mark-paid/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            { status: "paid" },
            { new: true }
        );
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // ✅ Send payment notification to family
        await Notification.create({
            receiverId: booking.familyId,
            familyId: booking.familyId,
            role: "family",
            title: "Payment Successful ✅",
            message: `Your payment of Rs. ${booking.rate} for ${booking.patientType || "care"} service has been processed successfully.`,
            status: "pending",
        });

        res.json({ message: "Payment marked successfully", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// POST /api/service-request/submit-review
// Family submits a review for a completed booking
// ─────────────────────────────────────────
router.post("/submit-review", async (req, res) => {
    try {
        const { bookingId, providerId, rating, review, recommend, aspects } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "reviewed", rating, review, recommend, aspects },
            { new: true }
        );

        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // ✅ Send notification to provider about new review
        if (providerId) {
            await Notification.create({
                receiverId: providerId,
                providerId: providerId,
                role: "provider",
                title: "New Review Received! ⭐",
                message: `A family rated your service ${rating}/5 stars.`,
                status: "pending",
            });
        }

        res.json({ message: "Review submitted successfully", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;