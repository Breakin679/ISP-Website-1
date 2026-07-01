import React, { useState, useEffect } from "react";
import { FaUserEdit, FaUserSlash } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://localhost:44325/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open edit form
  const openEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  // Handle delete (soft-delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`https://localhost:44325/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:44325/users/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Update failed");
      setIsEditing(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.fn} {u.ln}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.phone_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {u.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  <button
                    onClick={() => openEdit(u)}
                    className="hover:text-blue-600"
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="hover:text-red-600"
                  >
                    <FaUserSlash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-sm">First Name</label>
              <input
                name="fn"
                value={formData.fn || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Last Name</label>
              <input
                name="ln"
                value={formData.ln || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Phone</label>
              <input
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Role</label>
              <select
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
