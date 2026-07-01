import React, { useEffect, useState } from "react";
import RequestInstallationModal from "../components/Installation";
import { FaHome, FaBuilding, FaNetworkWired } from "react-icons/fa";
import Fuse from "fuse.js";

import useNavigateToSection from "../components/Functions";

export default function Locations() {
  const navigateToSection = useNavigateToSection();

  const [modalOpen, setModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [loading, setLoading] = useState(true);
  const [locData, setLocData] = useState({
    Residential: [],
    Fiber: [],
    Corporate: [],
  });

  const [zip, setZip] = useState("");
  const [filteredData, setFilteredData] = useState(locData);

  const subsOptions = {
    Residential: ["Basic Plan", "Standard Plan", "Premium Plan"],
    Corporate: ["Corporate Plan A", "Corporate Plan B"],
    Fiber: ["Fiber 500", "Fiber 1G", "Fiber 2G"],
  };

  useEffect(() => {
    fetch("https://localhost:44325/coverage/locations")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        const mapped = {
          Residential: data.residential || [],
          Fiber: data.fiber || [],
          Corporate: data.corporate || [],
        };
        setLocData(mapped);
        setFilteredData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch locations:", err);
        setLoading(false);
      });
  }, []);

  const typeIcon = {
    Residential: <FaHome className="w-8 h-8 text-indigo-600" />,
    Corporate: <FaBuilding className="w-8 h-8 text-indigo-600" />,
    Fiber: <FaNetworkWired className="w-8 h-8 text-indigo-600" />,
  };

  const openModal = (type) => {
    setInstallType(type);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    console.log("Install request:", data);
    setModalOpen(false);
    alert("Installation request sent!");
  };

  const checkCoverage = () => {
    const z = zip.trim();
    if (!z) {
      setFilteredData(locData);
      return;
    }
    const filtered = {};
    Object.keys(locData).forEach((type) => {
      const fuse = new Fuse(locData[type], {
        includeScore: true,
        threshold: 0.4,
      });
      const results = fuse.search(z);
      filtered[type] = results.map((r) => r.item);
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <main className="pt-24 px-6 pb-16 text-center">
        <p className="text-lg text-gray-600">Loading locations…</p>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Check Your Coverage
        </h1>
        <div className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Enter your city or state name (ex: Zahle)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="border px-4 py-2 rounded w-2/3"
          />
          <button
            onClick={checkCoverage}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Check
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(filteredData).map((type) => (
            <div
              key={type}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">{typeIcon[type]}</div>
                <h2 className="text-xl font-semibold">{type}</h2>
              </div>

              <ul className="flex-1 mb-6 space-y-2 text-gray-700 list-disc list-inside">
                {filteredData[type].length > 0 ? (
                  filteredData[type].map((loc, i) => (
                    <li key={i} className="italic">
                      {loc}
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-400">No coverage here</li>
                )}
              </ul>

              <button
                onClick={() =>
                  navigateToSection(`/subscriptions/${type}`, "plansSection")
                }
                className="mt-auto bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Request {type} Installation
              </button>
            </div>
          ))}
        </div>
      </div>

      <RequestInstallationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        installType={installType}
        locations={filteredData[installType] || []}
        subscriptionOptions={subsOptions[installType] || []}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
