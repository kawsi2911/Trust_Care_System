import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Notification from "../models/notificationModel.js";
import Provider from "../models/providerModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {

  try {

    const newServiceRequest = new ServiceRequest({
      ...req.body,
      familyId: req.body.familyId
    });

   const savedRequest = await newServiceRequest.save(); 

    /* notification for family */
    const familyNotification = new Notification({
      receiverId: req.body.familyId,
      familyId: req.body.familyId,
      requestId: savedRequest._id,
      role: "family",
      title: "Request Sent",
      message: `Your service request in ${req.body.SLocation} has been sent to nearby caregivers`
    });

    await familyNotification.save();


    /* find providers in same location */
    const providers = await Provider.find({
      location: req.body.SLocation
    });

    /* notify providers */
    for (const provider of providers) {

      const notification = new Notification({
        receiverId: provider._id,
        providerId: provider._id,
        familyId: req.body.familyId,
        requestId: savedRequest._id,
        role: "provider",
        title: "New Service Request",
        message: `New request in ${req.body.SLocation}. Click to view request`
      });

      await notification.save();
    }

    res.json({
      message: "Service Request Submitted Successfully",
      requestId: savedRequest._id
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({ error: error.message });

  }

});

router.get("/provider/:providerId", async (req, res) => {

  try {

    const notifications = await Notification.find({
      providerId: req.params.providerId
    }).populate("requestId");

    res.json(notifications);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

// Get notifications with request info
router.get("/:providerId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      providerId: req.params.providerId
    }).populate("requestId"); // populate service request

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


<<<<<<< HEAD
=======
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
        const completed      = bookings.filter(b => b.status === "completed").length;

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
>>>>>>> mumthaj


// ─────────────────────────────────────────
// PUT /api/service-request/mark-paid/:bookingId  ← mumthaj change 
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
        res.json({ message: "Payment marked successfully", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;