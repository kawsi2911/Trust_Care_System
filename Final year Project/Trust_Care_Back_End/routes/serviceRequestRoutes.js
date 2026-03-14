import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Booking from "../models/bookingModel.js";
// ✅ FIXED: was missing — caused ServiceProvider.findById() to crash
import ServiceProvider from "../models/providerModel.js";

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

        // ✅ FIXED: ServiceProvider now imported correctly
        const provider = await ServiceProvider.findById(userId);
        if (!provider) return res.status(404).json({ error: "Provider not found" });

        const totalJobs   = await Booking.countDocuments({ providerId: userId });
        const activeJobs  = await Booking.countDocuments({ providerId: userId, status: "active" });
        const pendingJobs = await Booking.countDocuments({ providerId: userId, status: "pending" });

        // ✅ FIXED: status field now exists in serviceRequestModel
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
// Provider notifications — all pending requests near their city
// ─────────────────────────────────────────
router.get("/provider-notifications/:providerId", async (req, res) => {
    try {
        // ✅ FIXED: ServiceProvider now imported correctly
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
// Family confirms a provider → booking created, status updated
// ─────────────────────────────────────────
router.post("/accept/:requestId", async (req, res) => {
    try {
        const { providerId, familyId } = req.body;

        const request = await ServiceRequest.findById(req.params.requestId);
        if (!request) return res.status(404).json({ error: "Request not found" });

        const provider = await ServiceProvider.findById(providerId);
        if (!provider) return res.status(404).json({ error: "Provider not found" });

        // Create booking
        const booking = new Booking({
            serviceRequestId: request._id,
            providerId,
            familyId: familyId || request.familyId,
            status: "active",                    // confirmed by family = active
            patientType: request.PatientType,
            location: request.SLocation,
            duration: request.Service,
            rate: provider.hourlyRate,
            startDate: new Date()
        });

        await booking.save();

        // ✅ FIXED: update request status so it no longer shows in pending list
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
// Provider declines — request stays open for others
// ─────────────────────────────────────────
router.post("/decline/:requestId", async (req, res) => {
    try {
        res.json({ message: "Request declined" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/family-bookings/:familyId
// Family activity page — all bookings for this family
// ─────────────────────────────────────────
router.get("/family-bookings/:familyId", async (req, res) => {
    try {
        const bookings = await Booking.find({ familyId: req.params.familyId })
            .populate("providerId", "FullName phone email location hourlyRate uploadprofile")
            .populate("serviceRequestId", "PatientType SLocation Service PName")
            .sort({ createdAt: -1 });

        const totalServices  = bookings.length;
        const activeNow      = bookings.filter(b => b.status === "active").length;
        const completed      = bookings.filter(b => b.status === "completed").length;

        res.json({ bookings, totalServices, activeNow, completed });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─────────────────────────────────────────
// GET /api/service-request/family-dashboard/:familyId
// Family home dashboard stats
// ─────────────────────────────────────────
router.get("/family-dashboard/:familyId", async (req, res) => {
    try {
        const totalJobs   = await Booking.countDocuments({ familyId: req.params.familyId });
        const activeNow   = await Booking.countDocuments({ familyId: req.params.familyId, status: "active" });
        const completed   = await Booking.countDocuments({ familyId: req.params.familyId, status: "completed" });

        const recentBookings = await Booking.find({ familyId: req.params.familyId })
            .populate("serviceRequestId", "PatientType")
            .sort({ createdAt: -1 })
            .limit(3);

        res.json({ totalJobs, activeNow, completed, recentBookings });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────
// ADD THESE 3 ROUTES to your serviceRequestRoutes.js
// (paste at the bottom before "export default router")
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────
// GET /api/service-request/provider-services/:providerId
// ServicesDashboard — active bookings for this provider
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
// ServicesDashboard — provider marks job as complete
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
// ActivityDashboard — completed bookings + stats
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

        // Calculate stats
        const completed   = bookings.length;
        const totalEarned = bookings.reduce((sum, b) => sum + (Number(b.rate) || 0), 0);
        // avgRating placeholder — add a Review model later for real ratings
        const avgRating   = 0;

        res.json({
            stats: { completed, totalEarned, avgRating },
            bookings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;