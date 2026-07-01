import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profileRef = useRef(null);
  const subsRef = useRef(null);

  // Close profile and subs dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (subsRef.current && !subsRef.current.contains(e.target)) {
        setSubsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar when a link is clicked
  const handleSidebarLinkClick = () => setSidebarOpen(false);

  // Get user and role
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);
  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(user);
  const isAdmin = role === "admin";

  return (
    <>
      <nav className="bg-slate-800 text-sky-400 p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="text-2xl font-bold">
          <Link to="/home">MyISP</Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-lg font-light">
          <Link to="/about" className="hover:text-sky-400">
            About
          </Link>
          <Link to="/contact" className="hover:text-sky-400">
            Contact
          </Link>
          <Link to="/locations" className="hover:text-sky-400">
            Locations
          </Link>
          <div className="relative" ref={subsRef}>
            <button
              onClick={() => setSubsOpen(!subsOpen)}
              className="bg-slate-800 text-gray-400 hover:text-sky-600 p-1 rounded-md"
            >
              Subscriptions
            </button>
            {subsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 text-sky-400 rounded-md shadow-lg z-30">
                <Link
                  to="/subscriptions/fiber"
                  onClick={() => setSubsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800"
                >
                  Fiber Network
                </Link>
                <Link
                  to="/subscriptions/residential"
                  onClick={() => setSubsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800"
                >
                  Residential
                </Link>
                <Link
                  to="/subscriptions/corporate"
                  onClick={() => setSubsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800"
                >
                  Corporate
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="bg-slate-800 text-gray-400 hover:text-sky-600 p-1 rounded-full"
            >
              <FaUser className="w-6 h-6" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 text-sky-400 rounded-md shadow-lg z-30 p-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 border-b border-sky-700 mb-2">
                      <div className="font-semibold text-indigo-300">
                        {user.fn} {user.ln}
                      </div>
                      <div className="text-xs text-sky-300">
                        {isAdmin ? "Admin" : "Logged in"}
                      </div>
                    </div>
                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Manage Users
                        </Link>
                        <Link
                          to="/admin/plans"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Manage Plans
                        </Link>
                        <Link
                          to="/admin/installs"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Install Requests
                        </Link>
                        <Link
                          to="/admin/servers"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Servers
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/status"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Status
                        </Link>
                        <Link
                          to="/profile/subscription"
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                          onClick={() => setProfileOpen(false)}
                        >
                          Manage Subscription
                        </Link>
                      </>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("role");
                        setProfileOpen(false);
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => setProfileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col mt-20 px-6 space-y-6 font-light text-lg">
          <Link
            to="/about"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            Contact
          </Link>
          <Link
            to="/locations"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            Locations
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/plans"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Manage Plans
              </Link>
              <Link
                to="/admin/installs"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Install Requests
              </Link>
              <Link
                to="/admin/servers"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Servers
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/status"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Status
              </Link>
              <Link
                to="/profile/subscription"
                onClick={handleSidebarLinkClick}
                className="hover:text-sky-400"
              >
                Manage Subscription
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
