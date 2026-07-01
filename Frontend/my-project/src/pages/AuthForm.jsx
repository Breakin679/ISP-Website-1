import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AuthForm() {
  const location = useLocation();
  const initialLogin = location.pathname === "/login";
  const [isLogin, setIsLogin] = useState(initialLogin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("role", data.role);
  };

  const API_BASE = "https://localhost:44325";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!email || !password) {
      setError("Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const response = await res.json();
      console.log("Login response:", response);
      const { token, user } = response;
      console.log("Token type:", typeof token);
      console.log("Token value:", token);
      
      // Ensure token is a string
      const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
      console.log("Token string:", tokenString);
      
      saveUser(user);
      localStorage.setItem("token", tokenString);
      window.location.href = user.role === "admin" ? "/admin" : "/";
    } catch (err) {
      setError("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);
    const payload = {
      firstName: form.get("firstName").trim(),
      lastName: form.get("lastName").trim(),
      email: form.get("email").trim(),
      phone: form.get("phone").trim(),
      password: form.get("password"),
    };

    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.email ||
      !payload.password
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    if (payload.password !== form.get("confirm")) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status !== 201) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }
      const newUser = await res.json();
      saveUser(newUser);
      window.location.href = "/";
    } catch (err) {
      setError("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-24 flex justify-center items-center min-h-[60vh]">
      <motion.div
        layout
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-slate-800/30 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg w-[350px] max-w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-center mb-6 text-white">
                Login
              </h1>
              <form onSubmit={handleLogin}>
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <div className="relative my-4">
                  <input
                    name="email"
                    type="email"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Email
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="password"
                    type="password"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Password
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 mb-4 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Logging in…" : "Login"}
                </button>
              </form>
              <div className="text-center mt-2 text-sm text-white">
                Don’t have an account?{" "}
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => {
                    setError("");
                    setIsLogin(false);
                  }}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-center mb-6 text-white">
                Sign Up
              </h1>
              <form onSubmit={handleSignup}>
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <div className="relative my-4">
                  <input
                    name="firstName"
                    type="text"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    First Name
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="lastName"
                    type="text"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Last Name
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="email"
                    type="email"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Email
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="phone"
                    type="tel"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Phone (optional)
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="password"
                    type="password"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 peer-focus:scale-75">
                    Password
                  </label>
                </div>
                <div className="relative my-4">
                  <input
                    name="confirm"
                    type="password"
                    placeholder=" "
                    disabled={loading}
                    className="block w-72 py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
                    required
                  />
                  <label className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3">
                    Confirm Password
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 mb-4 text-[18px] rounded bg-blue-500 py-2 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Signing up…" : "Sign Up"}
                </button>
              </form>
              <div className="text-center mt-2 text-sm text-white">
                Already have an account?{" "}
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => {
                    setError("");
                    setIsLogin(true);
                  }}
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
