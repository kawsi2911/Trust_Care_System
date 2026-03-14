import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
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

// ── Get All Users ─────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { type, search } = req.query;
    let filter = {};
    if (type === "Families") filter.userType = "Family";
    if (type === "Verified") filter.status = "Verified";
    if (type === "Pending")  filter.status = "Pending";
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { nic:   { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Single User ───────────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: `User status updated to ${status}`, user });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Dashboard Stats ───────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers      = await User.countDocuments();
    const totalProviders  = await User.countDocuments({ userType: "ServiceProvider" });
    const totalFamilies   = await User.countDocuments({ userType: "Family" });
    const activeServices  = await User.countDocuments({ status: "Active" });
    const pendingUsers    = await User.countDocuments({ status: "Pending" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalFamilies,
        activeServices,
        pendingUsers,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
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
export const getAllServices = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "All Services") filter.status = status;
    if (search) {
      filter.$or = [
        { serviceNumber: { $regex: search, $options: "i" } },
        { "provider.name": { $regex: search, $options: "i" } },
        { "client.name": { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    console.error("Get all services error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Single Service ────────────────────────────────────────────────────────
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Update Service Status ─────────────────────────────────────────────────────
export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: `Service status updated to ${status}`, service });
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
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Get Service Stats ─────────────────────────────────────────────────────────
export const getServiceStats = async (req, res) => {
  try {
    const total      = await Service.countDocuments();
    const active     = await Service.countDocuments({ status: "Active" });
    const completed  = await Service.countDocuments({ status: "Completed" });
    const issues     = await Service.countDocuments({ status: "Issue Reported" });
    const cancelled  = await Service.countDocuments({ status: "Cancelled" });

    res.status(200).json({
      success: true,
      stats: { total, active, completed, issues, cancelled },
    });
  } catch (error) {
    console.error("Service stats error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── Generate Report ───────────────────────────────────────────────────────────
export const generateReport = async (req, res) => {
  try {
    const { reportType, fromDate, toDate } = req.query;

    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(fromDate);
    if (toDate)   dateFilter.$lte = new Date(new Date(toDate).setHours(23, 59, 59));

    let report = {};

    if (reportType === "User Growth Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const totalUsers     = await User.countDocuments(filter);
      const totalFamilies  = await User.countDocuments({ ...filter, userType: "Family" });
      const totalProviders = await User.countDocuments({ ...filter, userType: "ServiceProvider" });
      const activeUsers    = await User.countDocuments({ ...filter, status: "Active" });
      const pendingUsers   = await User.countDocuments({ ...filter, status: "Pending" });

      report = {
        title: "User Growth Report",
        summary: [
          { label: "Total Users",       value: totalUsers },
          { label: "Families",          value: totalFamilies },
          { label: "Service Providers", value: totalProviders },
          { label: "Active Users",      value: activeUsers },
          { label: "Pending Users",     value: pendingUsers },
        ],
      };
    }

    else if (reportType === "Service Summary Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const total     = await Service.countDocuments(filter);
      const active    = await Service.countDocuments({ ...filter, status: "Active" });
      const completed = await Service.countDocuments({ ...filter, status: "Completed" });
      const issues    = await Service.countDocuments({ ...filter, status: "Issue Reported" });
      const cancelled = await Service.countDocuments({ ...filter, status: "Cancelled" });

      // Count by service type
      const elderCare    = await Service.countDocuments({ ...filter, serviceType: "Elder Care" });
      const childCare    = await Service.countDocuments({ ...filter, serviceType: "Child Care" });
      const homeCare     = await Service.countDocuments({ ...filter, serviceType: "Home Patient Care" });
      const hospitalCare = await Service.countDocuments({ ...filter, serviceType: "Hospital Patient Care" });

      report = {
        title: "Service Summary Report",
        summary: [
          { label: "Total Services",        value: total },
          { label: "Active",                value: active },
          { label: "Completed",             value: completed },
          { label: "Issues Reported",       value: issues },
          { label: "Cancelled",             value: cancelled },
          { label: "Elder Care",            value: elderCare },
          { label: "Child Care",            value: childCare },
          { label: "Home Patient Care",     value: homeCare },
          { label: "Hospital Patient Care", value: hospitalCare },
        ],
      };
    }

    else if (reportType === "Revenue Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const services = await Service.find({ ...filter, isPaid: true });
      const totalRevenue   = services.reduce((sum, s) => sum + s.amount, 0);
      const commission     = totalRevenue * 0.10;
      const providerPayout = totalRevenue - commission;
      const paidServices   = services.length;
      const unpaidServices = await Service.countDocuments({ ...filter, isPaid: false });

      report = {
        title: "Revenue Report",
        summary: [
          { label: "Total Revenue",     value: `Rs. ${totalRevenue.toLocaleString()}` },
          { label: "Platform Commission (10%)", value: `Rs. ${commission.toLocaleString()}` },
          { label: "Provider Payouts",  value: `Rs. ${providerPayout.toLocaleString()}` },
          { label: "Paid Services",     value: paidServices },
          { label: "Unpaid Services",   value: unpaidServices },
        ],
      };
    }

    else if (reportType === "Provider Performance Report") {
      const filter = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
      const totalProviders  = await User.countDocuments({ userType: "ServiceProvider" });
      const activeProviders = await User.countDocuments({ userType: "ServiceProvider", status: "Active" });
      const pendingProviders = await User.countDocuments({ userType: "ServiceProvider", status: "Pending" });
      const completedServices = await Service.countDocuments({ ...filter, status: "Completed" });
      const issueServices     = await Service.countDocuments({ ...filter, status: "Issue Reported" });

      report = {
        title: "Provider Performance Report",
        summary: [
          { label: "Total Providers",      value: totalProviders },
          { label: "Active Providers",     value: activeProviders },
          { label: "Pending Verification", value: pendingProviders },
          { label: "Completed Services",   value: completedServices },
          { label: "Issues Reported",      value: issueServices },
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
export const getFinanceStats = async (req, res) => {
  try {
    // All paid services
    const paidServices     = await Service.find({ isPaid: true });
    const totalRevenue     = paidServices.reduce((sum, s) => sum + s.amount, 0);
    const commission       = totalRevenue * 0.10;
    const providerPayout   = totalRevenue - commission;

    // This month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPaid  = await Service.find({ isPaid: true, createdAt: { $gte: startOfMonth } });
    const monthlyRevenue = monthlyPaid.reduce((sum, s) => sum + s.amount, 0);

    // Last month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthPaid    = await Service.find({
      isPaid: true,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const lastMonthRevenue = lastMonthPaid.reduce((sum, s) => sum + s.amount, 0);

    // Recent transactions (last 5 paid services)
    const recentTransactions = await Service.find({ isPaid: true })
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
    // Get existing or create default settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
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