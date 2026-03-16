import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Booking from "../models/bookingModel.js";
import ServiceProvider from "../models/providerModel.js";
import Notification from "../models/notificationModel.js";

const router = express.Router();


// POST /api/service-request/new-request
router.post("/new-request", async (req, res) => {
  try {
    const familyId = req.body.familyId || req.userId;
    if (!familyId) return res.status(400).json({ error: "familyId is required" });

    const requiredFields = [
      "PatientType",
      "PName",
      "relationship",
      "Page",
      "Service",
      "SLocation",
      "Address",
      "serviceOptions",
      "Gender",
      "additionalRequirement",
    ];

    for (const field of requiredFields) {
      if (!req.body[field] || !req.body[field].toString().trim()) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const newRequest = new ServiceRequest({ familyId, ...req.body });
    const savedRequest = await newRequest.save();

    // Notify providers in same location
    const providers = await ServiceProvider.find({
      location: { $regex: new RegExp(req.body.SLocation, "i") },
      status: "Active",
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


// GET request details
router.get("/service-request/:id", async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id).populate(
      "providerId"
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Provider dashboard
router.get("/dashboard/:providerId", async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      providerId: req.params.providerId,
    }).populate("familyId");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Accept request
router.put("/accept/:requestId", async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.requestId);

    if (request.status === "Accepted") {
      return res.json({ message: "Already accepted" });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.requestId,
      {
        providerId: req.body.providerId,
        status: "Accepted",
      },
      { new: true }
    );

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Decline request
router.post("/decline/:requestId", async (req, res) => {
  try {
    const { providerId, familyId } = req.body;

    const provider = await ServiceProvider.findById(providerId);

    if (familyId) {
      await Notification.create({
        receiverId: familyId,
        familyId,
        providerId,
        role: "family",
        title: "Request Declined",
        message: `${
          provider?.FullName || "A provider"
        } has declined your service request.`,
        status: "declined",
      });
    }

    res.json({ message: "Request declined" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Family bookings
router.get("/family-bookings/:familyId", async (req, res) => {
  try {
    const bookings = await Booking.find({ familyId: req.params.familyId })
      .populate(
        "providerId",
        "FullName phone email location hourlyRate uploadprofile"
      )
      .populate("serviceRequestId", "PatientType SLocation Service PName")
      .sort({ createdAt: -1 });

    const totalServices = bookings.length;
    const activeNow = bookings.filter((b) => b.status === "active").length;
    const completed = bookings.filter((b) =>
      ["completed", "paid", "reviewed"].includes(b.status)
    ).length;

    res.json({ bookings, totalServices, activeNow, completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Complete booking
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


// Mark payment
router.put("/mark-paid/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: "paid" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await Notification.create({
      receiverId: booking.familyId,
      familyId: booking.familyId,
      role: "family",
      title: "Payment Successful",
      message: `Your payment of Rs. ${booking.rate} has been processed.`,
      status: "pending",
    });

    res.json({ message: "Payment marked successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Submit review
router.post("/submit-review", async (req, res) => {
  try {
    const { bookingId, providerId, rating, review, recommend, aspects } =
      req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "reviewed", rating, review, recommend, aspects },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (providerId) {
      await Notification.create({
        receiverId: providerId,
        providerId,
        role: "provider",
        title: "New Review Received!",
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