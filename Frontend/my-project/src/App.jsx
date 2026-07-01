import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Fiber from "./pages/Subscriptions/Fiber";
import Residential from "./pages/Subscriptions/Residential";
import Corporate from "./pages/Subscriptions/Corporate";
import Full from "./pages/full";
import Locations from "./pages/Locations";
import AuthForm from "./pages/AuthForm";
import Status from "./pages/Status";
import ManageSubscription from "./pages/ManageSubscription";
import ContactImg from "./assets/Contact_img.jpg";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePlans from "./pages/admin/ManagePlans";
import InstallRequests from "./pages/admin/InstallRequests";
import ManageServers from "./pages/admin/ServerCheck";
import ManageSubscriptions from "./pages/admin/ManageSubscriptions";
{
  /*import PrivateRoute from "./components/PrivateRoute";*/
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Full />}>
        <Route path="home" element={<Home />} />
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="locations" element={<Locations />} />
        <Route
          path="contact"
          element={
            <div
              className="w-full min-h-screen flex justify-center items-center"
              style={{
                backgroundImage: `url(${ContactImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Contact />
            </div>
          }
        />

        <Route
          path="login"
          element={
            <div
              className="text-white flex justify-center items-center h-[100vh] bg-cover"
              style={{ backgroundImage: "url('../src/assets/World.jpg')" }}
            >
              <AuthForm />
            </div>
          }
        />
        <Route
          path="signup"
          element={
            <div
              className="text-white flex justify-center items-center h-[100vh] bg-cover"
              style={{ backgroundImage: "url('../src/assets/World.jpg')" }}
            >
              <AuthForm />
            </div>
          }
        />
        <Route path="subscriptions/fiber" element={<Fiber />} />
        <Route path="subscriptions/residential" element={<Residential />} />
        <Route path="subscriptions/corporate" element={<Corporate />} />

        <Route path="status" element={<Status />} />

        <Route path="profile/subscription" element={<ManageSubscription />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="admin/plans"
          element={
            <AdminRoute>
              <ManagePlans />
            </AdminRoute>
          }
        />
        <Route
          path="admin/subscriptions"
          element={
            <AdminRoute>
              <ManageSubscriptions />
            </AdminRoute>
          }
        />
        <Route
          path="admin/installs"
          element={
            <AdminRoute>
              <InstallRequests />
            </AdminRoute>
          }
        />
        <Route
          path="admin/servers"
          element={
            <AdminRoute>
              <ManageServers />
            </AdminRoute>
          }
        />

        {/* fallback / 404… */}
      </Route>
    </Routes>
  );
}

export default App;
