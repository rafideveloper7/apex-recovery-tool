"use client";

import backendApi from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await backendApi.get("/api/admin/users");
      setUsers(response.data.users || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await backendApi.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const toggleAdmin = async (id, isAdmin) => {
    try {
      await backendApi.put(`/api/admin/users/${id}`, { isAdmin: !isAdmin });
      fetchUsers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "40px", color: "var(--danger)" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "20px" }}>
        User Management
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              background: "var(--surface)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <strong>{user.name}</strong>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => toggleAdmin(user._id, user.isAdmin)} className="btn-sm btn-ghost">
                {user.isAdmin ? "Remove Admin" : "Make Admin"}
              </button>
              <button onClick={() => deleteUser(user._id)} className="btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}