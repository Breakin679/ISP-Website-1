import React from "react";
import Optic from "../assets/Optic.jpg";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUsers, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <main className="pt-24  mx-auto px-6 text-gray-800">
      {/* Header */}
      <section className="relative min-h-[80vh] mb-16 overflow-hidden flex flex-col items-center justify-center">
        {/* Full-size background image */}
        <img
          src={Optic}
          alt="Optic background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Semi‑transparent overlay */}
        <div className="absolute inset-0 backdrop-opacity-50" />

        {/* Centered text */}
        <div className="relative z-10 h-full">
          <h1 className="text-center text-6xl font-bold text-white">
            About MyISP
          </h1>
          <p className="p-4 text-lg sm:text-xl text-white/90">
            Founded in 2025, MyISP has been committed to providing quality
            internet service tailored to homes and businesses. Our passion for
            technology and customer satisfaction drives us every day to innovate
            and improve.
          </p>
        </div>
      </section>
      {/*
      {/* Company Story 
      <section className="mb-16  mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-6">
          Our Story
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed text-center">
          Founded in 2025, MyISP has been committed to providing quality
          internet service tailored to the needs of homes and businesses. Our
          passion for technology and customer satisfaction drives us every day
          to innovate and improve.
        </p>
      </section>
*/}
      {/* Values */}

      <section
        style={{ backgroundColor: "rgb(65, 105, 225)" }}
        className="py-16"
      >
        {/* Content goes here */}

        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reliability */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition">
              <FaShieldAlt className="text-indigo-600 w-12 h-12 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">
                99.9% uptime to keep you connected around the clock.
              </p>
            </div>

            {/* Customer Focus */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition">
              <FaUsers className="text-indigo-600 w-12 h-12 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600">
                We listen to your needs and deliver personalized solutions.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition">
              <FaLightbulb className="text-indigo-600 w-12 h-12 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Always embracing new technology to improve your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Team Section */}

      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              src: "https://randomuser.me/api/portraits/women/68.jpg",
              name: "Jane Smith",
              role: "CEO & Co-Founder",
            },
            {
              src: "https://randomuser.me/api/portraits/men/75.jpg",
              name: "Tony Doe",
              role: "CTO",
            },
            {
              src: "https://randomuser.me/api/portraits/women/65.jpg",
              name: "Ava Johnson",
              role: "Head of Customer Success",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="text-center transform hover:translate-y-[-5px] transition-transform duration-300"
            >
              <img
                src={m.src}
                alt={m.name}
                className="mx-auto w-32 h-32 rounded-full mb-4 object-cover shadow-md"
              />
              <h3 className="text-xl font-semibold">{m.name}</h3>
              <p className="text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Actiddddon */}

      <section className=" bg-indigo-700 text-white py-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Connected?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Let's get you started with the perfect internet plan for your home or
          business.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-indigo-700 font-semibold px-8 py-4 rounded-full shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
};

export default About;
