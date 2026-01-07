import { useState } from "react";
import { Link } from "react-router-dom";
import { VerificationQueue } from "../components/VerificationQueue";
import { ContentModeration } from "../components/ContentModeration";
import { BadgeAuditView } from "../components/BadgeAuditView";
import { PlatformAnalytics } from "../components/PlatformAnalytics";
import { AdminNotifications, AdminNotificationBell } from "../components/AdminNotifications";

type User = {
  id: string;
  name: string;
  email: string;
  type: "patient" | "provider";
  status: "pending" | "approved" | "denied";
  registeredDate: Date;
  lastLogin: Date;
  plan?: "free" | "pro" | "premium"; // For providers
};

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "verifications" | "moderation" | "badges" | "notifications" | "providers" | "patients" | "settings">("overview");

  // Mock Data for Admin View
  const [allUsers, setAllUsers] = useState<User[]>([
    {
      id: "p1",
      name: "Dr. Sarah Johnson",
      email: "sarah.j@example.com",
      type: "provider",
      status: "approved",
      registeredDate: new Date("2024-01-15"),
      lastLogin: new Date("2025-03-10"),
      plan: "premium",
    },
    {
      id: "p2",
      name: "Jessica Martinez, NP",
      email: "jessica.m@example.com",
      type: "provider",
      status: "approved",
      registeredDate: new Date("2024-02-01"),
      lastLogin: new Date("2025-03-08"),
      plan: "pro",
    },
    {
      id: "p3",
      name: "Emily Chen",
      email: "emily.c@example.com",
      type: "provider",
      status: "pending",
      registeredDate: new Date("2025-03-01"),
      lastLogin: new Date("2025-03-01"),
      plan: "free",
    },
    {
      id: "p4",
      name: "Michael Torres",
      email: "michael.t@example.com",
      type: "provider",
      status: "denied",
      registeredDate: new Date("2024-11-20"),
      lastLogin: new Date("2024-11-20"),
      plan: "free",
    },
    {
      id: "u1",
      name: "Jane Smith",
      email: "jane.s@example.com",
      type: "patient",
      status: "approved",
      registeredDate: new Date("2024-01-20"),
      lastLogin: new Date("2025-03-12"),
    },
    {
      id: "u2",
      name: "John Doe",
      email: "john.d@example.com",
      type: "patient",
      status: "approved",
      registeredDate: new Date("2024-03-05"),
      lastLogin: new Date("2025-03-09"),
    },
  ]);

  const handleStatusChange = (userId: string, newStatus: "pending" | "approved" | "denied") => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
    alert(`User ${userId} status changed to ${newStatus}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      alert(`User ${userId} deleted.`);
    }
  };

  const providers = allUsers.filter((user) => user.type === "provider");
  const patients = allUsers.filter((user) => user.type === "patient");

  const getStatusColor = (status: "pending" | "approved" | "denied") => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "denied": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8E4]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <AdminNotificationBell />
              <span className="text-gray-600">Logged in as: Admin User</span>
              <Link to="/" className="text-blue-600 hover:underline">
                Logout
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{allUsers.length}</div>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">{providers.length}</div>
            <p className="text-gray-600">Total Providers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {providers.filter(p => p.status === "pending").length}
            </div>
            <p className="text-gray-600">Pending Providers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {providers.filter(p => p.status === "approved").length}
            </div>
            <p className="text-gray-600">Approved Providers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "verifications", label: "Verifications" },
                { id: "moderation", label: "Moderation" },
                { id: "badges", label: "Badge Audit" },
                { id: "notifications", label: "Notifications" },
                { id: "providers", label: "Providers" },
                { id: "patients", label: "Patients" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Welcome to the Admin Panel</h2>
                <p className="text-gray-700">
                  This dashboard provides a centralized view and control over all users and providers on the Just Gorge platform.
                  You can manage accounts, review pending verifications, handle reports, and configure global settings.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <Link
                    to="/admin-dashboard?tab=providers"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center"
                  >
                    Manage Providers
                  </Link>
                  <Link
                    to="/admin-dashboard?tab=patients"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 text-center"
                  >
                    Manage Patients
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <PlatformAnalytics />
            )}

            {activeTab === "verifications" && (
              <VerificationQueue />
            )}

            {activeTab === "moderation" && (
              <ContentModeration />
            )}

            {activeTab === "badges" && (
              <BadgeAuditView />
            )}

            {activeTab === "notifications" && (
              <AdminNotifications />
            )}

            {activeTab === "providers" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Manage Providers</h2>
                <div className="mb-4 flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">All ({providers.length})</button>
                  <button className="px-4 py-2 border border-yellow-500 text-yellow-800 rounded-lg hover:bg-yellow-50">Pending ({providers.filter(p => p.status === "pending").length})</button>
                  <button className="px-4 py-2 border border-green-500 text-green-800 rounded-lg hover:bg-green-50">Approved ({providers.filter(p => p.status === "approved").length})</button>
                  <button className="px-4 py-2 border border-red-500 text-red-800 rounded-lg hover:bg-red-50">Denied ({providers.filter(p => p.status === "denied").length})</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Plan</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Registered</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((provider) => (
                        <tr key={provider.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{provider.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{provider.plan}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(provider.status)}`}>
                              {provider.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{provider.registeredDate.toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {provider.status !== "approved" && (
                                <button
                                  onClick={() => handleStatusChange(provider.id, "approved")}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                              )}
                              {provider.status !== "denied" && (
                                <button
                                  onClick={() => handleStatusChange(provider.id, "denied")}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Deny
                                </button>
                              )}
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button
                                onClick={() => handleDeleteUser(provider.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "patients" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Manage Patients</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Registered</th>
                        <th className="px-6 py-3">Last Login</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.registeredDate.toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{patient.lastLogin.toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button
                                onClick={() => handleDeleteUser(patient.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Global Settings</h2>
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold mb-4">Platform Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Default Provider Plan</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                          <option>Free</option>
                          <option>Pro</option>
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                          <span>Enable new provider registrations</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                          <span>Enable patient messaging to Pro/Premium providers</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold mb-4">Content Moderation</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Auto-flag keywords</label>
                        <input
                          type="text"
                          defaultValue="spam, inappropriate, scam"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                          <span>Require admin approval for all new provider photos</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Save Global Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
