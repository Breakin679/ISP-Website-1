import React, { useState, useEffect } from "react";

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 0.0,
    description_plan: "",
    plan_type_id: 4,
    bandwidth: 0,
    data_limit: 0,
    limit_type: 0,
    public_ip_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchPlans = async () => {
    try {
      const res = await fetch("https://localhost:44325/plans/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      setPlans(await res.json());
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const fetchPlanTypes = async () => {
    try {
      const res = await fetch("https://localhost:44325/plan-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Fetch types error: ${res.status}`);
      setPlanTypes(await res.json());
    } catch (err) {
      console.error("Error fetching plan types:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchPlanTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: [
        "plan_type_id",
        "bandwidth",
        "data_limit",
        "limit_type",
        "public_ip_count",
      ].includes(name)
        ? parseInt(value, 10) || ""
        : name === "price"
        ? parseFloat(value) || ""
        : value,
    }));
  };

  const startEdit = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      price: plan.price,
      description_plan: plan.description_plan,
      bandwidth: plan.bandwidth,
      data_limit: plan.data_limit,
      plan_type_id: plan.plan_type_id,
      limit_type: plan.limit_type,
      public_ip_count: plan.public_ip_count,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId
      ? `https://localhost:44325/plans/${editingId}`
      : "https://localhost:44325/plans";
    const method = editingId ? "PUT" : "POST";
    const payload = {
      name: form.name,
      description_plan: form.description_plan,
      bandwidth: form.bandwidth,
      data_limit: form.data_limit,
      plan_type_id: form.plan_type_id,
      limit_type: form.limit_type,
      price: form.price,
      public_ip_count: form.public_ip_count,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Post error: ${res.status}`);
      setEditingId(null);
      setForm({
        name: "",
        price: 0.0,
        description_plan: "",
        plan_type_id: 0,
        bandwidth: 0,
        data_limit: 0,
        limit_type: 0,
        public_ip_count: 0,
      });
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      console.error("Error adding/updating plan:", err);
      alert("Failed to save plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`https://localhost:44325/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 409) {
        // 409 Conflict from backend when active subscriptions exist
        alert("Cannot delete this plan: there are active subscriptions.");
        return;
      }
      if (!res.ok) throw new Error(`Delete error: ${res.status}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("Failed to delete plan. Please try again.");
    }
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Manage Plans {editingId ? "(Editing)" : ""}
        </h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? (editingId ? "Cancel Edit" : "Cancel") : "Add Plan"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                name="description_plan"
                value={form.description_plan}
                onChange={handleChange}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Bandwidth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bandwidth (Mbps)
              </label>
              <input
                name="bandwidth"
                value={form.bandwidth}
                onChange={handleChange}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Data Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Limit (GB)
              </label>
              <input
                name="data_limit"
                value={form.data_limit}
                onChange={handleChange}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan Type
              </label>
              <select
                name="plan_type_id"
                value={form.plan_type_id}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select type</option>
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Limit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Limit Type (0–3)
              </label>
              <input
                name="limit_type"
                value={form.limit_type}
                onChange={handleChange}
                type="number"
                min="-1"
                max="3"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Public IP Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Public IP Count
              </label>
              <input
                name="public_ip_count"
                value={form.public_ip_count}
                onChange={handleChange}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="self-end bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading
                ? editingId
                  ? "Saving..."
                  : "Adding..."
                : editingId
                ? "Update Plan"
                : "Add Plan"}
            </button>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Plan Name",
                "Price",
                "description_plan",
                "Bandwidth",
                "Data Limit",
                "Type ID",
                "Limit Type",
                "Public IPs",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.description_plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{p.bandwidth}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.data_limit}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.plan_type_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{p.limit_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.public_ip_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  <button onClick={() => startEdit(p)}>✏️</button>
                  <button onClick={() => handleDelete(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
