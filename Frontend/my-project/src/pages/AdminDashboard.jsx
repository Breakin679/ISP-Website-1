import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaDollarSign,
  FaServer,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubs: 0,
    pendingInstalls: 0,
    totalServers: 0,
    totalPlans: 0,
    totalBilling: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("https://localhost:44325/admin/stats");
        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers,
          activeSubs: data.activeSubscriptions,
          pendingInstalls: data.pendingRequests,
          totalServers: data.totalServers,
          totalPlans: data.totalPlans,
          totalBilling: data.totalBilling,
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <main className="pt-24 px-6 text-center">
        <p>Loading dashboard…</p>
      </main>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-5xl text-indigo-600" />,
      link: "/admin/users",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubs,
      icon: <FaClipboardList className="text-5xl text-green-600" />,
      link: "/admin/subscriptions",
    },
    {
      label: "Pending Installs",
      value: stats.pendingInstalls,
      icon: <FaTools className="text-5xl text-yellow-600" />,
      link: "/admin/installs",
    },
    {
      label: "Total Servers",
      value: stats.totalServers,
      icon: <FaServer className="text-5xl text-blue-600" />,
      link: "/admin/servers",
    },
    {
      label: "Total Plans",
      value: stats.totalPlans,
      icon: <FaChartBar className="text-5xl text-purple-600" />,
      link: "/admin/plans",
    },
    {
      label: "Total Billing",
      value: `$${stats.totalBilling.toLocaleString()}`,
      icon: <FaDollarSign className="text-5xl text-teal-600" />,
      link: "/admin/billing",
    },
  ];

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full max-w-5xl mx-auto">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className="bg-white p-12 rounded-2xl shadow-md flex flex-col items-center justify-center hover:shadow-2xl transition-transform transform hover:scale-105 h-56"
          >
            {c.icon}
            <p className="mt-4 text-xl font-semibold text-gray-800">
              {c.label}
            </p>
            {c.value !== "" && (
              <p className="mt-2 text-4xl font-bold text-gray-900">{c.value}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
