import Admin from "../models/adminModel.js";
import Family from "../models/familyModel.js";
import Provider from "../models/providerModel.js";
import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";
import Service from "../models/serviceModel.js";
import Settings from "../models/settingsModel.js";
import jwt from "jsonwebtoken";

// ── Verify Token (middleware) ────────────────────────────────────────────────
export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "trustcare_secret_key");
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ── Admin Login ──────────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Please provide username and password" });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "trustcare_secret_key",
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Create Admin ─────────────────────────────────────────────────────────────
export const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }
    const admin = new Admin({ username, password, email });
    await admin.save();
    res.status(201).json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Dashboard Stats ───────────────────────────────────────────────────────
// ✅ CHANGED: now counts from real families + serviceproviders + bookings collections
export const getDashboardStats = async (req, res) => {
  try {
    const totalFamilies   = await Family.countDocuments();
    const totalProviders  = await Provider.countDocuments();
    const totalUsers      = totalFamilies + totalProviders;
    const activeBookings  = await Booking.countDocuments({ status: "active" });
    const totalBookings   = await Booking.countDocuments();
    const totalPayments   = await Payment.countDocuments({ status: "Paid" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalFamilies,
        activeServices: activeBookings,
        pendingUsers: 0,
        totalBookings,
        totalPayments,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get All Users ─────────────────────────────────────────────────────────────
// ✅ CHANGED: fetches from families + serviceproviders collections
export const getAllUsers = async (req, res) => {
  try {
    const { type, search } = req.query;

    let families  = [];
    let providers = [];

    // Build search filter
    const searchFilter = search ? {
      $or: [
        { familyFullName: { $regex: search, $options: "i" } },
        { FullName:        { $regex: search, $options: "i" } },
        { email:           { $regex: search, $options: "i" } },
        { familynic:       { $regex: search, $options: "i" } },
        { NIC:             { $regex: search, $options: "i" } },
      ]
    } : {};

    if (!type || type === "All Users" || type === "Families") {
      const familySearch = search ? {
        $or: [
          { familyFullName: { $regex: search, $options: "i" } },
          { email:          { $regex: search, $options: "i" } },
          { familynic:      { $regex: search, $options: "i" } },
        ]
      } : {};
      const rawFamilies = await Family.find(familySearch).sort({ createdAt: -1 });
      families = rawFamilies.map(f => ({
        _id:      f._id,
        name:     f.familyFullName,
        email:    f.email,
        phone:    f.phone,
        nic:      f.familynic,
        city:     f.city,
        userType: "Family",
        status:   f.status || "Active",
        joinDate: f.createdAt,
      }));
    }

    if (!type || type === "All Users" || type === "Providers" || type === "Verified" || type === "Pending") {
      const providerSearch = search ? {
        $or: [
          { FullName: { $regex: search, $options: "i" } },
          { email:    { $regex: search, $options: "i" } },
          { NIC:      { $regex: search, $options: "i" } },
        ]
      } : {};

      let providerFilter = { ...providerSearch };
      if (type === "Verified") providerFilter.status = "Verified";
      if (type === "Pending")  providerFilter.status = { $in: ["Pending", undefined, null] };

      const rawProviders = await Provider.find(providerFilter).sort({ createdAt: -1 });
      providers = rawProviders.map(p => ({
        _id:          p._id,
        name:         p.FullName,
        email:        p.email,
        phone:        p.phone,
        nic:          p.NIC,
        location:     p.location,
        serviceType:  p.serviceType,
        hourlyRate:   p.hourlyRate,
        userType:     "Provider",
        status:       p.status || "Pending",
        joinDate:     p.createdAt,
      }));
    }

    // Combine based on type
    let users = [];
    if (!type || type === "All Users")  users = [...families, ...providers];
    else if (type === "Families")       users = families;
    else if (type === "Providers" || type === "Verified" || type === "Pending") users = providers;

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Single User ───────────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    let user = await Family.findById(req.params.id);
    if (!user) user = await Provider.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update User Status ────────────────────────────────────────────────────────
// ✅ CHANGED: updates status in both families and serviceproviders
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let user = await Family.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) user = await Provider.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Delete User ───────────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    let user = await Family.findByIdAndDelete(req.params.id);
    if (!user) user = await Provider.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get All Services ──────────────────────────────────────────────────────────
// ✅ CHANGED: now fetches from bookings collection with populated family + provider
export const getAllServices = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "All Services") filter.status = status.toLowerCase();

    const bookings = await Booking.find(filter)
      .populate("familyId",   "familyFullName email phone")
      .populate("providerId", "FullName email phone")
      .sort({ createdAt: -1 });

    let services = bookings.map(b => ({
      _id:         b._id,
      serviceNumber: b._id.toString().slice(-6).toUpperCase(),
      serviceType:   b.patientType || "Care Service",
      provider: {
        name:  b.providerId?.FullName || "N/A",
        email: b.providerId?.email    || "",
        phone: b.providerId?.phone    || "",
      },
      client: {
        name:  b.familyId?.familyFullName || "N/A",
        email: b.familyId?.email          || "",
        phone: b.familyId?.phone          || "",
      },
      location:  b.location  || "N/A",
      amount:    b.rate      || 0,
      isPaid:    b.status === "paid",
      status:    b.status === "active"    ? "Active"
               : b.status === "completed" ? "Completed"
               : b.status === "paid"      ? "Completed"
               : b.status === "cancelled" ? "Cancelled"
               : "Active",
      startDate: b.startDate || b.createdAt,
      createdAt: b.createdAt,
    }));

    // Apply search filter
    if (search) {
      services = services.filter(s =>
        s.serviceType.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.name.toLowerCase().includes(search.toLowerCase()) ||
        s.client.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    console.error("Get all services error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Single Service ────────────────────────────────────────────────────────
export const getServiceById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("familyId",   "familyFullName email phone")
      .populate("providerId", "FullName email phone");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, service: booking });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update Service Status ─────────────────────────────────────────────────────
export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: `Service status updated to ${status}`, booking });
  } catch (error) {
    console.error("Update service status error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Create Service ────────────────────────────────────────────────────────────
export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, message: "Service created successfully", service });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Delete Service ────────────────────────────────────────────────────────────
export const deleteService = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Service Stats ─────────────────────────────────────────────────────────
// ✅ CHANGED: now counts from bookings collection
export const getServiceStats = async (req, res) => {
  try {
    const total     = await Booking.countDocuments();
    const active    = await Booking.countDocuments({ status: "active" });
    const completed = await Booking.countDocuments({ status: { $in: ["completed", "paid"] } });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    res.status(200).json({
      success: true,
      stats: { total, active, completed, issues: 0, cancelled },
    });
  } catch (error) {
    console.error("Service stats error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Generate Report ───────────────────────────────────────────────────────────
// ✅ CHANGED: uses real families + providers + bookings + payments
export const generateReport = async (req, res) => {
  try {
    const { reportType, fromDate, toDate } = req.query;
    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(fromDate);
    if (toDate)   dateFilter.$lte = new Date(new Date(toDate).setHours(23, 59, 59));

    let report = {};

    if (reportType === "User Growth Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const totalFamilies  = await Family.countDocuments(filter);
      const totalProviders = await Provider.countDocuments(filter);
      report = {
        title: "User Growth Report",
        summary: [
          { label: "Total Users",       value: totalFamilies + totalProviders },
          { label: "Families",          value: totalFamilies },
          { label: "Service Providers", value: totalProviders },
        ],
      };
    }

    else if (reportType === "Service Summary Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const total     = await Booking.countDocuments(filter);
      const active    = await Booking.countDocuments({ ...filter, status: "active" });
      const completed = await Booking.countDocuments({ ...filter, status: { $in: ["completed", "paid"] } });
      const cancelled = await Booking.countDocuments({ ...filter, status: "cancelled" });
      report = {
        title: "Service Summary Report",
        summary: [
          { label: "Total Services", value: total },
          { label: "Active",         value: active },
          { label: "Completed",      value: completed },
          { label: "Cancelled",      value: cancelled },
        ],
      };
    }

    else if (reportType === "Revenue Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const payments       = await Payment.find({ ...filter, status: "Paid" });
      const totalRevenue   = payments.reduce((sum, p) => sum + p.amount, 0);
      const commission     = totalRevenue * 0.10;
      const providerPayout = totalRevenue - commission;
      report = {
        title: "Revenue Report",
        summary: [
          { label: "Total Revenue",            value: `Rs. ${totalRevenue.toLocaleString()}` },
          { label: "Platform Commission (10%)", value: `Rs. ${commission.toLocaleString()}` },
          { label: "Provider Payouts",          value: `Rs. ${providerPayout.toLocaleString()}` },
          { label: "Paid Transactions",         value: payments.length },
        ],
      };
    }

    else if (reportType === "Provider Performance Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const totalProviders    = await Provider.countDocuments(filter);
      const completedServices = await Booking.countDocuments({ ...filter, status: { $in: ["completed", "paid"] } });
      report = {
        title: "Provider Performance Report",
        summary: [
          { label: "Total Providers",    value: totalProviders },
          { label: "Completed Services", value: completedServices },
        ],
      };
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Finance Stats ─────────────────────────────────────────────────────────
// ✅ CHANGED: uses real payments collection
export const getFinanceStats = async (req, res) => {
  try {
    const paidPayments   = await Payment.find({ status: "Paid" });
    const totalRevenue   = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const commission     = totalRevenue * 0.10;
    const providerPayout = totalRevenue - commission;

    const now            = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = await Payment.find({ status: "Paid", createdAt: { $gte: startOfMonth } });
    const monthlyRevenue  = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthPayments = await Payment.find({
      status: "Paid",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);

    const recentTransactions = await Payment.find({ status: "Paid" })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      finance: {
        totalRevenue,
        commission,
        providerPayout,
        monthlyRevenue,
        lastMonthRevenue,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Finance stats error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Settings ──────────────────────────────────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update General Settings ───────────────────────────────────────────────────
export const updateGeneralSettings = async (req, res) => {
  try {
    const { platformName, supportEmail, supportPhone } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    if (platformName) settings.platformName = platformName;
    if (supportEmail) settings.supportEmail = supportEmail;
    if (supportPhone) settings.supportPhone = supportPhone;
    settings.updatedAt = new Date();
    await settings.save();
    res.status(200).json({ success: true, message: "General settings saved!", settings });
  } catch (error) {
    console.error("Update general settings error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update Fee Settings ───────────────────────────────────────────────────────
export const updateFeeSettings = async (req, res) => {
  try {
    const { commission, serviceFee } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    if (commission !== undefined) settings.commission = Number(commission);
    if (serviceFee !== undefined) settings.serviceFee = Number(serviceFee);
    settings.updatedAt = new Date();
    await settings.save();
    res.status(200).json({ success: true, message: "Fee settings updated!", settings });
  } catch (error) {
    console.error("Update fee settings error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update Notification Settings ──────────────────────────────────────────────
export const updateNotificationSettings = async (req, res) => {
  try {
    const { email, sms, push, daily } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    settings.notifications = { email, sms, push, daily };
    settings.updatedAt = new Date();
    await settings.save();
    res.status(200).json({ success: true, message: "Notification settings saved!", settings });
  } catch (error) {
    console.error("Update notification settings error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};