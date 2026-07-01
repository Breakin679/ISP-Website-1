import React, { useEffect, useState } from "react";
import {
  FaWifi,
  FaTv,
  FaGamepad,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import RequestInstallationModal from "../../components/Installation";
import useNavigateToSection from "../../components/Functions";
import useScrollToHash from "../../hooks/useScrollToHash";

export default function Residential({ locData = {}, subsOptions = {} }) {
  useScrollToHash();
  const navigateToSection = useNavigateToSection();

  const [page, setPage] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const currentPlans = plans.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadPlans() {
      try {
        const resp = await fetch("https://localhost:44325/plans/type/2", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        setPlans(await resp.json());
      } catch (err) {
        console.error("Failed to load plans:", err);
        setError("Unable to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const openModal = (type, plan) => {
    setInstallType(type);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSubmit = async (installData) => {
    const payload = {
      plan_id: selectedPlan.id,
      installType,
      ...installData,
    };
    console.log("Installation requested:", payload);
    // Example POST—uncomment & adapt to your API:
    /*
    await fetch("https://localhost:44325/pendingrequests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    */
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <main className="pt-24 text-center">
        <p>Loading plans…</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="pt-24 text-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <>
      <main className="pt-24 bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-20 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Residential Internet Plans
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl mb-8">
            Fast, reliable, and affordable internet for every home—stream, game,
            and browse without limits.
          </p>
          <button
            onClick={() =>
              navigateToSection("/subscriptions/residential", "PlansSection")
            }
            className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            View Plans
          </button>
        </section>

        {/* Key Benefits */}
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Our Residential Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaWifi className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Blazing Fast Speeds
              </h3>
              <p className="text-gray-600">
                Enjoy speeds up to 500 Mbps to power all your devices
                seamlessly.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaTv className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Unlimited Streaming
              </h3>
              <p className="text-gray-600">
                Stream HD and 4K content on multiple screens without buffering.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaGamepad className="text-teal-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Lag-Free Gaming</h3>
              <p className="text-gray-600">
                Low latency connections ideal for online gaming and video calls.
              </p>
            </div>
          </div>
        </section>

        {/* Plans & Pricing with pagination */}
        <section id="PlansSection" className="bg-gray-50 py-16 px-4 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="flex justify-between items-center mb-4">
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
                    ${plan.price}/month
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    Speed:{" "}
                    {plan.bandwidth>=0 ? `${plan.bandwidth} Mbps`: "Unlimited"}
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    Data Limit:{" "}
                    {plan.data_limit >= 0
                      ? `${plan.data_limit}GB`
                      : "Unlimited"}
                  </p>

                  <ul className="mb-6 space-y-2">
                    {plan.perks?.map((f, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-teal-600 rounded-full mr-2" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openModal("Residential", plan)}
                    className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition"
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

        {/* FAQ */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need a contract?",
                a: "No long-term contracts—cancel any time with 30 days notice.",
              },
              {
                q: "How soon can I get connected?",
                a: "Most installations are completed within 3–5 business days.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-gray-600 mt-1">{faq.a}</p>
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
              to="/subscriptions/fiber"
              className="inline-block text-lg bg-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
            >
              Check Fiber Plans
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

      {/* Installation Modal */}
      <RequestInstallationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        installType={installType}
        selectedPlanId={selectedPlan?.id}
        selectedPlanName={selectedPlan?.name}
        locData={locData}
        subsOptions={subsOptions}
        onSubmit={handleSubmit}
      />
    </>
  );
}
