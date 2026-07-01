// src/pages/Status.jsx
import React, { useState, useEffect } from "react";
import {
  FaWifi,
  FaServer,
  FaTachometerAlt,
  FaDownload,
  FaUpload,
  FaSyncAlt,
} from "react-icons/fa";

export default function Status() {
  // TODO: replace with real API calls
  const [status, setStatus] = useState({
    isOnline: true,
    serverStatus: "up",
    signalStrength: 82,
    latencyMs: 23,
    downloadMbps: 150,
    uploadMbps: 20,
    lastChecked: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    // TODO: fetch from your status endpoint here
    await new Promise((r) => setTimeout(r, 500));
    setStatus((s) => ({
      ...s,
      lastChecked: new Date().toISOString(),
    }));
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const {
    isOnline,
    serverStatus,
    signalStrength,
    latencyMs,
    downloadMbps,
    uploadMbps,
    lastChecked,
  } = status;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Connection Status
          </h1>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FaSyncAlt className="animate-spin-fast" />
            <span>{loading ? "Refreshing…" : "Refresh Status"}</span>
          </button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <FaWifi
              className={`w-8 h-8 ${
                isOnline ? "text-green-500" : "text-red-500"
              }`}
            />
            <div>
              <p className="text-lg text-gray-600">Client Connection</p>
              <p
                className={`text-2xl font-semibold ${
                  isOnline ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <FaServer
              className={`w-8 h-8 ${
                serverStatus === "up" ? "text-green-500" : "text-red-500"
              }`}
            />
            <div>
              <p className="text-lg text-gray-600">Server Health</p>
              <p
                className={`text-2xl font-semibold ${
                  serverStatus === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {serverStatus === "up" ? "Operational" : "Issue Detected"}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaTachometerAlt className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 mb-2">Signal Strength</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-indigo-600 h-3 rounded-full"
                style={{ width: `${signalStrength}%` }}
              />
            </div>
            <p className="text-gray-600">{signalStrength}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaSyncAlt className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 mb-2">Latency (Ping)</p>
            <p className="text-3xl font-semibold text-gray-800">
              {latencyMs} ms
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaDownload className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 mb-2">Download Speed</p>
            <p className="text-3xl font-semibold text-gray-800">
              {downloadMbps} Mbps
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaUpload className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="font-medium text-gray-700 mb-2">Upload Speed</p>
            <p className="text-3xl font-semibold text-gray-800">
              {uploadMbps} Mbps
            </p>
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500">
          Last checked: {new Date(lastChecked).toLocaleString()}
        </footer>
      </div>
    </main>
  );
}
