// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-gray-300 pt-12">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Branding & Description */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">MyISP</h3>
        <p className="leading-relaxed">
          Providing fast, reliable internet solutions for homes and businesses
          since 2025. Join thousands of happy customers enjoying seamless
          connectivity.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
          </li>
          <li>
            <Link
              to="/subscriptions/fiber"
              className="hover:text-white transition"
            >
              Plans
            </Link>
          </li>
          <li>
            <Link to="/locations" className="hover:text-white transition">
              Locations
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact & Newsletter */}
      <div>
        <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
        <p className="mb-2">📍 Beirut, Lebanon</p>
        <p className="mb-2">📞 +961 71 234 567</p>
        <p className="mb-4">✉️ support@myisp.com</p>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-6">
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaFacebookF className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaLinkedinIn className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-12 border-t border-slate-700 pt-6 pb-4 text-center text-sm">
      © {new Date().getFullYear()} MyISP. All rights reserved.
    </div>
  </footer>
);

export default Footer;
