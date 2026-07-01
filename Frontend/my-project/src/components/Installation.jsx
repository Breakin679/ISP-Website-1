import React, { useState, useEffect } from "react";

export default function RequestInstallationModal({
  isOpen,
  onClose,
  installType,
  selectedPlanId, // ← new
  selectedPlanName, // ← new
}) {
  // detect logged‑in user
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id || null;
    const tokenRaw = localStorage.getItem("token");
    let token = tokenRaw;
    
    // Handle case where token might be stored as JSON string of an object
    if (tokenRaw && tokenRaw.startsWith('"') && tokenRaw.endsWith('"')) {
      try {
        token = JSON.parse(tokenRaw);
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    }
    
    console.log("Raw token from localStorage:", tokenRaw);
    console.log("Processed token:", token);

  // form state
  const [form, setForm] = useState({
    location: "",
    contact: "", // only for guests
  });

  // location options
  const [locOptions, setLocOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // map installType → plan_type_id (if you still need)
  const typeMap = { Fiber: 1, Residential: 2, Corporate: 3 };
  const typeId = typeMap[installType];

  // load locations when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setForm({ location: "", contact: "" });
    setLocOptions([]);
    setError("");
    setLoading(true);

    (async () => {
      try {
        const cov = await fetch(
          `https://localhost:44325/coverage/type/${typeId}`
        );
        if (!cov.ok) throw new Error("Failed to load locations");
        const locData = await cov.json();
        setLocOptions(locData.map((c) => c.location));
      } catch {
        setError("Could not load locations.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, typeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      UserId: userId, // null for guests
      Email: userId ? null : form.contact,

      Location: form.location,
      PlanId: selectedPlanId, // use prop
    };

    // Check if user is logged in
    if (!userId || !token) {
      setError("Please log in to submit an installation request.");
      setLoading(false);
      return;
    }

    // Debug: Log token info
    console.log("Token:", token ? token.substring(0, 20) + "..." : "No token");
    console.log("User ID:", userId);

    try {
      const res = await fetch("https://localhost:44325/pendingrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response status:", res.status);
        console.error("Response text:", errorText);
        throw new Error(`Request failed: ${res.status} - ${errorText}`);
      }
      
      onClose();
    } catch (err) {
      console.error("Request error:", err);
      setError("Failed to submit request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSend}
          className="bg-slate-700 rounded-lg shadow-lg w-full max-w-md p-6"
        >
          <h3 className="text-xl text-white font-semibold mb-4">
            {installType} Installation
          </h3>

          {loading && <p className="text-center text-white mb-4">Loading…</p>}
          {error && <p className="text-center text-red-400 mb-4">{error}</p>}

          {/* Install Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Type of Install
            </label>
            <input
              type="text"
              value={installType}
              readOnly
              className="mt-1 text-white w-full px-3 py-2 border rounded bg-slate-700"
            />
          </div>

          {/* Plan (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Plan</label>
            <input
              type="text"
              value={selectedPlanName}
              readOnly
              className="mt-1 text-white w-full px-3 py-2 border rounded bg-slate-700"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Location
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 text-white w-full px-3 py-2 border rounded"
            >
              <option className="bg-slate-500 text-white" value="">
                Select a location
              </option>
              {locOptions.map((loc) => (
                <option
                  key={loc}
                  value={loc}
                  className="bg-slate-500 text-white"
                >
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Login requirement */}
          {!userId && (
            <div className="mb-6 p-3 bg-yellow-600/20 border border-yellow-500 rounded">
              <p className="text-yellow-300 text-sm">
                Please log in to submit an installation request.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-500 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
