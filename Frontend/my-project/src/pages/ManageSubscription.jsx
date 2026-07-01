import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaKey, FaUnlock } from "react-icons/fa";
import RequestInstallationModal from "../components/Installation";

export default function ManageSubscription({ locData = {}, subsOptions = {} }) {
  const [subs, setSubs] = useState([]);
  const [plansByType, setPlansByType] = useState({});
  const [addModal, setAddModal] = useState({
    isOpen: false,
    installType: "",
    planId: null,
  });
  const [changeModal, setChangeModal] = useState({
    isOpen: false,
    subscription: null,
    plans: [],
    selectedPlanId: null,
  });
  const [accessModal, setAccessModal] = useState({
    isOpen: false,
    subscriptionId: null,
    key: "",
  });
  const [statusMsg, setStatusMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.id;
  const token = localStorage.getItem("token");

  // Load active subscriptions
  useEffect(() => {
    if (!userId) return;
    fetch(`https://localhost:44325/subscriptions/active/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.status === 404 ? [] : r.json()))
.then((list) =>
  setSubs(
    list.map((sub) => ({
      ...sub,
      subscriptionKey: sub.subscriptionKey || "",
      planTypeId: sub.planTypeId ?? sub.PlanTypeId, // normalize casing
    }))
  )
)
      .catch(() => setStatusMsg("Could not load subscriptions."));
  }, [userId, token]);

  // Preload plans
  useEffect(() => {
    [1, 2, 3].forEach((typeId) => {
      fetch(`https://localhost:44325/plans/type/${typeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((pls) => setPlansByType((p) => ({ ...p, [typeId]: pls })))
        .catch(() => {});
    });
  }, [token]);

  // Add subscription
  const openAdd = (type, planId) =>
    setAddModal({ isOpen: true, installType: type, planId });
  const closeAdd = () =>
    setAddModal({ isOpen: false, installType: "", planId: null });
<<<<<<< Updated upstream
  const handleAdd = (installData) => {
    const { planId } = addModal;
    fetch("https://localhost:44325/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ userId, planId, serverId: installData.location }),
=======

  // ■■■ Updated openChange: fetch same-type plans on demand ■■■
  const openChange = (sub) => {
    console.log("sub:", sub);
    const typeId = sub.planTypeId;
    fetch(`https://localhost:44325/plans/type/${typeId}`, {
      headers: { Authorization: `Bearer ${token}` },
>>>>>>> Stashed changes
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((newSub) =>
        setSubs((s) => [
          ...s,
          { ...newSub, subscriptionKey: newSub.subscriptionKey || "" },
        ])
      )
      .catch(() => setStatusMsg("Failed to add subscription."))
      .finally(closeAdd);
  };

  // Change plan
const openChange = (sub) => {
  const planTypeId = sub.planTypeId;
  if (!planTypeId) {
    setStatusMsg("Plan type ID not available for this subscription.");
    return;
  }
  fetch(`https://localhost:44325/plans/type/${planTypeId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((list) =>
      setChangeModal({
        isOpen: true,
        subscription: sub,
        plans: list,
        selectedPlanId: null,
      })
    )
    .catch(() => setStatusMsg("Failed to load plans for change."));
};
  const closeChange = () =>
    setChangeModal({
      isOpen: false,
      subscription: null,
      plans: [],
      selectedPlanId: null,
    });
<<<<<<< Updated upstream
=======

  // Add handler
  const handleAdd = (installData) => {
    const { planId } = addModal;
    const payload = { userId, planId, serverId: installData.location };
    fetch("https://localhost:44325/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((newSub) => setSubs((s) => [...s, newSub]))
      .catch(() => setStatusMsg("Failed to add subscription."))
      .finally(closeAdd);
  };

  // Change handler
>>>>>>> Stashed changes
  const handleChange = () => {
    const { subscription, selectedPlanId } = changeModal;
    fetch(
      `https://localhost:44325/subscriptions/${subscription.subscriptionId}/change-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPlanId: selectedPlanId }),
      }
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((updatedSub) =>
        setSubs((prev) =>
          prev.map((s) =>
            s.subscriptionId === updatedSub.subscriptionId
              ? {
                  ...updatedSub,
                  subscriptionKey: updatedSub.subscriptionKey || "",
                }
              : s
          )
        )
      )
      .catch(() => setStatusMsg("Failed to change subscription."))
      .finally(closeChange);
  };

  // Unsubscribe
  const handleUnsubscribe = (id) => {
    fetch(`https://localhost:44325/subscriptions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        setSubs((prev) => prev.filter((s) => s.subscriptionId !== id));
      })
      .catch(() => setStatusMsg("Failed to unsubscribe."));
  };

  // Generate key
  const handleGenerateKey = async (subscriptionId) => {
    try {
      const res = await fetch(
        `https://localhost:44325/subscriptions/${subscriptionId}/generate-key`,
        { method: "POST", headers: { Authorization: `Bearer ${jwt}` } }
      );
      if (!res.ok) throw new Error();
      const { key } = await res.json();
      setSubs((prev) =>
        prev.map((s) =>
          s.subscriptionId === subscriptionId
            ? { ...s, subscriptionKey: key }
            : s
        )
      );
    } catch {
      setStatusMsg("Failed to generate key.");
    }
  };

  // Request access
  const openAccess = () =>
    setAccessModal({ isOpen: true, subscriptionId: null, key: "" });
  const closeAccess = () =>
    setAccessModal({ isOpen: false, subscriptionId: null, key: "" });
  const handleRequestAccess = () => {
    fetch(`https://localhost:44325/subscriptions/validate-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ KeyHash: accessModal.key, UserId: userId }),
    })
      .then((r) => setStatusMsg(r.ok ? "Access granted." : "Invalid key."))
      .finally(closeAccess);
  };

  return (
    <main className="pt-24 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Manage Subscription
      </h1>

      {/* Request access alone */}
      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Request Access to a Subscription
        </h2>
        <button
          onClick={openAccess}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Request Access
        </button>
      </div>

      {/* Active subscriptions */}
      <ul className="space-y-4 mb-12 max-w-3xl mx-auto">
        {subs.map((s) => (
          <li
            key={s.subscriptionId}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-700">
                {s.subscriptionKey}
              </span>
              <div>
                <div className="font-semibold">{s.planName}</div>
                <div className="text-gray-500 text-sm">
                  {s.location} · Started{" "}
                  {new Date(s.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateKey(s.subscriptionId)}
                className="text-green-600 hover:underline flex items-center"
              >
                <FaKey className="mr-1" />
                Generate Key
              </button>
              <button
                onClick={() => openChange(s)}
                className="text-indigo-600 hover:underline flex items-center"
              >
                <FaEdit className="mr-1" />
                Change
              </button>
              <button
                onClick={() => handleUnsubscribe(s.subscriptionId)}
                className="text-red-600 hover:underline flex items-center"
              >
                <FaTimes className="mr-1" />
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Access Key Modal */}
      {accessModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Enter Subscription Key
            </h2>
            <input
              type="text"
              value={accessModal.key}
              onChange={(e) =>
                setAccessModal((m) => ({ ...m, key: e.target.value }))
              }
              className="w-full border rounded p-2 mb-4"
              placeholder="Subscription Key"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeAccess}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestAccess}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add new subscription */}
      <div className="max-w-3xl mx-auto space-y-12 mb-12">
        {[1, 2, 3].map((typeId) => {
          const label =
            typeId === 1 ? "Fiber" : typeId === 2 ? "Residential" : "Corporate";
          const plans = plansByType[typeId] || [];
          return (
            <section key={typeId}>
              <h2 className="text-xl font-semibold mb-2">{label} Plans</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => openAdd(label, plan.id)}
                    className="p-4 bg-white rounded shadow hover:shadow-lg transition"
                  >
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-gray-600">${plan.price}</div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {statusMsg && <p className="text-center text-red-600">{statusMsg}</p>}

      {/* Installation Modal for ADD */}
      <RequestInstallationModal
        isOpen={addModal.isOpen}
        onClose={closeAdd}
        installType={addModal.installType}
        selectedPlanId={addModal.planId}
        selectedPlanName={
          Object.values(plansByType)
            .flat()
            .find((p) => p.id === addModal.planId)?.name || ""
        }
        onSubmit={handleAdd}
        locData={locData}
        subsOptions={subsOptions}
      />

      {/* Change‐plan popup */}
      {changeModal.isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeChange}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Change "{changeModal.subscription.planName}" To:
              </h2>

              <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto mb-4">
                {changeModal.plans.map((p) => (
                  <label
                    key={p.id}
                    className={`p-3 border-2 rounded cursor-pointer ${
                      changeModal.selectedPlanId === p.id
                        ? "border-indigo-500 bg-gray-100"
                        : "border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="changePlan"
                      className="sr-only"
                      checked={changeModal.selectedPlanId === p.id}
                      onChange={() =>
                        setChangeModal((m) => ({
                          ...m,
                          selectedPlanId: p.id,
                        }))
                      }
                    />
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-gray-600">${p.price}</div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeChange}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={!changeModal.selectedPlanId}
                  onClick={handleChange}
                  className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
