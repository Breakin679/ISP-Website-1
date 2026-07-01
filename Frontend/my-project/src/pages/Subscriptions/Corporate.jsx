import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaNetworkWired,
  FaLifeRing,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import RequestInstallationModal from "../../components/Installation";
import useNavigateToSection from "../../components/Functions";
import useScrollToHash from "../../hooks/useScrollToHash";

export default function Corporate({ locData = {}, subsOptions = {} }) {
  useScrollToHash();
  const navigateToSection = useNavigateToSection();
  const [hash] = useState(window.location.hash);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const currentPlans = plans.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const resp = await fetch("https://localhost:44325/plans/type/3");
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
  const handleSubmit = (installData) => {
    const payload = {
      plan_id: selectedPlan.id,
      installType,
      ...installData,
    };
    console.log("Installation requested:", payload);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <main className="pt-24 text-center">
        <p>Loading plans…</p>
      </main>
    );
  if (error)
    return (
      <main className="pt-24 text-center">
        <p className="text-red-500">{error}</p>
      </main>
    );

  return (
    <>
      <main className="pt-24 bg-white text-gray-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Enterprise & Corporate Solutions
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl mb-8">
            Tailored, high‑capacity internet and network services designed for
            large organizations.
          </p>
          <button
            onClick={() =>
              navigateToSection("/subscriptions/corporate", "plansSection")
            }
            className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-md shadow hover:bg-gray-100 transition"
          >
            Get a Quote
          </button>
        </section>

        {/* Features */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Our Corporate Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaNetworkWired className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Dedicated Bandwidth
              </h3>
              <p className="text-gray-600">
                Guaranteed speeds and SLAs for mission‑critical operations.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaBriefcase className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Custom SLAs</h3>
              <p className="text-gray-600">
                Tailored service level agreements to meet your uptime and
                support needs.
              </p>
            </div>
            <div className="p-8 border rounded-lg shadow hover:shadow-lg transition text-center">
              <FaLifeRing className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                24/7 Priority Support
              </h3>
              <p className="text-gray-600">
                Fast‑track issue resolution with our dedicated enterprise
                support team.
              </p>
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="bg-gray-100 py-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Industries We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Banking & Finance",
              "Healthcare",
              "Manufacturing",
              "Education",
              "Government",
              "Retail",
            ].map((industry, i) => (
              <span
                key={i}
                className="bg-white px-4 py-2 rounded-full shadow text-gray-700 hover:bg-indigo-50 transition"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        {/* Plans & Pricing */}
        <section id="plansSection" className="bg-gray-50 py-16 px-4 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Corporate Plans
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
                  <p className="text-center text-gray-600 mb-2">
                    {plan.bandwidth} Mbps
                  </p>
                  <p className="text-center text-gray-600 mb-4">
                    Data Limit:{" "}
                    {plan.data_limit >= 0
                      ? `${plan.data_limit} GB`
                      : "Unlimited"}
                  </p>
                  <button
                    onClick={() => openModal("Corporate", plan)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
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

        {/* Testimonials */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">
            What Enterprise Clients Say
          </h2>
          {[
            {
              quote:
                "Their corporate network solution transformed our global operations. Uptime has never been better.",
              author: "— Global Tech Corp",
            },
            {
              quote:
                "Outstanding support and performance. We can’t imagine running our data centers without them.",
              author: "— FinBank International",
            },
          ].map((t, i) => (
            <blockquote key={i} className="italic text-gray-700">
              “{t.quote}”
              <cite className="block mt-4 font-semibold text-indigo-600">
                {t.author}
              </cite>
            </blockquote>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 px-4">
          <p className="text-lg sm:text-xl mb-6">
            Looking for custom enterprise solutions?
          </p>
          <Link
            to="/contact"
            className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-md shadow hover:bg-indigo-700 transition"
          >
            Contact Us
          </Link>
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
