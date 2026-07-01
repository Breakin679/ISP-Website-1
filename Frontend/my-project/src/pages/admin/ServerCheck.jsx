import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaServer,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function CheckServers() {
  const [coverageList, setCoverageList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState("");
  const [servers, setServers] = useState([]);

  // Form state for adding location
  const [newLocName, setNewLocName] = useState("");
  const [newLocLocation, setNewLocLocation] = useState("");
  const [newLocPlanType, setNewLocPlanType] = useState(2);

  // Editing existing location
  const [editLocId, setEditLocId] = useState(null);
  const [editLocData, setEditLocData] = useState({
    name: "",
    location: "",
    plan_type_id: 2,
  });

  // Form state for adding/editing server
  const [newServer, setNewServer] = useState({ name: "", bandwidth: "" });
  const [editSrvId, setEditSrvId] = useState(null);

  useEffect(() => {
    fetchCoverage();
  }, []);

  const fetchCoverage = async () => {
    const res = await fetch("https://localhost:44325/coverage");
    const data = await res.json();
    setCoverageList(data);
    const unique = Array.from(new Set(data.map((c) => c.location)));
    setLocations(unique);
    if (unique.length && !selected) handleSelect(unique[0]);
  };

  const handleSelect = (loc) => {
    setSelected(loc);
    fetchServers(loc);
    setEditLocId(null);
  };

  const fetchServers = async (loc) => {
    const res = await fetch(
      `https://localhost:44325/servers/location/${encodeURIComponent(loc)}`
    );
    const data = await res.json();
    setServers(data);
  };

  // Add Location
  const addLocation = async () => {
    await fetch("https://localhost:44325/coverage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newLocName,
        plan_type_id: newLocPlanType,
        location: newLocLocation,
      }),
    });
    setNewLocName("");
    setNewLocLocation("");
    setNewLocPlanType(2);
    await fetchCoverage();
  };

  // Edit Location
  const startEditLoc = () => {
    const locObj = coverageList.find((c) => c.location === selected);
    setEditLocId(locObj.id);
    setEditLocData({
      name: locObj.name,
      location: locObj.location,
      plan_type_id: locObj.plan_type_id,
    });
  };

  const saveEditLoc = async () => {
    await fetch(`https://localhost:44325/coverage/${editLocId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editLocData),
    });
    setEditLocId(null);
    await fetchCoverage();
  };

  const cancelEditLoc = () => {
    setEditLocId(null);
  };

  const deleteLoc = async () => {
    const locObj = coverageList.find((c) => c.location === selected);
    await fetch(`https://localhost:44325/coverage/${locObj.id}`, {
      method: "DELETE",
    });
    await fetchCoverage();
  };

  // Server CRUD
  const submitServer = async () => {
    const cov = coverageList.find((c) => c.location === selected);
    const url = editSrvId
      ? `https://localhost:44325/servers/${editSrvId}`
      : "https://localhost:44325/servers";
    const method = editSrvId ? "PUT" : "POST";
    const body = editSrvId
      ? JSON.stringify({
          name: newServer.name,
          bandwidth: newServer.bandwidth,
          coverage_id: cov.id,
        })
      : JSON.stringify({
          name: newServer.name,
          bandwidth: newServer.bandwidth,
          coverage_id: cov.id,
          status: true,
        });
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    setNewServer({ name: "", bandwidth: "" });
    setEditSrvId(null);
    await fetchServers(selected);
  };

  const startEditSrv = (srv) => {
    setEditSrvId(srv.id);
    setNewServer({ name: srv.name, bandwidth: srv.bandwidth });
  };

  const deleteSrv = async (id) => {
    await fetch(`https://localhost:44325/servers/${id}`, { method: "DELETE" });
    await fetchServers(selected);
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Server Coverage</h1>

      {/* Add Location Form Always Visible */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Location</h2>
        <div className="flex gap-2">
          <input
            placeholder="Name"
            value={newLocName}
            onChange={(e) => setNewLocName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Location"
            value={newLocLocation}
            onChange={(e) => setNewLocLocation(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={newLocPlanType}
            onChange={(e) => setNewLocPlanType(+e.target.value)}
            className="border p-2 rounded"
          >
            <option value={1}>Fiber</option>
            <option value={2}>Residential</option>
            <option value={3}>Corporate</option>
          </select>
          <button
            onClick={addLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {/* Location Dropdown + Edit/Delete */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Choose Location:</label>
        <select
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
          className="border p-2 rounded"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <button onClick={startEditLoc}>
          <FaEdit />
        </button>
        <button onClick={deleteLoc}>
          <FaTrash />
        </button>
      </div>

      {/* Edit Location Inline */}
      {editLocId && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Location</h2>
          <div className="flex gap-2">
            <input
              placeholder="Name"
              value={editLocData.name}
              onChange={(e) =>
                setEditLocData({ ...editLocData, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              placeholder="Location"
              value={editLocData.location}
              onChange={(e) =>
                setEditLocData({ ...editLocData, location: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={editLocData.plan_type_id}
              onChange={(e) =>
                setEditLocData({
                  ...editLocData,
                  plan_type_id: +e.target.value,
                })
              }
              className="border p-2 rounded"
            >
              <option value={1}>Fiber</option>
              <option value={2}>Residential</option>
              <option value={3}>Corporate</option>
            </select>
            <button
              onClick={saveEditLoc}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              <FaSave /> Save
            </button>
            <button onClick={cancelEditLoc} className="px-4 py-2">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Server Management */}
      {selected && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Servers in {selected}</h2>
          {/* Add/Edit Server Form */}
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Server Name"
              value={newServer.name}
              onChange={(e) =>
                setNewServer({ ...newServer, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              placeholder="Bandwidth"
              value={newServer.bandwidth}
              onChange={(e) =>
                setNewServer({ ...newServer, bandwidth: e.target.value })
              }
              className="border p-2 rounded"
            />
            <button
              onClick={submitServer}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editSrvId ? <FaSave /> : <FaPlus />} {editSrvId ? "Save" : "Add"}
            </button>
            {editSrvId && (
              <button
                onClick={() => {
                  setEditSrvId(null);
                  setNewServer({ name: "", bandwidth: "" });
                }}
                className="px-4 py-2"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <ul className="divide-y">
            {servers.map((srv) => (
              <li
                key={srv.id}
                className="py-2 flex items-center justify-between"
              >
                <span>
                  {srv.name} ({srv.bandwidth})
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEditSrv(srv)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteSrv(srv.id)}>
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
