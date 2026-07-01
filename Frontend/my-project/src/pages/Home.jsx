import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWifi, FaTv, FaGamepad } from "react-icons/fa";
import RequestInstallationModal from "../components/Installation";
import ReviewForm from "../components/ReviewForm";
import useNavigateToSection from "../components/Functions";

const Home = () => {
  // State hooks (always called in same order)
  const [modalOpen, setModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [form, setForm] = useState({
    location: "",
    subscription: "",
    contact: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    {
      name: "Sarah K.",
      review: "The best internet provider I've ever had! Reliable and fast.",
    },
    {
      name: "Mike D.",
      review: "Great customer service and affordable plans. Highly recommend.",
    },
    {
      name: "Lina M.",
      review:
        "Fiber network is super fast and stable. Perfect for my business.",
    },
  ]);
  const [currentReview, setCurrentReview] = useState(0);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  // Always call this hook before any early returns!
  const navigateToSection = useNavigateToSection();

  // Load plan summaries
  useEffect(() => {
    async function loadSummaries() {
      try {
        const types = [
          { key: "Fiber", id: 1 },
          { key: "Residential", id: 2 },
          { key: "Corporate", id: 3 },
        ];
        const results = await Promise.all(
          types.map(async ({ key, id }) => {
            const res = await fetch(
              `https://localhost:44325/plans/summary/${id}`
            );
            if (!res.ok) throw new Error(`Failed to fetch summary for ${key}`);
            const json = await res.json();
            return [key, json];
          })
        );
        setSummaries(Object.fromEntries(results));
      } catch (e) {
        console.error(e);
        setSummaryError("Failed to load plan summaries.");
      } finally {
        setLoadingSummaries(false);
      }
    }
    loadSummaries();
  }, []);

  // Early returns after all hooks
  if (loadingSummaries) {
    return (
      <main className="pt-24 text-center">
        <p>Loading plan info…</p>
      </main>
    );
  }
  if (summaryError) {
    return (
      <main className="pt-24 text-center">
        <p className="text-red-500">{summaryError}</p>
      </main>
    );
  }

  // Data and helper functions
  const locData = {
    Residential: ["----", "----", "----"],
    Corporate: ["----", "----", "----"],
    Fiber: ["Beirut"],
  };
  const subsOptions = {
    Residential: ["Basic Plan", "Standard Plan", "Premium Plan"],
    Corporate: ["Corporate Plan A", "Corporate Plan B"],
    Fiber: ["Fiber 500", "Fiber 1G", "Fiber 2G"],
  };
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = Boolean(user);

  const handleSubmit = (data) => {
    console.log(data);
    setModalOpen(false);
    alert("Installation request sent!");
  };

  const handleAddReview = (review) => {
    setReviews((prev) => [...prev, review]);
    setShowReviewForm(false);
    setCurrentReview(reviews.length);
  };

  const handleScroll = (dir) => {
    setCurrentReview((prev) => {
      const total = reviews.length;
      if (dir === "left") return prev > 0 ? prev - 1 : total - 1;
      if (dir === "right") return prev < total - 1 ? prev + 1 : 0;
      return prev;
    });
  };

  const getThreeReviews = () => {
    const total = reviews.length;
    if (total === 0) return [];
    if (total === 1) return [reviews[0], reviews[0], reviews[0]];
    return [
      reviews[(currentReview - 1 + total) % total],
      reviews[currentReview],
      reviews[(currentReview + 1) % total],
    ];
  };

  const plans = [
    {
      title: "Fiber Plan",
      type: "Fiber",
      summary: summaries.Fiber,
      icon: <FaWifi className="w-6 h-6 inline-block mr-2" />,
    },
    {
      title: "Residential Plan",
      type: "Residential",
      summary: summaries.Residential,
      icon: <FaTv className="w-6 h-6 inline-block mr-2" />,
    },
    {
      title: "Corporate Plan",
      type: "Corporate",
      summary: summaries.Corporate,
      icon: <FaGamepad className="w-6 h-6 inline-block mr-2" />,
    },
  ];

  return (
    <main className="pt-14  bg-white text-gray-900">
      <div className="mx-auto">
        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-r from-sky-600 to-indigo-700 bg-cover text-white text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to MyISP — Your Trusted Internet Provider
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mb-8">
            Lightning fast, reliable internet tailored for your home and
            businesses
          </p>
        </section>

        {/* Services Overview */}
        <section id="services" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Fiber Network</h3>
              <p>
                Blazing fast fiber optic internet for ultra-reliable
                connectivity.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Residential</h3>
              <p>
                Affordable plans for your home with great speed and service.
              </p>
            </div>
            <div className="p-6 border rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Corporate</h3>
              <p>
                Custom business solutions with guaranteed uptime and support.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section
          id="why-us"
          className="w-full bg-gray-100 py-16 px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-indigo-700">
            <div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p>99.9% uptime keeps you connected all the time.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Speed</h3>
              <p>Fast speeds up to 300 Mbps for all your needs.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p>24/7 customer support ready to help.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Affordable</h3>
              <p>Competitive pricing with no hidden fees.</p>
            </div>
          </div>
        </section>

        {/* Plans & Pricing */}
        <section id="plans" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Plans & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(({ title, type, summary, icon }) => (
              <div
                key={type}
                className="p-6 border rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {icon}
                  {title}
                </h3>
                <p className="text-3xl font-bold mb-4">
                  Starting ${summary.lowestPrice.toFixed(2)}/month
                </p>
                <ul className="mb-4 text-left list-disc list-inside">
                  <li>Up to {summary.highestSpeedMbps} Mbps</li>
                  <li>
                    {summary.hasUnlimitedData
                      ? "Unlimited Data"
                      : `${summary.highestDataLimit} GB data limit`}
                  </li>
                  <li>24/7 Support</li>
                </ul>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  onClick={() =>
                    navigateToSection(
                      `/subscriptions/${type.toLowerCase()}`,
                      "plans"
                    )
                  }
                >
                  View Plans
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="w-full bg-gray-50 py-16 px-4 text-center"
        >
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          </div>
          <div className="flex items-center justify-center w-full max-w-[98vw] xl:max-w-[1400px] mx-auto gap-0 relative">
            <button
              aria-label="Previous review"
              className="absolute left-0 z-10 bg-indigo-200 text-indigo-700 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center hover:bg-indigo-300 top-1/2 -translate-y-1/2 ml-2 md:ml-8 xl:ml-16"
              onClick={() => handleScroll("left")}
              style={{ left: 0 }}
            >
              &#8592;
            </button>
            <div className="flex flex-1 justify-center items-center w-full gap-2 md:gap-6 lg:gap-10">
              {getThreeReviews().map((r, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-4 md:p-8 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-full min-w-0 flex-1 mx-1 md:mx-4 ${
                    idx === 1
                      ? "scale-105 md:scale-110 z-10 max-w-xs md:max-w-3xl min-w-[180px] md:min-w-[400px] border-indigo-400 shadow-lg text-base md:text-lg py-6 md:py-12 px-4 md:px-10 border"
                      : "opacity-70 scale-95 text-sm md:text-base max-w-[120px] md:max-w-lg min-w-[100px] md:min-w-[250px] py-4 md:py-8 px-2 md:px-6"
                  }`}
                >
                  <p className="text-gray-700 italic mb-4">
                    “{r.review || r.comment}”
                  </p>
                  <div className="text-right font-semibold text-gray-900">
                    — {r.name}
                  </div>
                </div>
              ))}
            </div>
            <button
              aria-label="Next review"
              className="absolute right-0 z-10 bg-indigo-200 text-indigo-700 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center hover:bg-indigo-300 top-1/2 -translate-y-1/2 mr-2 md:mr-8 xl:mr-16"
              onClick={() => handleScroll("right")}
              style={{ right: 0 }}
            >
              &#8594;
            </button>
          </div>
          <div className="mt-8">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => {
                if (isLoggedIn) {
                  setShowReviewForm(true);
                } else {
                  alert("You need to be logged in to add a review.");
                }
              }}
            >
              Add Review
            </button>
            {showReviewForm && (
              <ReviewForm
                onSubmit={(review) =>
                  handleAddReview({
                    ...review,
                    name: user?.username || review.name,
                    rating: review.rating || 5,
                  })
                }
                onClose={() => setShowReviewForm(false)}
              />
            )}
          </div>
        </section>

        {/* Coverage */}
        <section id="coverage" className="w-full py-16 px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Check Your Coverage</h2>
          <p className="mb-4">
            Do you wanna know what installations we have at your location?
          </p>

          <button
            onClick={() => navigateToSection(`/locations`, "main")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition"
          >
            Go to Coverages
          </button>
        </section>

        {/* Contact CTA */}
        <section
          id="contact"
          className="w-full bg-gray-100 py-16 px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">Need Help? Contact Us</h2>
          <p className="mb-4">
            Questions? Issues? Our support team is here for you 24/7.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-indigo-800 text-white font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
          >
            Contact Support
          </Link>
        </section>
      </div>
      <RequestInstallationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        installType={installType}
        locations={locData[installType] || []}
        subscriptionOptions={subsOptions[installType] || []}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default Home;
