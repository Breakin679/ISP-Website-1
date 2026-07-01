import React, { useState } from "react";

const ContactPage = () => {
  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-black/80">
      <div className="w-full max-w-lg mx-auto bg-gray-900/850 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl text-center text-indigo-400 font-extrabold mb-8">
          Contact Us
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Need assistance? Call us at{" "}
          <a href="tel:+1234567890" className="text-indigo-400 hover:underline">
            +1 (234) 567-890
          </a>{" "}
          or email{" "}
          <a
            href="mailto:help@isp.com"
            className="text-indigo-400 hover:underline"
          >
            help@isp.com
          </a>
        </p>
        <form>
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              placeholder="Mary Jane"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              required
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Your Email
            </label>
            <input
              placeholder="mary@example.com"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              required
              type="email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Your Message
            </label>
            <textarea
              rows="5"
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-400 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ContactPage;
