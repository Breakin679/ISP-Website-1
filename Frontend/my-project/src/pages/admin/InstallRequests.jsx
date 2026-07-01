import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function InstallRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [serversByLocation, setServersByLocation] = useState({});
  const [modal, setModal] = useState({
    isOpen: false,
    request: null,
    serverId: "",
    ipList: [], // { ip, isPublic }
    error: "",
  });

  const token = localStorage.getItem("token");

  // 1) Load pending requests (now enriched by backend)
  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch(
          "https://localhost:44325/pendingrequests/incomplete",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const reqs = await res.json();
        setRequests(reqs);
      } catch (e) {
        console.error("Error loading requests", e);
      }
    }
    loadRequests();
  }, []);

  // 2) Fetch servers when modal opens
  useEffect(() => {
    if (!modal.isOpen || !modal.request) return;
    const loc = modal.request.location;
    if (serversByLocation[loc]) return;
    fetch(`https://localhost:44325/servers/location/${encodeURIComponent(loc)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((list) =>
        setServersByLocation((prev) => ({ ...prev, [loc]: list }))
      )
      .catch(() => setServersByLocation((prev) => ({ ...prev, [loc]: [] })));
  }, [modal.isOpen, modal.request, serversByLocation]);

  // open modal
  const openModal = (req) => {
    // backend now gives publicIpCount
    const count = Math.max(req.publicIpCount, 1);
    const rows = Array.from({ length: count }, () => ({
      ip: "",
      isPublic: false,
    }));
    setModal({
      isOpen: true,
      request: req,
      serverId: "",
      ipList: rows,
      error: "",
    });
  };

  const closeModal = () =>
    setModal({
      isOpen: false,
      request: null,
      serverId: "",
      ipList: [],
      error: "",
    });

  // Approve handler
  const handleApprove = async () => {
    const { request, serverId, ipList } = modal;
    if (!serverId || ipList.some((e) => !e.ip.trim())) {
      setModal((m) => ({
        ...m,
        error: "Please select a server and fill in every IP address field.",
      }));
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:44325/pendingrequests/${request.id}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ serverId, ipAddresses: ipList }),
        }
      );
      if (!res.ok) throw new Error();
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      closeModal();
    } catch {
      setModal((m) => ({
        ...m,
        error: "Approval failed. Check server or IPs.",
      }));
    }
  };

  // Reject handler
  const handleReject = async (id) => {
    if (!window.confirm("Reject and delete this request?")) return;
    await fetch(`https://localhost:44325/pendingrequests/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Installation Requests</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ID",
                "Requester",
                "Location",
                "Plan ID",
                "Plan Name",
                "# IPs",
                "Requested",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{r.id}</td>
                {/* now show the name, not userId */}
                <td className="px-6 py-4">{r.requesterName}</td>
                <td className="px-6 py-4">{r.location}</td>
                <td className="px-6 py-4">{r.planId}</td>
                <td className="px-6 py-4">{r.planName}</td>
                <td className="px-6 py-4">{r.publicIpCount}</td>
                <td className="px-6 py-4">
                  {new Date(r.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <button
                    onClick={() => openModal(r)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No pending requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Approve Request #{modal.request.id}
              </h2>
              <p className="mb-1">
                <strong>Location:</strong> {modal.request.location}
              </p>
              <p className="mb-1">
                <strong>Plan:</strong> {modal.request.planName}
              </p>
              <p className="mb-4">
                <strong>IPs to assign:</strong> {modal.request.publicIpCount}
              </p>

              <label className="block text-sm font-medium mb-1">
                Select Server
              </label>
              <select
                value={modal.serverId}
                onChange={(e) =>
                  setModal((m) => ({ ...m, serverId: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded mb-4"
              >
                <option value="">-- choose --</option>
                {(serversByLocation[modal.request.location] || []).map((sv) => (
                  <option key={sv.id} value={sv.id}>
                    {sv.name}
                  </option>
                ))}
              </select>

              <p className="mb-2 font-medium">Enter IP Addresses:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-2">
                {modal.ipList.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`IP #${idx + 1}`}
                      value={entry.ip}
                      onChange={(e) => {
                        const ip = e.target.value;
                        setModal((m) => {
                          const ipList = [...m.ipList];
                          ipList[idx] = { ...ipList[idx], ip };
                          return { ...m, ipList };
                        });
                      }}
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={entry.isPublic}
                        onChange={(e) => {
                          const isPublic = e.target.checked;
                          setModal((m) => {
                            const ipList = [...m.ipList];
                            ipList[idx] = { ...ipList[idx], isPublic };
                            return { ...m, ipList };
                          });
                        }}
                      />
                      Public?
                    </label>
                  </div>
                ))}
              </div>

              {modal.error && (
                <p className="text-red-500 text-sm mt-1">{modal.error}</p>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
