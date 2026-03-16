import express from "express";
import ServiceRequest from "../models/serviceRequestModel.js";
import Booking from "../models/bookingModel.js";
import ServiceProvider from "../models/providerModel.js";
import Notification from "../models/notificationModel.js";

const router = express.Router();


// ================================
// CREATE NEW SERVICE REQUEST
// ================================
router.post("/new-request", async (req, res) => {
  try {

    const familyId = req.body.familyId;

    const newRequest = new ServiceRequest({
      ...req.body,
      familyId
    });

    const savedRequest = await newRequest.save();

    // notify providers in same location
    const providers = await ServiceProvider.find({
      location: { $regex: new RegExp(req.body.SLocation, "i") },
      status: "Active"
    });

    for (const provider of providers) {
      await Notification.create({
        receiverId: provider._id,
        role: "provider",
        title: "New Service Request",
        message: `A family in ${req.body.SLocation} needs ${req.body.PatientType} care service.`,
        requestId: savedRequest._id,
        status: "pending"
      });
    }

    res.status(201).json(savedRequest);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// GET SINGLE SERVICE REQUEST
// ================================
router.get("/service-request/:id", async (req, res) => {
  try {

    const request = await ServiceRequest
      .findById(req.params.id)
      .populate("providerId");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(request);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// PROVIDER DASHBOARD REQUESTS
// ================================
router.get("/provider-requests/:providerId", async (req, res) => {
  try {

    const requests = await ServiceRequest
      .find({ providerId: req.params.providerId })
      .populate("familyId");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// ACCEPT SERVICE REQUEST
// ================================
router.put("/accept/:requestId", async (req, res) => {
  try {

    const { providerId, familyId } = req.body;

    const request = await ServiceRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ error: "Service request not found" });
    }

    const provider = await ServiceProvider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // create booking
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

    // update request
    await ServiceRequest.findByIdAndUpdate(req.params.requestId, {
      providerId,
      status: "matched"
    });

    // notify family
    await Notification.create({
      receiverId: familyId || request.familyId,
      role: "family",
      title: "Booking Confirmed",
      message: `${provider.FullName} has accepted your service request.`,
      requestId: request._id,
      status: "accepted"
    });

    res.json({
      message: "Booking confirmed successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// DECLINE SERVICE REQUEST
// ================================
router.post("/decline/:requestId", async (req, res) => {
  try {

    const { providerId, familyId } = req.body;

    const provider = await ServiceProvider.findById(providerId);

    if (familyId) {
      await Notification.create({
        receiverId: familyId,
        role: "family",
        title: "Request Declined",
        message: `${provider?.FullName || "A provider"} declined your request.`,
        status: "declined"
      });
    }

    res.json({ message: "Request declined" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// FAMILY BOOKINGS
// ================================
router.get("/family-bookings/:familyId", async (req, res) => {
  try {

    const bookings = await Booking
      .find({ familyId: req.params.familyId })
      .populate("providerId", "FullName phone location hourlyRate uploadprofile")
      .populate("serviceRequestId", "PatientType SLocation Service PName")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// COMPLETE BOOKING
// ================================
router.put("/complete/:bookingId", async (req, res) => {
  try {

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: "completed" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking completed",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// MARK PAYMENT
// ================================
router.put("/mark-paid/:bookingId", async (req, res) => {
  try {

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: "paid" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await Notification.create({
      receiverId: booking.familyId,
      role: "family",
      title: "Payment Successful",
      message: `Payment of Rs.${booking.rate} received successfully.`,
      status: "pending"
    });

    res.json({
      message: "Payment marked successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================================
// SUBMIT REVIEW
// ================================
router.post("/submit-review", async (req, res) => {
  try {

    const { bookingId, providerId, rating, review } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "reviewed", rating, review },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (providerId) {
      await Notification.create({
        receiverId: providerId,
        role: "provider",
        title: "New Review",
        message: `You received ${rating}/5 rating from a family.`,
        status: "pending"
      });
    }

    res.json({
      message: "Review submitted",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;