import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";

// ─── Shared Top Bar & Nav ───────────────────────────────────────────────────
const AdminTopBar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = ["Home", "Users", "Services", "Reports", "Finance", "Settings"];
  return (
    <>
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <img src={logo} alt="Trust Care Logo" className="topbar-logo" />
        </div>
        <h1 className="topbar-title">Admin Dashboard</h1>
        <div className="topbar-right-placeholder"></div>
      </div>
      <div className="admin-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="logout-btn" onClick={onLogout}>
          ▶ Log Out
        </button>
      </div>
    </>
  );
};

// ─── USER DETAIL MODAL ───────────────────────────────────────────────────────
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "32px",
        width: "480px", maxWidth: "90%", maxHeight: "80vh", overflowY: "auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#1a237e" }}>👤 User Details</h3>
          <button onClick={onClose} style={{
            background: "#f44336", color: "#fff", border: "none",
            borderRadius: "50%", width: "30px", height: "30px",
            cursor: "pointer", fontSize: "1rem", fontWeight: "bold"
          }}>✕</button>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Name:</strong> {user.name}
          </div>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Type:</strong> {user.userType}
          </div>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Status:</strong>{" "}
            <span style={{ color: user.status === "Active" ? "#4caf50" : user.status === "Pending" ? "#ff9800" : "#f44336", fontWeight: 600 }}>
              {user.status}
            </span>
          </div>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Email:</strong> {user.email}
          </div>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Phone:</strong> {user.phone || "N/A"}
          </div>
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>NIC:</strong> {user.nic || "N/A"}
          </div>
          {user.userType === "Provider" && (
            <>
              <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
                <strong>Location:</strong> {user.location || "N/A"}
              </div>
              <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
                <strong>Service Types:</strong> {Array.isArray(user.serviceType) ? user.serviceType.join(", ") : "N/A"}
              </div>
              <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
                <strong>Hourly Rate:</strong> Rs. {user.hourlyRate || "N/A"}
              </div>
            </>
          )}
          {user.userType === "Family" && (
            <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
              <strong>City:</strong> {user.city || "N/A"}
            </div>
          )}
          <div style={{ background: "#f5f5f5", padding: "10px 14px", borderRadius: "8px" }}>
            <strong>Joined:</strong> {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <button onClick={onClose} style={{
          marginTop: "20px", width: "100%", padding: "10px",
          background: "#2196f3", color: "#fff", border: "none",
          borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600
        }}>Close</button>
      </div>
    </div>
  );
};

// ─── USER EDIT MODAL ─────────────────────────────────────────────────────────
const UserEditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:   user.name   || "",
    email:  user.email  || "",
    phone:  user.phone  || "",
    status: user.status || "Active",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: form.status }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("✅ Saved successfully!");
        setTimeout(() => { onSave(); onClose(); }, 1000);
      } else {
        setMsg("❌ Failed to save");
      }
    } catch {
      setMsg("❌ Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "32px",
        width: "480px", maxWidth: "90%",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#1a237e" }}>✏️ Edit User</h3>
          <button onClick={onClose} style={{
            background: "#f44336", color: "#fff", border: "none",
            borderRadius: "50%", width: "30px", height: "30px",
            cursor: "pointer", fontSize: "1rem", fontWeight: "bold"
          }}>✕</button>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#555" }}>Name</label>
            <input
              value={form.name}
              disabled
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#555" }}>Email</label>
            <input
              value={form.email}
              disabled
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#555" }}>Phone</label>
            <input
              value={form.phone}
              disabled
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", background: "#f9f9f9", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#555" }}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>

        {msg && <p style={{ color: msg.includes("✅") ? "#4caf50" : "#f44336", marginTop: "12px", fontWeight: 600 }}>{msg}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "10px", background: "#4caf50", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600
          }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "#9e9e9e", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── HOME TAB ───────────────────────────────────────────────────────────────
const HomeTab = ({ setActiveTab }) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
  const lastLogin = adminInfo.lastLogin
    ? new Date(adminInfo.lastLogin).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "Today";

  const [stats, setStats] = useState({
    totalUsers: 0, totalProviders: 0, totalFamilies: 0,
    activeServices: 0, pendingUsers: 0, totalBookings: 0,
  });
  const [activity, setActivity] = useState([]);

  useState(() => {
    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", { headers });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    const fetchActivity = async () => {
      try {
        const activityList = [];

        const famRes = await fetch("http://localhost:5000/api/admin/users?type=Families", { headers });
        const famData = await famRes.json();
        if (famData.success && famData.users.length > 0) {
          famData.users.slice(0, 2).forEach(u => {
            activityList.push({ icon: "✅", text: `New family registered: ${u.name}`, time: u.joinDate });
          });
        }

        const provRes = await fetch("http://localhost:5000/api/admin/users?type=Providers", { headers });
        const provData = await provRes.json();
        if (provData.success && provData.users.length > 0) {
          provData.users.slice(0, 2).forEach(u => {
            activityList.push({ icon: "✅", text: `New provider registered: ${u.name}`, time: u.joinDate });
          });
        }

        const svcRes = await fetch("http://localhost:5000/api/admin/services", { headers });
        const svcData = await svcRes.json();
        if (svcData.success && svcData.services.length > 0) {
          svcData.services.slice(0, 2).forEach(s => {
            activityList.push({
              icon: s.status === "Completed" ? "✅" : "⚡",
              text: `Service ${s.status}: ${s.serviceType} — ${s.client.name}`,
              time: s.createdAt,
            });
          });
        }

        activityList.sort((a, b) => new Date(b.time) - new Date(a.time));
        setActivity(activityList.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      }
    };

    fetchStats();
    fetchActivity();
  }, []);

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="admin-content">
      <div className="welcome-banner">
        Welcome, {adminInfo.username || "Admin"} | Last Login: {lastLogin}
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-number">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-number">{stats.totalProviders.toLocaleString()}</div>
          <div className="stat-label">Service Providers</div>
        </div>
        <div className="stat-card stat-teal">
          <div className="stat-number">{stats.totalFamilies.toLocaleString()}</div>
          <div className="stat-label">Families</div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-number">{stats.activeServices.toLocaleString()}</div>
          <div className="stat-label">Active Services</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-number">{stats.totalBookings || 0}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-number">{stats.pendingUsers.toLocaleString()}</div>
          <div className="stat-label">Pending Issues</div>
        </div>
      </div>

      <div className="activity-card">
        <h3>📊 Recent Activity</h3>
        {activity.length > 0 ? (
          activity.map((item, idx) => (
            <div className="activity-item" key={idx}>
              {item.icon} {item.text}
              <span style={{ float: "right", color: "#999", fontSize: "0.8rem" }}>
                {getTimeAgo(item.time)}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: "#999", padding: "10px 0" }}>No recent activity found.</div>
        )}
      </div>

      <div className="quick-actions-card">
        <h3>Quick Actions</h3>
        <button className="action-btn action-btn-blue" onClick={() => setActiveTab("Users")}>
          View All Users
        </button>
        <button className="action-btn action-btn-orange" onClick={() => setActiveTab("Reports")}>
          View Reports
        </button>
      </div>
    </div>
  );
};

// ─── USERS TAB ──────────────────────────────────────────────────────────────
const UsersTab = () => {
  const [filter, setFilter] = useState("All Users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const filters = ["All Users", "Families", "Providers", "Verified", "Pending"];

  const fetchUsers = async (filterType, searchText) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = "http://localhost:5000/api/admin/users?";
      if (filterType && filterType !== "All Users") url += `type=${filterType}&`;
      if (searchText) url += `search=${searchText}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => { fetchUsers(filter, search); }, []);

  const handleFilterChange = (f) => { setFilter(f); fetchUsers(f, search); };
  const handleSearch = (e) => { setSearch(e.target.value); fetchUsers(filter, e.target.value); };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) fetchUsers(filter, search);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getBadgeClass = (status) => {
    if (status === "Active" || status === "Verified") return "badge-active";
    if (status === "Pending") return "badge-pending";
    if (status === "Inactive") return "badge-inactive";
    return "badge-pending";
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <div className="admin-content">
      {/* ✅ NEW: View Details Modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* ✅ NEW: Edit Modal */}
      {editUser && (
        <UserEditModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={() => fetchUsers(filter, search)}
        />
      )}

      <div className="search-bar-wrapper">
        <input
          className="search-bar"
          type="text"
          placeholder="Search users by name, email, NIC......"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => handleFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading users...</div>
      ) : filter === "Pending" ? (
        <>
          <div className="verification-header-banner">Provider Verification</div>
          <div className="pending-alert">
            ⚠️ {users.filter(u => u.status === "Pending").length} providers waiting for verification
          </div>
          {users.filter(u => u.status === "Pending").map((user, idx) => (
            <div className="verification-card" key={idx}>
              <h4>Pending Verification – {user.name}</h4>
              <div className="provider-info-row">
                <div className="provider-avatar">👤</div>
                <div className="provider-details">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>NIC:</strong> {user.nic || "N/A"}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                  <p><strong>Type:</strong> {user.userType}</p>
                  <p><strong>Registered:</strong> {getTimeAgo(user.joinDate)}</p>
                </div>
              </div>
              <div className="verification-actions">
                <button className="btn-approve" onClick={() => handleStatusUpdate(user._id, "Active")}>
                  ✓ Approve &amp; Activate
                </button>
                <button className="btn-reject" onClick={() => handleStatusUpdate(user._id, "Inactive")}>
                  ✗ Reject Application
                </button>
              </div>
            </div>
          ))}
          {users.filter(u => u.status === "Pending").length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No pending users found.</div>
          )}
        </>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No users found.</div>
      ) : (
        users.map((user, idx) => (
          <div className="user-card" key={idx}>
            <div className="user-card-top">
              <div>
                <h4>{user.name}</h4>
                <p>{user.userType} | {user.status}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone || "N/A"}</p>
                <p>Joined: {new Date(user.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
              </div>
              <span className={`badge ${getBadgeClass(user.status)}`}>{user.status}</span>
            </div>
            <div className="user-card-actions">
              {/* ✅ NEW: View Details opens modal */}
              <button className="btn-view" onClick={() => setSelectedUser(user)}>
                View Details
              </button>
              {/* ✅ NEW: Edit opens edit modal */}
              <button className="btn-edit" onClick={() => setEditUser(user)}>
                Edit
              </button>
              {/* ✅ Deactivate already works */}
              <button className="btn-reject" onClick={() => handleStatusUpdate(user._id, "Inactive")}>
                Deactivate
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ─── SERVICES TAB ───────────────────────────────────────────────────────────
const ServicesTab = () => {
  const [filter, setFilter] = useState("All Services");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filters = ["All Services", "Active", "Completed", "Issues"];

  const fetchServices = async (filterType, searchText) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = "http://localhost:5000/api/admin/services?";
      if (filterType === "Issues") url += `status=Issue Reported&`;
      else if (filterType && filterType !== "All Services") url += `status=${filterType}&`;
      if (searchText) url += `search=${searchText}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setServices(data.services);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => { fetchServices(filter, search); }, []);

  const handleFilterChange = (f) => { setFilter(f); fetchServices(f, search); };
  const handleSearch = (e) => { setSearch(e.target.value); fetchServices(filter, e.target.value); };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`http://localhost:5000/api/admin/services/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchServices(filter, search);
    } catch (err) {
      console.error("Failed to update service status:", err);
    }
  };

  const getBadgeClass = (status) => {
    if (status === "Active") return "badge-active";
    if (status === "Completed") return "badge-verified";
    if (status === "Issue Reported") return "badge-pending";
    if (status === "Cancelled") return "badge-inactive";
    return "badge-pending";
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <div className="admin-content">
      <div className="search-bar-wrapper">
        <input
          className="search-bar"
          type="text"
          placeholder="Search by service number, provider, client..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="filter-tabs">
        {filters.map((f) => (
          <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => handleFilterChange(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>Loading services...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No services found.</div>
      ) : filter === "Issues" ? (
        services.map((service, idx) => (
          <div className="service-card issue-priority-high" key={idx}>
            <h4><span className="priority-dot dot-red"></span>{service.serviceNumber} – {service.serviceType}</h4>
            <p><strong>Provider:</strong> {service.provider.name}</p>
            <p><strong>Client:</strong> {service.client.name}</p>
            <p><strong>Issue:</strong> {service.issueDescription || "Issue reported"}</p>
            <p><strong>Reported:</strong> {getTimeAgo(service.createdAt)}</p>
            <div style={{ margin: "8px 0" }}><span className="badge-urgent">Urgent</span></div>
            <div className="service-card-actions">
              <button className="btn-respond">View &amp; Respond</button>
              <button className="btn-resolve" onClick={() => handleStatusUpdate(service._id, "Completed")}>Mark Resolved</button>
            </div>
          </div>
        ))
      ) : (
        services.map((service, idx) => (
          <div className={`service-card ${service.status === "Issue Reported" ? "issue-card" : ""}`} key={idx}>
            <div className="service-card-top">
              <h4>{service.serviceNumber} – {service.serviceType}</h4>
              <span className={`badge ${getBadgeClass(service.status)}`}>{service.status}</span>
            </div>
            <p><strong>Provider:</strong> {service.provider.name}</p>
            <p><strong>Client:</strong> {service.client.name}</p>
            <p><strong>Location:</strong> {service.location}</p>
            <p><strong>Started:</strong> {new Date(service.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            <p><strong>Amount:</strong> Rs. {service.amount.toLocaleString()} {service.isPaid ? "(Paid)" : "(Unpaid)"}</p>
            <div className="service-card-actions">
              <button className="btn-view">View Full Details</button>
              {service.status === "Active" && (
                <button className="btn-edit" onClick={() => handleStatusUpdate(service._id, "Completed")}>Mark Completed</button>
              )}
              <button className="btn-reject" onClick={() => handleStatusUpdate(service._id, "Cancelled")}>Cancel</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ─── REPORTS TAB ────────────────────────────────────────────────────────────
const ReportsTab = () => {
  const [reportType, setReportType] = useState("User Growth Report");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = `http://localhost:5000/api/admin/reports?reportType=${encodeURIComponent(reportType)}`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate)   url += `&toDate=${toDate}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setReport(data.report); setGenerated(true); }
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="reports-header">Reports & Analytics</div>
      <label className="form-label">Select Report Type</label>
      <select className="form-select" value={reportType} onChange={(e) => { setReportType(e.target.value); setGenerated(false); }}>
        <option>User Growth Report</option>
        <option>Service Summary Report</option>
        <option>Revenue Report</option>
        <option>Provider Performance Report</option>
      </select>
      <div className="date-row">
        <div>
          <label className="form-label">From Date</label>
          <input type="date" className="form-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">To Date</label>
          <input type="date" className="form-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>
      <button className="generate-btn" onClick={handleGenerateReport} disabled={loading}>
        {loading ? "Generating..." : "View Detailed Report"}
      </button>
      {generated && report && (
        <div className="summary-card">
          <h4>📋 {report.title}</h4>
          {fromDate && toDate && (
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "12px" }}>
              Period: {new Date(fromDate).toLocaleDateString()} – {new Date(toDate).toLocaleDateString()}
            </p>
          )}
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <div>{report.title}</div>
            <div>Real-time data from MongoDB</div>
          </div>
          {report.summary.map((item, idx) => (
            <div className="summary-item" key={idx}>
              <span>{item.label}:</span>
              <span><strong>{item.value}</strong></span>
            </div>
          ))}
          <div className="export-row" style={{ marginTop: "16px" }}>
            <button className="btn-export-pdf">Export PDF</button>
            <button className="btn-export-excel">Export Excel</button>
          </div>
        </div>
      )}
      {!generated && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          Select a report type and click "View Detailed Report" to see real data
        </div>
      )}
    </div>
  );
};

// ─── FINANCE TAB ─────────────────────────────────────────────────────────────
const FinanceTab = () => {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    const fetchFinance = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/admin/finance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setFinance(data.finance);
      } catch (err) {
        console.error("Failed to fetch finance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, []);

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) return `Rs. ${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `Rs. ${(amount / 1000).toFixed(1)}K`;
    return `Rs. ${amount.toLocaleString()}`;
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>Loading finance data...</div>
  );

  return (
    <div className="admin-content">
      <div className="finance-stats">
        <div className="stat-card stat-blue">
          <div className="stat-number" style={{ fontSize: "1.8rem" }}>
            {finance ? formatAmount(finance.totalRevenue) : "Rs. 0"}
          </div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-number" style={{ fontSize: "1.8rem" }}>
            {finance ? formatAmount(finance.commission) : "Rs. 0"}
          </div>
          <div className="stat-label">Platform Commission (10%)</div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-number" style={{ fontSize: "1.8rem" }}>
            {finance ? formatAmount(finance.providerPayout) : "Rs. 0"}
          </div>
          <div className="stat-label">Provider Payouts</div>
        </div>
      </div>

      <div className="transactions-card">
        <h4>💳 Recent Transactions</h4>
        {finance && finance.recentTransactions && finance.recentTransactions.length > 0 ? (
          finance.recentTransactions.map((payment, idx) => (
            <div className="transaction-item" key={idx}>
              <p className="t-amount">{payment.paymentNumber} – Rs. {payment.amount.toLocaleString()}</p>
              <p><strong>Family:</strong> {payment.familyName || "N/A"} → <strong>Provider:</strong> {payment.providerName || "N/A"}</p>
              <p><strong>Service:</strong> {payment.serviceType || "Care Service"}</p>
              <p><strong>Method:</strong> {payment.paymentMethod || "N/A"}</p>
              <p>Platform Fee: Rs. {(payment.amount * 0.10).toLocaleString()}</p>
              <p className="t-time">{getTimeAgo(payment.createdAt)}</p>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>No transactions yet.</div>
        )}
      </div>

      <div className="comparison-card">
        <h4>📊 Monthly Comparison</h4>
        <div className="comparison-item">
          <span>This Month:</span>
          <span><strong>Rs. {finance ? finance.monthlyRevenue.toLocaleString() : 0}</strong></span>
        </div>
        <div className="comparison-item">
          <span>Last Month:</span>
          <span><strong>Rs. {finance ? finance.lastMonthRevenue.toLocaleString() : 0}</strong></span>
        </div>
        <div className="comparison-item">
          <span>Growth:</span>
          <span className="growth-text">
            {finance && finance.lastMonthRevenue > 0
              ? `${(((finance.monthlyRevenue - finance.lastMonthRevenue) / finance.lastMonthRevenue) * 100).toFixed(1)}%`
              : "N/A"}
          </span>
        </div>
      </div>

      <button className="generate-btn">View Detailed Report</button>
    </div>
  );
};

// ─── SETTINGS TAB ────────────────────────────────────────────────────────────
const SettingsTab = () => {
  const [platformName, setPlatformName] = useState("Trust Care");
  const [supportEmail, setSupportEmail] = useState("support@trustcare.lk");
  const [supportPhone, setSupportPhone] = useState("+94 11 234 5678");
  const [commission, setCommission] = useState("10");
  const [serviceFee, setServiceFee] = useState("500");
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: true, daily: false });
  const [msg, setMsg] = useState({ general: "", fees: "", notif: "" });

  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useState(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings", { headers });
        const data = await res.json();
        if (data.success) {
          const s = data.settings;
          setPlatformName(s.platformName);
          setSupportEmail(s.supportEmail);
          setSupportPhone(s.supportPhone);
          setCommission(String(s.commission));
          setServiceFee(String(s.serviceFee));
          setNotifications(s.notifications);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const showMsg = (type, text) => {
    setMsg((prev) => ({ ...prev, [type]: text }));
    setTimeout(() => setMsg((prev) => ({ ...prev, [type]: "" })), 3000);
  };

  const saveGeneral = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings/general", {
        method: "PUT", headers, body: JSON.stringify({ platformName, supportEmail, supportPhone }),
      });
      const data = await res.json();
      showMsg("general", data.success ? "✅ Saved!" : "❌ Failed");
    } catch { showMsg("general", "❌ Error saving"); }
  };

  const saveFees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings/fees", {
        method: "PUT", headers, body: JSON.stringify({ commission, serviceFee }),
      });
      const data = await res.json();
      showMsg("fees", data.success ? "✅ Updated!" : "❌ Failed");
    } catch { showMsg("fees", "❌ Error saving"); }
  };

  const saveNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings/notifications", {
        method: "PUT", headers, body: JSON.stringify(notifications),
      });
      const data = await res.json();
      showMsg("notif", data.success ? "✅ Saved!" : "❌ Failed");
    } catch { showMsg("notif", "❌ Error saving"); }
  };

  const toggleNotification = (key) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="admin-content">
      <div className="settings-section">
        <h4>⚙️ General Settings</h4>
        <label className="form-label">Platform Name</label>
        <input className="form-input" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
        <label className="form-label">Support Email</label>
        <input className="form-input" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
        <label className="form-label">Support Phone</label>
        <input className="form-input" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
        {msg.general && <p style={{ color: "#4caf50", marginBottom: "8px", fontWeight: 600 }}>{msg.general}</p>}
        <button className="save-btn" onClick={saveGeneral}>Save Changes</button>
      </div>

      <div className="settings-section">
        <h4>💰 Commission & Fees</h4>
        <label className="form-label">Platform Commission (%)</label>
        <input className="form-input" placeholder="e.g. 10" value={commission} onChange={(e) => setCommission(e.target.value)} />
        <label className="form-label">Service Fee (Rs.)</label>
        <input className="form-input" placeholder="500" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} />
        {msg.fees && <p style={{ color: "#4caf50", marginBottom: "8px", fontWeight: 600 }}>{msg.fees}</p>}
        <button className="save-btn" onClick={saveFees}>Update Fees</button>
      </div>

      <div className="settings-section">
        <h4>🔔 Notification Settings</h4>
        {[
          { key: "email", label: "Email notifications to users" },
          { key: "sms",   label: "SMS notifications" },
          { key: "push",  label: "Push notifications" },
          { key: "daily", label: "Daily admin reports" },
        ].map(({ key, label }) => (
          <div className="checkbox-row" key={key}>
            <input type="checkbox" id={key} checked={notifications[key]} onChange={() => toggleNotification(key)} />
            <label htmlFor={key}>{label}</label>
          </div>
        ))}
        {msg.notif && <p style={{ color: "#4caf50", marginBottom: "8px", fontWeight: 600 }}>{msg.notif}</p>}
        <button className="save-btn" onClick={saveNotifications}>Save Settings</button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Home":     return <HomeTab setActiveTab={setActiveTab} />;
      case "Users":    return <UsersTab />;
      case "Services": return <ServicesTab />;
      case "Reports":  return <ReportsTab />;
      case "Finance":  return <FinanceTab />;
      case "Settings": return <SettingsTab />;
      default:         return <HomeTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminTopBar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;