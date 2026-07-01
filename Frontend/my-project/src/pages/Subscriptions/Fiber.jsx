import React, { useState, useEffect } from "react";
import {
  FaRocket,
  FaLock,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import RequestInstallationModal from "../../components/Installation";
import useNavigateToSection from "../../components/Functions";
import useScrollToHash from "../../hooks/useScrollToHash";

export default function Fiber({ locData = {}, subsOptions = {} }) {
  // scroll to any hash on mount/navigation
  useScrollToHash();

  const navigateToSection = useNavigateToSection();
  const { hash } = useLocation();

  // pagination state
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const itemsPerPage = 3;
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const currentPlans = plans.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const token = localStorage.getItem("token");

  // fetch plans once
  useEffect(() => {
    async function loadPlans() {
      try {
        const resp = await fetch("https://localhost:44325/plans/type/1", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans:", err);
        setError("Unable to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  // open / close modal
  const openModal = (type, planId, planName) => {
    setInstallType(type);

    setSelectedPlanId(planId);
    setSelectedPlanName(planName);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (data) => {
    console.log("Installation requested:", data);
    setIsModalOpen(false);
  };

  // loading / error states
  if (loading) {
    return (
      <main className="pt-24 text-center">
        <p>Loading plans…</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="pt-24 text-center text-red-600">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <>
      <main className="pt-24 bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Fast Fiber Internet
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8">
            Reliable, fast fiber internet for homes and businesses. Enjoy stable
            speeds and local support.
          </p>
          <button
            onClick={() =>
              navigateToSection("/subscriptions/fiber", "plansSection")
            }
            className="bg-white text-pink-600 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            Explore Plans
          </button>
        </section>

        {/* Key Advantages */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Fiber
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaRocket className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Consistent Speeds</h3>
              <p className="text-gray-600">
                Enjoy up to 100 Mbps download/upload, perfect for streaming,
                work, and gaming.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaLock className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">
                Transparent pricing, no surprise charges, and flexible monthly
                plans.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaHeadset className="text-pink-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Local Support</h3>
              <p className="text-gray-600">
                Support team available 7 days a week.
              </p>
            </div>
          </div>
        </section>

        {/* Plans & Pricing with Pagination */}
        <section id="plansSection" className="bg-gray-50 py-16 px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-12">Fiber Plans</h2>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
              {currentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-center">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold text-center mb-4">
                    ${plan.price}/mo
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    {plan.bandwidth} Mbps
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan.perks?.map((perk, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-pink-600 rounded-full mr-2" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openModal("Fiber", plan.id, plan.name)}
                    className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="text-center text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </div>
        </section>

        {/* Installation Steps */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Easy Installation in 3 Steps
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {[
              { step: 1, label: "Request Service" },
              { step: 2, label: "Schedule Installation" },
              { step: 3, label: "Enjoy Fiber Internet" },
            ].map((s) => (
              <div key={s.step} className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-pink-600 text-white rounded-full font-bold">
                  {s.step}
                </div>
                <p className="text-lg font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Want to check other Plans?
          </h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Join thousands of homes and businesses enjoying fast, stable
            internet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/subscriptions/residential"
              className="inline-block text-lg bg-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
            >
              Check Residential Plans
            </Link>
            <Link
              to="/subscriptions/corporate"
              className="inline-block text-lg bg-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
            >
              Check Corporate Plans
            </Link>
          </div>
        </section>
      </main>
      <RequestInstallationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        installType={installType}
        selectedPlanId={selectedPlanId}
        selectedPlanName={selectedPlanName}
      />
    </>
  );
}
